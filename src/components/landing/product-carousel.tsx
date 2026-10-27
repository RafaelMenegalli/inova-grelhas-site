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

/**
 * Vitrine em carrossel (1 card no celular, 2 no tablet, 3 no desktop), com arrastar
 * por mouse/toque e setas. As setas só aparecem quando há mais cards do que cabem.
 */
export function ProductCarousel({
  items,
  labels,
}: {
  items: { product: ProductView; quoteHref: string }[];
  labels: Dictionary["catalog"];
}) {
  const count = items.length;

  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      {/* O padding vertical dá espaço para a sombra e a elevação do card no hover. */}
      <CarouselContent className="-ml-6 py-4">
        {items.map(({ product, quoteHref }) => (
          <CarouselItem
            key={product.id}
            className="basis-full pl-6 md:basis-1/2 lg:basis-1/3"
          >
            <ProductCard
              product={product}
              labels={labels}
              quoteHref={quoteHref}
            />
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
