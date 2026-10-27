import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ArrowRight,
  Factory,
  HardHat,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { HeroVideo } from "@/components/landing/hero-video";
import {
  ProductShowcase,
  ProductShowcaseSkeleton,
} from "@/components/landing/product-showcase";
import { SiteFooter } from "@/components/site/footer";
import { FaqSection } from "@/components/landing/faq-section";
import { QualityBar } from "@/components/landing/quality-bar";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { Gtm } from "@/components/site/gtm";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary, homePath, type Lang } from "@/dictionaries";
import { site, whatsappLink } from "@/lib/site";

export function landingMetadata(lang: Lang): Metadata {
  const { title, description, ogLocale } = getDictionary(lang).meta;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: homePath(lang),
      languages: { "pt-BR": homePath("pt"), en: homePath("en") },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: homePath(lang),
      siteName: site.name,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function localBusinessJsonLd(lang: Lang) {
  const { description, areaServed, knowsAbout } = getDictionary(lang).meta;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: `${site.url}${homePath(lang)}`,
    inLanguage: lang === "en" ? "en" : "pt-BR",
    description,
    telephone: `+${site.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      postalCode: site.postalCode,
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: "BR",
    },
    areaServed: { "@type": "Country", name: areaServed },
    knowsAbout,
  };
}

const differentialIcons = [ShieldCheck, Factory, Wrench];

/** Landing page completa; `/` (português) e `/en` (inglês) só escolhem o idioma. */
export function LandingPage({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang);
  const generalQuote = whatsappLink(dict.whatsapp.general);
  const b2bQuote = whatsappLink(dict.whatsapp.b2b);
  const { hero, about, catalog, b2b, location } = dict;

  return (
    <div lang={dict.meta.htmlLang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd(lang)).replace(
            /</g,
            "\u003c",
          ),
        }}
      />

      <Gtm />
      <SiteHeader lang={lang} nav={dict.nav} quoteHref={generalQuote} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-5 py-16 text-white sm:py-24 lg:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-primary/30 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
            <div>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-200">
                <MapPin className="size-4 text-sky-400" aria-hidden />
                {hero.badge}
              </p>
              <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                {hero.titleStart}{" "}
                <span className="text-sky-400">{hero.titleHighlight}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                {hero.subtitle}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6 text-base">
                  <a
                    href={generalQuote}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle />
                    {hero.cta}
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/20 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="#produtos">
                    {hero.secondary}
                    <ArrowRight />
                  </a>
                </Button>
              </div>
            </div>
            <HeroVideo lang={lang} />
          </div>
        </section>

        <QualityBar lang={lang} />

        {/* Sobre */}
        <section id="sobre" className="bg-white px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                {about.eyebrow}
              </p>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {about.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                {about.text}
              </p>
            </div>
            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {about.differentials.map(({ title: t, text }, i) => {
                const Icon = differentialIcons[i];
                return (
                  <li key={t}>
                    <Card className="h-full border-slate-200 bg-slate-50 shadow-none">
                      <CardContent className="flex flex-col gap-4 p-2">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                          <Icon className="size-6" aria-hidden />
                        </span>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {t}
                        </h3>
                        <p className="leading-relaxed text-slate-600">{text}</p>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Produtos */}
        <section id="produtos" className="bg-slate-50 px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {catalog.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {catalog.title}
            </h2>
            <p className="mb-12 mt-4 max-w-2xl text-lg text-slate-600">
              {catalog.text}
            </p>
            <Suspense fallback={<ProductShowcaseSkeleton />}>
              <ProductShowcase lang={lang} />
            </Suspense>
          </div>
        </section>

        <TestimonialsSection lang={lang} />

        {/* B2B */}
        <section
          id="projetistas"
          className="bg-slate-900 px-5 py-20 text-white sm:py-28"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-sky-400">
                <HardHat className="size-4" aria-hidden />
                {b2b.eyebrow}
              </p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {b2b.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                {b2b.text}
              </p>
            </div>
            <Button asChild size="lg" className="h-12 shrink-0 px-6 text-base">
              <a href={b2bQuote} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                {b2b.cta}
              </a>
            </Button>
          </div>
        </section>
        <FaqSection lang={lang} />

        {/* Localização */}
        <section id="localizacao" className="bg-white px-5 py-16 md:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {location.eyebrow}
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {location.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              {location.description}
            </p>
          </div>
          <div className="relative mx-auto mt-8 aspect-square w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xl md:mt-12 md:aspect-[21/9]">
            <iframe
              src="https://maps.google.com/maps?q=Rua%20Dr.%20H%C3%A9lio%20Furlan%2C%20Santa%20B%C3%A1rbara%20d'Oeste%20-%20SP%2C%2013458-733&t=&z=15&ie=UTF8&iwloc=&output=embed"
              title={location.mapTitle}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} quoteHref={generalQuote} />
    </div>
  );
}
