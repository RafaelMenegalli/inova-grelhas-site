import { copy } from "@/components/blog/copy";
import { SiteFooter } from "@/components/site/footer";
import { Gtm } from "@/components/site/gtm";
import { SiteHeader } from "@/components/site/header";
import { type Locale } from "@/lib/articles";
import { blogHomePath, getDictionary } from "@/dictionaries";
import { whatsappLink } from "@/lib/site";

/** Moldura das páginas do blog: header (com a troca de idioma) e rodapé. */
export function BlogShell({
  locale,
  mobileCta = false,
  switchHref,
  children,
}: {
  locale: Locale;
  /** A página tem a barra fixa de CTA no celular: o rodapé ganha espaço para não ficar atrás dela. */
  mobileCta?: boolean;
  /** Página equivalente no outro idioma (padrão: a lista do blog dele). */
  switchHref?: string;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const quote = whatsappLink(dict.whatsapp.blog);

  return (
    <div lang={copy[locale].htmlLang} className="flex min-h-screen flex-col">
      <Gtm />
      <SiteHeader
        lang={locale}
        nav={dict.nav}
        quoteHref={quote}
        switchHref={switchHref ?? blogHomePath(locale === "pt" ? "en" : "pt")}
      />
      <div className="flex-1">{children}</div>
      <SiteFooter
        lang={locale}
        quoteHref={quote}
        className={mobileCta ? "pb-28 md:pb-10" : undefined}
      />
    </div>
  );
}
