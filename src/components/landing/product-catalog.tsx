"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCarousel } from "@/components/landing/product-carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/dictionaries";
import type { ProductView } from "@/lib/products";

type Item = { product: ProductView; quoteHref: string };

/** Minúsculas e sem acentos, para "grelha" achar "Grelha" e "aco" achar "aço". */
function normalize(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Texto pesquisável do produto: nome, descrição (sem tags) e variações. */
function searchableText(product: ProductView) {
  const description = product.descriptionHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
  const variations = product.variations
    .map((v) => `${v.size} ${v.finish}${v.hasScreen ? " tela" : ""}`)
    .join(" ");
  return normalize(`${product.name} ${description} ${variations}`);
}

/**
 * Vitrine com busca em tempo real: filtra no navegador por nome, descrição e variações
 * (todas as palavras digitadas precisam aparecer) e mostra os resultados no carrossel.
 */
export function ProductCatalog({
  items,
  labels,
}: {
  items: Item[];
  labels: Dictionary["catalog"];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const indexed = useMemo(
    () => items.map((item) => ({ item, text: searchableText(item.product) })),
    [items],
  );

  const words = normalize(searchTerm).split(/\s+/).filter(Boolean);
  const filtered =
    words.length === 0
      ? items
      : indexed
          .filter(({ text }) => words.every((w) => text.includes(w)))
          .map(({ item }) => item);

  const total = items.length;
  const countLabel =
    words.length > 0
      ? labels.countFiltered
          .replace("{n}", String(filtered.length))
          .replace("{total}", String(total))
      : (total === 1 ? labels.countOne : labels.countMany).replace(
          "{n}",
          String(total),
        );

  return (
    <>
      <div className="relative mx-auto mb-8 max-w-md">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchLabel}
          className="h-11 rounded-full border-slate-200 bg-slate-50 pl-10 dark:border-slate-800 dark:bg-slate-900"
        />
      </div>

      <p
        className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400"
        aria-live="polite"
      >
        {countLabel}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {labels.noResults.replace("{term}", searchTerm.trim())}
          </p>
          <Button
            type="button"
            variant="ghost"
            className="mt-4"
            onClick={() => setSearchTerm("")}
          >
            {labels.clearSearch}
          </Button>
        </div>
      ) : (
        // A chave reinicia o carrossel no primeiro card a cada busca nova.
        <ProductCarousel
          key={words.join(" ")}
          items={filtered}
          labels={labels}
        />
      )}
    </>
  );
}
