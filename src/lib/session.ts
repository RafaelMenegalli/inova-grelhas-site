// Sessão do admin: cookie assinado com HMAC-SHA256 (Web Crypto, compatível com o proxy).
// Formato do valor: "<expiraEmMs>.<assinaturaHex>". O cookie nunca contém a senha.

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

const encoder = new TextEncoder();

function secret() {
  const value = process.env.AUTH_SECRET;
  // Falha fechada: sem uma chave forte configurada, nenhuma sessão é válida.
  return value && value.length >= 32 ? value : null;
}

function toHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function hmacKey(usage: "sign" | "verify") {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

export async function createSessionToken() {
  if (!secret())
    throw new Error("AUTH_SECRET ausente ou curto (mín. 32 chars).");
  const expires = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  const signature = await crypto.subtle.sign(
    "HMAC",
    await hmacKey("sign"),
    encoder.encode(expires),
  );
  return `${expires}.${toHex(signature)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !secret()) return false;
  const [expires, signatureHex, ...rest] = token.split(".");
  if (!expires || !signatureHex || rest.length) return false;
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;

  const signature = fromHex(signatureHex);
  if (!signature) return false;

  // crypto.subtle.verify compara em tempo constante.
  return crypto.subtle.verify(
    "HMAC",
    await hmacKey("verify"),
    signature,
    encoder.encode(expires),
  );
}
