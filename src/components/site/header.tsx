"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/site/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#produtos", label: "Produtos" },
  { href: "/#projetistas", label: "Projetistas" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader({ quoteHref }: { quoteHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="Inova Grelhas Lineares: página inicial">
          <BrandLogo src="/logo-horizontal-sem-fundo.png" className="h-12" />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Principal"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="lg" className="h-9 px-4">
            <a href={quoteHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
              Orçamento
            </a>
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-slate-200 hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Abrir menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 border-slate-800 bg-slate-950 text-slate-100"
          >
            <SheetHeader>
              <SheetTitle className="text-white">
                Inova Grelhas Lineares
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navegação do site
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/10"
                >
                  {l.label}
                </Link>
              ))}
              <Button asChild size="lg" className="mt-4 h-11">
                <a href={quoteHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  Pedir orçamento
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
