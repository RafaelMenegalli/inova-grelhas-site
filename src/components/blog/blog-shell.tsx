import Link from "next/link";
import { Languages } from "lucide-react";
import { copy } from "@/components/blog/copy";
import { SiteFooter } from "@/components/site/footer";
import { Gtm } from "@/components/site/gtm";
import { SiteHeader } from "@/components/site/header";
import { blogPath, type Locale } from "@/lib/articles";
import { blogHomePath, getDictionary } from "@/dictionaries";
import { whatsappLink } from "@/lib/site";

/** Moldura das páginas do blog: header, rodapé e troca de idioma. */
export function BlogShell({
  locale,
  localeBar = true,
  mobileCta = false,
  children,
}: {
  locale: Locale;
  /** Exibe a faixa de troca de idioma (artigos têm o próprio link para o mesmo slug). */
  localeBar?: boolean;
  /** A página tem a barra fixa de CTA no celular: o rodapé ganha espaço para não ficar atrás dela. */
  mobileCta?: boolean;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const quote = whatsappLink(dict.whatsapp.blog);
  const other: Locale = locale === "pt" ? "en" : "pt";

  return (
    <div lang={copy[locale].htmlLang} className="flex min-h-screen flex-col">
      <Gtm />
      <SiteHeader
        lang={locale}
        nav={dict.nav}
        quoteHref={quote}
        switchHrefs={{ pt: blogHomePath("pt"), en: blogHomePath("en") }}
      />
      {localeBar && (
        <div className="border-b border-white/10 bg-slate-900">
          <div className="mx-auto flex max-w-6xl justify-end px-5 py-2">
            <Link
              href={blogPath(other)}
              hrefLang={other === "pt" ? "pt-BR" : "en"}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              <Languages className="size-4" aria-hidden />
              {copy[locale].other}
            </Link>
          </div>
        </div>
      )}
      <div className="flex-1">{children}</div>
      <SiteFooter
        lang={locale}
        quoteHref={quote}
        className={mobileCta ? "pb-28 md:pb-10" : undefined}
      />
    </div>
  );
}
