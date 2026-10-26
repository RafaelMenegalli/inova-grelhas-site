import { Factory, ShieldCheck, Truck, Wrench } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    text: "100% Aço Inox 304",
    note: "Não enferruja",
  },
  { icon: Factory, text: "Direto da Fábrica" },
  { icon: Wrench, text: "Fácil Instalação" },
  { icon: Truck, text: "Envio para todo o Brasil" },
];

export function QualityBar() {
  return (
    <section
      aria-label="Diferenciais de qualidade"
      className="border-b border-slate-200 bg-slate-50 px-5 py-12 sm:py-14"
    >
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {items.map(({ icon: Icon, text, note }) => (
          <li
            key={text}
            className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-7" aria-hidden />
            </span>
            <p className="font-semibold leading-snug text-slate-900">
              {text}
              {note && (
                <span className="block text-sm font-normal text-slate-500">
                  ({note})
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
