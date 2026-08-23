# RxOrbit Product Quality & UX Design

## Goal

Turn the current working RxOrbit MVP into a polished, trustworthy, mobile-first pharmacy SaaS while preserving the existing secure Supabase architecture and improving data correctness before adding high-risk outreach automation.

## Product principles

- Simple and minimal: the pharmacist should understand the next best action immediately.
- Mobile-first: every core workflow must work comfortably on a phone.
- Few clicks: prioritize review, consent, and action over configuration.
- Professional soft visual language with subtle motion; no flashy effects.
- Real data only: no hard-coded production metrics or fake opportunity states in live views.
- Security first: never weaken RLS or expose cross-pharmacy data to anonymous users.
- Consent first: no WhatsApp outreach without a valid consent state.
- Explainability: every opportunity should show why RxOrbit thinks the customer is likely to rebuy.
- Verify before declaring done: every feature requires database/security tests and a live-browser verification.

## Current-state weaknesses to address

1. The interface still looks like a basic/static prototype rather than a cohesive production SaaS.
2. Browser alerts are used for important actions instead of polished in-app feedback.
3. Some dashboard/customer/opportunity content can still be static or insufficiently connected to live data.
4. CSV import needs stronger preview, validation, duplicate handling, and import history UX.
5. Customer profiles lack a complete purchase and rebuy timeline.
6. Opportunity scoring needs clear explanations and consistent edge-case behavior.
7. Consent, STOP suppression, frequency limits, and outreach event tracking are not yet a complete production workflow.
8. WhatsApp is not yet a real end-to-end sending/tracking integration.
9. Staff roles and permissions need a complete owner/pharmacist/staff model and management UI.
10. Error, loading, empty, and success states need consistent treatment.
11. Production hardening needs explicit tests for session expiry, unauthorized access, duplicate imports, and cross-pharmacy isolation.

## Product scope and order

### Phase 1: Visual and UX foundation

- Establish a reusable visual system: typography, spacing, cards, buttons, badges, tables, dialogs, forms, navigation, responsive breakpoints.
- Redesign Dashboard, Opportunities, Customers, and Outreach as one coherent application.
- Add polished loading, empty, error, success, and confirmation states.
- Replace browser alerts with accessible in-app toast/dialog feedback.
- Improve mobile navigation and touch targets.
- Keep animations subtle and functional.
- Remove or isolate remaining static/demo values from live views.

### Phase 2: Data correctness and import quality

- Make dashboard metrics derive from Supabase data.
- Improve CSV preview and column validation before commit.
- Validate rows and report created, updated, skipped, and rejected counts.
- Maintain pharmacy isolation and authenticated-only writes.
- Add import history and useful error details.
- Ensure repeated imports are idempotent where the source data identifies the same customer/purchase.

### Phase 3: Customer intelligence

- Add customer detail/profile view.
- Show purchase timeline, last purchase, purchase cadence, predicted interval, language, consent, and suppression state.
- Improve opportunity explanations: score, tier, timing, and reason.
- Support delay/ignore/not-now behavior without losing history.

### Phase 4: Consent-first outreach

- Add explicit consent gate before every send action.
- Persist outreach events.
- Implement STOP permanent suppression.
- Enforce frequency/recency limits.
- Generate prepared messages using preferred language.
- Track reply state and purchase attribution.

### Phase 5: WhatsApp integration

- Integrate an approved WhatsApp provider/API rather than relying on client-side hacks.
- Keep send operations server-authorized and auditable.
- Record delivery/send/reply outcomes.
- Make failures retryable without duplicate sends.

### Phase 6: Roles, analytics, and production hardening

- Complete owner/pharmacist/staff roles and permissions.
- Add staff management and secure invitations.
- Add operational analytics for opportunities, outreach, rebuys, and attributed revenue.
- Add audit history for sensitive actions.
- Test session expiry, unauthorized access, cross-pharmacy isolation, duplicate imports, malformed CSVs, and large imports.

## UX requirements

- Dashboard first screen answers: “Who should I act on now, and why?”
- Opportunity cards expose priority, timing, reason, and next action without requiring a detail page.
- Primary actions use clear verbs: Review, Prepare, Send, Delay, Suppress.
- Dangerous/destructive actions require confirmation.
- All async operations show progress and a final result.
- Empty states explain what to do next instead of showing blank tables.
- Mobile layouts must not require horizontal scrolling for core workflows.
- Accessibility: visible focus states, keyboard support where applicable, readable contrast, semantic controls, and meaningful labels.

## Security requirements

- `anon` must not receive pharmacy/customer/opportunity data access.
- Browser requests must use the authenticated Supabase session for protected data.
- RLS must scope every tenant-owned record to the current pharmacy.
- Server-side/import operations must validate the active pharmacy staff relationship.
- Never expose service-role credentials in browser code.
- Consent and suppression must be enforced server-side, not only in UI.

## Testing requirements

For each feature:

1. Test the database behavior.
2. Test authenticated and unauthorized access.
3. Test cross-pharmacy isolation where relevant.
4. Test error, empty, loading, and success states.
5. Verify the live Vercel deployment in a browser.
6. Only mark the feature complete after the live flow succeeds.

## Definition of done

RxOrbit is considered production-ready for an implemented feature only when the feature uses real Supabase data, respects authentication/RLS, has polished mobile UX, handles failure states, and passes live-browser verification. No feature is marked complete based solely on a code change or successful SQL migration.
