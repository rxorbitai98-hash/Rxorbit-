# RxOrbit–Ecogreen Demo Integration Design

**Goal:** Build a browser-visible demo showing how Ecogreen pharmacy data can flow into RxOrbit, become rebuy opportunities, and reach a pharmacist action without requiring real Ecogreen credentials.

## Scope

This is a realistic throwaway/demo integration layer. Ecogreen is represented by a mock API with the same conceptual contract we expect from a real Ecogreen integration. The connector boundary must make replacing the mock source with a real Ecogreen API straightforward.

## User Flow

1. Open RxOrbit.
2. Sign in to the demo.
3. Open the Ecogreen integration view.
4. Trigger a sync from Ecogreen.
5. Show sync status and imported counts.
6. Transform customers and sales into RxOrbit records.
7. Calculate rebuy opportunities from repeat purchase patterns.
8. Show Due Now / High / Medium opportunities.
9. Open a customer opportunity.
10. Show reason, confidence, and a prepared WhatsApp message.
11. Simulate pharmacist review/send and record the outreach event.

## Data Contract

### Ecogreen source objects

- Customer: external customer ID, name, mobile number, preferred language.
- Sale/invoice: external invoice ID, customer ID, date, total amount.
- Sale line: invoice ID, product ID, product name, quantity.
- Product: external product ID, name, SKU/category.
- Branch: external branch/store ID and name.

### RxOrbit normalized objects

- customers
- products
- purchases
- purchase_items
- opportunities
- outreach_events

Every imported source record retains its external Ecogreen ID so the connector can be made idempotent and later switched to the real API.

## Demo API Boundary

Use a server-side route/module named as an Ecogreen adapter. It exposes mock operations equivalent to:

- `getCustomers()`
- `getSales(from, to)`
- `getProducts()`
- `sync()`

The UI must not contain an Ecogreen secret or directly depend on a real provider URL.

## Opportunity Logic

The demo uses deterministic rules rather than claiming to be a production ML model:

- Detect repeated purchases for the same customer/product.
- Estimate the typical interval between purchases.
- Compare the elapsed time since the latest purchase with that interval.
- Assign a confidence score and urgency bucket.
- Display the evidence used for the score.

## Safety / Compliance

- Demo data is synthetic.
- No real patient/customer information is included.
- WhatsApp sending is simulated only.
- Consent is represented in the outreach flow and must be checked before a simulated send.
- STOP/suppression state must prevent simulated outreach.

## UX

- Mobile-first.
- Simple/minimal visual design.
- Few clicks.
- Clear sync status.
- Clear distinction between imported source data and RxOrbit recommendations.
- No unnecessary configuration screens.

## Success Criteria

The demo is successful when a user can visibly follow:

`Ecogreen mock data → Sync → RxOrbit data → Opportunity → Customer profile → Consent → Prepared WhatsApp → Simulated send → Outreach event`

without manually editing data.
