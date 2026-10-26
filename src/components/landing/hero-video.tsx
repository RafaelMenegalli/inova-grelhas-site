import { Play } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Moldura vertical 9:16 do vídeo contínuo do hero.
 *
 * Para ativar o vídeo, defina NEXT_PUBLIC_HERO_VIDEO_URL. Para usar um iframe
 * (YouTube/Vimeo), troque a tag <video> abaixo por <iframe className="size-full" ... />:
 * o contêiner já mantém a proporção 9:16 e evita salto de layout.
 */
export function HeroVideo() {
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-600 via-slate-800 to-slate-950 shadow-2xl sm:max-w-[320px]">
      {site.heroVideoUrl ? (
        <video
          className="size-full object-cover"
          src={site.heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Vídeo da fábrica da Inova Grelhas Lineares"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center text-slate-300">
          <span className="flex size-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur">
            <Play className="size-7 translate-x-0.5 fill-current" aria-hidden />
          </span>
          <p className="text-sm">Em breve: tour da fábrica e instalação</p>
        </div>
      )}
    </div>
  );
}
