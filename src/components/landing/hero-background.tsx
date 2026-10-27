"use client";

import { motion, useReducedMotion } from "framer-motion";

// Imagem temporária do hero (enquanto não há vídeo da fábrica).
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80";

/**
 * Fundo do hero: foto com zoom lento contínuo (efeito Ken Burns) e camadas escuras por
 * cima para o texto continuar legível. Deve ficar dentro de uma seção `relative isolate
 * overflow-hidden`: o zoom não pode vazar da seção.
 */
export function HeroBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <motion.img
        src={HERO_IMAGE}
        alt=""
        aria-hidden
        fetchPriority="high"
        decoding="async"
        referrerPolicy="no-referrer"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        initial={{ scale: 1 }}
        animate={reduceMotion ? { scale: 1 } : { scale: 1.05 }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent"
      />
      {/* No celular o texto ocupa a largura toda: escurece um pouco mais para manter o contraste. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-slate-950/45 lg:hidden"
      />
    </>
  );
}
