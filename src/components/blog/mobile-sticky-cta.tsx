"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Barra fixa de conversão no rodapé do celular (some a partir de `md`). */
export function MobileStickyCTA({
  text,
  label,
  href,
}: {
  text: string;
  label: string;
  href: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between gap-3 border-t border-slate-200 bg-white/90 p-4 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] backdrop-blur-lg md:hidden dark:border-slate-800 dark:bg-slate-950/90">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {text}
      </p>
      <Button asChild size="lg" className="h-10 shrink-0 px-5">
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  );
}
