"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { login, type LoginState } from "./actions";
import { FormField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );
  // Controlado: o React 19 limpa o <form> após cada action, mesmo com erro.
  const [user, setUser] = useState("");
  const next = useSearchParams().get("next") ?? "";

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      <FormField label="Usuário" htmlFor="user">
        <Input
          id="user"
          name="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoComplete="username"
          autoFocus
          required
          className="h-10"
        />
      </FormField>
      <FormField label="Senha" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-10"
        />
      </FormField>
      {state.error && (
        <p
          role="alert"
          className="flex items-center gap-2 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} size="lg" className="h-10">
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
