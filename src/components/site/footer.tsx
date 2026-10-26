import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/site/brand-logo";
import { site } from "@/lib/site";

const linkClass = "transition-colors hover:text-white";

export function SiteFooter({ quoteHref }: { quoteHref: string }) {
  return (
    <footer className="bg-slate-950 px-5 pb-10 pt-20 text-sm text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.2fr_1fr_1fr]">
        <div>
          <BrandLogo src="/logo-horizontal-sem-fundo.png" className="h-16" />
          <p className="mt-4 max-w-sm leading-relaxed">
            Fábrica de ralos e grelhas lineares em inox em {site.city} -{" "}
            {site.region}. Fundição própria, acabamento de alto padrão.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">Dados da empresa</p>
          <dl className="mt-4 space-y-3 leading-relaxed">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                {site.legalName === site.name
                  ? "Razão Social / Nome Fantasia"
                  : "Razão Social"}
              </dt>
              <dd className="text-slate-300">{site.legalName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                CNPJ
              </dt>
              <dd className="text-slate-300">{site.cnpj}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">
                Endereço
              </dt>
              <dd className="text-slate-300">
                {site.street}
                <br />
                CEP {site.postalCode}
                <br />
                {site.city} - {site.region}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <p className="font-semibold text-white">Contato</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={quoteHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Links</p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="/#sobre" className={linkClass}>
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/#produtos" className={linkClass}>
                Produtos
              </Link>
            </li>
            <li>
              <Link href="/#projetistas" className={linkClass}>
                Para projetistas
              </Link>
            </li>
            <li>
              <Link href="/#faq" className={linkClass}>
                Perguntas frequentes
              </Link>
            </li>
            <li>
              <Link href="/blog" className={linkClass}>
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200">
          <ShieldCheck className="size-5 shrink-0 text-sky-400" aria-hidden />
          <span>
            <strong className="font-semibold text-white">Compra Segura</strong>{" "}
            - Atendimento Humanizado via WhatsApp
          </span>
        </p>
        <p className="text-xs text-slate-500">
          © {site.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
