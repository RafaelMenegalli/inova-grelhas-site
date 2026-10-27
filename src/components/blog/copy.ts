import type { Locale } from "@/lib/articles";

export const copy = {
  pt: {
    htmlLang: "pt-BR",
    dateLocale: "pt-BR",
    ogLocale: "pt_BR",
    eyebrow: "Blog",
    badge: "Dicas e guias",
    explore: "Explorar artigos",
    latest: "Artigo em destaque",
    latestTitle: "Últimos lançamentos",
    categoriesTitle: "Explorar por categorias",
    bannerAlt:
      "Ralo linear em inox escovado instalado na borda de uma piscina, ao entardecer",
    heading: "Dicas, guias e ideias para banheiros, áreas externas e obras",
    subheading:
      "Instalação, manutenção, projetos e tendências, com a experiência de quem fabrica.",
    metaTitle:
      "Blog | Dicas e Guias para Banheiros e Áreas Externas | Inova Grelhas Lineares",
    metaDescription:
      "Dicas, guias e ideias para banheiros, áreas externas, piscinas e obras: instalação, manutenção e projetos, com a experiência de quem fabrica ralos e grelhas lineares em inox.",
    featured: "Em destaque",
    read: "Ler artigo",
    readTime: (min: number) => `${min} min de leitura`,
    empty: "Em breve publicaremos nossos primeiros artigos.",
    back: "Voltar ao blog",
    nextArticle: "Próximo artigo",
    toc: "Neste artigo",
    stickyText: "Gostou dos produtos?",
    stickyButton: "Ver Catálogo",
    mostRead: "🔥 Mais Lidos",
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
    badge: "Tips & guides",
    explore: "Explore articles",
    latest: "Featured article",
    latestTitle: "Latest releases",
    categoriesTitle: "Browse by category",
    bannerAlt:
      "Brushed stainless steel linear drain along the edge of a swimming pool at dusk",
    heading:
      "Tips, guides and ideas for bathrooms, outdoor areas and building projects",
    subheading:
      "Installation, maintenance, design and trends, backed by the experience of the people who make the products.",
    metaTitle:
      "Blog | Tips & Guides for Bathrooms and Outdoor Areas | Inova Grelhas Lineares",
    metaDescription:
      "Tips, guides and ideas for bathrooms, outdoor areas, pools and building projects: installation, maintenance and design, from the makers of stainless steel linear drains and grates.",
    featured: "Featured",
    read: "Read article",
    readTime: (min: number) => `${min} min read`,
    empty: "Our first articles are coming soon.",
    back: "Back to blog",
    nextArticle: "Next article",
    toc: "In this article",
    stickyText: "Like the products?",
    stickyButton: "View Catalog",
    mostRead: "🔥 Most Read",
    ctaTitle: "Ready to specify your linear drain?",
    ctaText: "Talk directly to the factory and get a quote for your project.",
    ctaButton: "Chat on WhatsApp",
    cta: (title: string) =>
      `Hello! I read the article "${title}" on the Inova Grelhas Lineares blog and would like a quote.`,
  },
} satisfies Record<Locale, unknown>;
