// Provider-neutral API connector framework.
// Production adapters should implement pull() against an authorized provider API.
export class ConnectorError extends Error {
  constructor(message, code = 'CONNECTOR_ERROR') { super(message); this.name = 'ConnectorError'; this.code = code; }
}

export function normalizeCustomer(input = {}) {
  return {
    externalId: String(input.externalId ?? input.id ?? ''),
    name: String(input.name ?? input.customer_name ?? input.patient_name ?? '').trim(),
    phone: String(input.phone ?? input.mobile ?? input.mobile_no ?? input.customer_phone ?? '').trim(),
    preferredLanguage: String(input.preferredLanguage ?? input.language ?? '').trim(),
    consent: input.consent === true || input.whatsapp_consent === true,
  };
}

export function normalizePurchase(input = {}) {
  return {
    externalId: String(input.externalId ?? input.id ?? ''),
    customerExternalId: String(input.customerExternalId ?? input.customer_id ?? input.customerId ?? ''),
    product: String(input.product ?? input.product_name ?? input.medicine ?? input.medicine_name ?? '').trim(),
    purchaseDate: String(input.purchaseDate ?? input.purchase_date ?? input.date ?? '').trim(),
    amount: Number(input.amount ?? input.total ?? input.total_amount ?? 0) || 0,
  };
}

export function createConnector({ id, name, pull, healthcheck }) {
  if (!id || !name || typeof pull !== 'function') throw new ConnectorError('Connector requires id, name and pull()', 'INVALID_CONNECTOR');
  return { id, name, pull, healthcheck: healthcheck ?? (async () => ({ ok: true })) };
}

export async function syncConnector(connector, cursor = null) {
  const result = await connector.pull({ cursor });
  if (!result || !Array.isArray(result.customers) || !Array.isArray(result.purchases)) {
    throw new ConnectorError('Connector returned an invalid normalized payload', 'INVALID_PAYLOAD');
  }
  return {
    customers: result.customers.map(normalizeCustomer),
    purchases: result.purchases.map(normalizePurchase),
    nextCursor: result.nextCursor ?? null,
    syncedAt: new Date().toISOString(),
  };
}
