"use server";

import { redirect } from "next/navigation";
import { checkCredentials, endSession, startSession } from "@/lib/auth";

export type LoginState = { error?: string };

function safeNext(value: FormDataEntryValue | null) {
  // Só caminhos internos do admin (evita open redirect).
  return typeof value === "string" &&
    value.startsWith("/admin") &&
    !value.startsWith("//") &&
    !value.startsWith("/admin/login")
    ? value
    : "/admin/produtos";
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(user, password)) {
    // Atraso fixo para desencorajar tentativa e erro em massa.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Usuário ou senha incorretos." };
  }

  await startSession();
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
