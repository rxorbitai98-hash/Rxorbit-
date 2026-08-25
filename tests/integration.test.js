import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEcogreenPayload, calculateOpportunity, buildPreparedMessage } from '../src/rxorbit.js';

test('normalizes Ecogreen customer and sales data into RxOrbit records', () => {
  const result = normalizeEcogreenPayload({
    customers: [{ customerId: 'C-101', name: 'Raj Sharma', mobile: '9876543210', language: 'English' }],
    sales: [
      { invoiceId: 'INV-1', customerId: 'C-101', date: '2026-05-27', product: 'Diabetes Care 30', quantity: 30, amount: 450 },
      { invoiceId: 'INV-2', customerId: 'C-101', date: '2026-06-26', product: 'Diabetes Care 30', quantity: 30, amount: 450 },
      { invoiceId: 'INV-3', customerId: 'C-101', date: '2026-07-26', product: 'Diabetes Care 30', quantity: 30, amount: 450 }
    ]
  });
  assert.equal(result.customers.length, 1);
  assert.equal(result.purchases.length, 3);
  assert.equal(result.customers[0].id, 'C-101');
});

test('scores a regular 30-day rebuy as a high opportunity', () => {
  const score = calculateOpportunity({ purchaseDates: ['2026-05-27', '2026-06-26', '2026-07-26'], today: '2026-08-25' });
  assert.ok(score >= 85);
});

test('builds a prepared message without requiring pharmacist typing', () => {
  const message = buildPreparedMessage({ name: 'Raj Sharma', language: 'English', dueLabel: 'today' });
  assert.match(message, /Raj Sharma/);
  assert.match(message, /refill|medicine/i);
});
