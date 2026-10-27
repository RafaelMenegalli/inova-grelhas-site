import { cacheLife, cacheTag } from "next/cache";
import { publicContentLife } from "@/lib/cache";
import { htmlToText, toEditorHtml } from "@/lib/content-format";
import { productImages } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";
import { toSafeHtml } from "@/lib/sanitize";

export type ProductView = {
  id: string;
  name: string;
  /** Fotos em ordem; a primeira é a principal. */
  images: string[];
  /** Resumo em texto puro para o card da vitrine. */
  summary: string;
  /** Descrição completa em HTML já sanitizado (segura para dangerouslySetInnerHTML). */
  descriptionHtml: string;
  variations: {
    id: string;
    size: string;
    finish: string;
    hasScreen: boolean;
  }[];
};

function summaryOf(html: string) {
  const flat = htmlToText(html);
  return flat.length > 160 ? `${flat.slice(0, 157).trimEnd()}…` : flat;
}

/** Produtos ativos com ao menos uma variação ativa, trazendo só as variações ativas. */
export async function getActiveProducts(): Promise<ProductView[]> {
  "use cache";
  cacheTag("products");
  cacheLife(publicContentLife);

  const rows = await prisma.product.findMany({
    where: { isActive: true, variations: { some: { isActive: true } } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
      imageUrl: true,
      variations: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        select: { id: true, size: true, finish: true, hasScreen: true },
      },
    },
  });

  return rows.map((p) => {
    // Descrições antigas são texto puro: converte para HTML antes de sanitizar.
    const descriptionHtml = toSafeHtml(toEditorHtml(p.description));
    return {
      id: p.id,
      name: p.name,
      images: productImages(p),
      summary: summaryOf(descriptionHtml),
      descriptionHtml,
      variations: p.variations,
    };
  });
}
