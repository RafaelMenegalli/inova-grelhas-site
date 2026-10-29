/** Itens por página nas listagens do painel admin. */
export const ADMIN_PAGE_SIZE = 10;

/** Lê o `?page=` da URL: inteiro a partir de 1 (valores inválidos viram 1). */
export function parsePage(raw: string | string[] | undefined) {
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(value) && value >= 1 ? value : 1;
}

/**
 * Página efetiva e total de páginas para `total` itens. A página pedida é limitada à
 * última, de modo que apagar os itens da última página não deixa uma tela vazia.
 */
export function paginate(total: number, requestedPage: number) {
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  return {
    page,
    totalPages,
    skip: (page - 1) * ADMIN_PAGE_SIZE,
    take: ADMIN_PAGE_SIZE,
  };
}
