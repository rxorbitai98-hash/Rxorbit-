# RxOrbit Local Connector

## Purpose

A small pharmacy-side agent for software that runs locally or has no usable cloud API.

## Flow

`Pharmacy software -> local agent -> normalized batch -> authenticated RxOrbit ingestion endpoint`

## Requirements

- Runs as a least-privileged local service.
- Supports an approved source adapter (API, database read, or exported file).
- Never asks for or transmits the pharmacy software administrator password.
- Sends only fields approved by the pharmacy.
- Uses short-lived device enrollment credentials and TLS.
- Queues encrypted batches when offline and retries with backoff.
- Reports connector health, last sync, records read and last error.
- Supports pause/revoke from RxOrbit.
- Does not expose customer data through local logs.

## Adapter contract

Each source adapter must return the provider-neutral customer and purchase objects consumed by `integrations/connector-core.js`.

The local connector is an integration transport, not an ML engine. Prediction happens after records enter the normalized RxOrbit data model.
