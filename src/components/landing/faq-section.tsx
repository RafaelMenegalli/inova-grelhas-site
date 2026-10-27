import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getDictionary, type Lang } from "@/dictionaries";
import { whatsappLink } from "@/lib/site";

export function FaqSection({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang);
  const t = dict.faq;
  const ask = whatsappLink(dict.whatsapp.question);

  return (
    <section id="faq" className="bg-slate-50 px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        {/* Fixo no desktop: acompanha a rolagem da lista longa de perguntas. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {t.eyebrow}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {t.text}
          </p>
          <Button asChild size="lg" className="mt-8 h-12 px-6 text-base">
            <a href={ask} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
              {t.cta}
            </a>
          </Button>
        </div>

        <Accordion
          type="single"
          collapsible
          className="rounded-xl border border-slate-200 bg-white px-6 shadow-sm"
        >
          {t.items.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`}>
              <AccordionTrigger className="py-5 text-base font-semibold text-slate-900 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-slate-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
