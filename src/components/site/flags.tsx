import type { Lang } from "@/dictionaries";
import { cn } from "@/lib/utils";

/** Bandeira do Brasil (simplificada), em SVG colorido. */
function FlagBR({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 14"
      aria-hidden
      className={cn("h-4 w-auto shrink-0 rounded-[3px]", className)}
    >
      <rect width="20" height="14" fill="#009C3B" />
      <polygon points="10,1.4 18.2,7 10,12.6 1.8,7" fill="#FFDF00" />
      <circle cx="10" cy="7" r="3.5" fill="#002776" />
      <path
        d="M6.6 6.2 Q10 4.9 13.4 7.8"
        fill="none"
        stroke="#fff"
        strokeWidth="0.7"
      />
    </svg>
  );
}

/** Bandeira dos Estados Unidos (simplificada), em SVG colorido. */
function FlagUS({ className }: { className?: string }) {
  const stripe = 14 / 13;
  return (
    <svg
      viewBox="0 0 26 14"
      aria-hidden
      className={cn("h-4 w-auto shrink-0 rounded-[3px]", className)}
    >
      <rect width="26" height="14" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11].map((i) => (
        <rect
          key={i}
          y={i * stripe}
          width="26"
          height={stripe}
          fill="#FFFFFF"
        />
      ))}
      <rect width="11" height={7 * stripe} fill="#3C3B6E" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={1.4 + col * 2}
            cy={1.2 + row * 1.6}
            r="0.42"
            fill="#fff"
          />
        )),
      )}
    </svg>
  );
}

/** Bandeira do idioma: Brasil para português, Estados Unidos para inglês. */
export function LangFlag({
  lang,
  className,
}: {
  lang: Lang;
  className?: string;
}) {
  return lang === "pt" ? (
    <FlagBR className={className} />
  ) : (
    <FlagUS className={className} />
  );
}
