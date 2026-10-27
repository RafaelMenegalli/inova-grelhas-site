/** Máximo de fotos por produto (a primeira é a principal). */
export const MAX_PRODUCT_IMAGES = 5;

/**
 * Fotos do produto em ordem. Cai para o campo legado `imageUrl` em linhas que ainda não
 * têm `images` (criadas antes da migração).
 */
export function productImages(p: {
  images: string[];
  imageUrl?: string | null;
}): string[] {
  if (p.images.length > 0) return p.images;
  return p.imageUrl ? [p.imageUrl] : [];
}
