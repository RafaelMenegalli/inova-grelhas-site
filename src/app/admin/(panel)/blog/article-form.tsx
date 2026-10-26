"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { uploadEditorImage, type FormState } from "../actions";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, DEFAULT_CATEGORY } from "@/lib/categories";
import { toEditorHtml } from "@/lib/content-format";

export type InitialArticle = {
  slug: string;
  titlePt: string;
  titleEn: string;
  contentPt: string;
  contentEn: string;
  coverImage: string;
  category: string;
  isPublished: boolean;
};

type TextField = "slug" | "titlePt" | "titleEn";

/** Envia a imagem inserida no texto e devolve a URL pública. */
async function uploadInlineImage(file: File) {
  const formData = new FormData();
  formData.set("file", file);
  const result = await uploadEditorImage(formData);
  if ("error" in result) throw new Error(result.error);
  return result.url;
}

/**
 * Formulário de artigo usado na criação e na edição.
 * Com `initial` (edição), a capa deixa de ser obrigatória: sem arquivo novo,
 * a imagem salva é mantida.
 */
export function ArticleForm({
  action: formAction,
  initial,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: InitialArticle;
}) {
  const isEdit = !!initial;
  const formRef = useRef<HTMLFormElement>(null);
  const formResetting = useRef(false);
  const [state, action, pending] = useActionState<FormState, FormData>(
    formAction,
    {},
  );
  // Campos controlados: o React 19 limpa o <form> após cada action, mesmo com erro.
  const [fields, setFields] = useState({
    slug: initial?.slug ?? "",
    titlePt: initial?.titlePt ?? "",
    // Artigos antigos são texto puro: converte para HTML ao abrir no editor.
    contentPt: toEditorHtml(initial?.contentPt ?? ""),
    titleEn: initial?.titleEn ?? "",
    contentEn: toEditorHtml(initial?.contentEn ?? ""),
    category: initial?.category ?? DEFAULT_CATEGORY,
    isPublished: initial?.isPublished ?? false,
  });
  // O React 19 reseta o <form> após cada action e o Select do Radix, ao ouvir esse
  // reset, volta ao valor inicial. A marca na fase de captura (que roda antes do
  // listener do Radix) permite ignorar essa troca automática e manter a escolha.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const mark = () => {
      formResetting.current = true;
      setTimeout(() => {
        formResetting.current = false;
      }, 0);
    };
    form.addEventListener("reset", mark, true);
    return () => form.removeEventListener("reset", mark, true);
  }, []);
  const bind = (key: TextField) => ({
    name: key,
    id: key,
    value: fields[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Publicação</CardTitle>
          <CardDescription>
            Categoria, slug, imagem de capa e status do artigo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FormField
            label="Categoria"
            htmlFor="category"
            hint="Define em qual prateleira o artigo aparece na página do blog."
          >
            <Select
              value={fields.category}
              onValueChange={(category) => {
                if (formResetting.current) return;
                setFields((f) => ({ ...f, category }));
              }}
            >
              <SelectTrigger id="category" className="h-10 w-full sm:w-72">
                <SelectValue placeholder="Escolha uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="category" value={fields.category} />
          </FormField>
          <FormField
            label="Slug"
            htmlFor="slug"
            hint={
              isEdit
                ? "Alterar o slug muda o endereço público do artigo (os links antigos deixam de funcionar)."
                : "Opcional. Se vazio, é gerado a partir do título em português."
            }
          >
            <Input
              {...bind("slug")}
              placeholder="meu-artigo"
              className="h-10"
            />
          </FormField>
          <FormField
            label={isEdit ? "Imagem de capa" : "Imagem de capa *"}
            htmlFor="coverImage"
            hint={
              isEdit
                ? "A capa atual será mantida se você não selecionar uma nova. JPG, PNG, WebP, AVIF ou GIF, até 5 MB."
                : "JPG, PNG, WebP, AVIF ou GIF, até 5 MB."
            }
          >
            {initial && (
              <Image
                src={initial.coverImage}
                alt={`Capa atual: ${initial.titlePt}`}
                width={256}
                height={144}
                className="h-24 w-44 rounded-lg border object-cover"
              />
            )}
            <Input
              id="coverImage"
              name="coverImage"
              type="file"
              accept="image/*"
              required={!isEdit}
              className="h-10 cursor-pointer py-1.5"
            />
          </FormField>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isPublished"
              checked={fields.isPublished}
              onCheckedChange={(v) =>
                setFields((f) => ({ ...f, isPublished: v === true }))
              }
            />
            <Label htmlFor="isPublished">
              {isEdit ? "Publicado" : "Publicar imediatamente"}
            </Label>
            {fields.isPublished && (
              <input type="hidden" name="isPublished" value="on" />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conteúdo</CardTitle>
          <CardDescription>
            Os dois idiomas são obrigatórios para salvar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pt">
            <TabsList className="h-10">
              <TabsTrigger value="pt" className="px-4">
                Português
              </TabsTrigger>
              <TabsTrigger value="en" className="px-4">
                Inglês
              </TabsTrigger>
            </TabsList>
            {/* forceMount mantém ambos os idiomas no DOM para serem enviados juntos. */}
            <TabsContent
              value="pt"
              forceMount
              className="mt-6 flex flex-col gap-6 data-[state=inactive]:hidden"
            >
              <FormField label="Título (PT)" htmlFor="titlePt">
                <Input {...bind("titlePt")} className="h-10" />
              </FormField>
              <FormField label="Conteúdo (PT)" htmlFor="contentPt">
                <RichTextEditor
                  id="contentPt"
                  label="Conteúdo (PT)"
                  value={fields.contentPt}
                  onChange={(html) =>
                    setFields((f) => ({ ...f, contentPt: html }))
                  }
                  onUploadImage={uploadInlineImage}
                />
                <input
                  type="hidden"
                  name="contentPt"
                  value={fields.contentPt}
                />
              </FormField>
            </TabsContent>
            <TabsContent
              value="en"
              forceMount
              className="mt-6 flex flex-col gap-6 data-[state=inactive]:hidden"
            >
              <FormField label="Title (EN)" htmlFor="titleEn">
                <Input {...bind("titleEn")} className="h-10" />
              </FormField>
              <FormField label="Content (EN)" htmlFor="contentEn">
                <RichTextEditor
                  id="contentEn"
                  label="Content (EN)"
                  value={fields.contentEn}
                  onChange={(html) =>
                    setFields((f) => ({ ...f, contentEn: html }))
                  }
                  onUploadImage={uploadInlineImage}
                />
                <input
                  type="hidden"
                  name="contentEn"
                  value={fields.contentEn}
                />
              </FormField>
            </TabsContent>
          </Tabs>
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
              : "Salvar artigo"}
        </Button>
        {isEdit && (
          <Button asChild variant="outline" size="lg" className="h-10 px-6">
            <Link href="/admin/blog">Cancelar</Link>
          </Button>
        )}
      </div>
    </form>
  );
}
