# Inova Grelhas Lineares

Site institucional, loja de orçamento via WhatsApp, blog bilíngue (PT/EN) e painel administrativo (CMS) da Inova Grelhas Lineares, fábrica de ralos e grelhas lineares em inox em Santa Bárbara d'Oeste - SP.

## Stack

- Next.js 16 (App Router, Cache Components) e React 19
- TypeScript, Tailwind CSS v4 e shadcn/ui
- Prisma 7 + PostgreSQL (Neon)
- Supabase Storage (imagens), Tiptap (editor do blog) e sanitize-html

## Desenvolvimento

```bash
npm install        # gera o Prisma Client (postinstall)
cp .env.example .env   # preencha as variáveis
npx prisma db push     # cria/atualiza as tabelas
npm run dev            # http://localhost:3000
```

Painel administrativo: `/admin` (login com `ADMIN_USER` e `ADMIN_PASSWORD`).

## Variáveis de ambiente

Veja `.env.example`. Em produção (Vercel), configure todas em *Project Settings → Environment Variables*:

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | Conexão com o Neon (use a URL *pooled*) |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site (SEO, Open Graph, JSON-LD) |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_STORAGE_BUCKET` | Upload de imagens |
| `ADMIN_USER`, `ADMIN_PASSWORD`, `AUTH_SECRET` | Login do painel (a chave assina o cookie de sessão) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número dos botões de orçamento (DDI+DDD+número) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager |
| `NEXT_PUBLIC_CNPJ`, `NEXT_PUBLIC_LEGAL_NAME` | Dados fiscais do rodapé |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | Vídeo vertical do hero (opcional) |

Nunca versione o `.env`: ele está no `.gitignore`.

## Deploy

A `main` é publicada automaticamente pela Vercel a cada push. O `postinstall` roda `prisma generate`, pois o client gerado não é versionado.
