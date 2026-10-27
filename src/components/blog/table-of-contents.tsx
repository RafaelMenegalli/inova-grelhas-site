import Link from "next/link";
import type { Heading } from "@/lib/toc";
import { cn } from "@/lib/utils";

/** Índice do artigo ("Neste artigo") com links âncora para os H2 e H3. Sem títulos, não renderiza. */
export function TableOfContents({
  headings,
  title,
}: {
  headings: Heading[];
  title: string;
}) {
  if (headings.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-900 dark:text-slate-50">
        {title}
      </p>
      <ul className="mt-4 space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={cn(heading.level === 3 && "ml-4")}>
            <Link
              href={`#${heading.id}`}
              className={cn(
                "transition-colors hover:text-primary dark:hover:text-sky-400",
                heading.level === 3
                  ? "text-sm text-slate-500 dark:text-slate-400"
                  : "font-medium text-slate-700 dark:text-slate-300",
              )}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
