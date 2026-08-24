/* RxOrbit ML foundation — privacy-first, explainable, model-ready.
 *
 * This is the inference layer for the prototype. It uses a transparent
 * baseline model until sufficient pharmacy outcome data exists to train and
 * calibrate a production model. It must NOT present a probability as learned
 * ML unless the model has been trained and calibrated on real outcomes.
 */
(function (global) {
  'use strict';

  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

  function median(values) {
    const a = values.filter(Number.isFinite).sort((x, y) => x - y);
    if (!a.length) return null;
    const m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }

  function buildFeatures(customer, today = new Date()) {
    const purchases = (customer.purchases || [])
      .map(p => new Date(p.date))
      .filter(d => !Number.isNaN(d.getTime()))
      .sort((a, b) => a - b);

    const intervals = [];
    for (let i = 1; i < purchases.length; i++) {
      intervals.push((purchases[i] - purchases[i - 1]) / 86400000);
    }

    const typicalInterval = median(intervals) || customer.typicalIntervalDays || 30;
    const lastPurchase = purchases[purchases.length - 1];
    const daysSincePurchase = lastPurchase
      ? Math.max(0, (today - lastPurchase) / 86400000)
      : null;
    const cycleFit = daysSincePurchase == null
      ? 0
      : Math.exp(-Math.abs(daysSincePurchase - typicalInterval) / Math.max(7, typicalInterval * 0.35));

    const frequency = clamp(purchases.length / 8, 0, 1);
    const recency = daysSincePurchase == null ? 0 : Math.exp(-daysSincePurchase / 120);
    const responseRate = customer.outreach && customer.outreach.sent
      ? clamp((customer.outreach.purchasesAfterContact || 0) / customer.outreach.sent, 0, 1)
      : 0;
    const consent = customer.consent === true ? 1 : 0;
    const value = clamp((customer.averageValue || 0) / 2000, 0, 1);

    return {
      typicalIntervalDays: Math.round(typicalInterval),
      daysSincePurchase: daysSincePurchase == null ? null : Math.round(daysSincePurchase),
      cycleFit,
      frequency,
      recency,
      responseRate,
      consent,
      value,
      purchaseCount: purchases.length
    };
  }

  // Transparent baseline score. Replace weights with a trained/calibrated
  // model after enough labelled outcomes exist. This is intentionally not
  // exposed as a probability in the UI.
  function score(features) {
    const raw =
      0.40 * features.cycleFit +
      0.18 * features.frequency +
      0.12 * features.recency +
      0.15 * features.responseRate +
      0.10 * features.value +
      0.05 * features.consent;
    return Math.round(clamp(raw, 0, 1) * 100);
  }

  function opportunity(customer, today) {
    const features = buildFeatures(customer, today);
    const scoreValue = score(features);
    let level = 'Low';
    if (scoreValue >= 75) level = 'Strong';
    else if (scoreValue >= 55) level = 'Good';

    const reasons = [];
    if (features.daysSincePurchase != null && features.daysSincePurchase >= features.typicalIntervalDays - 3) {
      reasons.push('near the customer’s usual refill cycle');
    }
    if (features.purchaseCount >= 4) reasons.push('has a repeat purchase pattern');
    if (features.responseRate >= 0.35) reasons.push('has responded well to previous outreach');
    if (features.value >= 0.5) reasons.push('has meaningful typical purchase value');
    if (!reasons.length) reasons.push('limited history available — keep confidence conservative');

    return {
      score: scoreValue,
      level,
      reasons,
      features,
      confidenceLabel: features.purchaseCount >= 4 ? 'Supported by history' : 'Early signal'
    };
  }

  function rank(customers, today) {
    return customers
      .map(customer => ({ customer, opportunity: opportunity(customer, today) }))
      .sort((a, b) => b.opportunity.score - a.opportunity.score);
  }

  global.RxOrbitML = { buildFeatures, opportunity, rank };
})(window);
