# RxOrbit Visual UX Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current prototype-like RxOrbit presentation with a polished, mobile-first pharmacy SaaS interface while preserving the already-working Supabase authentication, session, RLS, customer, opportunity, outreach, CSV import, and automatic opportunity-generation flows.

**Architecture:** Keep the current single-page `index.html` architecture for this first visual phase so the working backend integration is not disturbed. Refactor the HTML/CSS/JavaScript into clearer UI sections inside the same file, introduce reusable visual primitives through CSS classes and small rendering helpers, and keep all protected data requests going through the existing authenticated `request()` path.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Supabase REST/Auth APIs, Vercel static deployment.

**Spec:** `docs/superpowers/specs/2026-08-22-rxorbit-product-quality-design.md`

## Global Constraints

- Preserve the existing Supabase project URL and publishable key.
- Never grant `anon` access to pharmacy/customer/opportunity data.
- Keep protected browser requests authenticated with the existing session access token.
- Preserve pharmacy isolation and existing RLS behavior.
- Do not introduce a service-role credential into browser code.
- Mobile-first; core workflows must not require horizontal scrolling.
- Replace browser `alert()` interactions with accessible in-app UI.
- Use real Supabase values in live views; do not restore hard-coded production metrics.
- Use subtle animation only for feedback and state transitions.
- Verify the live Vercel deployment before marking the phase complete.

---

### Task 1: Establish the visual system

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces reusable CSS classes for layout, typography, cards, buttons, badges, tables, status messages, dialogs, and responsive navigation.
- Consumes the existing DOM IDs and Supabase data-rendering functions so behavior remains intact.

- [ ] **Step 1: Write the visual-system acceptance checks**

Check in the browser at desktop and mobile widths that the page has a consistent spacing scale, readable type hierarchy, visible focus states, touch-friendly controls, and no horizontal overflow.

- [ ] **Step 2: Implement the visual system**

Create CSS tokens for background, surface, text, muted text, border, accent, success, warning, and danger; add consistent radii, shadows, focus rings, button variants, badges, table containers, and responsive breakpoints. Keep the palette professional and soft.

- [ ] **Step 3: Add reusable state classes**

Add classes for `loading`, `empty`, `error`, `success`, `toast`, `dialog`, and disabled controls so all asynchronous operations can use the same visual language.

- [ ] **Step 4: Verify the visual system**

Run the live page at desktop and narrow mobile widths. Confirm no horizontal scrolling and that keyboard focus is visible on interactive controls.

- [ ] **Step 5: Commit**

Commit with: `style: establish RxOrbit visual system`

---

### Task 2: Redesign the application shell and navigation

**Files:**
- Modify: `index.html`

**Interfaces:**
- `show(id, btn)` continues to switch the existing application pages.
- Existing `login`, `logout`, and `request` behavior remains unchanged.

- [ ] **Step 1: Add a production-style application shell**

Introduce a compact header with workspace context, connection status, user identity, and sign-out action while keeping the existing navigation destinations.

- [ ] **Step 2: Improve navigation**

Use clearer labels and active states for Dashboard, Opportunities, Customers, and Outreach. On mobile, keep touch targets at least 44px high and avoid relying on tiny icon-only controls without accessible labels.

- [ ] **Step 3: Improve authentication screen**

Give the existing login form a polished card, clear error area, disabled/loading state, and accessible labels while preserving the current authentication request.

- [ ] **Step 4: Verify navigation**

Test login, logout, every navigation item, refresh while authenticated, and refresh after logout.

- [ ] **Step 5: Commit**

Commit with: `style: redesign RxOrbit application shell`

---

### Task 3: Redesign the Dashboard around the next best action

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes `loadCustomers()`, `loadOpportunities()`, `loadOutreach()`, and `loadRebuys()`.
- Preserves the existing metric element IDs or updates the rendering helpers consistently.

- [ ] **Step 1: Rework metric cards**

Make the four metrics visually distinct but restrained, with clear labels, supporting context, and loading placeholders. Keep their values sourced from Supabase.

- [ ] **Step 2: Rework opportunity cards**

Each opportunity card must show customer, priority, timing/signal, score or meaningful priority context, and one primary next action. Keep Review and WhatsApp actions visually secondary until consent is verified.

- [ ] **Step 3: Add real empty/error states**

Show useful messages when there are no opportunities, when data is loading, and when Supabase fails. Explain what the pharmacist should do next instead of showing blank space.

- [ ] **Step 4: Verify dashboard behavior**

Import test data, refresh, confirm metrics change from real data, and confirm the dashboard remains usable when there are zero opportunities.

- [ ] **Step 5: Commit**

Commit with: `style: redesign RxOrbit dashboard`

---

### Task 4: Redesign Opportunities, Customers, and Outreach views

**Files:**
- Modify: `index.html`

**Interfaces:**
- Existing data-loading functions remain the source of truth.
- Page switching remains compatible with `show()`.

- [ ] **Step 1: Improve Opportunities view**

Use a responsive card/table presentation. On narrow screens, convert dense table rows into stacked opportunity cards so the user never needs horizontal scrolling.

- [ ] **Step 2: Improve Customers view**

Present customer name, language, consent, suppression, and useful status as readable badges. Add a clear empty state and make customer rows visually actionable for the future customer-detail phase without pretending that detail functionality exists yet.

- [ ] **Step 3: Improve Outreach view**

Turn outreach records into a clean timeline/list with channel, language, status, message preview, and timestamp. Clearly distinguish prepared/draft states from actually sent states.

- [ ] **Step 4: Verify responsive behavior**

Test all three pages at mobile and desktop widths with real Supabase data and with empty results.

- [ ] **Step 5: Commit**

Commit with: `style: polish opportunities customers and outreach`

---

### Task 5: Replace browser alerts with accessible in-app feedback

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces `toast(message, type)` and `openDialog(options)` helpers for UI feedback.
- Existing actions such as CSV import and prepared-message review use these helpers instead of `alert()`.

- [ ] **Step 1: Add toast container and dialog markup**

Create accessible live-region feedback for success/error messages and a reusable confirmation/review dialog for prepared messages.

- [ ] **Step 2: Implement toast helper**

Implement a small `toast(message, type)` helper that renders success, warning, or error feedback, auto-dismisses after a short interval, and does not block the page.

- [ ] **Step 3: Replace blocking alerts**

Replace existing `alert()` calls for CSV status and prepared WhatsApp messages with the new in-app feedback components.

- [ ] **Step 4: Verify async feedback**

Test successful CSV import, failed CSV import, empty CSV, and prepared-message review. Confirm feedback is visible on mobile and keyboard accessible.

- [ ] **Step 5: Commit**

Commit with: `ux: replace browser alerts with in-app feedback`

---

### Task 6: Live-browser verification and regression gate

**Files:**
- Modify: `index.html` only if verification finds a concrete defect.

**Interfaces:**
- No new application interfaces; this task validates the completed visual phase against the existing backend.

- [ ] **Step 1: Verify authentication**

Sign in with the existing account and confirm the protected dashboard loads without anonymous-role permission errors.

- [ ] **Step 2: Verify data isolation**

Confirm protected customer and opportunity requests continue to use the authenticated session and that no anonymous data access is introduced.

- [ ] **Step 3: Verify core flows**

Test Dashboard, Opportunities, Customers, Outreach, CSV import, automatic opportunity generation, logout, and session refresh.

- [ ] **Step 4: Verify responsive UX**

Check mobile and desktop layouts, touch targets, focus states, loading states, empty states, error states, and toast/dialog behavior.

- [ ] **Step 5: Verify Vercel deployment**

Confirm the latest GitHub commit is deployed to the RxOrbit Vercel URL and that the live browser renders the updated UI.

- [ ] **Step 6: Commit verification fixes**

If a concrete regression is found, make the smallest fix and commit with: `fix: resolve RxOrbit visual regression`

- [ ] **Step 7: Completion gate**

Only mark Phase 1 complete after the live browser passes the checks above.
