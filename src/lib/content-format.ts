import { stripAffiliateCards } from "@/lib/affiliate-card";

// Utilitários puros (sem dependências) para o conteúdo dos artigos.
// Artigos antigos foram salvos como texto puro; os novos, como HTML do Tiptap.

const HTML_TAG =
  /<\/?(p|h[1-6]|ul|ol|li|blockquote|strong|em|b|i|a|img|br|hr|div|span)\b/i;

export function looksLikeHtml(content: string) {
  return HTML_TAG.test(content);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Texto puro (parágrafos separados por linha em branco) vira HTML com <p>. */
export function plainToHtml(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/** Normaliza qualquer conteúdo salvo (texto puro ou HTML) para HTML. */
export function toEditorHtml(content: string) {
  return looksLikeHtml(content) ? content : plainToHtml(content);
}

/** Extrai só o texto de um HTML (para resumos, meta description e validação). */
export function htmlToText(html: string) {
  // O texto do card de afiliado (título, preço, "Ver Oferta") não entra em resumos.
  return stripAffiliateCards(html)
    .replace(/<\/(p|h[1-6]|li|blockquote|div)>|<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
