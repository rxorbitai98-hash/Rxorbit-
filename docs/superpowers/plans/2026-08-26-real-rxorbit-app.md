# Real RxOrbit App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current RxOrbit demo login/dashboard behavior with a real Supabase-backed pharmacy application while preserving the approved UI and safety-first outreach flow.

**Architecture:** Keep the existing static frontend as the deployment baseline, split browser logic into focused modules, and connect it to Supabase Auth/Postgres through the publishable client. Enforce pharmacy tenancy and roles in Postgres RLS; keep privileged integration/provider secrets server-side.

**Tech Stack:** HTML/CSS/vanilla browser JavaScript, Supabase Auth/Postgres, existing Node test runner, Vercel static hosting, optional Supabase Edge Function for provider sends.

**Spec:** `docs/superpowers/specs/2026-08-26-real-rxorbit-app-design.md`

## Global Constraints

- Preserve the supplied minimal/mobile-first RxOrbit visual direction.
- Never expose Supabase service-role/secret keys in browser code.
- Every exposed tenant table must have RLS and least-privilege grants.
- Authorization must use database membership, not editable user metadata.
- WhatsApp outreach requires consent/suppression/frequency checks and pharmacist review.
- No fake production success messages or demo localStorage authentication.
- Every task ends with a focused test/verification cycle.

---

### Task 1: Establish production frontend structure

**Files:**
- Modify: `package.json`
- Modify: `index.html`
- Create: `src/config.js`
- Create: `src/supabase.js`
- Create: `src/auth.js`
- Create: `src/app.js`
- Test: `tests/frontend.test.js`

**Interfaces:**
- `src/supabase.js` exports `supabase`.
- `src/auth.js` exports `signIn`, `signInWithGoogle`, `requestPasswordReset`, `signOut`, and `getCurrentUser`.
- `src/app.js` owns protected rendering and navigation.

- [ ] Add the Supabase browser dependency with a pinned version and lockfile.
- [ ] Add environment-based `SUPABASE_URL` and publishable key configuration without embedding secrets.
- [ ] Write auth tests for invalid input and authenticated-state transitions using mocked client boundaries.
- [ ] Replace demo auth handlers in `index.html` with module imports and real Supabase calls.
- [ ] Remove localStorage demo session behavior and fake Google/reset success messages.
- [ ] Run `npm test`.
- [ ] Commit the frontend foundation.

### Task 2: Create tenant database schema and RLS

**Files:**
- Create: `supabase/migrations/<timestamp>_rxorbit_core.sql`
- Create: `tests/rls.test.js`
- Modify: `docs/superpowers/specs/2026-08-26-real-rxorbit-app-design.md` only if implementation clarifies an interface.

**Interfaces:**
- Tables expose pharmacy-scoped CRUD according to role policies.
- Membership lookup is the authoritative authorization boundary.

- [ ] Add pharmacies and pharmacy_members with role constraints.
- [ ] Add customers, medicines, purchases, opportunities, outreach_events, and audit_events.
- [ ] Add unique/index constraints for tenant queries and external identifiers.
- [ ] Enable RLS on every exposed table.
- [ ] Revoke unnecessary anonymous access and grant only required authenticated operations.
- [ ] Create SELECT/INSERT/UPDATE/DELETE policies with pharmacy membership predicates.
- [ ] Use `WITH CHECK` on updates/inserts to prevent tenant reassignment.
- [ ] Add role-aware policies for owner/pharmacist/staff operations.
- [ ] Apply the migration to the connected Supabase project.
- [ ] Run RLS isolation tests against two pharmacy contexts.
- [ ] Run Supabase security/performance advisors and resolve actionable findings.
- [ ] Commit schema/RLS changes.

### Task 3: Implement real authentication and onboarding

**Files:**
- Modify: `src/auth.js`
- Modify: `src/app.js`
- Modify: `index.html`
- Create: `src/onboarding.js`
- Test: `tests/auth.test.js`

- [ ] Implement email/password sign-in using Supabase Auth.
- [ ] Implement Google OAuth redirect.
- [ ] Implement password recovery and recovery-return state.
- [ ] Subscribe to Supabase auth state changes.
- [ ] Load the authenticated user's pharmacy membership.
- [ ] Show a clear blocked state if the account has no pharmacy membership.
- [ ] Implement logout through Supabase.
- [ ] Verify browser login/logout against the connected project.
- [ ] Commit authentication.

### Task 4: Replace hard-coded dashboard data with Supabase queries

**Files:**
- Modify: `index.html`
- Create: `src/data.js`
- Create: `src/dashboard.js`
- Create: `src/opportunities.js`
- Test: `tests/data.test.js`

- [ ] Query live pharmacy-scoped opportunity data.
- [ ] Calculate dashboard counts from live rows instead of constants.
- [ ] Render loading, empty, and error states.
- [ ] Add opportunity sorting/filtering for due-now/high/medium.
- [ ] Add customer search constrained to the current pharmacy.
- [ ] Preserve the approved visual hierarchy and mobile behavior.
- [ ] Run tests and browser verification.
- [ ] Commit dashboard data wiring.

### Task 5: Persist the opportunity engine

**Files:**
- Modify: `src/rxorbit.js`
- Create: `src/opportunity-engine.js`
- Modify: `tests/integration.test.js`
- Create: `tests/opportunity-engine.test.js`

- [ ] Keep the existing deterministic score behavior as the baseline.
- [ ] Add due-date calculation and opportunity status transitions.
- [ ] Add idempotent persistence/update logic.
- [ ] Ensure only meaningful rebuy candidates are surfaced.
- [ ] Generate language-aware prepared messages.
- [ ] Add tests for 0/1/2/multiple purchase histories and boundary dates.
- [ ] Commit opportunity engine.

### Task 6: Build customer profile and pharmacist review flow

**Files:**
- Modify: `index.html`
- Create: `src/customer-profile.js`
- Create: `src/review-flow.js`
- Test: `tests/review-flow.test.js`

- [ ] Add customer profile view with recent purchases and opportunity explanation.
- [ ] Add prepared message preview.
- [ ] Add consent status and suppression state.
- [ ] Add pharmacist review confirmation before outreach.
- [ ] Ensure minimum typing: pharmacist edits only when needed.
- [ ] Add accessible focus/error states.
- [ ] Verify mobile flow.
- [ ] Commit review flow.

### Task 7: Enforce consent and outreach lifecycle

**Files:**
- Create: `src/outreach.js`
- Create: `src/consent.js`
- Modify: `supabase/migrations/<timestamp>_rxorbit_core.sql`
- Test: `tests/outreach.test.js`

- [ ] Implement consent eligibility checks.
- [ ] Implement permanent STOP suppression.
- [ ] Implement frequency/recency limits.
- [ ] Record prepared/reviewed/send-attempt events.
- [ ] Block outreach when consent or suppression rules fail.
- [ ] Make all outcomes traceable to the opportunity/customer/pharmacy.
- [ ] Run database and unit tests.
- [ ] Commit outreach safety layer.

### Task 8: Add CSV import and Ecogreen normalization

**Files:**
- Create: `src/import/csv.js`
- Create: `src/import/ecogreen.js`
- Modify: `integrations/smart-import.js`
- Modify: `src/rxorbit.js`
- Test: `tests/import.test.js`

- [ ] Define a stable normalized customer/purchase contract.
- [ ] Parse CSV safely with validation and row-level errors.
- [ ] Preserve the existing Ecogreen normalizer and expand it for production fields.
- [ ] Make imports idempotent using stable external IDs where available.
- [ ] Upsert only into the current pharmacy context.
- [ ] Report imported/rejected/duplicate counts.
- [ ] Run import tests with malformed and duplicate rows.
- [ ] Commit import layer.

### Task 9: Add provider-safe WhatsApp boundary

**Files:**
- Create: `src/whatsapp.js`
- Create: `supabase/functions/whatsapp-send/index.ts`
- Test: `tests/whatsapp.test.js`

- [ ] Define provider-neutral send interface.
- [ ] Make browser action call only the authenticated server boundary.
- [ ] Require a valid opportunity, pharmacist review, consent, and non-suppressed state before sending.
- [ ] Keep provider credentials out of the browser.
- [ ] If no provider credentials are configured, return a clear not-configured state rather than pretending to send.
- [ ] Deploy the function only when the project configuration supports it.
- [ ] Verify event logging.
- [ ] Commit provider boundary.

### Task 10: Production verification and deployment

**Files:**
- Modify: `vercel.json`
- Create/modify: `.env.example`
- Create: `.github/workflows/ci.yml`
- Modify: `README.md` if present; otherwise create it.
- Test: browser end-to-end flow.

- [ ] Add CI for unit/integration tests.
- [ ] Verify no service-role/secret key appears in tracked frontend files.
- [ ] Verify production build/deploy configuration.
- [ ] Verify login → dashboard → opportunity → profile → consent → review flow.
- [ ] Verify logout and protected-route behavior.
- [ ] Verify cross-pharmacy data isolation.
- [ ] Verify blocked outreach paths.
- [ ] Run Supabase advisors again.
- [ ] Run browser verification and fix any console/runtime errors.
- [ ] Create a pull request from `feature/real-rxorbit-app` to `main`.

