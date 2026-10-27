"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  ShoppingCart,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AffiliateProductDialog } from "@/components/ui/affiliate-product-dialog";
import { AffiliateProduct } from "@/lib/tiptap-affiliate";
import { cn } from "@/lib/utils";

type Props = {
  /** HTML inicial. Mudanças posteriores desta prop não reinicializam o editor. */
  value: string;
  /** Recebe o HTML gerado pelo Tiptap a cada alteração. */
  onChange: (html: string) => void;
  /**
   * Envia a imagem ao storage e devolve a URL pública (lança em caso de erro).
   * Sem ela, o editor fica só com texto: sem botões de imagem e de produto afiliado.
   */
  onUploadImage?: (file: File) => Promise<string>;
  id?: string;
  label?: string;
};

function normalizeUrl(raw: string) {
  const url = raw.trim();
  if (!url) return "";
  // Sem esquema (ex.: "loja.com/produto"): assume https. Mantém âncoras, caminhos e mailto.
  return /^(https?:\/\/|mailto:|\/|#)/i.test(url) ? url : `https://${url}`;
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "text-slate-600 hover:text-slate-900",
        active &&
          "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
      )}
    >
      {children}
    </Button>
  );
}

function Toolbar({
  editor,
  onUploadImage,
}: {
  editor: Editor;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      hasSelection: !e.state.selection.empty,
    }),
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [affiliateOpen, setAffiliateOpen] = useState(false);

  function openLink() {
    setLinkUrl((editor.getAttributes("link").href as string | undefined) ?? "");
    setMessage(null);
    setLinkOpen((open) => !open);
  }

  function applyLink() {
    const href = normalizeUrl(linkUrl);
    if (!href) return;
    if (!state.link && !state.hasSelection) {
      setMessage("Selecione o trecho do texto que vai virar link.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
    setMessage(null);
  }

  function removeLink() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkOpen(false);
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onUploadImage) return;
    setUploading(true);
    setMessage(null);
    try {
      const src = await onUploadImage(file);
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      editor.chain().focus().setImage({ src, alt }).run();
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar a imagem.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="border-b bg-slate-50">
      <div className="flex flex-wrap items-center gap-1 p-2">
        <ToolbarButton
          label="Negrito"
          active={state.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          label="Itálico"
          active={state.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <ToolbarButton
          label="Subtítulo (H2)"
          active={state.h2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 />
        </ToolbarButton>
        <ToolbarButton
          label="Subtítulo menor (H3)"
          active={state.h3}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <ToolbarButton
          label="Lista com marcadores"
          active={state.bullet}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolbarButton>
        <ToolbarButton
          label="Lista numerada"
          active={state.ordered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolbarButton>
        <ToolbarButton
          label="Citação"
          active={state.quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <ToolbarButton
          label="Inserir link"
          active={state.link || linkOpen}
          onClick={openLink}
        >
          <Link2 />
        </ToolbarButton>
        {onUploadImage && (
          <>
            <ToolbarButton
              label="Inserir imagem"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
            </ToolbarButton>
            <ToolbarButton
              label="Inserir produto afiliado"
              active={affiliateOpen}
              onClick={() => setAffiliateOpen(true)}
            >
              <ShoppingCart />
            </ToolbarButton>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={onPickImage}
            />
          </>
        )}
      </div>

      {onUploadImage && (
        <AffiliateProductDialog
          open={affiliateOpen}
          onOpenChange={setAffiliateOpen}
          onUploadImage={onUploadImage}
          onInsert={(attrs) =>
            editor
              .chain()
              .focus()
              .insertContent({ type: "affiliateProduct", attrs })
              .run()
          }
        />
      )}

      {linkOpen && (
        <div className="flex flex-wrap items-center gap-2 border-t bg-white p-2">
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
            }}
            placeholder="https://loja.com/produto"
            aria-label="Endereço do link"
            className="h-9 min-w-48 flex-1"
            autoFocus
          />
          <Button type="button" size="sm" className="h-9" onClick={applyLink}>
            Aplicar
          </Button>
          {state.link && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9"
              onClick={removeLink}
            >
              Remover link
            </Button>
          )}
        </div>
      )}

      {message && (
        <p
          role="alert"
          className="border-t bg-red-50 px-3 py-2 text-sm text-destructive"
        >
          {message}
        </p>
      )}
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  onUploadImage,
  id,
  label,
}: Props) {
  const editor = useEditor({
    // Evita divergência de hidratação no Next (o editor só existe no cliente).
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // O sanitizador do servidor só aceita este conjunto de formatos.
        code: false,
        codeBlock: false,
        strike: false,
        underline: false,
        horizontalRule: false,
        link: false,
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      // Imagens e cards de afiliado só existem onde há upload (blog); a descrição de produto não os tem.
      ...(onUploadImage ? [Image, AffiliateProduct] : []),
    ],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        ...(label ? { "aria-label": label } : {}),
        class:
          "prose prose-slate max-w-none min-h-[22rem] px-5 py-4 focus:outline-none prose-img:rounded-lg prose-a:text-primary",
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-lg border bg-white focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      {editor ? (
        <Toolbar editor={editor} onUploadImage={onUploadImage} />
      ) : (
        <div className="h-11 border-b bg-slate-50" />
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
