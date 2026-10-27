import { ProductCard } from "@/components/landing/product-card";
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

  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            labels={t.catalog}
            quoteHref={whatsappLink(
              t.whatsapp.product.replace("{name}", product.name),
            )}
          />
        </li>
      ))}
    </ul>
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
