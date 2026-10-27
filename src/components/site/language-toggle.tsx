import Link from "next/link";
import { LangFlag } from "@/components/site/flags";
import type { Lang } from "@/dictionaries";
import { cn } from "@/lib/utils";

const LANGUAGES: Record<Lang, { label: string; hrefLang: string }> = {
  pt: { label: "Português", hrefLang: "pt-BR" },
  en: { label: "English", hrefLang: "en" },
};

/**
 * Botão único de troca de idioma: mostra a bandeira do outro idioma e, num clique, leva à
 * página equivalente nele (`href` vem de cada página: por exemplo, o mesmo artigo).
 */
export function LanguageToggle({
  href,
  target,
  title,
  showLabel = false,
  className,
  onNavigate,
}: {
  href: string;
  /** Idioma para o qual o clique troca (o outro idioma, não o atual). */
  target: Lang;
  title: string;
  /** Mostra o nome do idioma por extenso (menu do celular) em vez do código (PT/EN). */
  showLabel?: boolean;
  className?: string;
  onNavigate?: () => void;
}) {
  const { label, hrefLang } = LANGUAGES[target];
  return (
    <Link
      href={href}
      hrefLang={hrefLang}
      lang={hrefLang}
      aria-label={title}
      title={title}
      onClick={onNavigate}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
        className,
      )}
    >
      <LangFlag lang={target} />
      {showLabel ? label : target.toUpperCase()}
    </Link>
  );
}
