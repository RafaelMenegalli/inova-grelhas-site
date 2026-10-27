import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/fields";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/lib/auth";
import { productImages } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../../../actions";
import { ProductForm } from "../../product-form";

async function EditProductForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
      imageUrl: true,
      variations: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          size: true,
          finish: true,
          hasScreen: true,
          isActive: true,
        },
      },
    },
  });
  if (!product) notFound();

  return (
    <ProductForm
      action={updateProduct.bind(null, product.id)}
      initial={{ ...product, images: productImages(product) }}
    />
  );
}

export default function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <>
      <PageHeader
        title="Editar produto"
        description="Altere os dados, a foto e as variações do ralo."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <EditProductForm params={params} />
      </Suspense>
    </>
  );
}
