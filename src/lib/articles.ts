import { cacheLife, cacheTag } from "next/cache";
import { publicContentLife } from "@/lib/cache";
import { htmlToText, toEditorHtml } from "@/lib/content-format";
import { prisma } from "@/lib/prisma";
import { toSafeHtml } from "@/lib/sanitize";

export type Locale = "pt" | "en";

export type ArticleView = {
  slug: string;
  title: string;
  content: string;
  coverImage: string;
  /** Categoria (nome em português, como salvo no banco). */
  category: string;
  createdAt: Date;
  /** Resumo (~170 caracteres) para cards e meta description. */
  excerpt: string;
};

const PREFIX: Record<Locale, string> = { pt: "/blog", en: "/en/blog" };

export function blogPath(locale: Locale, slug?: string) {
  return slug ? `${PREFIX[locale]}/${slug}` : PREFIX[locale];
}

function excerptOf(content: string) {
  // Resumo em texto puro: remove o HTML do editor (e aceita texto legado).
  const flat = htmlToText(toEditorHtml(content));
  return flat.length > 170 ? `${flat.slice(0, 167).trimEnd()}…` : flat;
}

function toView(
  a: {
    slug: string;
    titlePt: string;
    titleEn: string;
    contentPt: string;
    contentEn: string;
    coverImage: string;
    category: string;
    createdAt: Date;
  },
  locale: Locale,
): ArticleView {
  const content = locale === "pt" ? a.contentPt : a.contentEn;
  return {
    slug: a.slug,
    title: locale === "pt" ? a.titlePt : a.titleEn,
    // HTML já sanitizado: seguro para dangerouslySetInnerHTML.
    content: toSafeHtml(content),
    coverImage: a.coverImage,
    category: a.category,
    createdAt: a.createdAt,
    excerpt: excerptOf(content),
  };
}

export async function getPublishedArticles(locale: Locale) {
  "use cache";
  cacheTag("articles");
  cacheLife(publicContentLife);

  const rows = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
  // O conteúdo completo não é necessário nas listagens.
  return rows.map((a) => ({ ...toView(a, locale), content: "" }));
}

export async function getArticle(slug: string, locale: Locale) {
  "use cache";
  cacheTag("articles");
  cacheLife(publicContentLife);

  const a = await prisma.article.findFirst({
    where: { slug, isPublished: true },
  });
  return a ? toView(a, locale) : null;
}

export async function getPublishedSlugs() {
  "use cache";
  cacheTag("articles");
  cacheLife(publicContentLife);

  const rows = await prisma.article.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
