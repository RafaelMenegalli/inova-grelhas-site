"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";

const DISTANCE = 32;
const REVEAL_MARGIN = 100;

function offset(direction: Direction) {
  switch (direction) {
    case "up":
      return { x: 0, y: DISTANCE };
    case "down":
      return { x: 0, y: -DISTANCE };
    case "left":
      return { x: DISTANCE, y: 0 };
    case "right":
      return { x: -DISTANCE, y: 0 };
  }
}

/**
 * Revela o conteúdo (fade + deslocamento) na primeira vez que ele chega perto da tela.
 *
 * O HTML do servidor sai sempre visível: nada de opacity 0 no HTML inicial, então
 * buscadores, leitores sem JavaScript e o LCP não são afetados. Só depois da
 * hidratação, o que está abaixo da dobra é "armado" (escondido sem transição) e
 * animado quando o usuário rola. Quem prefere menos movimento não vê animação.
 */
export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    // Já visível ao carregar (ex.: topo da página): não esconde, para não piscar.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setArmed(true);

    // Revela quando o topo passa de 100px acima da borda inferior da tela. Como é uma
    // checagem de posição (e não só de interseção), seções puladas por um link de
    // âncora também aparecem.
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight - REVEAL_MARGIN) {
        setShown(true);
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [reduceMotion]);

  const { x, y } = offset(direction);
  const hidden = armed && !shown;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        hidden
          ? { opacity: 0, x, y, transition: { duration: 0 } }
          : {
              opacity: 1,
              x: 0,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut", delay },
            }
      }
    >
      {children}
    </motion.div>
  );
}
