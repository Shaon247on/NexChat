# Part 1 — API reference

My own documentation of the chat API, written before building against it.

The provided spec is request-focused by design: it documents endpoints, methods, and
request bodies, but not response bodies or status codes. So everything under
**Response** below is *observed*, not specified — I recorded what actually came back.
Where I'd design the endpoint differently, I've said so rather than quietly
reimplementing it.

- **Base URL (REST):** `https://frontend-task-chatapp.onrender.com/api`
- **Socket.io origin:** `https://frontend-task-chatapp.onrender.com` — the **host
  root**, not `/api`. Socket.io serves its own handshake at `/socket.io/`; pointing a
  client at `/api` gives a handshake 404.
- **Auth:** `Authorization: Bearer <jwt>` on every protected request. Same token goes
  in the Socket.io handshake `auth` object.

> **Hosting note:** the API runs on Render's free tier and sleeps when idle. The first
> request after a period of inactivity can take **30–50 seconds**. This isn't a bug, but
> it does change what a correct client looks like — see [Timeouts](#timeouts).

---

## Conventions

### Response envelopes — there isn't one

Four endpoints, three different conventions:

| Endpoint | Envelope |
|---|---|
| `POST /auth/login` | `{ token, user: {…} }` — entity nested under a key |
| `GET /auth/me` | `{ _id, … }` — bare object |
| `GET /users/search` | `[ … ]` — bare array |
| `GET /conversations` | `{ data: [ … ] }` — array wrapped in `data` |

There's no way to guess which you'll get, and guessing wrong on a list endpoint yields an
empty list rather than an error — a silent failure. My list parsers therefore accept both
a bare array and a `{ data: [] }` wrapper. If I were designing this, every collection
response would be `{ data, meta }` and every single-entity response would be the bare
entity.

### Error envelope

Errors come back nested under `error`:

```json
{
  "error": {
    "message": "Regular expression is invalid: quantifier does not follow a repeatable item",
    "code": 51091
  }
}
```

⚠️ **`code` is sometimes a number and sometimes a string.** Any client that reads it has
to accept both. I normalise it to a string at the boundary and keep it as
`upstreamCode`, separate from my own semantic error codes.

### Identifiers

Entities use Mongo-style **`_id`**, not `id`. I normalise to `id` at the API boundary so
nothing downstream depends on the storage engine's naming.

### Phone numbers are not validated, anywhere

Treat every `phone` value as opaque display text. It is not guaranteed to be a phone
number, or even to be in the right field — see
[the data-quality notes](#observation-the-data-is-unvalidated-and-it-shows).

### Timeouts

Requests a user actively waits on get a **45s** budget; background reads get 15s. A
uniform short timeout makes the app look broken every time the instance cold-starts.

---

## `POST /auth/login`

Sign in. Doubles as registration — there is no separate signup endpoint. An unknown
phone number creates an account; a known one signs in.

**Auth:** none.

### Request

```json
{
  "phone": "+880140060",
  "name": "Aminul Islam Shaon"
}
```

| Field | Type | Notes |
|---|---|---|
| `phone` | string | International format. **Not validated server-side** — see below. |
| `name` | string | Display name. |

### Response — `200`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6a891014e5d6aac9752631a7",
    "name": "Aminul Islam Shaon",
    "phone": "+880140060",
    "createdAt": "2026-08-22T02:57:24.187Z"
  }
}
```

### The token

Decoded (payload only — the signature can't be verified client-side without the HS256
secret, and I don't treat it as verified):

| Claim | Value | Note |
|---|---|---|
| `alg` | `HS256` | |
| `sub` | `6a891014e5d6aac9752631a7` | Equals `user._id` |
| `iat` | `1787367482` | |
| `exp` | `1787972282` | `exp - iat` = 604800s = **exactly 7 days** |

**There is no refresh token.** Session expiry is therefore a hard logout, not a renewal.
I derive the session cookie's `maxAge` from `exp` so the cookie and the credential
expire together — otherwise you get a cookie that outlives its token and produces
confusing mid-session 401s.

### Observation: phone numbers aren't validated

`+880140060` has nine digits after the country code. That is not a valid Bangladeshi
subscriber number, and the API accepts it and creates the account.

**How I handled it:** client validation enforces E.164's *length* bounds only — `+`
followed by 7–15 digits. Running strict per-country validation would reject numbers the
server demonstrably accepts, which is a worse failure than letting an unusual one
through. I do strip spaces, dashes, dots, and parentheses before sending, so the stored
value is canonical — that matters because users are looked up *by number* later, and
`+1 555 123 4567` has to find the same account as `+15551234567`.

### Open question

If an existing phone logs in with a **different** name, does the account get renamed, or
is the name ignored? The endpoint being both login and registration makes this
ambiguous, and it's observable behaviour I'd want pinned down. To be tested and recorded
here.

### Would I design it this way?

Mostly yes — collapsing login and registration is a reasonable choice for a phone-first
product, and it removes a whole flow. Two changes I'd make:

1. **Return `201` for a newly created account and `200` for a sign-in.** Right now the
   client cannot tell "welcome back" from "welcome", which is a real difference in
   onboarding UX and costs the server nothing to communicate.
2. **Split the rename.** If setting a name on an existing account is intended, it should
   be an explicit `PATCH /auth/me`, not a side effect of signing in.

---

## `GET /auth/me`

The authenticated user's profile. Also serves as the token-validity check: a `401` here
means the session is genuinely dead, which is the only signal I let destroy a session.

**Auth:** `Bearer <jwt>`.

### Response — `200`

```json
{
  "_id": "6a882468e5d6aac97521e25e",
  "name": "Ada Lovelace",
  "phone": "+15551234567",
  "createdAt": "2026-08-21T10:11:52.529Z"
}
```

### Observation: inconsistent user shape

This is the same entity `POST /auth/login` returns, but shaped differently:

| Endpoint | Shape |
|---|---|
| `POST /auth/login` | `{ token, user: { _id, … } }` — **nested** under `user` |
| `GET /auth/me` | `{ _id, … }` — **bare** at the top level |

**How I handled it:** one Zod schema (`apiUserSchema`) that both responses pass through
and which emits a single normalised domain type. It accepts either `_id` or `id`, since
endpoints that embed a user — conversation participants, message senders — may differ
again. The inconsistency stops at the API boundary; no component sees two shapes.

### Would I design it this way?

No. Pick one and keep it. I'd return the bare entity from both and let login wrap only
what's genuinely login-specific:

```json
{ "token": "…", "expiresAt": "2026-08-29T02:57:24.187Z", "user": { … } }
```

Adding an explicit `expiresAt` would also spare every client from decoding the JWT just
to learn when its session ends — which is otherwise something each client reimplements,
usually slightly wrong.

---

## Observed bug: unescaped regex in search

One response I hit while probing:

```json
{
  "error": {
    "message": "Regular expression is invalid: quantifier does not follow a repeatable item",
    "code": 51091
  }
}
```

That message comes from a regex compiler, which means **user input is reaching a regular
expression unescaped** — almost certainly a Mongo `$regex` query built by string
interpolation for user search.

**Impact:** a user typing any regex metacharacter — `+`, `*`, `?`, `(`, `[` — can make
the endpoint throw. `+` matters most here, because every phone number in this system
starts with one, so *searching by phone number the obvious way triggers it.* There's a
performance dimension too: an unanchored user-supplied regex over a users collection
can't use an index.

**How I handle it client-side:**
1. Escape regex metacharacters before sending a search term.
2. Treat this specific failure as "no results" rather than an error state, so a stray
   `(` doesn't turn the search UI into an error screen.

**How I'd fix it server-side:** escape the input, or match on a normalised phone field
with an exact/prefix query instead of a regex.

---

## `GET /users/search`

Find people to start a conversation with.

**Auth:** `Bearer <jwt>`.

### Request

```
GET /users/search?q=sha
```

| Param | Type | Notes |
|---|---|---|
| `q` | string | Matches **name only** — see below. |

### Response — `200`

A **bare array**, not wrapped:

```json
[
  { "_id": "6a883a34e5d6aac97522000a", "name": "sharif vai", "phone": "+8801709835643" },
  { "_id": "6a885ddee5d6aac97522793a", "name": "shanto",     "phone": "01887654321" }
]
```

No `createdAt` on these records, unlike `/auth/me`.

### Observation: name-only matching, and it fails silently

Searching by phone number returns `[]` — not an error. From the client that is
indistinguishable from "nobody by that name", which is the worst kind of failure:
the user assumes their contact isn't registered when really the query could never
have matched.

**How I handled it:** the search field is labelled "Search people by name", and if a
term *looks* like a phone number and returns nothing, the UI says the directory matches
names only rather than showing a bare "no results".

### Observation: the regex bug is reachable from normal use

This is the endpoint behind the error in [the regex section](#observed-bug-unescaped-regex-in-search).
Because it interpolates `q` into a regex unescaped, and because every phone number here
starts with `+`, **the most natural thing a user can type is the thing that breaks it.**
Client-side escaping (`escapeSearchTerm`) neutralises it before the request leaves.

The search input is also debounced at 300ms — worth doing anywhere, but especially here,
since the endpoint runs an unindexed regex over the users collection on an instance that
sleeps.

### Observation: duplicate humans

The dataset contains the same person more than once:

```
"shariful"  01829197321
"shariful"  +8801829197321
```

Same human, two accounts, because the phone number isn't normalised before the uniqueness
check. This is direct evidence for the client-side normalisation I do on login — stripping
spaces, dashes, and parentheses before submitting — though it can only reduce the problem,
not fix it. A server-side fix would normalise to E.164 before the uniqueness check.

### Would I design it this way?

I'd make it `GET /users?search=` and have it match name **or** phone, with phone compared
against a normalised column. Searching for a person by their number is the single most
obvious thing to do in a phone-based chat app, and right now it's the one thing that
doesn't work.

---

## `GET /conversations`

Every conversation the caller belongs to.

**Auth:** `Bearer <jwt>`.

### Response — `200`

Wrapped in `data` — note this differs from `/users/search`, which returns a bare array:

```json
{
  "data": [
    {
      "_id": "6a892c9ee5d6aac9752732e7",
      "type": "direct",
      "lastMessage": {
        "text": "hello from verify bot",
        "sender": "6a892c9ae5d6aac9752732cd",
        "createdAt": "2026-08-22T04:59:13.494Z"
      },
      "updatedAt": "2026-08-22T04:59:13.729Z",
      "participant": { "_id": "…", "name": "Verify Bot", "phone": "+15554744983" }
    },
    {
      "_id": "6a886e91e5d6aac97522dafe",
      "type": "group",
      "lastMessage": { "text": "hi", "sender": "…", "createdAt": "…" },
      "updatedAt": "2026-08-22T04:57:29.971Z",
      "name": "20's Aura",
      "createdBy": "6a882468e5d6aac97521e25e",
      "admins": ["6a882468e5d6aac97521e25e", "6a8871fce5d6aac97522ed7e"],
      "participants": [{ "_id": "…", "name": "Ada Lovelace", "phone": "+15551234567" }]
    }
  ]
}
```

### Two conversation kinds, structurally different

Not one shape with optional fields — genuinely different records:

| | `direct` | `group` |
|---|---|---|
| Counterpart | `participant` — a single object | `participants` — an array |
| Name | *none* — the title is the other person | `name` |
| Ownership | — | `createdBy`, `admins: string[]` |

I model this as a discriminated union on `type`, so TypeScript forces the branch instead
of leaving a pile of optionals for every component to re-check. `getConversationTitle()`
centralises the "direct chats have no name of their own" rule.

`admins` and `lastMessage.sender` are **ids only**, not user objects, so the sender of a
group's last message has to be resolved against the embedded `participants`.

### ⚠️ `lastMessage` is `{}`, not `null`

When a conversation has no messages, `lastMessage` is an **empty object**:

```json
{ "lastMessage": {} }
```

This is the most dangerous shape in the whole API. A schema that marks the fields
optional will pass validation, and `lastMessage.text` then reads `undefined` several
components deep — rendering an empty preview line rather than an "no messages yet" state,
with nothing failing loudly to explain why.

**How I handled it:** every field is optional in the schema and anything incomplete is
collapsed to `null`, so "no messages yet" becomes a state the UI can't accidentally
ignore.

### Observation: no pagination, and very large payloads

The endpoint returns **every** conversation in one response, with **every participant
inlined**. In the live account this is ~45 conversations, one of which embeds ~90
participant objects. The single response is large enough that it truncated when pasted
into a chat window.

Consequences I designed around:
- Background polling of this endpoint is deliberately slow (30s), and is only a fallback
  for a dropped socket — `message:new` / `conversation:updated` are the real update path.
- Sorting is done client-side by `updatedAt`; the server appears to sort already, but it
  isn't documented.

**What I'd change:** paginate it, and replace inline `participants` with a count plus a
few avatars, fetching the full member list only when a group's detail view is opened.
There is no reason to ship 90 user objects to render one sidebar row.

### Observation: no unread counts

Nothing in the payload indicates unread state, so unread badges can't be built from the
API. They'd need client-side tracking of a last-read timestamp per conversation, which is
per-device and lost on a new browser. Called out because "why are there no unread
badges?" is a fair question, and the answer is the data model, not an oversight.

### Observation: the data is unvalidated, and it shows

Real records from this response:

```json
{ "name": "+8801700000001", "phone": "Test User" }   // name and phone swapped
{ "name": "admin",          "phone": "admin" }        // phone is literally "admin"
{ "name": "as",             "phone": "111" }
{ "name": "Adam",           "phone": "#2222222222" }
{ "name": "Lyle Ingram",    "phone": "+1 (974) 501-5975" }
```

**How I handled it:** two things. `phone` is treated as opaque display text and never
parsed or reformatted — the `User` type says so explicitly. And the conversation list is
parsed **record by record**, so one malformed conversation costs one row instead of
blanking the entire sidebar; the count of skipped records is surfaced in the UI rather
than hidden, so a genuine upstream shape change stays visible.

### Would I design it this way?

Beyond pagination: return `unreadCount` per conversation, and give direct conversations a
resolved `title` so clients stop reimplementing the "direct chats have no name" branch.

---

## `GET /conversations/{id}/messages`

Full message history for a conversation. The same endpoint serves direct chats and
groups — `{id}` is the conversation id in both cases, so there is no separate group
route.

**Auth:** `Bearer <jwt>`.

### Response — `200`

An array of messages (see the shape under `POST /messages`).

No pagination or cursor parameter is documented, so this returns the **entire**
transcript on every call. That shapes the polling interval: history is refetched every
4s as the live-update mechanism, which is affordable only because these threads are
small. On a real dataset this would need a `since` or cursor param before polling could
be justified at all — noted as a limitation rather than pretended away.

---

## `POST /messages`

Send a message. Used for both direct and group conversations.

**Auth:** `Bearer <jwt>`.

### Request

```json
{
  "conversationId": "6a892ec9e5d6aac975274785",
  "text": "Project Team again"
}
```

### Response — success

```json
{
  "_id": "6a893879e5d6aac97527a6fe",
  "conversation": "6a892ec9e5d6aac975274785",
  "sender": "6a882468e5d6aac97521e25e",
  "text": "Project Team again",
  "createdAt": "2026-08-22T05:49:45.621Z"
}
```

`sender` and `conversation` are ids, not embedded objects — consistent with
`lastMessage.sender` on the conversation list. Sender names are resolved against the
conversation's participants.

### ⚠️ A rejected send returns `null`, not an error

This is the most consequential quirk in the API. A send that doesn't succeed answers with
a **`null` body**, not a 4xx/5xx.

Why it matters more than it looks: the natural way to write an optimistic send is
"apply the change, and roll back if the request throws". Here it doesn't throw. A client
written that way would flip the message from *sending* to *sent* — checkmark and all —
while nothing was stored. **The user believes they've been heard when they haven't**,
which is the single worst failure mode a chat client can have. It's silent, and it's
indistinguishable from success at exactly the moment the user stops paying attention.

**How I handled it:** the parse layer returns `null` explicitly and the send path converts
that into a thrown error, so the `null` case and a genuine network failure follow the same
code path. The bubble is marked *not delivered* with Retry and Discard, and the text stays
on screen so nothing the user wrote is lost.

### Observation: `conversationId` in, `conversation` out

The request calls the field `conversationId`; the response calls the same thing
`conversation`. Both names are accepted in the schema and normalised to
`conversationId`, so only the validation layer knows about it.

### Would I design it this way?

Return `201` with the created message, and a `4xx` with an error body when it fails.
`null` is not a failure signal — it's an absence of one.

---

## `POST /conversations`

Create a conversation, direct or group.

> **Contract still needed:** exact body for direct vs group, and the response shape.

### Observation: creating a duplicate direct conversation is indistinguishable from creating a new one

Calling this with someone you *already* have a direct conversation with returns success,
with nothing in the response to say whether it created a conversation or matched an
existing one. So the response can't be used to decide whether to expect history.

**How I handled it — by not needing the distinction.** The client checks its own
conversation list first (`findDirectConversationWith`): if a direct conversation with that
person exists, it navigates straight to it and never sends the request. The POST only fires
when there genuinely isn't one. That removes the ambiguity rather than guessing around it,
and it's faster in the common case — messaging someone you already talk to costs zero
round trips.

**What I'd change server-side:** return `200` with the existing conversation and `201` when
one is created. That's what the status codes are for, and it makes the client's job trivial.

---

## Remaining endpoints

Group management — rename, add member, remove member, promote admin, leave — documented
here in the same format once the contracts are confirmed. The rules they enforce are known:
groups have 3+ members, the creator starts as an admin, only admins may add, remove,
promote, or rename, and any member may leave.

### Socket.io events (not part of the OpenAPI spec)

Connect to the host root with the JWT in the handshake:

```js
const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: { token },
});
```

An invalid or missing token is rejected at handshake time.

| Direction | Event | Payload |
|---|---|---|
| client → server | `message:send` | `{ conversationId, text }`, optional ack callback |
| server → client | `message:new` | A new message addressed to you |
| server → client | `conversation:updated` | A group you belong to changed — created, renamed, or members/admins changed |

Group messages use the same `POST /messages` endpoint and the same `message:new` event as
direct messages.

