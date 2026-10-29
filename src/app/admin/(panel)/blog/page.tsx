import Image from "next/image";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/fields";
import { Pagination } from "@/components/admin/pagination";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth";
import { paginate, parsePage } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { ArticleActions } from "./article-actions";

type SearchParams = Promise<{ page?: string | string[] }>;

async function ArticlesTable({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const requestedPage = parsePage((await searchParams).page);
  const total = await prisma.article.count();
  const { page, totalPages, skip, take } = paginate(total, requestedPage);
  const articles = await prisma.article.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-28 pl-6">Capa</TableHead>
              <TableHead>Título (PT)</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden sm:table-cell">Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Criado em</TableHead>
              <TableHead className="w-16 pr-6 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="py-3 pl-6">
                  <Image
                    src={a.coverImage}
                    alt={a.titlePt}
                    width={80}
                    height={48}
                    className="h-12 w-20 rounded-lg border object-cover"
                  />
                </TableCell>
                <TableCell className="max-w-64 truncate font-medium text-slate-900">
                  {a.titlePt}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {a.slug}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="text-slate-600">
                    {a.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  {a.isPublished ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Publicado
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Rascunho
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {a.createdAt.toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <ArticleActions
                    id={a.id}
                    title={a.titlePt}
                    isPublished={a.isPublished}
                  />
                </TableCell>
              </TableRow>
            ))}
            {articles.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-muted-foreground"
                >
                  Nenhum artigo cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <Pagination
        basePath="/admin/blog"
        page={page}
        totalPages={totalPages}
        total={total}
        noun="artigos"
      />
    </>
  );
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <PageHeader
        title="Blog"
        description="Artigos bilíngues (Português e Inglês) publicados no site."
        action={{ href: "/admin/blog/novo", label: "Novo artigo" }}
      />
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <ArticlesTable searchParams={searchParams} />
      </Suspense>
    </>
  );
}
