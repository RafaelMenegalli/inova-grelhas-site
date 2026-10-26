"use client";

import { useRef, useState } from "react";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AFFILIATE_LIMITS,
  normalizeAffiliate,
  safeUrl,
  type AffiliateAttrs,
} from "@/lib/affiliate-card";

const EMPTY = { title: "", imageUrl: "", price: "", link: "" };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Recebe os dados já validados e normalizados. */
  onInsert: (attrs: AffiliateAttrs) => void;
  /** Envia a imagem ao storage e devolve a URL pública (lança em caso de erro). */
  onUploadImage: (file: File) => Promise<string>;
};

/** Diálogo para inserir um card de produto afiliado (Amazon, Mercado Livre etc.). */
export function AffiliateProductDialog({
  open,
  onOpenChange,
  onInsert,
  onUploadImage,
}: Props) {
  const [fields, setFields] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set =
    (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null); // o aviso some assim que o usuário corrige algo
      setFields((f) => ({ ...f, [key]: e.target.value }));
    };

  function close(next: boolean) {
    if (!next) {
      setFields(EMPTY);
      setError(null);
    }
    onOpenChange(next);
  }

  function submit() {
    if (!fields.title.trim()) return setError("Informe o título do produto.");
    if (!safeUrl(fields.link))
      return setError(
        "Informe o link de afiliado completo, começando com https://",
      );
    if (fields.imageUrl.trim() && !safeUrl(fields.imageUrl, true))
      return setError("A imagem precisa ser uma URL https:// válida.");

    const attrs = normalizeAffiliate(fields);
    if (!attrs) return setError("Confira os dados do produto.");
    onInsert(attrs);
    close(false);
  }

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await onUploadImage(file);
      setFields((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar a imagem.",
      );
    } finally {
      setUploading(false);
    }
  }

  // Enter envia o diálogo (sem <form>, para não interferir no formulário do artigo).
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const previewUrl = safeUrl(fields.imageUrl, true);

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Inserir produto afiliado</DialogTitle>
          <DialogDescription>
            O card aparece no meio do artigo com o botão &quot;Ver Oferta&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4" onKeyDown={onEnter}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="aff-title">Título do produto *</Label>
            <Input
              id="aff-title"
              value={fields.title}
              onChange={set("title")}
              maxLength={AFFILIATE_LIMITS.title}
              placeholder="Ralo linear inox 304 escovado 70 cm"
              className="h-10"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="aff-image">URL da imagem</Label>
            <div className="flex gap-2">
              <Input
                id="aff-image"
                value={fields.imageUrl}
                onChange={set("imageUrl")}
                placeholder="https://m.media-amazon.com/images/..."
                className="h-10"
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                Enviar
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={pickImage}
              />
            </div>
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Pré-visualização da imagem do produto"
                referrerPolicy="no-referrer"
                className="size-20 rounded-md border bg-white object-contain p-1"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="aff-price">Preço</Label>
            <Input
              id="aff-price"
              value={fields.price}
              onChange={set("price")}
              maxLength={AFFILIATE_LIMITS.price}
              placeholder="R$ 149,90"
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="aff-link">Link de afiliado *</Label>
            <Input
              id="aff-link"
              value={fields.link}
              onChange={set("link")}
              placeholder="https://amzn.to/..."
              className="h-10"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => close(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={submit}>
            Inserir card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
