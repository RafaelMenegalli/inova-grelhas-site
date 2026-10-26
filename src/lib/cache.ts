/**
 * Validade do cache dos dados públicos (vitrine e blog).
 *
 * O banco é um só, mas o cache da Vercel é separado do ambiente local: uma ação
 * feita no admin local não invalida o cache do site publicado. Com validade curta,
 * qualquer mudança (inclusive exclusões) chega ao site em cerca de 1 a 2 minutos.
 * `expire` >= 5 min mantém a página pré-renderizada (rápida).
 */
export const publicContentLife = {
  stale: 30,
  revalidate: 60,
  expire: 3600,
} as const;
