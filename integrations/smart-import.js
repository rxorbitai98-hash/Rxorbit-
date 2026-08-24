export const FIELD_ALIASES = {
  name: ['name', 'customer_name', 'patient_name', 'customer', 'patient'],
  phone: ['phone', 'mobile', 'mobile_no', 'customer_phone', 'phone_number'],
  preferredLanguage: ['language', 'preferred_language', 'preferredlanguage'],
  consent: ['consent', 'whatsapp_consent', 'whatsapp_opt_in', 'opt_in'],
  product: ['product', 'product_name', 'medicine', 'medicine_name'],
  purchaseDate: ['purchase_date', 'purchased_at', 'date', 'purchaseDate'],
  amount: ['amount', 'total', 'total_amount', 'value'],
};

const clean = value => String(value ?? '').trim();
const key = value => clean(value).toLowerCase().replace(/[\s_-]+/g, '');

export function detectMapping(headers) {
  const mapping = {};
  for (const header of headers) {
    const normalized = key(header);
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (aliases.some(alias => key(alias) === normalized)) mapping[field] = header;
    }
  }
  return mapping;
}

export function validateRows(rows, mapping) {
  const errors = [];
  const seenPhones = new Set();
  rows.forEach((row, index) => {
    const line = index + 2;
    const phone = clean(row[mapping.phone]);
    const name = clean(row[mapping.name]);
    if (!name && !phone) errors.push({ line, field: 'name/phone', message: 'Customer needs a name or phone.' });
    if (phone && !/^[+()\d .-]{7,20}$/.test(phone)) errors.push({ line, field: 'phone', message: 'Invalid phone format.' });
    if (phone && seenPhones.has(phone)) errors.push({ line, field: 'phone', message: 'Duplicate phone in this file.' });
    if (phone) seenPhones.add(phone);
    const amount = mapping.amount ? Number(row[mapping.amount]) : 0;
    if (mapping.amount && row[mapping.amount] !== '' && !Number.isFinite(amount)) errors.push({ line, field: 'amount', message: 'Amount must be numeric.' });
  });
  return errors;
}

export function normalizeImport(rows, mapping) {
  return rows.map(row => ({
    customer: { name: clean(row[mapping.name]), phone: clean(row[mapping.phone]), preferredLanguage: clean(row[mapping.preferredLanguage]), consent: /^(true|yes|1|y)$/i.test(clean(row[mapping.consent])) },
    purchase: { product: clean(row[mapping.product]), purchaseDate: clean(row[mapping.purchaseDate]), amount: Number(row[mapping.amount]) || 0 },
  }));
}

export function importPreview(rows) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const mapping = detectMapping(headers);
  const errors = validateRows(rows, mapping);
  return { headers, mapping, errors, valid: errors.length === 0, preview: normalizeImport(rows.slice(0, 10), mapping) };
}
