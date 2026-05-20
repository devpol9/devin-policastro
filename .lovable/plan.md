# DevHQ Phase 1 Plan

Large scope — I'll execute in this order. First, a database migration needs your approval before I can write the code that depends on it.

## Step 1 — Database migration (needs your approval)

Single migration adding 4 tables, all RLS-enabled using `has_role()`:

- **`priorities_today`** — user_id, priority_date, slot (1-3), title, completed. Unique on (user_id, date, slot). Admin-scoped to own rows.
- **`daily_logs_quick`** — user_id, content. Admin-scoped to own rows.
- **`chat_sessions`** — session_token (unique), user_agent, path, started_at, last_message_at, message_count. Anon insert/update; admin select.
- **`chat_messages`** — session_id FK, role ('user'|'assistant'), content. Anon insert; admin select. Index on (session_id, created_at).

After approval, types.ts auto-regenerates.

## Step 2 — Subdomain routing in `App.tsx`

Compute `isAdminHost` from `window.location.hostname` (`admin.devinpolicastro.com`, any `admin.*`) or `?hq=1` query param. Render a separate `<Routes>` tree for admin; otherwise existing public routes untouched.

Admin routes: `/` → redirect, `/login`, `/today`, `/inquiries`, `/inquiries/:id`, `*` → admin 404. Existing `/admin` and `/admin-login` become small redirect components using `window.location.replace` to `admin.devinpolicastro.com`.

## Step 3 — Admin shell

- `src/components/admin/AdminGuard.tsx` — checks session + admin role, subscribes to `onAuthStateChange`, minimal pulsing-dot loader, signs out non-admins.
- `src/components/admin/AdminShell.tsx` — shadcn Sidebar (collapsible), top bar with page title + search placeholder + date + logout, content `max-w-7xl`. Sidebar items: Today (active), Inquiries (active, new-count badge), then disabled "Soon" items (Projects, Ventures, Content, Daily Log, KPIs, Notes, Analytics, Chat Logs), Settings at bottom. Header "DevHQ" with terracotta italic accent. Footer shows email + logout.
- `src/hooks/useIsAdmin.ts` — reusable.

## Step 4 — Pages

- `src/pages/admin/Login.tsx` — move existing AdminLogin content here verbatim, post-login route → `/today`.
- `src/pages/admin/Today.tsx` — greeting block, 3 priority slots (inline editable, persist to `priorities_today` scoped by date), 7-day inquiry bar chart (recharts), 5 recent inquiries (clickable → detail), quick-log textarea (saves to `daily_logs_quick`), compact 24h analytics ticker (hidden if no data). Framer Motion fade-up.
- `src/pages/admin/Inquiries.tsx` — port existing `Admin.tsx` filter/status logic into the shell. Add name/email search bar + Total/New/This Week metric pills. Cards clickable → `/inquiries/:id`.
- `src/pages/admin/InquiryDetail.tsx` — 2-column layout. Left: badge, name, status dropdown, contact links, timestamp, form_data definition list. Right: notes textarea (save on blur), Mark contacted/closed buttons, disabled "Convert to Project" w/ Phase 2 tooltip, copy buttons, back link.

## Step 5 — Chat logging

- `supabase/functions/chat/index.ts` — accept optional `session_token` (generate if missing), upsert `chat_sessions` (user_agent from headers, path from body, increment message_count), insert user message before streaming, insert assistant message after stream completes, return `X-Session-Token` response header.
- `src/components/AIChatbot.tsx` — read/write `chat_session_token` in localStorage, send in request body, capture header on response. UX unchanged.

## Step 6 — Public-site DevHQ link

- `src/components/FloatingNav.tsx` — desktop-only small link visible when `useIsAdmin()` is true, linking to `https://admin.devinpolicastro.com/today`. MobileBottomNav untouched.

## Technical notes

- All new RLS policies use `has_role(auth.uid(), 'admin'::app_role)` per project pattern.
- Use existing `glass-card`, `glow-text`, `SectionHeader`, color tokens, Fraunces/Inter/JetBrains Mono. No new tokens or palette changes.
- Recharts is needed for the inquiry pulse chart — will add if not present.
- ESLint hover-rule from prior turn still applies — new code uses only color-change hovers, no scale/opacity/transform hovers.

## Out of scope (Phase 2/3)

Projects, Ventures, Content Calendar, KPIs, Notes, full Daily Log, full Analytics. DNS/Lovable domain config is a deploy step, not code.

## Acceptance verification

After ship: public site unchanged; `?hq=1` → admin login or Today; priorities persist; inquiries dashboard works inside shell with all filters; detail page notes save on blur; chatbot messages land in `chat_messages`; non-admin Google sign-in gets blocked + signed out.