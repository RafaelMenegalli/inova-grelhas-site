"use client";

import Image from "next/image";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Dictionary } from "@/dictionaries";
import type { ProductView } from "@/lib/products";
import { cn } from "@/lib/utils";

type Props = {
  product: ProductView;
  labels: Dictionary["catalog"];
  quoteHref: string;
};

function variationLabel(
  v: ProductView["variations"][number],
  withScreen: string,
) {
  return `${v.size} · ${v.finish}${v.hasScreen ? ` · ${withScreen}` : ""}`;
}

/** Galeria do modal: foto principal grande e miniaturas que trocam a foto exibida. */
function Gallery({ product, labels }: Pick<Props, "product" | "labels">) {
  const [selected, setSelected] = useState(0);
  const { images, name } = product;
  const photo = (n: number) =>
    labels.photo
      .replace("{n}", String(n))
      .replace("{total}", String(images.length));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800">
        <Image
          src={images[selected]}
          alt={`${labels.imageAlt} ${name}`}
          fill
          sizes="(min-width: 768px) 28rem, 90vw"
          className="object-contain"
          priority
        />
      </div>
      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-label={photo(i + 1)}
                aria-current={i === selected ? "true" : undefined}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-lg border bg-white opacity-70 outline-none transition hover:opacity-100 focus-visible:ring-4 focus-visible:ring-ring/50",
                  i === selected
                    ? "border-primary opacity-100 ring-2 ring-primary"
                    : "border-slate-200 dark:border-slate-800",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Card da vitrine; o botão (e a foto) abrem um modal com galeria, descrição e variações. */
export function ProductCard({ product, labels, quoteHref }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="h-full gap-0 overflow-hidden border-slate-200 py-0 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${labels.details}: ${product.name}`}
          className="relative block aspect-[4/3] cursor-pointer bg-gradient-to-br from-slate-100 to-slate-200 outline-none focus-visible:ring-4 focus-visible:ring-ring/50 dark:from-slate-800 dark:to-slate-900"
        >
          <Image
            src={product.images[0]}
            alt={`${labels.imageAlt} ${product.name}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </button>
        <CardHeader className="gap-2 px-6 pt-6">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {product.name}
          </CardTitle>
          <CardDescription className="line-clamp-3 leading-relaxed">
            {product.summary}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pt-4">
          <ul className="flex flex-wrap gap-2">
            {product.variations.map((v) => (
              <li key={v.id}>
                <Badge variant="secondary" className="h-auto py-1">
                  {variationLabel(v, labels.withScreen)}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="mt-auto border-0 bg-transparent px-6 pb-6 pt-6">
          <DialogTrigger asChild>
            <Button size="lg" className="h-11 w-full text-base">
              {labels.details}
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-2 md:overflow-hidden">
          <div className="bg-slate-50 p-5 md:overflow-y-auto md:p-6 dark:bg-slate-900/60">
            <Gallery product={product} labels={labels} />
          </div>
          <div className="flex min-h-0 flex-col md:max-h-[90vh]">
            <div className="flex-1 space-y-5 p-5 md:overflow-y-auto md:p-6">
              <DialogTitle className="pr-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {product.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {product.summary}
              </DialogDescription>
              <div
                className="prose prose-sm prose-slate max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-primary dark:text-sky-400">
                  {labels.variations}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.variations.map((v) => (
                    <li key={v.id}>
                      <Badge variant="secondary" className="h-auto py-1">
                        {variationLabel(v, labels.withScreen)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="sticky bottom-0 shrink-0 border-t border-slate-200 bg-background p-4 md:p-5 dark:border-slate-800">
              <Button
                asChild
                size="lg"
                className="h-12 w-full bg-emerald-600 text-base text-white hover:bg-emerald-700"
              >
                <a href={quoteHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  {labels.quoteWhatsapp}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
