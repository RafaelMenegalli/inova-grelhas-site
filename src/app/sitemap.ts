import type { MetadataRoute } from "next";
import { blogPath, getSitemapData } from "@/lib/articles";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles, productsUpdatedAt } = await getSitemapData();
  const abs = (path: string) => `${site.url}${path}`;
  const latest = articles[0]?.updatedAt;

  return [
    // Os produtos ativos aparecem na home (não têm página própria).
    {
      url: abs("/"),
      lastModified: productsUpdatedAt ?? undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: abs("/en"),
      lastModified: productsUpdatedAt ?? undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: abs(blogPath("pt")),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: abs(blogPath("en")),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...articles.flatMap((a) => [
      {
        url: abs(blogPath("pt", a.slug)),
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: abs(blogPath("en", a.slug)),
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      },
    ]),
  ];
}
