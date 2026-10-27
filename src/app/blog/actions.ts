"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const VIEW_WINDOW_SECONDS = 60 * 30;

/**
 * Soma 1 view a um artigo publicado. Chamada pelo ViewCounter (cliente), para que as
 * páginas continuem estáticas. Cada visitante conta no máximo 1 vez por artigo a cada
 * 30 minutos (cookie), o que barra recargas e chamadas repetidas.
 *
 * Usa SQL direto de propósito: um `update` do Prisma também atualizaria `updatedAt`,
 * e essa data alimenta o `lastmod` do sitemap, que não deve mudar a cada visita.
 */
export async function incrementArticleView(slug: string) {
  if (typeof slug !== "string" || slug.length === 0 || slug.length > 200)
    return;

  const jar = await cookies();
  const key = `v_${slug}`.slice(0, 120);
  if (jar.get(key)) return;
  jar.set(key, "1", {
    maxAge: VIEW_WINDOW_SECONDS,
    path: "/blog",
    httpOnly: true,
    sameSite: "lax",
  });

  await prisma.$executeRaw`UPDATE "Article" SET "views" = "views" + 1 WHERE "slug" = ${slug} AND "isPublished" = true`;
}
