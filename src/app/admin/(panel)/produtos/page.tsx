import Image from "next/image";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/fields";
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
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ProductActions } from "./product-actions";

async function ProductsTable() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      isActive: true,
      createdAt: true,
      _count: { select: { variations: true } },
    },
  });

  return (
    <Card className="overflow-hidden py-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-20 pl-6">Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Variações</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Criado em</TableHead>
            <TableHead className="w-16 pr-6 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow
              key={p.id}
              className={cn(!p.isActive && "bg-slate-50/60")}
            >
              <TableCell className="py-3 pl-6">
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  width={48}
                  height={48}
                  className={cn(
                    "size-12 rounded-lg border object-cover",
                    !p.isActive && "opacity-50 grayscale",
                  )}
                />
              </TableCell>
              <TableCell
                className={cn(
                  "font-medium",
                  p.isActive ? "text-slate-900" : "text-slate-500",
                )}
              >
                {p.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {p._count.variations}
              </TableCell>
              <TableCell>
                {p.isActive ? (
                  <Badge>Ativo</Badge>
                ) : (
                  <Badge variant="secondary" className="text-slate-600">
                    Inativo
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {p.createdAt.toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="pr-6 text-right">
                <ProductActions id={p.id} name={p.name} isActive={p.isActive} />
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-16 text-center text-muted-foreground"
              >
                Nenhum produto cadastrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

export default function ProdutosPage() {
  return (
    <>
      <PageHeader
        title="Produtos"
        description="Ralos e grelhas exibidos na vitrine do site."
        action={{ href: "/admin/produtos/novo", label: "Novo produto" }}
      />
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <ProductsTable />
      </Suspense>
    </>
  );
}
