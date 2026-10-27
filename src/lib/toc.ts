export type Heading = { level: 2 | 3; text: string; id: string };

// Ids já usados por elementos fixos da página do artigo.
const RESERVED_IDS = new Set(["most-read"]);

function decodeEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Dá um `id` a cada <h2>/<h3> do HTML do artigo e devolve também a lista para o índice.
 * Use só depois do sanitizador (ele remove atributos dos títulos), de modo que os ids
 * criados aqui são os únicos que existem e só têm letras minúsculas, números e hífen.
 */
export function addHeadingIds(html: string): {
  html: string;
  headings: Heading[];
} {
  const headings: Heading[] = [];
  const used = new Set<string>(RESERVED_IDS);

  const out = html.replace(
    /<h([23])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, inner: string) => {
      const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();
      if (!text) return match;

      const base = slugify(text) || `secao-${headings.length + 1}`;
      let id = base;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      used.add(id);

      headings.push({ level: Number(level) as 2 | 3, text, id });
      return `<h${level} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: out, headings };
}
