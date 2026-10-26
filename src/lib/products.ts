import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

/** Produtos ativos com ao menos uma variação ativa, trazendo só as variações ativas. */
export async function getActiveProducts() {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  return prisma.product.findMany({
    where: { isActive: true, variations: { some: { isActive: true } } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      variations: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        select: { id: true, size: true, finish: true, hasScreen: true },
      },
    },
  });
}
