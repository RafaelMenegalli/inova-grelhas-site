import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Endereço oficial do site em produção (sitemap, canonical, Open Graph e JSON-LD). */
const PRODUCTION_URL = "https://www.inovagrelhaslineares.com.br";

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const isLocal = !configured || /localhost|127\.0\.0\.1/.test(configured);
  // Em produção, uma variável ausente ou apontando para localhost (por exemplo, copiada do
  // .env local para a Vercel) nunca pode vazar para o sitemap: vale o endereço oficial.
  if (process.env.NODE_ENV === "production" && isLocal) return PRODUCTION_URL;
  return (configured || "http://localhost:3000").replace(/\/$/, "");
}

export const site = {
  name: "Inova Grelhas Lineares",
  url: resolveSiteUrl(),
  // Formato internacional, só dígitos (ex.: 5519999999999).
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5519992950901",
  // Vídeo vertical 9:16 do hero (tour da fábrica / instalação). Opcional.
  heroVideoUrl: process.env.NEXT_PUBLIC_HERO_VIDEO_URL,
  // Razão social e CNPJ exibidos no rodapé. Defina NEXT_PUBLIC_LEGAL_NAME e
  // NEXT_PUBLIC_CNPJ com os dados reais antes de divulgar o site.
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || "Inova Grelhas Lineares",
  cnpj: process.env.NEXT_PUBLIC_CNPJ || "XX.XXX.XXX/0001-XX",
  street: "Rua Dr. Hélio Furlan, 59",
  postalCode: "13458-733",
  city: "Santa Bárbara d'Oeste",
  region: "SP",
};

/** Link do Google Maps (busca pelo endereço) para abrir o app ou o site direto no local. */
export function mapsLink() {
  const address = `${site.street}, ${site.city} - ${site.region}, ${site.postalCode}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function whatsappLink(message: string) {
  return buildWhatsAppUrl(message, site.whatsapp);
}
