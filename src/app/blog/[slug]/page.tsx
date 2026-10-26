import {
  ArticlePage,
  articleMetadata,
  articleStaticParams,
} from "@/components/blog/blog-pages";

export const generateStaticParams = articleStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return articleMetadata("pt", slug);
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ArticlePage locale="pt" params={params} />;
}
