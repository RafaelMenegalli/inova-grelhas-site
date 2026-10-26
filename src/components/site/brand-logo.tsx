"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Logo da marca (por padrão public/logo.png). Se o arquivo ainda não existir, mostra
 * um fallback de texto para não deixar um ícone de imagem quebrada na navegação.
 */
export function BrandLogo({
  className,
  src = "/logo.png",
}: {
  className?: string;
  src?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          IG
        </span>
        <span className="text-sm font-semibold uppercase tracking-widest text-white">
          {site.name}
        </span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      // O erro pode ter ocorrido antes da hidratação (onError perdido): confere ao montar.
      ref={(img) => {
        if (img && img.complete && img.naturalWidth === 0) setFailed(true);
      }}
      src={src}
      alt="Logo Inova Grelhas Lineares"
      className={cn("h-10 w-auto", className)}
      onError={() => setFailed(true)}
    />
  );
}
