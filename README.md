# NexChat

A real-time messaging app — one-to-one and group chats — built as a take-home assignment,
plus the landing page that introduces it.

Sign in with a phone number and a name. There's no registration step: if the number is new
the account is created, and if it isn't you're signed in. From there you can search for
people by name, start direct conversations, create groups with admin controls, and send
messages that appear the moment they're sent.

## Live demo

| | URL |
|---|---|
| Landing page | https://nex-chat-inky.vercel.app |
| Chat app |https://nex-chat-inky.vercel.app/login |

## What's in here

The whole product is three routes:

| Route | What it is |
|---|---|
| `/` | Single-page landing site. Every nav item scrolls to a section — there are no other marketing pages. |
| `/login` | Phone number + name. Doubles as sign-up. |
| `/chat`, `/chat/[conversationId]` | The app: conversation sidebar, message panel, group management. |

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Radix primitives |
| Data — reads | `fetch` in Server Components (`src/lib/server/`) |
| Data — writes | Server Actions using axios (`src/app/actions/`) |
| Validation | Zod, at every API boundary |
| Real-time | Socket.io client, with `router.refresh()` polling as the fallback |
| Animation | Framer Motion, Lenis (smooth scroll, landing page only) |
| Forms | React Hook Form + Zod resolver |

**How data flows.** Reads happen in Server Components, which call the chat API directly and
pass plain props to client components. Writes go through Server Actions. The JWT lives in an
httpOnly cookie that only the server reads, so no token and no API URL is ever exposed to the
browser, and there's no client-side data cache to keep in sync — mutations call
`revalidatePath` and the server re-renders with fresh data.

## Getting started

### Prerequisites

- **Node.js 20.9 or newer** (required by Next 16)
- npm

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

The defaults in `.env.example` point at the assignment's hosted API and work as-is:

```ini
# REST base URL — server-only, never exposed to the browser
CHAT_API_BASE_URL=https://frontend-task-chatapp.onrender.com/api

# Socket.io connects to the HOST ROOT, not /api
NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

Both are validated on boot (`src/lib/env.server.ts`), so a missing or malformed value fails
immediately with a readable message rather than surfacing later as a confusing fetch error.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or
[http://localhost:3000/login](http://localhost:3000/login) to sign in.

> **First request is slow.** The API is hosted on a free tier that sleeps when idle, so the
> first sign-in after a quiet period can take 30–50 seconds while the instance wakes up. The
> app detects this and says so instead of showing an indefinite spinner.

### Production build

```bash
npm run build
npm start
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project structure

```
src/
  app/
    (marketing)/         Landing page — single page, section-anchored nav
    (auth)/login/        Sign in
    (chat)/chat/         The app (sidebar layout + conversation routes)
    actions/             Server Actions — all writes, via axios
    api/auth/            Cookie-clearing logout + socket token handout
  components/
    sections/chat/       Sidebar, message list, composer, group dialogs
    sections/landing/    Landing page sections
    ui/                  shadcn primitives
  lib/
    server/              Server-side reads (fetch + cookie auth)
    auth/                Session cookie, JWT decoding, current user
    validation/          Zod schemas + API response normalisation
    sections.ts          Landing page sections — nav's single source of truth
  hooks/                 Scroll-to-bottom, section nav, debounce
```

Each route group has its own layout: the marketing group adds smooth scroll and the
navbar/footer, and the chat group deliberately opts out of both — Lenis binds to document
scroll and would fight the message list's own scroll container.

## Documentation

Longer write-ups live in [`docs/`](./docs):

| Document | Contents |
|---|---|
| [`01-chat-app.md`](./docs/01-chat-app.md) | Engineering decisions and trade-offs, and a running log of API quirks found |
| [`02-landing-page.md`](./docs/02-landing-page.md) | Design decisions — palette, typography, section choices |
| [`03-api-reference.md`](./docs/03-api-reference.md) | My own documentation of the API: endpoints, request/response shapes, and where the responses differ from what you'd expect |
