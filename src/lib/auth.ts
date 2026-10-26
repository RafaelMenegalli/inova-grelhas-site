import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

/** Compara usuário/senha com o .env em tempo constante. Falha fechada se não configurado. */
export function checkCredentials(user: string, password: string) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) return false;

  // Avalia os dois para não vazar qual campo errou pelo tempo de resposta.
  const userOk = timingSafeEqual(digest(user), digest(expectedUser));
  const passwordOk = timingSafeEqual(
    digest(password),
    digest(expectedPassword),
  );
  return userOk && passwordOk;
}

export async function startSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete({ name: SESSION_COOKIE, path: "/admin" });
}

export async function isAdmin() {
  // A validade da sessão depende da hora atual: sempre em tempo de requisição.
  await connection();
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Use no início de toda Server Action e leitura de dados do painel. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
