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
import { site, whatsappLink } from "@/lib/site";

const title =
  "Ralos Lineares em Inox | Fábrica em Santa Bárbara d'Oeste | Inova Grelhas Lineares";
const description =
  "Fabricante de ralos e grelhas lineares em inox em Santa Bárbara d'Oeste, SP. Alta durabilidade, acabamento premium e preço de fábrica. Peça seu orçamento pelo WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  url: site.url,
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
  areaServed: { "@type": "Country", name: "Brasil" },
  knowsAbout: [
    "ralos lineares",
    "grelhas lineares",
    "fundição",
    "aço inoxidável",
  ],
};

const differentials = [
  {
    icon: ShieldCheck,
    title: "Durabilidade comprovada",
    text: "Inox de alta resistência à corrosão, pensado para áreas molhadas e de alto tráfego.",
  },
  {
    icon: Factory,
    title: "Fabricação própria",
    text: "Somos a fábrica: controle de qualidade em cada peça e preço direto, sem intermediários.",
  },
  {
    icon: Wrench,
    title: "Medidas e acabamentos",
    text: "Diversas medidas, acabamentos e opção com tela para cada projeto.",
  },
];

export default function Home() {
  const generalQuote = whatsappLink(
    "Olá! Vi o site da Inova Grelhas Lineares e gostaria de um orçamento.",
  );
  const b2bQuote = whatsappLink(
    "Olá! Sou engenheiro/arquiteto/projetista e gostaria de condições para compra em lote de ralos lineares.",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Gtm />
      <SiteHeader quoteHref={generalQuote} />

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
                Fábrica em Santa Bárbara d&apos;Oeste, SP
              </p>
              <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Ralos lineares em inox feitos para durar{" "}
                <span className="text-sky-400">décadas.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                Fundição própria, acabamento de alto padrão e o rigor de quem
                fabrica cada peça. Do projeto à obra, com preço de fábrica.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6 text-base">
                  <a
                    href={generalQuote}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle />
                    Pedir orçamento no WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/20 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="#produtos">
                    Ver produtos
                    <ArrowRight />
                  </a>
                </Button>
              </div>
            </div>
            <HeroVideo />
          </div>
        </section>

        <QualityBar />

        {/* Sobre */}
        <section id="sobre" className="bg-white px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Sobre a Inova
              </p>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Fabricantes, não revendedores.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                A Inova Grelhas Lineares nasce da fundição em Santa Bárbara
                d&apos;Oeste, no interior de São Paulo. Controlamos o processo
                da fundição ao acabamento, o que garante qualidade consistente,
                prazo previsível e atendimento direto com quem produz.
              </p>
            </div>
            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {differentials.map(({ icon: Icon, title: t, text }) => (
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
              ))}
            </ul>
          </div>
        </section>

        {/* Produtos */}
        <section id="produtos" className="bg-slate-50 px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Catálogo
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Nossos ralos lineares
            </h2>
            <p className="mb-12 mt-4 max-w-2xl text-lg text-slate-600">
              Escolha o modelo e peça seu orçamento: respondemos direto pelo
              WhatsApp.
            </p>
            <Suspense fallback={<ProductShowcaseSkeleton />}>
              <ProductShowcase />
            </Suspense>
          </div>
        </section>

        <TestimonialsSection />

        {/* B2B */}
        <section
          id="projetistas"
          className="bg-slate-900 px-5 py-20 text-white sm:py-28"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-sky-400">
                <HardHat className="size-4" aria-hidden />
                Engenheiros, arquitetos e projetistas
              </p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Condições especiais para obras e compras em lote.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                Especificação técnica, medidas sob projeto e negociação de
                volume direto com a fábrica. Fale com a nossa equipe e receba
                uma proposta para a sua obra.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 shrink-0 px-6 text-base">
              <a href={b2bQuote} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                Falar sobre projetos
              </a>
            </Button>
          </div>
        </section>
        <FaqSection />
      </main>

      <SiteFooter quoteHref={generalQuote} />
    </>
  );
}
