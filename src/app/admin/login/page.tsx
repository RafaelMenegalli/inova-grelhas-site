import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="items-center gap-3 pt-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="Logo Inova Grelhas Lineares"
            className="size-14 rounded-xl"
          />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Inova Grelhas Lineares
            </h1>
            <p className="text-sm text-muted-foreground">
              Acesso ao painel administrativo
            </p>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
