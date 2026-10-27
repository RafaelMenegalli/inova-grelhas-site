"use client";

import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Search } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { proofImages } from "@/lib/social-proof";

/** Carrossel de prints reais de avaliações. Cada print abre ampliado ao clicar. */
export function ProofCarousel({
  zoomLabel,
  dialogTitle,
}: {
  zoomLabel: string;
  dialogTitle: string;
}) {
  // Rotação automática em loop, a cada 3 s. Pausa ao passar o mouse e enquanto um
  // print está ampliado; quem pediu "reduzir movimento" no sistema não a recebe.
  const [autoplay] = useState(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return {
      reduced,
      plugin: Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: !reduced,
      }),
    };
  });

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      plugins={[autoplay.plugin]}
      className="w-full"
    >
      <CarouselContent className="-ml-5">
        {proofImages.map((p) => (
          <CarouselItem
            key={p.src}
            className="basis-[88%] pl-5 sm:basis-1/2 lg:basis-1/3"
          >
            <Dialog
              onOpenChange={(open) => {
                if (open) autoplay.plugin.stop();
                else if (!autoplay.reduced) autoplay.plugin.play();
              }}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label={`${zoomLabel}: ${p.alt}`}
                  className="group relative block h-72 w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm outline-none transition-shadow hover:shadow-lg focus-visible:ring-4 focus-visible:ring-ring/50 lg:h-80"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
                    className="object-contain p-2"
                  />
                  <span
                    aria-hidden
                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <Search className="size-4" />
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[min(94vw,52rem)] gap-0 p-2 sm:max-w-[min(94vw,52rem)] sm:p-3">
                <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
                <DialogDescription className="sr-only">
                  {p.alt}
                </DialogDescription>
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 832px) 832px, 94vw"
                  className="mx-auto h-auto max-h-[82vh] w-auto max-w-full rounded-lg"
                />
              </DialogContent>
            </Dialog>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-8 flex items-center justify-end gap-3">
        <CarouselPrevious className="static my-0 size-10" />
        <CarouselNext className="static my-0 size-10" />
      </div>
    </Carousel>
  );
}
