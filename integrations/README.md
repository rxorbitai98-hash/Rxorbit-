# RxOrbit Integration Hub

RxOrbit accepts pharmacy data through three connector paths:

1. API Connector Framework — adapters for authorized third-party APIs.
2. RxOrbit Local Connector — a local agent pattern for on-premise pharmacy software; it sends only normalized, authorized records over TLS and never requires a third-party admin password.
3. Smart CSV/Excel Import — schema detection, column mapping, validation, duplicate detection, preview and import reporting.

All paths normalize into the same RxOrbit records: customer, purchase, product, consent and outreach outcome.

## Security principles

- Explicit pharmacy authorization is required.
- Prefer read-only source access.
- Store provider secrets server-side; never expose them in browser code.
- Encrypt transport and sensitive data at rest.
- Log connector status and sync events without logging unnecessary customer data.
- Keep tenant data isolated.

## ML handoff

Normalized purchase/customer events are the input to the RxOrbit opportunity engine. The connector layer itself must not fabricate predictions or customer outcomes.
