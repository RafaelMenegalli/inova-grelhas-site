/** Monta a URL do WhatsApp (wa.me) com mensagem pré-preenchida. */
export function buildWhatsAppUrl(message: string, phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
