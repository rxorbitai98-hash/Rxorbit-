# Real RxOrbit App Design

## Goal
Turn the current static/demo RxOrbit HTML into a real pharmacy SaaS while preserving the approved minimal, mobile-first visual direction and the flow: Best Opportunities → Customer Profile → Prepared Message → Consent Check → Pharmacist Review → WhatsApp Send → Track Result.

## Current repository context
The repository is a lightweight static HTML/JavaScript app with an existing opportunity-scoring module and Ecogreen normalization tests. The supplied login/dashboard HTML is a visual prototype; its login, password recovery, Google login, WhatsApp action, dashboard metrics, and session are currently demo behaviors. The main repository also contains `src/rxorbit.js`, integration helpers, tests, and `vercel.json`.

## Architecture
- Frontend: keep the existing static deployment model initially, using focused browser JavaScript modules and the supplied HTML/CSS as the visual foundation rather than replacing it with a generic template.
- Data/auth: Supabase Auth + Postgres. The browser uses only the project URL and publishable key. All exposed tables use RLS and tenant-scoped policies.
- Domain model: pharmacy → staff membership → customers → purchases → opportunities → outreach events. Consent/suppression is first-class and must be checked before outreach.
- Integration boundary: Ecogreen/other pharmacy systems normalize into a common import contract. WhatsApp is represented by a provider interface; no fake production send is claimed until a real provider is configured.

## Data model
Core tables:
- pharmacies: tenant identity and pharmacy settings.
- pharmacy_members: auth user membership and role (`owner`, `pharmacist`, `staff`).
- customers: pharmacy-scoped customer identity, mobile, preferred language, consent state, suppression state.
- medicines: pharmacy-scoped medicine/product catalog.
- purchases: pharmacy-scoped customer purchases/invoices.
- opportunities: calculated rebuy opportunities with score, due date, status, and prepared message.
- outreach_events: consent-checked message lifecycle (`prepared`, `sent`, `delivered`, `replied`, `not_now`, `purchased`, `suppressed`).
- audit_events: security-sensitive actions and integration activity.

## Authorization
Tenant access is determined by membership rows, not editable user metadata. Every data table is pharmacy-scoped and RLS restricts access through the authenticated user's pharmacy membership. Owner-only operations include membership administration and pharmacy settings. Pharmacists can review opportunities and send approved outreach. Staff can view operational data according to the least-privilege policy. Updates include both `USING` and `WITH CHECK` where applicable.

## Authentication
- Email/password sign-in using Supabase Auth.
- Google OAuth button using Supabase OAuth.
- Password recovery using Supabase reset email flow.
- Auth state drives protected application rendering.
- Logout clears the Supabase session.
- No demo localStorage session is used as authentication.

## Opportunity engine
Retain the existing deterministic scoring as the first production-safe implementation, then persist calculated opportunities. Use purchase history and interval regularity; do not claim clinical advice or medication adherence. Only surface customers with genuine rebuy signals. Scores and due labels are explanatory operational signals, not medical decisions.

## Outreach safety
Before a WhatsApp action, RxOrbit checks active consent, permanent STOP suppression, frequency/recency limits, and current opportunity state. The UI shows the prepared message and consent state before pharmacist review. A send action creates an outreach event. A future provider implementation can call the WhatsApp Business API from a server-side/Edge Function boundary without exposing secrets to the browser.

## CSV/import
CSV import is pharmacy-scoped, validates required fields, normalizes rows, reports rejected rows, and upserts idempotently using stable external identifiers where available. Imports never bypass RLS by using a browser-exposed service-role key.

## UX
Preserve the supplied mascot login art, clean typography, soft colors, small number of clicks, and minimum pharmacist typing. The dashboard becomes data-driven while retaining the visual hierarchy. Loading, empty, error, consent-blocked, and offline-ish states are explicit.

## Testing and verification
- Unit tests for normalization, scoring, prepared messages, consent rules, and CSV parsing.
- Database/RLS tests for cross-pharmacy isolation and role permissions.
- Browser verification for login, logout, protected dashboard, opportunity review, and blocked/safe outreach states.
- Supabase security and performance advisors after schema changes.

## Explicit non-goals for this phase
- No real WhatsApp delivery until a provider account/configuration exists.
- No clinical recommendation engine.
- No automated outreach without pharmacist review and consent checks.
- No service-role/secret key in client-side code.
