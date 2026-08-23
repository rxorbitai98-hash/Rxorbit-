# RxOrbit Full Product Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rejected prototype direction with a complete, simple pharmacist-first RxOrbit product covering opportunities, customers, intelligence, outreach, insights, data operations, team/security, filters, and settings.

**Architecture:** Build a self-contained frontend prototype first, with clean domain sections and a shared design system. Keep the product flow simple while exposing advanced capabilities progressively. Use mock data and deterministic client-side interactions where backend integrations are not yet available; do not fake real WhatsApp, authentication, or database behavior as production integrations.

**Tech Stack:** Existing repository HTML/CSS/JavaScript; GitHub-hosted static frontend; no new dependency required for the prototype phase.

**Spec:** Approved RxOrbit architecture in conversation: Home, Opportunities, Customers, Insights, Outreach, Activity, Search/Filters, Data Import, Pharmacy Team, Security, Settings, and intelligence/outreach workflows.

## Global Constraints

- Premium, extremely simple, modern, friendly, powerful, calm.
- Pharmacist-first and mobile-first.
- Hide system complexity; surface only the next useful action.
- Core flow: DATA → PREDICT → PRIORITIZE → PERSONALIZE → CONSENT → WHATSAPP → REPLY → PURCHASE → REVENUE → LEARN.
- Do not use arbitrary accent colors or return to the rejected dashboard/card-heavy design.
- Do not claim mock interactions are live production integrations.
- Consent is required before an outreach send action.

---

### Task 1: Replace the rejected visual shell

**Files:**
- Modify: `rxorbit-minimal.html`
- Modify: `index.html` only if the entry target changes

**Deliverable:** A clean application shell with Home, Opportunities, Customers, Insights, Outreach, Activity, and Settings/Data access, using progressive disclosure rather than a dense dashboard.

- [ ] Create a compact top bar with RxOrbit identity, global search, and profile/settings access.
- [ ] Create responsive navigation that exposes primary areas without overcrowding mobile.
- [ ] Create reusable visual primitives in the same file: section heading, opportunity row, insight row, filter control, metric, primary/secondary action, modal/sheet, toast.
- [ ] Remove all rejected prototype-specific language, excessive cards, and colored status badges.
- [ ] Verify each navigation destination renders without a full page reload.
- [ ] Commit as `feat: rebuild rxorbit product shell`.

### Task 2: Home and daily command center

**Files:**
- Modify: `rxorbit-minimal.html`

**Deliverable:** Home answers “who needs attention?” and gives a short daily summary.

- [ ] Add Today summary with opportunities, replies, and purchases using restrained metrics.
- [ ] Add Top opportunities with customer, reason, likelihood, timing, and Review action.
- [ ] Add Needs attention for replies, follow-ups, and missed opportunities.
- [ ] Add a short Recent activity section.
- [ ] Add empty-state behavior for zero opportunities.
- [ ] Ensure the primary Home action is Review, not analytics exploration.
- [ ] Commit as `feat: add rxorbit home command center`.

### Task 3: Opportunities, intelligence, search, and filters

**Files:**
- Modify: `rxorbit-minimal.html`

**Deliverable:** A usable opportunity workspace with quick and advanced filters.

- [ ] Add opportunity rows with score, refill timing, reason, recommended action, and status.
- [ ] Add quick filters: All, Due now, This week, High potential, Recently purchased, Needs follow-up.
- [ ] Add advanced filters: purchase date, refill interval, customer value, language, consent, outreach status, and product.
- [ ] Add sorting: highest opportunity, due soonest, highest value, recent purchase, recently contacted.
- [ ] Add search across customer, phone, product, purchase, and opportunity fields.
- [ ] Add actions for Review, Snooze/Not now, Dismiss, and Suppress.
- [ ] Add a clear explanation for each recommendation rather than unexplained scoring alone.
- [ ] Commit as `feat: add opportunity intelligence and filters`.

### Task 4: Customer intelligence and profiles

**Files:**
- Modify: `rxorbit-minimal.html`

**Deliverable:** Customer directory and profile that explain behavior.

- [ ] Add customer directory with search, filters, and sorting.
- [ ] Add profile fields for identity, language, consent, last purchase, typical value, refill interval, and lifetime value.
- [ ] Add purchase history.
- [ ] Add outreach history.
- [ ] Add “Why RxOrbit selected this customer” explanation.
- [ ] Add detected refill pattern, response behavior, preferred time, and product preference insights.
- [ ] Add notes and tags as local prototype interactions.
- [ ] Commit as `feat: add customer intelligence`.

### Task 5: Outreach and message intelligence

**Files:**
- Modify: `rxorbit-minimal.html`

**Deliverable:** Consent-aware prepared outreach workflow.

- [ ] Add Outreach sections: Ready to send, Sent, Waiting for reply, Replied, Not now, Suppressed.
- [ ] Add prepared message generation from customer context.
- [ ] Add English, Marathi, and Hindi message variants.
- [ ] Add message preview and pharmacist editing.
- [ ] Require consent confirmation before Send.
- [ ] Add frequency-limit and quiet-period indicators.
- [ ] Add simulated states for sent, reply, STOP, not-now, and no-response without claiming real WhatsApp delivery.
- [ ] Add template library and basic template-performance insight.
- [ ] Commit as `feat: add consent aware outreach workflow`.

### Task 6: Insights and business intelligence

**Files:**
- Modify: `rxorbit-minimal.html`

**Deliverable:** Plain-language insights instead of a crowded analytics dashboard.

- [ ] Add daily insights.
- [ ] Add customer insights.
- [ ] Add pharmacy insights.
- [ ] Add outreach performance: sent, replies, conversion.
- [ ] Add purchase attribution examples and recovered-customer counts.
- [ ] Add revenue and ROI summaries.
- [ ] Add best-performing message, timing, and segment insights.
- [ ] Add missed-opportunity insight.
- [ ] Commit as `feat: add rxorbit insights`.

### Task 7: Activity and operations

**Files:**
- Modify: `rxorbit-minimal.html`

**Deliverable:** Clear audit-style activity timeline and data operations UI.

- [ ] Add Activity timeline for opportunity, message, reply, purchase, import, and team events.
- [ ] Add CSV customer import flow with preview, column mapping, validation, duplicate detection, and error summary as a local prototype.
- [ ] Add purchase import flow with the same safeguards.
- [ ] Add import history.
- [ ] Clearly label data operations as prototype/local where they are not connected to a real backend.
- [ ] Commit as `feat: add activity and data operations`.

### Task 8: Team, security, settings, and missing-product checklist

**Files:**
- Modify: `rxorbit-minimal.html`

**Deliverable:** Complete product navigation for team, security, settings, and integration readiness.

- [ ] Add Owner, Pharmacist, and Staff role views with permission descriptions.
- [ ] Add pharmacy profile settings.
- [ ] Add communication preferences, languages, outreach limits, quiet periods, and consent settings.
- [ ] Add integrations/settings placeholders for WhatsApp, data import, and future database connection, clearly marked as configuration/readiness rather than live integration.
- [ ] Add security section covering authentication, sessions, role-based access, consent records, audit trail, privacy, and backup readiness.
- [ ] Add a “What’s connected / What’s not connected” status panel so production limitations are transparent.
- [ ] Commit as `feat: complete rxorbit operations and settings`.

### Task 9: End-to-end prototype verification

**Files:**
- Modify: `rxorbit-minimal.html` only for fixes discovered during verification

**Deliverable:** Every planned navigation and core interaction works in the static prototype.

- [ ] Verify Home → Opportunity → Customer review.
- [ ] Verify filters and search change displayed results.
- [ ] Verify customer profile → prepared message.
- [ ] Verify consent blocks Send when unchecked.
- [ ] Verify Send changes the simulated outreach state.
- [ ] Verify Insights, Activity, Data, Team, Security, and Settings sections open.
- [ ] Verify mobile layout at narrow width and desktop layout at wide width.
- [ ] Verify no JavaScript errors in browser console.
- [ ] Verify no blue or rejected accent-color styling remains.
- [ ] Commit as `test: verify rxorbit full product prototype`.

### Task 10: Production integration readiness

**Files:**
- Modify: `docs/` and integration files only after backend credentials and integration contracts are available

**Deliverable:** Explicit boundary between prototype and production integrations.

- [ ] Document required Supabase tables/auth/RLS contracts before connecting real customer data.
- [ ] Document WhatsApp provider/API contract and consent requirements before enabling real sends.
- [ ] Document CSV import mapping and data validation rules.
- [ ] Document role permissions and audit events.
- [ ] Do not enable fake “live” states for any integration that is not actually connected.
- [ ] Commit as `docs: define rxorbit production integration contracts`.
