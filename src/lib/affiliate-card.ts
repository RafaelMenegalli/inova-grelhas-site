// Card de produto afiliado dentro dos artigos. Fonte única do visual e das regras:
// o editor (Tiptap) e o site público usam o mesmo desenho, e o servidor é quem
// monta o HTML final a partir de dados validados (nunca confia no HTML guardado).
//
// As classes Tailwind ficam neste arquivo de propósito: o Tailwind só gera o CSS
// das classes que encontra no código-fonte, e não das que existem só no banco.

export type AffiliateAttrs = {
  title: string;
  imageUrl: string;
  price: string;
  link: string;
};

export const AFFILIATE_LIMITS = { title: 160, price: 40, url: 2000 } as const;

/** Árvore de elementos: [tag, atributos, ...filhos]. Mesmo formato do DOMOutputSpec do Tiptap. */
export type Spec = string | [string, Record<string, string>, ...Spec[]];

const CLASSES = {
  card: "not-prose my-8 flex flex-col items-center gap-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 shadow-sm transition-shadow hover:shadow-md md:flex-row",
  image:
    "h-32 w-32 shrink-0 rounded-md border bg-white dark:bg-slate-900 object-contain p-2",
  body: "flex-1 text-center md:text-left",
  label:
    "m-0 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400",
  title: "m-0 mt-1 text-lg font-bold text-slate-900 dark:text-slate-50",
  price: "m-0 mt-2 text-2xl font-extrabold text-primary dark:text-sky-400",
  button:
    "w-full rounded-lg bg-primary px-6 py-3 text-center font-bold text-primary-foreground no-underline transition-colors hover:bg-primary/90 md:w-auto",
} as const;

/** Aceita só URLs absolutas http(s) (ou só https) e de tamanho razoável. */
export function safeUrl(raw: string, httpsOnly = false) {
  const value = raw.trim();
  if (!value || value.length > AFFILIATE_LIMITS.url) return null;
  try {
    const url = new URL(value);
    const ok = httpsOnly
      ? url.protocol === "https:"
      : url.protocol === "https:" || url.protocol === "http:";
    return ok ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Valida e normaliza os dados de um card. Devolve null se for inválido
 * (sem título ou sem link http(s)); imagem inválida só é omitida.
 */
export function normalizeAffiliate(
  input: Partial<AffiliateAttrs>,
): AffiliateAttrs | null {
  const title = (input.title ?? "").trim().slice(0, AFFILIATE_LIMITS.title);
  const link = safeUrl(input.link ?? "");
  if (!title || !link) return null;
  return {
    title,
    link,
    imageUrl: safeUrl(input.imageUrl ?? "", true) ?? "",
    price: (input.price ?? "").trim().slice(0, AFFILIATE_LIMITS.price),
  };
}

/** Desenho do card. No editor o botão não é clicável (evita abrir o link ao editar). */
export function affiliateSpec(a: AffiliateAttrs, inEditor = false): Spec {
  const children: Spec[] = [];
  if (a.imageUrl) {
    children.push([
      "img",
      {
        src: a.imageUrl,
        alt: a.title,
        class: CLASSES.image,
        loading: "lazy",
        referrerpolicy: "no-referrer",
      },
    ]);
  }
  const body: Spec[] = [
    ["p", { class: CLASSES.label }, "Oferta parceira"],
    ["h4", { class: CLASSES.title }, a.title],
  ];
  if (a.price) body.push(["p", { class: CLASSES.price }, a.price]);
  children.push(["div", { class: CLASSES.body }, ...body]);
  children.push([
    "a",
    {
      href: a.link,
      target: "_blank",
      rel: "sponsored nofollow noopener noreferrer",
      class: inEditor
        ? `${CLASSES.button} pointer-events-none`
        : CLASSES.button,
    },
    "Ver Oferta",
  ]);

  return [
    "div",
    {
      "data-affiliate": "",
      "data-title": a.title,
      "data-image-url": a.imageUrl,
      "data-price": a.price,
      "data-link": a.link,
      class: CLASSES.card,
    },
    ...children,
  ];
}

const VOID_TAGS = new Set(["img", "br", "hr"]);

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeEntities(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&#x0*27;/gi, "'")
    .replace(/&amp;/g, "&");
}

/** Serializa um Spec em HTML, escapando atributos e textos. */
export function specToHtml(spec: Spec): string {
  if (typeof spec === "string") return escapeHtml(spec);
  const [tag, attrs, ...children] = spec;
  const attrText = Object.entries(attrs)
    .map(([k, v]) =>
      v === "" && k.startsWith("data-")
        ? ` ${k}=""`
        : ` ${k}="${escapeHtml(v)}"`,
    )
    .join("");
  return VOID_TAGS.has(tag)
    ? `<${tag}${attrText}>`
    : `<${tag}${attrText}>${children.map(specToHtml).join("")}</${tag}>`;
}

/** HTML final de um card já validado (ou "" se os dados forem inválidos). */
export function affiliateCardHtml(input: Partial<AffiliateAttrs>) {
  const normalized = normalizeAffiliate(input);
  return normalized ? specToHtml(affiliateSpec(normalized)) : "";
}

function readDataAttrs(startTag: string): Partial<AffiliateAttrs> {
  const get = (name: string) => {
    const m = startTag.match(
      new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"),
    );
    return m ? decodeEntities(m[1] ?? m[2] ?? "") : "";
  };
  return {
    title: get("data-title"),
    imageUrl: get("data-image-url"),
    price: get("data-price"),
    link: get("data-link"),
  };
}

const MARKER_START = /<div\b[^>]*\sdata-affiliate(?=[\s=>/])[^>]*>/i;
const DIV_TOKEN = /<(\/?)div\b[^>]*>/gi;

/**
 * Troca cada card (<div data-affiliate ...> ... </div>, com divs aninhadas) pelo
 * resultado de `render`, que recebe os dados lidos dos atributos data-*.
 * Pressupõe HTML bem formado (use depois do sanitizador).
 */
export function replaceAffiliateCards(
  html: string,
  render: (attrs: Partial<AffiliateAttrs>) => string,
) {
  let out = "";
  let rest = html;
  for (;;) {
    const start = MARKER_START.exec(rest);
    if (!start) return out + rest;

    out += rest.slice(0, start.index);
    // Procura o </div> que fecha o card, contando divs aninhadas.
    DIV_TOKEN.lastIndex = start.index;
    let depth = 0;
    let end = -1;
    for (let t = DIV_TOKEN.exec(rest); t; t = DIV_TOKEN.exec(rest)) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) {
        end = DIV_TOKEN.lastIndex;
        break;
      }
    }
    out += render(readDataAttrs(start[0]));
    // Sem fechamento: descarta o restante (conteúdo malformado).
    if (end === -1) return out;
    rest = rest.slice(end);
  }
}

/** Remove os cards (para resumos, descrição para buscadores e validação de texto). */
export function stripAffiliateCards(html: string) {
  return replaceAffiliateCards(html, () => "");
}
