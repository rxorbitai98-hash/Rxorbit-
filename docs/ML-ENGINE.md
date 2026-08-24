# RxOrbit Machine Learning Engine

## Implemented now

The repository now contains `rxorbit-ml.js`, an explainable, privacy-first ML foundation that:

- extracts refill-cycle, recency, frequency, response, value and consent features;
- produces an opportunity ranking;
- gives human-readable reasons for each opportunity;
- distinguishes `Strong`, `Good`, and `Low` opportunity levels;
- avoids presenting the baseline score as a calibrated probability;
- is ready to be replaced by a trained/calibrated model when labelled pharmacy outcomes exist.

## Why this design

RxOrbit needs real outcomes to learn: purchase after outreach, no purchase, reply, not-now, suppression, timing and other consented events. A static demo must not pretend that hand-written weights are a trained ML model.

## Production ML path

1. Normalize customer and purchase data from connectors/CSV.
2. Create labelled outcomes from outreach and purchase events.
3. Train a pharmacy-safe model for refill/opportunity prediction.
4. Validate with time-based holdout data to avoid leakage.
5. Calibrate probabilities before displaying them as probabilities.
6. Evaluate precision/recall and business metrics, with emphasis on precision because RxOrbit should surface genuine opportunities rather than every customer.
7. Monitor drift and retrain when behavior changes.
8. Keep pharmacy/customer data isolated and use minimum necessary data.

## Feature groups

- Recency: days since last purchase.
- Frequency: repeat purchase count.
- Cycle fit: closeness to the customer's typical interval.
- Response: historical purchase-after-outreach rate.
- Value: normalized typical purchase value.
- Consent: whether outreach is permitted.

## Future models

- Refill-date prediction
- Opportunity ranking
- Response likelihood
- Best outreach timing
- Message/template optimization
- Customer-specific behavior models
- Pharmacy-specific adaptation
- Revenue attribution and learning loop

The intended flywheel is:

`DATA → PREDICT → PRIORITIZE → EXPLAIN → PERSONALIZE → CONSENT → OUTREACH → REPLY → PURCHASE → REVENUE → LEARN`
