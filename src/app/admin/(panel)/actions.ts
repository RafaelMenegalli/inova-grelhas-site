"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { normalizeCategory } from "@/lib/categories";
import { htmlToText } from "@/lib/content-format";
import { MAX_PRODUCT_IMAGES, productImages } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";
import { toSafeHtml } from "@/lib/sanitize";
import {
  copyImage,
  deleteImage,
  uploadImage,
  validateImage,
} from "@/lib/storage";

export type FormState = { error?: string };

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** O Tiptap devolve "<p></p>" quando vazio: valida pelo texto, não pela string. */
function hasText(html: string) {
  return htmlToText(html).length > 0;
}

/** URLs das imagens usadas dentro do HTML dos artigos (deleteImage ignora as de fora do bucket). */
function contentImages(...htmls: string[]) {
  const urls = new Set<string>();
  for (const html of htmls) {
    for (const m of html.matchAll(/<img[^>]*\ssrc="([^"]+)"/gi)) {
      urls.add(m[1].replace(/&amp;/g, "&"));
    }
  }
  return urls;
}

type ImageStep = { url: string } | { file: File };

/**
 * Monta a lista final de fotos a partir do formulário. O campo `imageOrder` traz a ordem
 * escolhida: "keep:<url>" para uma foto já salva (só vale se for deste produto) e "new:<n>"
 * para o n-ésimo arquivo enviado. A primeira da lista é a foto principal.
 */
function planProductImages(formData: FormData, current: string[]) {
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const plan: ImageStep[] = [];
  const usedUrls = new Set<string>();
  const usedFiles = new Set<number>();

  for (const token of formData.getAll("imageOrder").map(String)) {
    if (token.startsWith("keep:")) {
      const url = token.slice(5);
      if (current.includes(url) && !usedUrls.has(url)) {
        usedUrls.add(url);
        plan.push({ url });
      }
    } else if (token.startsWith("new:")) {
      const index = Number(token.slice(4));
      if (Number.isInteger(index) && files[index] && !usedFiles.has(index)) {
        usedFiles.add(index);
        plan.push({ file: files[index] });
      }
    }
  }
  return plan;
}

/** Confere quantidade, formato e tamanho das fotos; devolve a mensagem de erro, se houver. */
function checkProductImages(plan: ImageStep[]) {
  if (plan.length === 0) return "Envie ao menos uma foto do ralo.";
  if (plan.length > MAX_PRODUCT_IMAGES) {
    return `Cada produto aceita no máximo ${MAX_PRODUCT_IMAGES} fotos.`;
  }
  for (const step of plan) {
    if (!("file" in step)) continue;
    const error = validateImage(step.file, `a foto "${step.file.name}"`);
    if (error) return error;
  }
  return null;
}

/**
 * Envia as fotos novas do plano e devolve a lista final de URLs, na ordem do plano.
 * Se um envio falhar, apaga as que já subiram e relança o erro.
 */
async function applyProductImages(plan: ImageStep[]) {
  const uploaded: string[] = [];
  const urls: string[] = [];
  try {
    for (const step of plan) {
      if ("url" in step) {
        urls.push(step.url);
        continue;
      }
      const url = await uploadImage(step.file, "products");
      uploaded.push(url);
      urls.push(url);
    }
  } catch (e) {
    await Promise.all(uploaded.map(deleteImage));
    throw e;
  }
  return { urls, uploaded };
}

/** Atualiza o cache e as páginas públicas que mostram produtos. */
function refreshProducts() {
  updateTag("products");
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

/** Atualiza o cache e as páginas públicas do blog (PT e EN). */
function refreshArticles() {
  updateTag("articles");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/en/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/en/blog/[slug]", "page");
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type VariationInput = {
  id?: string;
  size: string;
  finish: string;
  hasScreen: boolean;
  isActive: boolean;
};

/** Lê as linhas de variação do formulário (campos paralelos, na mesma ordem). */
function parseVariations(
  formData: FormData,
): { variations: VariationInput[] } | { error: string } {
  const sizes = formData.getAll("size").map(String);
  const finishes = formData.getAll("finish").map(String);
  const screens = formData.getAll("hasScreen").map(String);
  const ids = formData.getAll("variationId").map(String);
  const actives = formData.getAll("variationActive").map(String);

  const variations = sizes
    .map((size, i) => ({
      id: ids[i] || undefined,
      size: size.trim(),
      finish: (finishes[i] ?? "").trim(),
      hasScreen: screens[i] === "true",
      isActive: actives[i] !== "false",
    }))
    .filter((v) => v.size || v.finish);

  if (variations.some((v) => !v.size || !v.finish)) {
    return { error: "Preencha medida e acabamento em todas as variações." };
  }
  return { variations };
}

export async function createProduct(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const name = text(formData, "name");
  const description = toSafeHtml(text(formData, "description"));
  if (!name) return { error: "Informe o nome do produto." };
  if (!hasText(description)) {
    return { error: "Informe a descrição do produto." };
  }

  const plan = planProductImages(formData, []);
  const imagesError = checkProductImages(plan);
  if (imagesError) return { error: imagesError };

  const parsed = parseVariations(formData);
  if ("error" in parsed) return { error: parsed.error };

  let images: string[];
  try {
    ({ urls: images } = await applyProductImages(plan));
  } catch (e) {
    console.error(e);
    return { error: "Não foi possível enviar as imagens. Tente novamente." };
  }

  await prisma.product.create({
    data: {
      name,
      description,
      images,
      imageUrl: images[0],
      variations: {
        create: parsed.variations.map(
          ({ size, finish, hasScreen, isActive }) => ({
            size,
            finish,
            hasScreen,
            isActive,
          }),
        ),
      },
    },
  });

  refreshProducts();
  redirect("/admin/produtos");
}

export async function updateProduct(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const existing = await prisma.product.findUnique({
    where: { id },
    select: {
      images: true,
      imageUrl: true,
      variations: { select: { id: true } },
    },
  });
  if (!existing) return { error: "Produto não encontrado." };

  const name = text(formData, "name");
  const description = toSafeHtml(text(formData, "description"));
  if (!name) return { error: "Informe o nome do produto." };
  if (!hasText(description)) {
    return { error: "Informe a descrição do produto." };
  }

  const parsed = parseVariations(formData);
  if ("error" in parsed) return { error: parsed.error };

  const current = productImages(existing);
  const plan = planProductImages(formData, current);
  const imagesError = checkProductImages(plan);
  if (imagesError) return { error: imagesError };

  let images: string[];
  let uploaded: string[];
  try {
    ({ urls: images, uploaded } = await applyProductImages(plan));
  } catch (e) {
    console.error(e);
    return { error: "Não foi possível enviar as imagens. Tente novamente." };
  }

  // Só reconhece ids que pertencem a este produto; os demais viram variações novas.
  const ownIds = new Set(existing.variations.map((v) => v.id));
  const keptVariations = parsed.variations.filter(
    (v) => v.id && ownIds.has(v.id),
  );
  const added = parsed.variations.filter((v) => !v.id || !ownIds.has(v.id));

  try {
    await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          images,
          imageUrl: images[0],
        },
      }),
      prisma.productVariation.deleteMany({
        where: {
          productId: id,
          id: { notIn: keptVariations.map((v) => v.id!) },
        },
      }),
      ...keptVariations.map((v) =>
        prisma.productVariation.updateMany({
          where: { id: v.id, productId: id },
          data: {
            size: v.size,
            finish: v.finish,
            hasScreen: v.hasScreen,
            isActive: v.isActive,
          },
        }),
      ),
      prisma.productVariation.createMany({
        data: added.map((v) => ({
          productId: id,
          size: v.size,
          finish: v.finish,
          hasScreen: v.hasScreen,
          isActive: v.isActive,
        })),
      }),
    ]);
  } catch (e) {
    console.error(e);
    await Promise.all(uploaded.map(deleteImage));
    return { error: "Não foi possível salvar as alterações. Tente novamente." };
  }

  // Fotos removidas no formulário saem do storage.
  await Promise.all(
    current.filter((url) => !images.includes(url)).map(deleteImage),
  );

  refreshProducts();
  redirect("/admin/produtos");
}

export async function toggleProductStatus(
  id: string,
  currentStatus: boolean,
): Promise<FormState> {
  await requireAdmin();
  const { count } = await prisma.product.updateMany({
    where: { id },
    data: { isActive: !currentStatus },
  });
  if (!count) return { error: "Produto não encontrado." };

  refreshProducts();
  return {};
}

/**
 * Cria uma cópia do produto (com variações e uma cópia própria da foto) e abre a edição.
 * A cópia nasce inativa, para não aparecer na vitrine antes de ser revisada.
 */
export async function duplicateProduct(id: string): Promise<FormState> {
  await requireAdmin();
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variations: { orderBy: { createdAt: "asc" } } },
  });
  if (!product) return { error: "Produto não encontrado." };

  // Cada produto precisa dos próprios arquivos (apagar um não pode afetar o outro).
  const images: string[] = [];
  try {
    for (const url of productImages(product)) {
      images.push(await copyImage(url, "products"));
    }
  } catch (e) {
    console.error(e);
    await Promise.all(images.map(deleteImage));
    return { error: "Não foi possível copiar as imagens. Tente novamente." };
  }

  const copy = await prisma.product.create({
    data: {
      name: `${product.name} (cópia)`,
      description: product.description,
      images,
      imageUrl: images[0],
      isActive: false,
      variations: {
        create: product.variations.map(
          ({ size, finish, hasScreen, isActive }) => ({
            size,
            finish,
            hasScreen,
            isActive,
          }),
        ),
      },
    },
  });

  refreshProducts();
  redirect(`/admin/produtos/${copy.id}/editar`);
}

export async function deleteProduct(id: string): Promise<FormState> {
  await requireAdmin();
  const product = await prisma.product.findUnique({
    where: { id },
    select: { images: true, imageUrl: true },
  });
  if (!product) return { error: "Produto não encontrado." };

  // As variações saem junto (onDelete: Cascade no schema).
  await prisma.product.delete({ where: { id } });
  await Promise.all(productImages(product).map(deleteImage));

  refreshProducts();
  return {};
}

export async function createArticle(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const titlePt = text(formData, "titlePt");
  const titleEn = text(formData, "titleEn");
  const contentPt = toSafeHtml(text(formData, "contentPt"));
  const contentEn = toSafeHtml(text(formData, "contentEn"));
  const slug = slugify(text(formData, "slug") || titlePt);
  const category = normalizeCategory(text(formData, "category"));

  if (!titlePt || !hasText(contentPt))
    return { error: "Preencha título e conteúdo na aba Português." };
  if (!titleEn || !hasText(contentEn))
    return { error: "Preencha título e conteúdo na aba Inglês." };
  if (!slug) return { error: "Não foi possível gerar o slug." };

  const cover = formData.get("coverImage");
  const coverError = validateImage(cover, "a imagem de capa");
  if (coverError) return { error: coverError };

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) return { error: `O slug "${slug}" já está em uso.` };

  let coverImage: string;
  try {
    coverImage = await uploadImage(cover as File, "articles");
  } catch (e) {
    console.error(e);
    return { error: "Não foi possível enviar a imagem. Tente novamente." };
  }

  await prisma.article.create({
    data: {
      slug,
      titlePt,
      titleEn,
      contentPt,
      contentEn,
      coverImage,
      category,
      isPublished: formData.get("isPublished") === "on",
    },
  });

  refreshArticles();
  redirect("/admin/blog");
}

export async function updateArticle(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const current = await prisma.article.findUnique({
    where: { id },
    select: { coverImage: true, contentPt: true, contentEn: true },
  });
  if (!current) return { error: "Artigo não encontrado." };

  const titlePt = text(formData, "titlePt");
  const titleEn = text(formData, "titleEn");
  const contentPt = toSafeHtml(text(formData, "contentPt"));
  const contentEn = toSafeHtml(text(formData, "contentEn"));
  const slug = slugify(text(formData, "slug") || titlePt);
  const category = normalizeCategory(text(formData, "category"));

  if (!titlePt || !hasText(contentPt))
    return { error: "Preencha título e conteúdo na aba Português." };
  if (!titleEn || !hasText(contentEn))
    return { error: "Preencha título e conteúdo na aba Inglês." };
  if (!slug) return { error: "Não foi possível gerar o slug." };

  const taken = await prisma.article.findFirst({
    where: { slug, NOT: { id } },
    select: { id: true },
  });
  if (taken) return { error: `O slug "${slug}" já está em uso.` };

  // Capa opcional na edição: sem arquivo novo, mantém a URL salva.
  const file = formData.get("coverImage");
  const newFile = file instanceof File && file.size > 0 ? file : null;
  if (newFile) {
    const coverError = validateImage(newFile, "a imagem de capa");
    if (coverError) return { error: coverError };
  }

  let newCoverUrl: string | undefined;
  if (newFile) {
    try {
      newCoverUrl = await uploadImage(newFile, "articles");
    } catch (e) {
      console.error(e);
      return { error: "Não foi possível enviar a imagem. Tente novamente." };
    }
  }

  try {
    await prisma.article.update({
      where: { id },
      data: {
        slug,
        titlePt,
        titleEn,
        contentPt,
        contentEn,
        category,
        isPublished: formData.get("isPublished") === "on",
        ...(newCoverUrl && { coverImage: newCoverUrl }),
      },
    });
  } catch (e) {
    console.error(e);
    if (newCoverUrl) await deleteImage(newCoverUrl);
    return { error: "Não foi possível salvar as alterações. Tente novamente." };
  }

  if (newCoverUrl) await deleteImage(current.coverImage);

  // Imagens que estavam no texto e foram retiradas na edição saem do bucket.
  const kept = contentImages(contentPt, contentEn);
  for (const url of contentImages(current.contentPt, current.contentEn)) {
    if (!kept.has(url)) await deleteImage(url);
  }

  refreshArticles();
  redirect("/admin/blog");
}

export async function toggleArticleStatus(
  id: string,
  currentStatus: boolean,
): Promise<FormState> {
  await requireAdmin();
  const { count } = await prisma.article.updateMany({
    where: { id },
    data: { isPublished: !currentStatus },
  });
  if (!count) return { error: "Artigo não encontrado." };

  refreshArticles();
  return {};
}

export async function deleteArticle(id: string): Promise<FormState> {
  await requireAdmin();
  const article = await prisma.article.findUnique({
    where: { id },
    select: { coverImage: true, contentPt: true, contentEn: true },
  });
  if (!article) return { error: "Artigo não encontrado." };

  await prisma.article.delete({ where: { id } });
  await deleteImage(article.coverImage);
  for (const url of contentImages(article.contentPt, article.contentEn)) {
    await deleteImage(url);
  }

  refreshArticles();
  return {};
}

/** Upload de imagem inserida dentro do texto do artigo (editor rico). */
export async function uploadEditorImage(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  const invalid = validateImage(file, "a imagem");
  if (invalid) return { error: invalid };

  try {
    return { url: await uploadImage(file as File, "articles/content") };
  } catch (e) {
    console.error(e);
    return { error: "Não foi possível enviar a imagem. Tente novamente." };
  }
}
