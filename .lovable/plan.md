## Scope: all four HQ upgrades

Big batch — sequenced from highest leverage to lowest. I'll ship in order, you can stop me at any point.

---

### 1. Connector CRM upgrade (`/hq/people`)

**DB (migration):**
- Add `intros.context` (text — why the intro), `intros.outcome` (text). Already has `from_person_id`, `to_person_id`, `status`, `follow_up_at`, `note`.
- Add `people.relationship_strength` (smallint 1–5) and lean on existing `tags[]` + `last_contacted_at`.

**UI rebuild:**
- Person detail drawer: full profile, edit-in-place, tag chips, relationship strength stars, "last touched" with quick "mark contacted today" button.
- **Intros tab on the drawer**: list of intros where this person is `from` or `to`, status badges (proposed → sent → connected → closed).
- **"Make intro" action**: button on a person picks a second person → creates `intros` row with context note → optional follow-up date.
- **Stale list** on People index: contacts not touched in 30/60/90 days, sorted by relationship strength.
- Tag filter pills above the grid.
- AI command bar already handles "add person" — extend it to "intro X to Y about Z".

---

### 2. Signal tab on Today

Replace the empty Signal tab with a chronological feed merging:
- New inquiries (last 7 days, unread)
- Analytics spikes — any path with >2× its 7-day avg in last 24h (via existing `analytics_top_paths` + simple ratio calc client-side)
- Pending intros needing follow-up (today or overdue)
- Stale top relationships (strength ≥ 4, not contacted in 30d)
- Content scheduled for today

Each item: icon, one-line headline, timestamp, click-through to the right page. No new tables.

---

### 3. Analytics page (`/hq/analytics`)

Use existing RPCs (`analytics_overview`, `analytics_over_time`, `analytics_top_paths`, `analytics_top_sources`, `analytics_top_events`).

Layout:
- Range picker: 24h / 7d / 30d / 90d
- 4 stat cards: page views, unique sessions, inquiries, chat engagements (with delta vs prior period)
- Line chart: events over time, stacked by event_name
- Two side-by-side tables: top paths (with inquiry conversion %), top referral sources
- Top events list at bottom

Pure read — no schema changes.

---

### 4. Monday Briefing inbox (`/hq/briefings`)

`briefings` table already exists. Build:
- Sidebar list of past briefings (week_start, emailed_at status pill)
- Main panel renders selected briefing as markdown
- Stats strip pulled from `briefings.stats` jsonb
- Add `/hq/briefings` to AdminShell nav under "output"
- "Generate this week now" button → invokes existing `monday-briefing` edge function manually

No schema changes.

---

## Technical notes

- One migration for #1 only (`intros.context`, `intros.outcome`, `people.relationship_strength`).
- All new pages wrapped in `AdminGuard` + `AdminShell`.
- Reuse existing `panel`, `accent-headline`, `SectionHeader`, TabBar conventions.
- Sentence case throughout (per memory).
- No new dependencies.

## Order of execution

1. Migration for #1 → wait for approval
2. Build Connector CRM
3. Build Briefings inbox (smallest, fast)
4. Build Analytics page
5. Build Signal tab last (depends on having intros + analytics calcs ready)

I'll ship in 4 separate code passes between checkpoints so you can react.
