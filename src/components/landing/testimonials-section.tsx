import { ProofCarousel } from "@/components/landing/proof-carousel";
import { getDictionary, type Lang } from "@/dictionaries";

export function TestimonialsSection({ lang }: { lang: Lang }) {
  const t = getDictionary(lang).socialProof;
  return (
    <section id="depoimentos" className="bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {t.title}
        </h2>
        <p className="mb-12 mt-4 max-w-2xl text-lg text-slate-600">{t.text}</p>
        <ProofCarousel zoomLabel={t.zoom} dialogTitle={t.dialogTitle} />
      </div>
    </section>
  );
}
