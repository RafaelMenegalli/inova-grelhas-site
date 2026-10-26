"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export type InitialProduct = {
  name: string;
  description: string;
  imageUrl: string;
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
 * Com `initial` (edição), a foto deixa de ser obrigatória: sem arquivo novo,
 * a imagem salva é mantida.
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
  const [description, setDescription] = useState(initial?.description ?? "");

  function addRow() {
    setRows((r) => [...r, emptyRow(nextKey)]);
    setNextKey((k) => k + 1);
  }

  function updateRow(key: number, patch: Partial<Row>) {
    setRows((r) =>
      r.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do produto</CardTitle>
          <CardDescription>
            Dados exibidos no card da vitrine do site.
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
          <FormField label="Descrição" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
          <FormField
            label={isEdit ? "Foto do ralo" : "Foto do ralo *"}
            htmlFor="image"
            hint={
              isEdit
                ? "Opcional: deixe em branco para manter a foto atual. JPG, PNG, WebP, AVIF ou GIF, até 5 MB."
                : "JPG, PNG, WebP, AVIF ou GIF, até 5 MB."
            }
          >
            {initial && (
              <Image
                src={initial.imageUrl}
                alt={`Foto atual: ${initial.name}`}
                width={160}
                height={120}
                className="h-24 w-32 rounded-lg border object-cover"
              />
            )}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required={!isEdit}
              className="h-10 cursor-pointer py-1.5"
            />
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
