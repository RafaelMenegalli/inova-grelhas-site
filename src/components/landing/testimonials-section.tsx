import { ProofCarousel } from "@/components/landing/proof-carousel";

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Prova social
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          O que nossos clientes dizem
        </h2>
        <p className="mb-12 mt-4 max-w-2xl text-lg text-slate-600">
          Avaliações reais de clientes, em prints originais do Google, de
          marketplaces e de mensagens recebidas pelo WhatsApp. Clique para
          ampliar.
        </p>
        <ProofCarousel />
      </div>
    </section>
  );
}
