import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { BlogShell } from "@/components/blog/blog-shell";
import { copy } from "@/components/blog/copy";
import { MobileStickyCTA } from "@/components/blog/mobile-sticky-cta";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ViewCounter } from "@/components/blog/view-counter";
import { sectionPath } from "@/dictionaries";
import { addHeadingIds } from "@/lib/toc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryLabel, categoryOrder } from "@/lib/categories";
import { htmlToText } from "@/lib/content-format";
import { Skeleton } from "@/components/ui/skeleton";
import {
  blogPath,
  getArticle,
  getPopularArticles,
  getPublishedArticles,
  getPublishedSlugs,
  type ArticleView,
  type Locale,
} from "@/lib/articles";
import { site, whatsappLink } from "@/lib/site";

const PLACEHOLDER_SLUG = "__placeholder__";

function formatDate(date: Date, locale: Locale) {
  return date.toLocaleDateString(copy[locale].dateLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/* ------------------------------ Listagem ------------------------------ */

export function blogIndexMetadata(locale: Locale): Metadata {
  const t = copy[locale];
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: {
      canonical: blogPath(locale),
      languages: { "pt-BR": blogPath("pt"), en: blogPath("en") },
    },
    openGraph: {
      type: "website",
      locale: t.ogLocale,
      url: blogPath(locale),
      siteName: site.name,
      title: t.metaTitle,
      description: t.metaDescription,
    },
  };
}

function ArticleImage({
  article,
  sizes,
  priority,
}: {
  article: ArticleView;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={article.coverImage}
      alt={article.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-4 text-2xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
      <span
        aria-hidden
        className="h-8 w-1.5 shrink-0 rounded-full bg-primary sm:h-9"
      />
      {children}
    </h2>
  );
}

/** Últimos lançamentos: lista horizontal (miniatura ~30% + conteúdo). */
function LatestList({
  locale,
  articles,
}: {
  locale: Locale;
  articles: ArticleView[];
}) {
  return (
    <ul className="mt-10 flex flex-col gap-6">
      {articles.map((a) => (
        <li key={a.slug}>
          <Link
            href={blogPath(locale, a.slug)}
            className="group flex flex-col gap-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-shadow hover:shadow-lg sm:flex-row sm:gap-8 sm:p-5"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 sm:w-[30%] sm:shrink-0">
              <ArticleImage
                article={a}
                sizes="(min-width: 640px) 30vw, 100vw"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
              <Badge className="w-fit bg-primary/10 text-primary dark:text-sky-400 hover:bg-primary/10">
                {categoryLabel(a.category, locale)}
              </Badge>
              <h3 className="text-balance text-xl font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-50 transition-colors group-hover:text-primary dark:group-hover:text-sky-400 sm:text-2xl">
                {a.title}
              </h3>
              <p className="hidden line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-400 sm:block">
                {a.excerpt}
              </p>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {formatDate(a.createdAt, locale)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Agrupa por categoria, na ordem da lista oficial (as desconhecidas, no fim). */
function groupByCategory(articles: ArticleView[]) {
  const groups = new Map<string, ArticleView[]>();
  for (const a of articles) {
    groups.set(a.category, [...(groups.get(a.category) ?? []), a]);
  }
  return [...groups.entries()].sort(
    ([a], [b]) => categoryOrder(a) - categoryOrder(b) || a.localeCompare(b),
  );
}

/** Uma "prateleira": cabeçalho forte da categoria + grid de cards compactos. */
function CategoryShelf({
  locale,
  category,
  articles,
}: {
  locale: Locale;
  category: string;
  articles: ArticleView[];
}) {
  return (
    <section aria-label={categoryLabel(category, locale)}>
      <div className="flex items-center gap-4">
        <h3 className="border-b-4 border-primary bg-slate-900 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white sm:text-base">
          {categoryLabel(category, locale)}
        </h3>
        <span
          aria-hidden
          className="h-px flex-1 bg-slate-200 dark:bg-slate-800"
        />
      </div>
      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              href={blogPath(locale, a.slug)}
              className="group flex h-full flex-col gap-3"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                <ArticleImage
                  article={a}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {formatDate(a.createdAt, locale)}
              </p>
              <h4 className="line-clamp-3 text-balance text-base font-bold leading-snug text-slate-900 dark:text-slate-50 transition-colors group-hover:text-primary dark:group-hover:text-sky-400">
                {a.title}
              </h4>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Hero: o artigo mais recente em destaque, com a capa ao fundo, título e resumo. */
function HeroFeatured({
  article,
  locale,
}: {
  article: ArticleView;
  locale: Locale;
}) {
  const t = copy[locale];
  return (
    <Link
      href={blogPath(locale, article.slug)}
      className="group relative block min-h-[26rem] overflow-hidden bg-slate-900 outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-400/60 sm:min-h-[30rem] lg:min-h-[36rem]"
    >
      <Image
        src={article.coverImage}
        alt=""
        fill
        priority
        quality={90}
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/10"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
        <Badge className="bg-primary text-primary-foreground hover:bg-primary">
          {categoryLabel(article.category, locale)}
        </Badge>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
          {article.title}
        </h2>
        <p className="mt-4 line-clamp-3 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
          {article.excerpt}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-sky-300">
          {t.read}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/** Hero: os artigos mais lidos, numerados, num painel na cor da marca. */
function HeroMostRead({
  articles,
  locale,
}: {
  articles: ArticleView[];
  locale: Locale;
}) {
  const t = copy[locale];
  return (
    <aside
      aria-labelledby="hero-most-read"
      className="bg-primary p-6 text-primary-foreground sm:p-10 lg:p-12"
    >
      <h2
        id="hero-most-read"
        className="text-sm font-bold uppercase tracking-widest"
      >
        {t.mostReadShort}
      </h2>
      <ol className="mt-6 divide-y divide-white/25">
        {articles.map((a, i) => (
          <li key={a.slug} className="py-5 first:pt-0 last:pb-0">
            <Link
              href={blogPath(locale, a.slug)}
              className="group flex gap-4 outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center bg-white text-2xl font-extrabold text-primary"
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wider text-white/80">
                  {categoryLabel(a.category, locale)}
                </span>
                <span className="mt-1 line-clamp-3 block text-lg font-semibold leading-snug group-hover:underline">
                  {a.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export async function BlogIndexPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const articles = await getPublishedArticles(locale);
  // O mais recente ganha destaque na Hero e também continua na listagem.
  const featured = articles[0];
  // Mais lidos (por visualizações; empate cai para o mais recente), sem repetir o destaque.
  const mostRead = articles
    .slice(1)
    .map((a, index) => ({ a, index }))
    .sort((x, y) => y.a.views - x.a.views || x.index - y.index)
    .slice(0, 3)
    .map(({ a }) => a);
  // Últimos lançamentos: do 2º ao 4º artigo, em lista horizontal.
  const latest = articles.slice(1, 4);
  // Prateleiras por categoria: o restante (do 5º em diante) mais o artigo em
  // destaque, que continua visível também na listagem.
  const shelves = groupByCategory(
    featured ? [featured, ...articles.slice(4)] : [],
  );

  return (
    <BlogShell locale={locale}>
      <h1 className="sr-only">{t.eyebrow}</h1>
      {featured && (
        // Hero montada com artigos: o mais recente em destaque e os mais lidos ao lado.
        <section
          className={
            mostRead.length > 0 ? "grid lg:grid-cols-[2fr_1fr]" : undefined
          }
        >
          <HeroFeatured article={featured} locale={locale} />
          {mostRead.length > 0 && (
            <HeroMostRead articles={mostRead} locale={locale} />
          )}
        </section>
      )}

      <main id="artigos">
        {articles.length === 0 ? (
          <section className="bg-slate-50 dark:bg-slate-900 px-5 py-16 sm:py-24">
            <div className="mx-auto max-w-6xl">
              <p className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400">
                {t.empty}
              </p>
            </div>
          </section>
        ) : (
          <>
            {latest.length > 0 && (
              <section className="bg-slate-50 dark:bg-slate-900 px-5 py-16 sm:py-24">
                <div className="mx-auto max-w-6xl">
                  <SectionHeading>{t.latestTitle}</SectionHeading>
                  <LatestList locale={locale} articles={latest} />
                </div>
              </section>
            )}
            <section className="bg-white dark:bg-slate-900 px-5 py-16 sm:py-24">
              <div className="mx-auto max-w-6xl">
                <SectionHeading>{t.categoriesTitle}</SectionHeading>
                <div className="mt-12 flex flex-col gap-16">
                  {shelves.map(([category, items]) => (
                    <CategoryShelf
                      key={category}
                      locale={locale}
                      category={category}
                      articles={items}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </BlogShell>
  );
}

/* ------------------------------- Artigo ------------------------------- */

export async function articleStaticParams() {
  const slugs = await getPublishedSlugs();
  // Cache Components exige ao menos um param; o placeholder cai em notFound().
  return (slugs.length ? slugs : [PLACEHOLDER_SLUG]).map((slug) => ({ slug }));
}

export async function articleMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  const article =
    slug === PLACEHOLDER_SLUG ? null : await getArticle(slug, locale);
  if (!article) return { title: "Not found", robots: { index: false } };

  const path = blogPath(locale, slug);
  // Descrição de ~150 caracteres, tamanho que o Google costuma exibir.
  const description =
    article.excerpt.length > 150
      ? `${article.excerpt.slice(0, 149).trimEnd()}…`
      : article.excerpt;
  return {
    title: article.title,
    description,
    alternates: {
      canonical: path,
      languages: {
        "pt-BR": blogPath("pt", slug),
        en: blogPath("en", slug),
      },
    },
    openGraph: {
      type: "article",
      locale: copy[locale].ogLocale,
      url: path,
      siteName: site.name,
      title: article.title,
      description,
      publishedTime: article.createdAt.toISOString(),
      images: [{ url: article.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [article.coverImage],
    },
  };
}

async function ArticleContent({
  locale,
  params,
}: {
  locale: Locale;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article =
    slug === PLACEHOLDER_SLUG ? null : await getArticle(slug, locale);
  if (!article) notFound();

  const t = copy[locale];
  // Próximo = o seguinte na ordem da listagem (mais antigo); no último, volta ao mais recente.
  const [all, popular] = await Promise.all([
    getPublishedArticles(locale),
    getPopularArticles(locale, slug),
  ]);
  const index = all.findIndex((a) => a.slug === slug);
  const next =
    all.length > 1 && index !== -1 ? all[(index + 1) % all.length] : null;
  const minutes = Math.max(
    1,
    Math.round(htmlToText(article.content).split(" ").length / 200),
  );
  // Dá id aos H2/H3 e monta o índice (o HTML já foi sanitizado antes).
  const { html: contentHtml, headings } = addHeadingIds(article.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.createdAt.toISOString(),
    inLanguage: locale === "pt" ? "pt-BR" : "en",
    mainEntityOfPage: `${site.url}${blogPath(locale, slug)}`,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 pb-24 md:pb-12 lg:grid-cols-12 lg:gap-12 lg:px-8">
      <ViewCounter slug={article.slug} />
      <MobileStickyCTA
        text={t.stickyText}
        label={t.stickyButton}
        href={sectionPath(locale, "produtos")}
      />
      <article
        className={popular.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <header className="mx-auto max-w-3xl px-5 pt-12 sm:pt-16">
          <div className="flex items-center justify-between gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link
              href={blogPath(locale)}
              className="inline-flex items-center gap-2 transition-colors hover:text-primary dark:hover:text-sky-400"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {t.back}
            </Link>
          </div>
          <p className="mt-12 text-center text-xs font-semibold uppercase tracking-widest text-primary dark:text-sky-400 sm:mt-16">
            {formatDate(article.createdAt, locale)}
            <span aria-hidden className="mx-2 text-slate-300">
              ·
            </span>
            {t.readTime(minutes)}
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-center text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            {article.title}
          </h1>
        </header>

        <div className="mx-auto mt-12 max-w-5xl px-5 sm:mt-14">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shadow-xl">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-[70ch] px-5 sm:mt-16">
          <hr className="border-slate-200 dark:border-slate-800" />
        </div>

        {headings.length > 0 && (
          <div className="mx-auto mt-10 max-w-[70ch] px-5">
            <TableOfContents headings={headings} title={t.toc} />
          </div>
        )}

        {/* HTML já sanitizado no servidor (lib/sanitize.ts) antes de chegar aqui. */}
        <div
          className="prose prose-lg prose-slate dark:prose-invert mx-auto mt-12 max-w-[70ch] px-5 prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-8 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary prose-img:rounded-xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <nav
          aria-label={t.back}
          className="mx-auto mt-14 flex max-w-[70ch] flex-col gap-3 px-5 sm:flex-row sm:items-stretch sm:justify-between"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-6 text-base"
          >
            <Link href={blogPath(locale)}>
              <ArrowLeft />
              {t.back}
            </Link>
          </Button>
          {next && (
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href={blogPath(locale, next.slug)} title={next.title}>
                {t.nextArticle}
                <ArrowRight />
              </Link>
            </Button>
          )}
        </nav>

        <aside className="mx-auto mt-16 max-w-3xl px-5 pb-20 sm:pb-28">
          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-sky-950 p-8 text-white shadow-2xl sm:p-12">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              {t.ctaTitle}
            </h2>
            <p className="mt-3 max-w-xl text-slate-300">{t.ctaText}</p>
            <Button asChild size="lg" className="mt-8 h-12 px-6 text-base">
              <a
                href={whatsappLink(t.cta(article.title))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle />
                {t.ctaButton}
              </a>
            </Button>
          </div>
        </aside>
      </article>

      {popular.length > 0 && (
        <aside
          aria-labelledby="most-read"
          className="h-fit px-5 pb-12 lg:sticky lg:top-24 lg:mt-16 lg:col-span-4 lg:px-0 lg:pb-0"
        >
          <h2
            id="most-read"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
          >
            {t.mostRead}
          </h2>
          <ul className="mt-5 space-y-3">
            {popular.map((a) => (
              <li key={a.slug}>
                <Link
                  href={blogPath(locale, a.slug)}
                  className="group flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="relative size-20 shrink-0 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800">
                    <Image
                      src={a.coverImage}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col justify-center">
                    {a.category && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-sky-400">
                        {categoryLabel(a.category, locale)}
                      </span>
                    )}
                    <span className="line-clamp-2 font-semibold leading-snug text-slate-900 dark:text-slate-50 group-hover:text-primary dark:group-hover:text-sky-400">
                      {a.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}

const articleSkeleton = (
  <div className="mx-auto max-w-3xl space-y-6 px-5 py-16">
    <Skeleton className="h-12 w-3/4" />
    <Skeleton className="h-72 w-full rounded-xl" />
  </div>
);

/** Moldura + conteúdo do artigo: só aqui o slug é conhecido, e o header leva ao mesmo artigo no outro idioma. */
async function ArticleWithShell({
  locale,
  params,
}: {
  locale: Locale;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const other: Locale = locale === "pt" ? "en" : "pt";
  return (
    <BlogShell locale={locale} mobileCta switchHref={blogPath(other, slug)}>
      <ArticleContent locale={locale} params={params} />
    </BlogShell>
  );
}

export function ArticlePage({
  locale,
  params,
}: {
  locale: Locale;
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <BlogShell locale={locale} mobileCta>
          {articleSkeleton}
        </BlogShell>
      }
    >
      <ArticleWithShell locale={locale} params={params} />
    </Suspense>
  );
}
