export function normalizeEcogreenPayload(payload) {
  const customers = (payload.customers || []).map((c) => ({
    id: c.customerId,
    name: c.name,
    mobile: c.mobile,
    language: c.language || 'English'
  }));
  const purchases = (payload.sales || []).map((s) => ({
    invoiceId: s.invoiceId,
    customerId: s.customerId,
    date: s.date,
    product: s.product,
    quantity: s.quantity,
    amount: s.amount
  }));
  return { customers, purchases };
}

function averageInterval(dates) {
  if (dates.length < 2) return 30;
  const sorted = [...dates].sort();
  const intervals = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push((new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000);
  }
  return intervals.reduce((a, b) => a + b, 0) / intervals.length;
}

export function calculateOpportunity({ purchaseDates, today }) {
  if (!purchaseDates?.length) return 0;
  const sorted = [...purchaseDates].sort();
  const last = new Date(sorted.at(-1));
  const now = new Date(today);
  const daysSince = Math.max(0, Math.round((now - last) / 86400000));
  const interval = averageInterval(sorted);
  const timing = Math.max(0, 1 - Math.abs(daysSince - interval) / Math.max(interval, 1));
  const regularity = sorted.length >= 3 ? 1 : 0.65;
  return Math.min(99, Math.round(55 + timing * 30 + regularity * 10));
}

export function buildPreparedMessage({ name, language = 'English', dueLabel = 'today' }) {
  if (language.toLowerCase().startsWith('mar')) {
    return `नमस्कार ${name}, तुमच्या नियमित औषधांचा रिफिल ${dueLabel} अपेक्षित आहे. तुम्हाला औषधे हवी असल्यास कृपया कळवा. STOP to opt out.`;
  }
  if (language.toLowerCase().startsWith('hin')) {
    return `नमस्ते ${name}, आपकी नियमित दवा का रिफिल ${dueLabel} अपेक्षित है। अगर आपको दवा चाहिए तो कृपया बताएं। STOP to opt out.`;
  }
  return `Hi ${name}, your regular medicine refill is due ${dueLabel}. Reply if you would like us to prepare it for you. STOP to opt out.`;
}

export function buildOpportunities(payload, today) {
  const normalized = normalizeEcogreenPayload(payload);
  return normalized.customers.map((customer) => {
    const purchases = normalized.purchases.filter((p) => p.customerId === customer.id);
    const score = calculateOpportunity({ purchaseDates: purchases.map((p) => p.date), today });
    const sorted = purchases.map((p) => p.date).sort();
    const last = sorted.at(-1);
    const interval = Math.round(averageInterval(sorted));
    const dueDate = last ? new Date(new Date(last).getTime() + interval * 86400000) : new Date(today);
    const daysToDue = Math.round((dueDate - new Date(today)) / 86400000);
    const dueLabel = daysToDue <= 0 ? 'today' : `in ${daysToDue} days`;
    return { ...customer, purchases, score, dueLabel, message: buildPreparedMessage({ ...customer, dueLabel }) };
  }).sort((a, b) => b.score - a.score);
}

export const demoEcogreenPayload = {
  customers: [
    { customerId: 'C-101', name: 'Raj Sharma', mobile: '9876543210', language: 'English' },
    { customerId: 'C-102', name: 'Priya Patil', mobile: '9876543211', language: 'Marathi' },
    { customerId: 'C-103', name: 'Amit Joshi', mobile: '9876543212', language: 'Hindi' },
    { customerId: 'C-104', name: 'Neha Kulkarni', mobile: '9876543213', language: 'English' }
  ],
  sales: [
    { invoiceId: 'INV-1001', customerId: 'C-101', date: '2026-05-27', product: 'Diabetes Care 30', quantity: 30, amount: 450 },
    { invoiceId: 'INV-1002', customerId: 'C-101', date: '2026-06-26', product: 'Diabetes Care 30', quantity: 30, amount: 450 },
    { invoiceId: 'INV-1003', customerId: 'C-101', date: '2026-07-26', product: 'Diabetes Care 30', quantity: 30, amount: 450 },
    { invoiceId: 'INV-1004', customerId: 'C-102', date: '2026-06-01', product: 'BP Care 30', quantity: 30, amount: 390 },
    { invoiceId: 'INV-1005', customerId: 'C-102', date: '2026-07-01', product: 'BP Care 30', quantity: 30, amount: 390 },
    { invoiceId: 'INV-1006', customerId: 'C-103', date: '2026-06-05', product: 'Heart Care 30', quantity: 30, amount: 520 },
    { invoiceId: 'INV-1007', customerId: 'C-103', date: '2026-07-05', product: 'Heart Care 30', quantity: 30, amount: 520 },
    { invoiceId: 'INV-1008', customerId: 'C-104', date: '2026-07-15', product: 'Vitamin Care', quantity: 15, amount: 250 }
  ]
};
