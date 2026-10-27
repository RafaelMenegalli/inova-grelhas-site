"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, Menu, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/site/brand-logo";
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

const LANGUAGES: { lang: Lang; label: string; hrefLang: string }[] = [
  { lang: "pt", label: "Português", hrefLang: "pt-BR" },
  { lang: "en", label: "English", hrefLang: "en" },
];

type Props = {
  lang: Lang;
  nav: Dictionary["nav"];
  quoteHref: string;
  /** Página equivalente em cada idioma (padrão: a home). */
  switchHrefs?: Record<Lang, string>;
};

export function SiteHeader({ lang, nav, quoteHref, switchHrefs }: Props) {
  const [open, setOpen] = useState(false);
  const other = LANGUAGES.find((l) => l.lang !== lang) ?? LANGUAGES[0];
  const switchTo = switchHrefs ?? { pt: homePath("pt"), en: homePath("en") };

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

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 px-2 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Link
              href={switchTo[other.lang]}
              hrefLang={other.hrefLang}
              lang={other.hrefLang}
              aria-label={nav.switchTo}
              title={nav.switchTo}
            >
              <Globe aria-hidden />
              {other.lang.toUpperCase()}
            </Link>
          </Button>

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

              <div
                role="group"
                aria-label={nav.language}
                className="mt-3 flex items-center gap-2 px-3 text-slate-400"
              >
                <Globe className="size-4" aria-hidden />
                {LANGUAGES.map((l) => (
                  <Link
                    key={l.lang}
                    href={switchTo[l.lang]}
                    hrefLang={l.hrefLang}
                    lang={l.hrefLang}
                    onClick={() => setOpen(false)}
                    aria-current={l.lang === lang ? "true" : undefined}
                    className={
                      l.lang === lang
                        ? "rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-white"
                        : "rounded-md px-3 py-1.5 text-sm font-medium hover:bg-white/10 hover:text-white"
                    }
                  >
                    {l.lang.toUpperCase()}
                  </Link>
                ))}
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
