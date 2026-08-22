# Part 1 — Chat app: engineering log

A running record of how the chat feature got built and why it looks the way it does.
Written as I went, so the reasoning is the real reasoning rather than a tidy story
assembled afterwards.

**Stack:** Next.js 16.1.6 (App Router) · React 19 · TypeScript · Axios ·
Server Actions · Zod · Tailwind v4 · shadcn/ui · Socket.io client

---

## 22 Aug — Picking the data layer

The starting repo was a marketing site with no data fetching of any kind, so this was
a clean choice between Axios, plain `fetch`, Axios, and RTK Query.

I went with **Axios over a thin `fetch` wrapper**, and no Axios.

The deciding factor wasn't caching, it was request cancellation. In a chat UI you
switch conversations fast, and the naive version has a race: you click conversation A,
then B, and if A's response lands second it overwrites B's messages. Axios
cancels superseded queries by passing an `AbortSignal` into the query function, so
that bug can't happen. Writing that by hand is possible, but it's the kind of thing
you only remember after a user reports it.

The rest followed from the same reasoning:

- `refetchInterval` covers real-time as a fallback if the socket drops.
- `useMutation` + `onMutate` gives optimistic sends — the message appears instantly
  and rolls back if the server rejects it.
- `isPending` / `isError` / `data` makes the required loading/empty/error states
  uniform across every screen instead of hand-rolled per component.

**Why not RTK Query:** it needs `@reduxjs/toolkit` and `react-redux`, and this app has
almost no global client state that isn't server state. Adding Redux purely as a fetch
layer is ceremony I'd have to justify in review.

**Why not Axios:** Axios is a transport, not a state layer, so it was never really the
alternative to Axios — the honest comparison is Axios vs `fetch`. Axios would
have given me interceptors, throw-on-4xx, and a `timeout` option. I get all three from
a ~150-line typed wrapper (`src/lib/api/http.ts`), and keeping retry and timeout policy
in one library instead of split across two is worth more to me than the ergonomics.

---

## 22 Aug — Where the JWT lives

`POST /auth/login` returns a JWT. The three real options were localStorage, an
in-memory token, or an httpOnly cookie.

I used an **httpOnly cookie**, set by a Server Action.

The reason is less about XSS than people usually assume, and I want to be precise
about that, because the Socket.io handshake requires the token in client JavaScript:

```js
io(url, { auth: { token } })
```

So there is an endpoint (`/api/auth/socket-token`) that hands the token to the browser,
and once that exists the cookie is no longer an absolute XSS defence. Claiming otherwise
would be overselling it.

What the cookie genuinely buys:

1. **The server can read the session.** That means Server Components resolve the user
   before rendering, so the chat shell paints with the user already known instead of
   flashing a skeleton on every load. A localStorage token is invisible to the server,
   so every authenticated page becomes a client-side waterfall.
2. **One authentication surface.** Client reads go through a BFF proxy at
   `/api/bff/*` which attaches the bearer token server-side. That's also the single
   place where upstream errors get normalised, which is how I found the API quirks
   listed below.
3. **No CORS.** The browser only ever talks to this app's own origin.

The cost is an extra network hop per read. On a free-tier upstream that's already the
slow part, so I took it.

---

## 22 Aug — Server Actions for writes, BFF for reads

The brief I was working to preferred Server Actions for API calls. That's right for
writes and wrong for reads, and the reason is concrete: **Next serialises Server
Actions.** They queue one at a time. A polling read running through an Action would
head-of-line block a user's send — the exact interaction that has to feel instant.

So the split is:

| | Mechanism | Why |
|---|---|---|
| Writes (login, logout, send, create group) | Server Action | Only the server can set an httpOnly cookie; mutations are naturally sequential anyway |
| Reads (profile, conversations, messages) | Route Handler BFF + Axios | Parallel, cancellable, cacheable, pollable |

---

## 22 Aug — Partial Prerendering: what I found

The brief also asked for PPR. Reading the installed Next source rather than the docs
turned up two things worth recording:

- `experimental.ppr` **throws** in 16.1.6. From
  `node_modules/next/dist/server/config.js:330`: *"`experimental.ppr` has been merged
  into `cacheComponents`."* PPR is now enabled by top-level `cacheComponents: true`.
- Per-route opt-in is gone. `checkIsRoutePPREnabled` returns `false` for
  `'incremental'`, and `experimental_ppr` no longer exists in the segment-config type.
  PPR is app-wide or not at all.

App-wide matters here, because this repo also contains ten heavily animated marketing
sections, and `cacheComponents` turns any uncached dynamic access outside a `<Suspense>`
boundary into a build error. Flipping it on hours before a deadline would mean auditing
all of that at the worst possible moment.

So I **built for it without enabling it**: static page shells, dynamic parts behind
Suspense boundaries, session resolved server-side. Turning the flag on is a one-line
change once there's time to audit the marketing routes properly. The streaming benefit
is already there; only the prerendered-shell-plus-dynamic-hole optimisation is deferred.

---

## 22 Aug — Route restructure

The original root layout wrapped *every* route in Lenis smooth scroll, plus navbar,
footer, and a loading-reveal animation.

Lenis binds to document scroll. The chat message list has its own scroll container and
one of the hard requirements is "auto-scroll to the newest message, but don't yank the
user down if they've scrolled up to read". Those two things fight, and Lenis wins in
ways that are miserable to debug.

So the root layout is now just `<html>`, `<body>`, and fonts, and each route group adds
only what it needs:

```
src/app/
  layout.tsx           # html + body + fonts, nothing else
  (marketing)/         # Lenis + navbar + footer  — the original site, URLs unchanged
  (auth)/login/        # centred shell, no Lenis
  (chat)/chat/         # QueryProvider, no Lenis
  api/bff/[...path]/   # authenticated proxy
  api/auth/…           # socket-token, logout
```

Route groups don't affect URLs, so nothing about the existing site moved as far as a
visitor is concerned. A side benefit: Axios only ships to the app routes, not
to the landing page, where bundle size actually shows up in the numbers.

---

## 22 Aug — Session states are four, not two

`getCurrentUser()` returns one of four states, not `User | null`:

```ts
"authenticated" | "unauthenticated" | "expired" | "unavailable"
```

The split between `expired` and `unavailable` is the one that matters. If you model
this as `User | null`, then "the API is asleep" and "your token is invalid" are the
same value, and the app logs people out every time the free-tier instance cold-starts
slowly. Only `expired` is allowed to destroy a session; `unavailable` shows a retry.

### The redirect loop I walked into

Server Components can't write cookies. So when the API rejects a token that hasn't yet
passed its own `exp`, the chat layout can only redirect — it can't delete the cookie.
Middleware then sees a present, not-yet-expired cookie on `/login`, decides the user is
signed in, and sends them back to `/chat`. Forever.

Fix: redirect through `GET /api/auth/logout`, a route handler, which *can* clear the
cookie before `/login` is reached. Documented at the top of that file so nobody
"simplifies" it back into a loop later.

---

## 22 Aug — Conversation shell: the URL is the state

The two-pane layout follows WhatsApp Web structurally, but one decision is worth
spelling out: **the open conversation lives in the URL, not in React state.**

```
src/app/(chat)/chat/
  layout.tsx                  # sidebar — persists across threads
  page.tsx                    # empty right pane
  [conversationId]/page.tsx   # one thread
```

The sidebar sits in the layout, so switching threads doesn't remount it — no refetch, no
scroll-position reset in the list. And because `/chat/<id>` is a real route, a thread is
shareable, survives a reload, and works with browser back/forward for free. Holding it in
state would have cost all three.

On mobile only one pane shows at a time, chosen by whether a thread is open, so the
"pick a conversation" pane never wastes a phone screen.

Opening a thread costs **no extra request** for its metadata: `/conversations` already
embeds participants and admins, so the header renders from the cached list. That is the one
upside of that endpoint's oversized payload.

---

## 22 Aug — The message panel

This is where the assignment says the marks are, so it got the most care. Three decisions
are worth explaining.

### The outbox is a separate cache entry

Optimistic messages do **not** live inside the cached server history. They sit under their
own query key (`chatKeys.pendingMessages(id)`), and the rendered thread is
`[...history, ...outbox]`.

The reason is a bug I'd otherwise have shipped: history is refetched on an interval. If an
optimistic bubble lived in that array, the next poll would replace it with the server's
version of reality — silently deleting a message the user is still watching send, or worse,
one that *failed* and needs retrying. Keeping the two apart means server data and local
state can never overwrite each other. It also means the outbox survives navigating away and
back, because it lives in the QueryClient rather than component state.

### A `null` response is a failure, and had to be made loud

`POST /messages` answers a rejected send with a `null` body and a success status. The
obvious way to write an optimistic send — apply, and roll back if it throws — does not
catch this. The bubble would go from *sending* to *sent*, checkmark and all, with nothing
stored.

That's the worst failure a chat app can have, because it's silent and it happens exactly
when the user has stopped paying attention. So `parseSentMessage` returns `null` explicitly
and the mutation converts it into a thrown error, putting it on the same path as a network
failure: the bubble is marked *not delivered*, with Retry and Discard, and **the text stays
on screen** so nothing the user typed is lost.

Mutations also have `retry: false` globally. A blind retry on a send is how you post the
same message twice.

### Auto-scroll: two rules that fight each other

"Scroll to the newest message" and "don't move the viewport while I'm reading history" are
in direct conflict, so the rules are explicit in `useStickToBottom`:

- Within 120px of the bottom → following, so follow. The slack matters: sub-pixel rounding,
  and someone one line up is still following along.
- Scrolled up → **don't move the viewport.** Count arrivals instead and offer a
  "3 new messages" pill. That's the other half of the requirement — not moving them is
  right, but leaving them unaware is not.
- A message *you* sent always scrolls. Pressing send is an unambiguous statement that you
  want to see the result.
- Switching conversations jumps instantly, in a layout effect, so there's no visible scroll
  through someone else's history.

One subtlety worth recording: the trigger watches for the message count *increasing*, not
merely changing. The count also **drops** when an optimistic bubble moves from the outbox
into history, and treating that as an arrival would have caused a spurious scroll on every
successful send.

---

## API quirks found

Kept here as I hit them; feeds the Part 3 write-up.

**1. The user shape is inconsistent between endpoints.**
`POST /auth/login` nests the user under `user`. `GET /auth/me` returns it bare at the
top level. Handled with one `apiUserSchema` in `src/lib/validation/user.ts` that both
responses pass through, so nothing above the API boundary sees two shapes.

**2. `_id`, not `id`.** Normalised to `id` at the boundary. Worth doing early rather
than late: the message list compares "is this message mine?" on every row, and a
codebase where the same entity is sometimes `_id` and sometimes `id` grows that bug
eventually. The schema accepts either key, since endpoints that embed a user
(participants, senders) may well differ.

**3. Error `code` is sometimes a number, sometimes a string.**
The error envelope is nested:

```json
{ "error": { "message": "…", "code": 51091 } }
```

I normalise `code` to a string and keep it as `upstreamCode`, separate from this app's
own semantic error codes — an upstream identifier is useful in logs but shouldn't be
something the UI branches on.

**4. Phone numbers aren't validated server-side.** The sample number `+880140060` has
nine digits after the country code, which isn't a real Bangladeshi subscriber number,
and it registers fine. So client validation enforces E.164's *length* bounds (7–15
digits) and nothing more. Strict per-country rules would reject numbers the server
demonstrably accepts, which is the worse failure.

**5. A search endpoint appears to interpolate input into a regex.** One error I saw:

> `Regular expression is invalid: quantifier does not follow a repeatable item`

That is a regex compiler complaining, which means user input is reaching a regex
unescaped. A user typing `+`, `*`, `(`, or `?` into search can therefore make the
endpoint throw. Notable both as an API bug and as an edge case the UI has to survive —
escaping metacharacters client-side before searching, and treating this error as "no
results" rather than a crash. Handled when the search UI is built.

**6. No refresh token.** Login returns only `token`. Decoded: HS256, `sub` equals the
user's `_id`, and `exp - iat` is exactly 604800s (7 days). So session expiry is a hard
logout, not a renewal. Cookie lifetime is derived from the token's own `exp` so the
cookie and the credential die together, rather than leaving a cookie that outlives its
token and produces confusing mid-session 401s.

**7. Cold starts.** The API is on Render's free tier and sleeps when idle; the first
request can take 30–50s. Requests a user actively waits on get a 45s budget instead of
the default 15s, and the login form explains what's happening once a request passes 5
seconds. A spinner that runs for 40 seconds with no explanation reads as a broken app.

**8. There is no consistent response envelope.** Four endpoints, three conventions: login
nests under `user`, `/auth/me` returns a bare object, `/users/search` returns a bare array,
`/conversations` wraps in `{ data: [] }`. Guessing wrong on a list endpoint gives you an
empty list rather than an error, so my list parsers accept either a bare array or a `data`
wrapper.

**9. `lastMessage` is `{}` rather than `null`** on a conversation with no messages. The
most dangerous shape here, because a schema with optional fields *passes* and then
`lastMessage.text` is `undefined` several components deep — an empty preview line with
nothing failing loudly. Collapsed to `null` at the boundary so "no messages yet" is a
state the UI can't accidentally ignore.

**10. `/conversations` has no pagination and inlines every participant.** ~45
conversations in one payload, one of them embedding ~90 participant objects. Two design
consequences: background polling of this endpoint is deliberately slow (30s, purely a
fallback for a dropped socket), and the list is parsed **record by record** so one
malformed conversation costs one row instead of blanking the sidebar. The skipped count is
shown in the UI rather than hidden — a silent shortening is how an upstream shape change
goes unnoticed for a week.

**11. No unread counts anywhere in the payload.** Unread badges therefore can't be built
from the API; they'd need per-device client tracking of a last-read timestamp. Worth
recording because their absence is a data-model limitation, not an oversight in the UI.

**12. The stored data is visibly unvalidated.** Real records include one with **`name` and
`phone` swapped** (`{"name": "+8801700000001", "phone": "Test User"}`), one where phone is
literally `"admin"`, and values like `"111"` and `"#2222222222"`. So `phone` is treated as
opaque display text everywhere and never parsed or reformatted — the `User` type says so
explicitly, because the tempting thing to do is prettify it.

Relatedly: the dataset contains the **same human twice** — "shariful" as both
`01829197321` and `+8801829197321` — because the phone isn't normalised before the
uniqueness check. That's the concrete justification for normalising phone input
client-side before submitting; it reduces the problem without being able to fix it.

**13. Searching by phone number silently returns nothing.** `/users/search` matches on
name only, and a phone number gives `[]` rather than an error — indistinguishable from "no
such person". Since this is a phone-based chat app, that's the most obvious search a user
will try. Handled by labelling the field "Search people by name" and, when a phone-like
term returns nothing, saying the directory matches names only rather than showing a bare
"no results".

**14. A rejected send returns `null` with a success status.** The most consequential quirk
in the API — a client that treats 2xx as delivered tells the user their message was sent
when nothing was stored. Converted into a thrown error so it shares the failure path with a
network error. Full reasoning in [the message panel section](#22-aug--the-message-panel).

**15. `conversationId` going in, `conversation` coming out.** `POST /messages` takes
`conversationId` in the request body and returns the same field as `conversation`. Both
names are accepted by the schema and normalised to `conversationId`.

**16. Creating a duplicate direct conversation looks identical to creating a new one.**
`POST /conversations` with someone you already have a direct chat with returns success, with
nothing to distinguish "created" from "already existed" — so the response can't tell you
whether to expect history. Rather than guess, the client checks its own conversation list
first and navigates straight to an existing thread without issuing the request at all. The
POST only fires when there genuinely isn't one, which removes the ambiguity instead of
working around it and saves a round trip in the common case.

**17. No pagination on message history either.** `GET /conversations/{id}/messages` returns
the entire transcript every call. That's what makes the 4s poll affordable here and also
what would make it indefensible on real data — an incremental `since`/cursor param is the
first thing this API needs.

---

## Deliberate non-goals

- **JWT signatures are not verified.** We don't hold the HS256 secret, so we can't.
  The token is treated as opaque and the API stays the only authority. Everything the
  app does with the token locally (reading `exp`, matching cookie lifetime) is a UX
  optimisation, never a security check — and middleware is a routing hint, not a guard.
- **Middleware doesn't validate anything.** It checks cookie presence and `exp`. A
  forged cookie sails through it, which is fine, because every real data request is
  authorised upstream via the BFF.
