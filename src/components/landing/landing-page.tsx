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
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Gtm } from "@/components/site/gtm";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
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
        <ScrollReveal>
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
                  <Button
                    asChild
                    size="lg"
                    className="h-12 px-6 text-base transition-transform hover:scale-105 active:scale-95"
                  >
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
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <QualityBar lang={lang} />
        </ScrollReveal>

        {/* Sobre */}
        <ScrollReveal>
          <section
            id="sobre"
            className="bg-white dark:bg-slate-950 px-5 py-20 sm:py-28"
          >
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary dark:text-sky-400">
                  {about.eyebrow}
                </p>
                <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                  {about.title}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  {about.text}
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
                {about.differentials.map(({ title: t, text }, i) => {
                  const Icon = differentialIcons[i];
                  return (
                    <li
                      key={t}
                      className={i === 0 ? "sm:col-span-2" : undefined}
                    >
                      <div
                        className={`flex h-full flex-col gap-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 ${
                          i === 0 ? "sm:flex-row sm:items-start sm:gap-6" : ""
                        }`}
                      >
                        <span className="flex w-fit shrink-0 items-center justify-center rounded-2xl bg-primary/10 p-4 text-primary dark:text-sky-400">
                          <Icon className="size-8" aria-hidden />
                        </span>
                        <div>
                          <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-50">
                            {t}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {text}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </ScrollReveal>

        {/* Produtos */}
        <ScrollReveal>
          <section
            id="produtos"
            className="bg-slate-50 dark:bg-slate-900 px-5 py-20 sm:py-28"
          >
            <div className="mx-auto max-w-6xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary dark:text-sky-400">
                {catalog.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                {catalog.title}
              </h2>
              <p className="mb-12 mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                {catalog.text}
              </p>
              <Suspense fallback={<ProductShowcaseSkeleton />}>
                <ProductShowcase lang={lang} />
              </Suspense>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <TestimonialsSection lang={lang} />
        </ScrollReveal>

        {/* B2B */}
        <ScrollReveal>
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
              <Button
                asChild
                size="lg"
                className="h-12 shrink-0 px-6 text-base"
              >
                <a href={b2bQuote} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  {b2b.cta}
                </a>
              </Button>
            </div>
          </section>
        </ScrollReveal>
        <ScrollReveal>
          <FaqSection lang={lang} />
        </ScrollReveal>

        {/* Localização */}
        <ScrollReveal>
          <section
            id="localizacao"
            className="bg-white dark:bg-slate-900 px-5 py-16 md:py-24"
          >
            <div className="mx-auto max-w-6xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary dark:text-sky-400">
                {location.eyebrow}
              </p>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                {location.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                {location.description}
              </p>
            </div>
            <div className="relative mx-auto mt-8 aspect-square w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-2xl md:mt-12 md:aspect-[21/9]">
              <iframe
                src="https://maps.google.com/maps?q=Rua%20Dr.%20H%C3%A9lio%20Furlan%2C%2059%20-%20Santa%20B%C3%A1rbara%20d'Oeste%20-%20SP%2C%2013458-733&t=&z=15&ie=UTF8&iwloc=&output=embed"
                title={location.mapTitle}
                className="absolute inset-0 h-full w-full border-0 dark:[filter:invert(90%)_hue-rotate(180deg)]"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </ScrollReveal>
      </main>

      <SiteFooter lang={lang} quoteHref={generalQuote} />
    </div>
  );
}
