"use client";

import { useEffect } from "react";
import { incrementArticleView } from "@/app/blog/actions";

/** Invisível: conta 1 visualização do artigo ao montar, sem tornar a página dinâmica. */
export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    // O sessionStorage evita contar de novo no duplo efeito do modo de desenvolvimento.
    const key = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Sem sessionStorage: o cookie do servidor ainda limita a contagem.
    }
    void incrementArticleView(slug);
  }, [slug]);

  return null;
}
