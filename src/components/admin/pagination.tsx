import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ADMIN_PAGE_SIZE } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/** Números das páginas a exibir: primeira, última e as vizinhas da atual, com `null` = "…". */
function pageItems(page: number, totalPages: number) {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...wanted]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  const items: (number | null)[] = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) items.push(null);
    items.push(n);
  });
  return items;
}

/**
 * Paginação das listagens do admin: resumo ("Mostrando 11–20 de 42") e links de página
 * (`?page=N`). Cada página é um endereço próprio, então dá para recarregar, voltar e
 * compartilhar. Sem itens, não renderiza.
 */
export function Pagination({
  basePath,
  page,
  totalPages,
  total,
  noun,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  total: number;
  /** Plural do que está sendo listado ("produtos", "artigos"). */
  noun: string;
}) {
  if (total === 0) return null;

  const href = (n: number) => (n === 1 ? basePath : `${basePath}?page=${n}`);
  const from = (page - 1) * ADMIN_PAGE_SIZE + 1;
  const to = Math.min(page * ADMIN_PAGE_SIZE, total);

  const arrow =
    "inline-flex size-9 items-center justify-center rounded-lg border text-slate-700 transition-colors hover:bg-slate-50";
  const disabled = "pointer-events-none opacity-40";

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Mostrando{" "}
        <strong className="font-semibold text-foreground">
          {from}–{to}
        </strong>{" "}
        de <strong className="font-semibold text-foreground">{total}</strong>{" "}
        {noun}
      </p>

      {totalPages > 1 && (
        <nav aria-label="Paginação" className="flex items-center gap-1.5">
          <Link
            href={href(Math.max(1, page - 1))}
            aria-label="Página anterior"
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
            className={cn(arrow, page === 1 && disabled)}
          >
            <ChevronLeft className="size-4" />
          </Link>

          {pageItems(page, totalPages).map((item, i) =>
            item === null ? (
              <span
                key={`gap-${i}`}
                aria-hidden
                className="px-1 text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Link
                key={item}
                href={href(item)}
                aria-label={`Página ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                  item === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {item}
              </Link>
            ),
          )}

          <Link
            href={href(Math.min(totalPages, page + 1))}
            aria-label="Próxima página"
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : undefined}
            className={cn(arrow, page === totalPages && disabled)}
          >
            <ChevronRight className="size-4" />
          </Link>
        </nav>
      )}
    </div>
  );
}
