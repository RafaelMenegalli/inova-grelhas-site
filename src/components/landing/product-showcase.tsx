import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDictionary, type Lang } from "@/dictionaries";
import { getActiveProducts } from "@/lib/products";
import { whatsappLink } from "@/lib/site";

export async function ProductShowcase({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const products = await getActiveProducts();

  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400">
        {t.catalog.empty}
      </p>
    );
  }

  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const message = t.whatsapp.product.replace("{name}", product.name);
        return (
          <li key={product.id}>
            <Card className="h-full gap-0 overflow-hidden dark:bg-slate-950 border-slate-200 dark:border-slate-800 py-0 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 dark:from-slate-800 to-slate-200 dark:to-slate-900">
                <Image
                  src={product.imageUrl}
                  alt={`${t.catalog.imageAlt} ${product.name}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <CardHeader className="gap-2 px-6 pt-6">
                <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-3 leading-relaxed">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-4">
                <ul className="flex flex-wrap gap-2">
                  {product.variations.map((v) => (
                    <li key={v.id}>
                      <Badge variant="secondary" className="h-auto py-1">
                        {v.size} · {v.finish}
                        {v.hasScreen ? ` · ${t.catalog.withScreen}` : ""}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto border-0 bg-transparent px-6 pb-6 pt-6">
                <Button asChild size="lg" className="h-11 w-full text-base">
                  <a
                    href={whatsappLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle />
                    {t.catalog.quote}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </li>
        );
      })}
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
