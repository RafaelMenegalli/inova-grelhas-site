import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const site = {
  name: "Inova Grelhas Lineares",
  // Em produção sem a variável, usa o domínio da Vercel (nunca localhost no sitemap).
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
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

export function whatsappLink(message: string) {
  return buildWhatsAppUrl(message, site.whatsapp);
}
