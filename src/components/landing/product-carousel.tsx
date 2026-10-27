"use client";

import { ProductCard } from "@/components/landing/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Dictionary } from "@/dictionaries";
import type { ProductView } from "@/lib/products";
import { cn } from "@/lib/utils";

type Item = { product: ProductView; quoteHref: string };

/** Agrupa em colunas de 2 produtos: cada slide do carrossel tem 2 cards empilhados. */
function toColumns(items: Item[]) {
  const columns: Item[][] = [];
  for (let i = 0; i < items.length; i += 2) columns.push(items.slice(i, i + 2));
  return columns;
}

/**
 * Vitrine em carrossel com 2 linhas: cada slide é uma coluna com 2 produtos, e aparecem
 * 1 coluna no celular, 2 no tablet e 3 no desktop (até 6 produtos à vista). Arrasta por
 * mouse/toque e tem setas, que só aparecem quando há mais colunas do que cabem.
 */
export function ProductCarousel({
  items,
  labels,
}: {
  items: Item[];
  labels: Dictionary["catalog"];
}) {
  const columns = toColumns(items);
  const count = columns.length;

  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      {/* O padding vertical dá espaço para a sombra e a elevação do card no hover. */}
      <CarouselContent className="-ml-6 py-4">
        {columns.map((column) => (
          <CarouselItem
            key={column[0].product.id}
            className="basis-full pl-6 md:basis-1/2 lg:basis-1/3"
          >
            {/* Duas linhas de mesma altura: as linhas ficam alinhadas entre as colunas. */}
            <div className="grid h-full grid-rows-2 gap-6">
              {column.map(({ product, quoteHref }) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  labels={labels}
                  quoteHref={quoteHref}
                />
              ))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div
        className={cn(
          "mt-4 flex items-center justify-end gap-3",
          count <= 1 && "hidden",
          count === 2 && "md:hidden",
          count === 3 && "lg:hidden",
        )}
      >
        <CarouselPrevious className="static my-0 size-10" />
        <CarouselNext className="static my-0 size-10" />
      </div>
    </Carousel>
  );
}
