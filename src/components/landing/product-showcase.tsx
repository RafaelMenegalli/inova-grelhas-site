import { ProductCarousel } from "@/components/landing/product-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getDictionary, type Lang } from "@/dictionaries";
import { getActiveProducts } from "@/lib/products";
import { whatsappLink } from "@/lib/site";

export async function ProductShowcase({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const products = await getActiveProducts();

  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        {t.catalog.empty}
      </p>
    );
  }

  const countLabel = (
    products.length === 1 ? t.catalog.countOne : t.catalog.countMany
  ).replace("{n}", String(products.length));

  return (
    <>
      <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        {countLabel}
      </p>
      <ProductCarousel
        labels={t.catalog}
        items={products.map((product) => ({
          product,
          quoteHref: whatsappLink(
            t.whatsapp.product.replace("{name}", product.name),
          ),
        }))}
      />
    </>
  );
}

export function ProductShowcaseSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-[28rem] rounded-xl" />
      ))}
    </div>
  );
}
