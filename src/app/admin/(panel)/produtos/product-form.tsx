"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, ImagePlus, Plus, Star, Trash2, X } from "lucide-react";
import type { FormState } from "../actions";
import { FormField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { toEditorHtml } from "@/lib/content-format";
import { MAX_PRODUCT_IMAGES } from "@/lib/product-images";
import { MAX_IMAGE_BYTES } from "@/lib/storage-limits";

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

/** Foto do formulário: já salva (`url`) ou escolhida agora (`file`). A ordem do array é a ordem final. */
type Photo = { id: string; preview: string; url?: string; file?: File };

export type InitialProduct = {
  name: string;
  description: string;
  images: string[];
  variations: {
    id: string;
    size: string;
    finish: string;
    hasScreen: boolean;
    isActive: boolean;
  }[];
};

type Row = {
  key: number;
  /** Vazio em variações novas; preenchido nas que já existem no banco. */
  id: string;
  size: string;
  finish: string;
  hasScreen: boolean;
  isActive: boolean;
};

const emptyRow = (key: number): Row => ({
  key,
  id: "",
  size: "",
  finish: "",
  hasScreen: false,
  isActive: true,
});

/**
 * Formulário de produto usado na criação e na edição.
 * Aceita de 1 a 5 fotos (a primeira é a principal) e descrição em texto rico.
 * Na edição, as fotos salvas podem ser mantidas, removidas ou reordenadas.
 */
export function ProductForm({
  action: formAction,
  initial,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: InitialProduct;
}) {
  const isEdit = !!initial;
  const [state, action, pending] = useActionState<FormState, FormData>(
    formAction,
    {},
  );
  const [rows, setRows] = useState<Row[]>(() =>
    initial && initial.variations.length > 0
      ? initial.variations.map((v, i) => ({ ...v, key: i }))
      : [emptyRow(0)],
  );
  const [nextKey, setNextKey] = useState(initial?.variations.length || 1);
  // Campos controlados: o React 19 limpa o <form> após cada action, mesmo com erro.
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(() =>
    toEditorHtml(initial?.description ?? ""),
  );
  const [photos, setPhotos] = useState<Photo[]>(() =>
    (initial?.images ?? []).map((url) => ({ id: url, preview: url, url })),
  );
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // Guarda as prévias criadas aqui para liberá-las ao sair da página.
  const blobUrls = useRef<string[]>([]);
  useEffect(() => {
    const urls = blobUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  function addRow() {
    setRows((r) => [...r, emptyRow(nextKey)]);
    setNextKey((k) => k + 1);
  }

  function updateRow(key: number, patch: Partial<Row>) {
    setRows((r) =>
      r.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  function pickPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    const room = Math.max(MAX_PRODUCT_IMAGES - photos.length, 0);
    let error: string | null =
      picked.length > room
        ? `Cada produto aceita no máximo ${MAX_PRODUCT_IMAGES} fotos.`
        : null;
    const accepted: Photo[] = [];
    for (const file of picked.slice(0, room)) {
      if (!IMAGE_TYPES.includes(file.type)) {
        error = `"${file.name}": formato inválido (use JPG, PNG, WebP, AVIF ou GIF).`;
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        error = `"${file.name}": o arquivo excede 5 MB.`;
        continue;
      }
      const preview = URL.createObjectURL(file);
      blobUrls.current.push(preview);
      accepted.push({ id: preview, preview, file });
    }
    setPhotoError(error);
    if (accepted.length > 0) setPhotos((p) => [...p, ...accepted]);
  }

  function removePhoto(id: string) {
    setPhotoError(null);
    setPhotos((p) => p.filter((x) => x.id !== id));
  }

  function makeMain(id: string) {
    setPhotos((p) => {
      const picked = p.find((x) => x.id === id);
      return picked ? [picked, ...p.filter((x) => x.id !== id)] : p;
    });
  }

  // Os arquivos novos vão no envio, na ordem em que aparecem; `imageOrder` diz ao servidor
  // como juntá-los às fotos já salvas. (O input de arquivo só escolhe: não tem `name`.)
  const newPhotos = photos.filter((p) => p.file);
  function submit(formData: FormData) {
    formData.delete("images");
    for (const p of newPhotos) formData.append("images", p.file!);
    return action(formData);
  }

  return (
    <form action={submit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do produto</CardTitle>
          <CardDescription>
            Dados exibidos no card e nos detalhes do produto na vitrine do site.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FormField label="Nome" htmlFor="name">
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10"
            />
          </FormField>
          <FormField
            label="Descrição"
            htmlFor="description"
            hint="Sem limite de caracteres. Use negrito, listas e títulos para organizar os detalhes."
          >
            <RichTextEditor
              id="description"
              label="Descrição"
              value={description}
              onChange={setDescription}
            />
            <input type="hidden" name="description" value={description} />
          </FormField>
          <FormField
            label="Fotos do ralo *"
            htmlFor="photos"
            hint={`De 1 a ${MAX_PRODUCT_IMAGES} fotos (JPG, PNG, WebP, AVIF ou GIF, até 5 MB cada). A primeira é a principal, exibida no card da vitrine.`}
          >
            <ul className="flex flex-wrap gap-3">
              {photos.map((photo, index) => (
                <li key={photo.id} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.preview}
                    alt={`Foto ${index + 1}`}
                    className="size-28 rounded-lg border bg-white object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    aria-label={`Remover foto ${index + 1}`}
                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-slate-900/75 text-white hover:bg-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => makeMain(photo.id)}
                      className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-center gap-1 rounded-md bg-slate-900/75 py-1 text-[11px] font-medium text-white hover:bg-slate-900"
                    >
                      <Star className="size-3" />
                      Tornar principal
                    </button>
                  )}
                  <input
                    type="hidden"
                    name="imageOrder"
                    value={
                      photo.url
                        ? `keep:${photo.url}`
                        : `new:${newPhotos.indexOf(photo)}`
                    }
                  />
                </li>
              ))}
              {photos.length < MAX_PRODUCT_IMAGES && (
                <li>
                  <button
                    type="button"
                    id="photos"
                    onClick={() => fileRef.current?.click()}
                    className="flex size-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <ImagePlus className="size-5" />
                    Adicionar fotos
                  </button>
                </li>
              )}
            </ul>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={pickPhotos}
            />
            {photoError && (
              <p role="alert" className="text-sm text-destructive">
                {photoError}
              </p>
            )}
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variações</CardTitle>
          <CardDescription>
            Medida, acabamento e se acompanha tela. Só variações ativas aparecem
            na vitrine.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className="grid gap-4 rounded-lg border bg-slate-50 p-4 sm:grid-cols-[8rem_1fr_auto_auto] sm:items-end"
            >
              <input type="hidden" name="variationId" value={row.id} />
              <input
                type="hidden"
                name="variationActive"
                value={String(row.isActive)}
              />
              <input
                type="hidden"
                name="hasScreen"
                value={String(row.hasScreen)}
              />
              <FormField label="Medida" htmlFor={`size-${row.key}`}>
                <Input
                  id={`size-${row.key}`}
                  name="size"
                  placeholder="50cm"
                  value={row.size}
                  onChange={(e) => updateRow(row.key, { size: e.target.value })}
                  className="h-10 bg-white"
                />
              </FormField>
              <FormField label="Acabamento" htmlFor={`finish-${row.key}`}>
                <Input
                  id={`finish-${row.key}`}
                  name="finish"
                  placeholder="Inox Escovado"
                  value={row.finish}
                  onChange={(e) =>
                    updateRow(row.key, { finish: e.target.value })
                  }
                  className="h-10 bg-white"
                />
              </FormField>
              <div className="flex h-10 items-center gap-5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`screen-${row.key}`}
                    checked={row.hasScreen}
                    onCheckedChange={(v) =>
                      updateRow(row.key, { hasScreen: v === true })
                    }
                  />
                  <Label htmlFor={`screen-${row.key}`}>Com tela</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`active-${row.key}`}
                    checked={row.isActive}
                    onCheckedChange={(v) =>
                      updateRow(row.key, { isActive: v === true })
                    }
                  />
                  <Label htmlFor={`active-${row.key}`}>Ativa</Label>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                aria-label={`Remover variação ${index + 1}`}
                onClick={() =>
                  setRows((r) => r.filter((x) => x.key !== row.key))
                }
                className="h-10 text-muted-foreground hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
              Nenhuma variação adicionada.
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={addRow}
            className="h-10 w-fit px-4"
          >
            <Plus />
            Adicionar variação
          </Button>
        </CardContent>
      </Card>

      {state.error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={pending}
          size="lg"
          className="h-10 px-6"
        >
          {pending
            ? "Salvando..."
            : isEdit
              ? "Salvar alterações"
              : "Salvar produto"}
        </Button>
        {isEdit && (
          <Button asChild variant="outline" size="lg" className="h-10 px-6">
            <Link href="/admin/produtos">Cancelar</Link>
          </Button>
        )}
      </div>
    </form>
  );
}
