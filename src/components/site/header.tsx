"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/site/brand-logo";
import { LanguageToggle } from "@/components/site/language-toggle";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  blogHomePath,
  homePath,
  sectionPath,
  type Dictionary,
  type Lang,
} from "@/dictionaries";

const toggleClass =
  "relative size-9 text-slate-300 hover:bg-white/10 hover:text-white";

type Props = {
  lang: Lang;
  nav: Dictionary["nav"];
  quoteHref: string;
  /** Página equivalente no outro idioma (padrão: a página inicial dele). */
  switchHref?: string;
};

export function SiteHeader({ lang, nav, quoteHref, switchHref }: Props) {
  const [open, setOpen] = useState(false);
  const otherLang: Lang = lang === "pt" ? "en" : "pt";
  const switchTo = switchHref ?? homePath(otherLang);

  const themeLabels = {
    toggle: nav.theme,
    light: nav.themeLight,
    dark: nav.themeDark,
    system: nav.themeSystem,
  };

  const links = [
    { href: sectionPath(lang, "sobre"), label: nav.about },
    { href: sectionPath(lang, "produtos"), label: nav.products },
    { href: sectionPath(lang, "projetistas"), label: nav.designers },
    { href: blogHomePath(lang), label: nav.blog },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href={homePath(lang)} aria-label={nav.home}>
          <BrandLogo src="/logo-horizontal-sem-fundo.png" className="h-12" />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label={nav.mainLabel}
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

          <LanguageToggle
            href={switchTo}
            target={otherLang}
            title={nav.switchTo}
            className="text-slate-300 hover:bg-white/10 hover:text-white"
          />

          <ModeToggle labels={themeLabels} className={toggleClass} />

          <Button asChild size="lg" className="h-9 px-4">
            <a href={quoteHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
              {nav.quote}
            </a>
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-slate-200 hover:bg-white/10 hover:text-white md:hidden"
              aria-label={nav.openMenu}
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
                {nav.menuDescription}
              </SheetDescription>
            </SheetHeader>
            <nav
              className="flex flex-col gap-1 px-4"
              aria-label={nav.mobileLabel}
            >
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

              <div className="mt-3 px-1">
                <LanguageToggle
                  href={switchTo}
                  target={otherLang}
                  title={nav.switchTo}
                  showLabel
                  onNavigate={() => setOpen(false)}
                  className="text-base text-slate-200 hover:bg-white/10"
                />
              </div>

              <div className="mt-2 flex items-center gap-2 px-3 text-slate-400">
                <span className="text-sm">{nav.theme}</span>
                <ModeToggle labels={themeLabels} className={toggleClass} />
              </div>

              <Button asChild size="lg" className="mt-4 h-11">
                <a href={quoteHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  {nav.quoteLong}
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
