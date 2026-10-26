import { Suspense } from "react";
import { MobileNav, Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // usePathname() (item ativo do menu) só existe em tempo de requisição em rotas
  // dinâmicas como /produtos/[id]/editar, então vai dentro de <Suspense>.
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Suspense
        fallback={
          <aside className="hidden h-screen w-64 shrink-0 bg-slate-900 lg:block" />
        }
      >
        <Sidebar />
      </Suspense>
      <div className="min-w-0 flex-1">
        <Suspense
          fallback={<header className="h-[69px] bg-slate-900 lg:hidden" />}
        >
          <MobileNav />
        </Suspense>
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
