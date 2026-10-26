import { Suspense } from "react";
import { PageHeader } from "@/components/admin/fields";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/lib/auth";
import { createArticle } from "../../actions";
import { ArticleForm } from "../article-form";

// O editor rico (Tiptap) gera ids aleatórios ao renderizar, então o formulário
// não pode ser pré-renderizado: a checagem de sessão o torna dinâmico.
async function NovoArtigoForm() {
  await requireAdmin();
  return <ArticleForm action={createArticle} />;
}

export default function NovoArtigoPage() {
  return (
    <>
      <PageHeader
        title="Novo artigo"
        description="Escreva o conteúdo em Português e em Inglês."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <NovoArtigoForm />
      </Suspense>
    </>
  );
}
