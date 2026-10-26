// Categorias do blog. O valor salvo no banco é sempre o nome em português;
// o inglês só muda o rótulo exibido em /en/blog.

export const CATEGORIES = [
  { value: "Arquitetura", en: "Architecture" },
  { value: "Drenagem", en: "Drainage" },
  { value: "Obras", en: "Construction" },
  { value: "Guias de Instalação", en: "Installation Guides" },
  { value: "Geral", en: "General" },
] as const;

export const DEFAULT_CATEGORY = "Geral";

/** Só aceita categorias da lista; qualquer outro valor vira "Geral". */
export function normalizeCategory(value: string) {
  return CATEGORIES.some((c) => c.value === value) ? value : DEFAULT_CATEGORY;
}

export function categoryLabel(value: string, locale: "pt" | "en") {
  if (locale === "pt") return value;
  return CATEGORIES.find((c) => c.value === value)?.en ?? value;
}

/** Posição na lista (categorias desconhecidas vão para o fim). */
export function categoryOrder(value: string) {
  const i = CATEGORIES.findIndex((c) => c.value === value);
  return i === -1 ? CATEGORIES.length : i;
}
