"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, Newspaper, Package } from "lucide-react";
import { logout } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
];

function Brand() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo reduzida (emblema), public/icon.png */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon.png"
        alt="Logo Inova Grelhas Lineares"
        className="size-10 shrink-0 rounded-lg"
      />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-white">
          Inova Grelhas Lineares
        </p>
        <p className="text-xs text-slate-400">Painel administrativo</p>
      </div>
    </div>
  );
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <Brand />
      </div>
      <nav className="flex flex-col gap-1 px-3">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          Conteúdo
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <form action={logout} className="mt-auto border-t border-slate-800 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </form>
    </div>
  );
}

/** Sidebar fixa para telas grandes. */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-900 lg:block">
      <NavContent />
    </aside>
  );
}

/** Barra superior com menu em Sheet para mobile/tablet. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
      <Brand />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            className="text-slate-200 hover:bg-slate-800 hover:text-white"
            aria-label="Abrir menu"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 border-slate-800 bg-slate-900 p-0 text-slate-100"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Navegação do painel</SheetDescription>
          </SheetHeader>
          <NavContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
