import type { Locale } from "@/lib/articles";

export const copy = {
  pt: {
    htmlLang: "pt-BR",
    dateLocale: "pt-BR",
    ogLocale: "pt_BR",
    eyebrow: "Blog",
    latestTitle: "Últimos lançamentos",
    categoriesTitle: "Explorar por categorias",
    metaTitle:
      "Blog | Dicas e Guias para Banheiros e Áreas Externas | Inova Grelhas Lineares",
    metaDescription:
      "Artigos práticos sobre banheiros, áreas externas, piscinas e obras: como escolher, instalar e cuidar, direto de quem fabrica ralos e grelhas lineares em inox.",
    read: "Ler artigo",
    readTime: (min: number) => `${min} min de leitura`,
    empty: "Em breve publicaremos nossos primeiros artigos.",
    back: "Voltar ao blog",
    nextArticle: "Próximo artigo",
    toc: "Neste artigo",
    stickyText: "Gostou dos produtos?",
    stickyButton: "Ver Catálogo",
    mostRead: "🔥 Mais Lidos",
    mostReadShort: "Mais lidas",
    ctaTitle: "Pronto para especificar o seu ralo linear?",
    ctaText:
      "Fale direto com a fábrica e receba um orçamento para a sua obra ou projeto.",
    ctaButton: "Falar no WhatsApp",
    cta: (title: string) =>
      `Olá! Li o artigo "${title}" no blog da Inova Grelhas Lineares e gostaria de um orçamento.`,
  },
  en: {
    htmlLang: "en",
    dateLocale: "en-US",
    ogLocale: "en_US",
    eyebrow: "Blog",
    latestTitle: "Latest releases",
    categoriesTitle: "Browse by category",
    heading:
      "Tips, guides and ideas for bathrooms, outdoor areas and building projects",
    metaTitle:
      "Blog | Tips & Guides for Bathrooms and Outdoor Areas | Inova Grelhas Lineares",
    metaDescription:
      "Practical articles on bathrooms, outdoor areas, pools and building projects: how to choose, install and care, straight from the makers of stainless steel linear drains and grates.",
    read: "Read article",
    readTime: (min: number) => `${min} min read`,
    empty: "Our first articles are coming soon.",
    back: "Back to blog",
    nextArticle: "Next article",
    toc: "In this article",
    stickyText: "Like the products?",
    stickyButton: "View Catalog",
    mostRead: "🔥 Most Read",
    mostReadShort: "Most read",
    ctaTitle: "Ready to specify your linear drain?",
    ctaText: "Talk directly to the factory and get a quote for your project.",
    ctaButton: "Chat on WhatsApp",
    cta: (title: string) =>
      `Hello! I read the article "${title}" on the Inova Grelhas Lineares blog and would like a quote.`,
  },
} satisfies Record<Locale, unknown>;
