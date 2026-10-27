import { en } from "./en";
import { pt, type Dictionary } from "./pt";

export type Lang = "pt" | "en";
export type { Dictionary };

const dictionaries: Record<Lang, Dictionary> = { pt, en };

/** Textos da landing, do header e do rodapé no idioma pedido (padrão: português). */
export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? pt;
}

/** Caminho da página inicial no idioma (`/` em português, `/en` em inglês). */
export function homePath(lang: Lang) {
  return lang === "en" ? "/en" : "/";
}

/** Âncora de uma seção da landing (ex.: `/en#sobre`); o rolar suave vem do CSS global. */
export function sectionPath(lang: Lang, id: string) {
  return `${homePath(lang)}#${id}`;
}

export function blogHomePath(lang: Lang) {
  return lang === "en" ? "/en/blog" : "/blog";
}
