import { getDictionary, type Lang } from "@/dictionaries";
import { Factory, ShieldCheck, Truck, Wrench } from "lucide-react";

const icons = [ShieldCheck, Factory, Wrench, Truck];

export function QualityBar({ lang }: { lang: Lang }) {
  const { label, items } = getDictionary(lang).badges;
  return (
    <section
      aria-label={label}
      className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-5 py-12 sm:py-14"
    >
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {items.map(({ text, note }, i) => {
          const Icon = icons[i];
          return (
            <li
              key={text}
              className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-sky-400">
                <Icon className="size-7" aria-hidden />
              </span>
              <p className="font-semibold leading-snug text-slate-900 dark:text-slate-50">
                {text}
                {note && (
                  <span className="block text-sm font-normal text-slate-500 dark:text-slate-400">
                    ({note})
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
