import { Suspense } from "react";
import { PageHeader } from "@/components/admin/fields";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/lib/auth";
import { createProduct } from "../../actions";
import { ProductForm } from "../product-form";

async function NovoProdutoForm() {
  await requireAdmin();
  return <ProductForm action={createProduct} />;
}

export default function NovoProdutoPage() {
  return (
    <>
      <PageHeader
        title="Novo produto"
        description="Cadastre o ralo e suas variações de medida e acabamento."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <NovoProdutoForm />
      </Suspense>
    </>
  );
}
