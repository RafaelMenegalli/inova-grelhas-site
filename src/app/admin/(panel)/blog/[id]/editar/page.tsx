import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/fields";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateArticle } from "../../../actions";
import { ArticleForm } from "../../article-form";

async function EditArticleForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      titlePt: true,
      titleEn: true,
      contentPt: true,
      contentEn: true,
      coverImage: true,
      category: true,
      isPublished: true,
    },
  });
  if (!article) notFound();

  return (
    <ArticleForm
      action={updateArticle.bind(null, article.id)}
      initial={article}
    />
  );
}

export default function EditarArtigoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <>
      <PageHeader
        title="Editar artigo"
        description="Altere o conteúdo em Português e em Inglês, a capa e o status."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <EditArticleForm params={params} />
      </Suspense>
    </>
  );
}
