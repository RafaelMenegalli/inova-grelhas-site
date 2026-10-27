"use client";

import { useEffect } from "react";

/**
 * O painel admin só tem tema claro: mantém a classe `dark` fora do <html> enquanto ele
 * está aberto (o next-themes a reaplica ao hidratar) e a devolve ao sair, sem mexer na
 * escolha de tema guardada do visitante.
 */
export function ForceLight() {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    const previousScheme = root.style.colorScheme;

    const enforce = () => {
      if (root.classList.contains("dark")) root.classList.remove("dark");
      if (root.style.colorScheme !== "light") root.style.colorScheme = "light";
    };
    enforce();
    const observer = new MutationObserver(enforce);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      observer.disconnect();
      if (hadDark) root.classList.add("dark");
      root.style.colorScheme = previousScheme;
    };
  }, []);

  return null;
}
