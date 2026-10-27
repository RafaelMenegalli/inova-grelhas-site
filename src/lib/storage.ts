import { randomUUID } from "node:crypto";

import { MAX_IMAGE_BYTES } from "@/lib/storage-limits";

export { MAX_IMAGE_BYTES };

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export class UploadError extends Error {}

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!url || !key || !bucket) {
    throw new Error("Variáveis do Supabase Storage não configuradas.");
  }
  return { url: url.replace(/\/$/, ""), key, bucket };
}

/** Valida o arquivo sem fazer upload; retorna a mensagem de erro, se houver. */
export function validateImage(file: FormDataEntryValue | null, label: string) {
  if (!(file instanceof File) || file.size === 0) {
    return `Envie ${label}.`;
  }
  if (!(file.type in EXTENSIONS)) {
    return `${label}: formato inválido (use JPG, PNG, WebP, AVIF ou GIF).`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `${label}: o arquivo excede 5 MB.`;
  }
  return null;
}

/** Envia a imagem ao Supabase Storage e devolve a URL pública. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const { url, key, bucket } = config();
  const path = `${folder}/${randomUUID()}.${EXTENSIONS[file.type]}`;

  const res = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    body: file,
  });

  if (!res.ok) {
    throw new UploadError(
      `Falha no upload da imagem (${res.status}): ${await res.text()}`,
    );
  }

  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Remove do bucket uma imagem enviada por nós. Best-effort: nunca lança, e ignora
 * URLs que não sejam do nosso bucket (ex.: dados antigos ou externos).
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  try {
    const { url, key, bucket } = config();
    const prefix = `${url}/storage/v1/object/public/${bucket}/`;
    if (!publicUrl.startsWith(prefix)) return;
    const path = publicUrl.slice(prefix.length);

    const res = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${key}`, apikey: key },
    });
    if (!res.ok)
      console.error(`Falha ao apagar imagem (${res.status}): ${path}`);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Copia uma imagem do nosso bucket para um arquivo novo e devolve a URL pública da cópia.
 * Cada registro precisa da própria imagem, porque apagar ou trocar uma foto remove o arquivo.
 * Lança se a cópia falhar; URLs de fora do bucket (dados antigos) são devolvidas como estão,
 * já que o deleteImage as ignora.
 */
export async function copyImage(
  publicUrl: string,
  folder: string,
): Promise<string> {
  const { url, key, bucket } = config();
  const prefix = `${url}/storage/v1/object/public/${bucket}/`;
  if (!publicUrl.startsWith(prefix)) return publicUrl;

  const source = publicUrl.slice(prefix.length);
  const extension = source.includes(".") ? source.split(".").pop() : "jpg";
  const destination = `${folder}/${randomUUID()}.${extension}`;

  const res = await fetch(`${url}/storage/v1/object/copy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucketId: bucket,
      sourceKey: source,
      destinationKey: destination,
    }),
  });
  if (!res.ok) {
    throw new UploadError(
      `Falha ao copiar a imagem (${res.status}): ${await res.text()}`,
    );
  }
  return `${prefix}${destination}`;
}
