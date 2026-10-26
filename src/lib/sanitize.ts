import sanitizeHtml from "sanitize-html";
import { toEditorHtml } from "@/lib/content-format";

/** Prefixo das imagens que aceitamos dentro do artigo (nosso bucket público). */
function imagePrefix() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  return url && bucket ? `${url}/storage/v1/object/public/${bucket}/` : null;
}

/**
 * Sanitiza o HTML de um artigo (só no servidor): lista fechada de tags, sem
 * scripts/eventos, links externos com rel seguro e imagens apenas do nosso bucket.
 * Aceita também texto puro legado, convertendo-o antes.
 */
export function toSafeHtml(content: string) {
  const prefix = imagePrefix();

  return sanitizeHtml(toEditorHtml(content), {
    allowedTags: [
      "p",
      "br",
      "h2",
      "h3",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "blockquote",
      "hr",
      "a",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "rel", "target"],
      img: ["src", "alt", "loading", "decoding"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    transformTags: {
      b: "strong",
      i: "em",
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href ?? "");
        return {
          tagName,
          attribs: {
            ...(attribs.href ? { href: attribs.href } : {}),
            // Links externos (inclui afiliados): sinaliza patrocinado e isola a aba.
            ...(external
              ? { rel: "sponsored noopener noreferrer", target: "_blank" }
              : {}),
          },
        };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          src: attribs.src ?? "",
          alt: attribs.alt ?? "",
          loading: "lazy",
          decoding: "async",
        },
      }),
    },
    // Descarta imagens que não sejam do nosso bucket (evita pixels de rastreio).
    exclusiveFilter: (frame) => {
      // Parágrafos vazios (o Tiptap deixa um <p></p> no fim) não entram; os que
      // têm só imagem ficam, pois mediaChildren os identifica.
      if (
        frame.tag === "p" &&
        !frame.text.trim() &&
        frame.mediaChildren.length === 0
      )
        return true;
      return (
        frame.tag === "img" &&
        (!prefix || !(frame.attribs.src ?? "").startsWith(prefix))
      );
    },
  });
}
