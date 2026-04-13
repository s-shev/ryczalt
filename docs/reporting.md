# Compliance Reporting — JDG (Ryczałt)

This document defines the mandatory electronic filings and declarations for a Polish sole proprietorship (JDG) operating under the Ryczałt (lump-sum) tax regime. It separates VAT reporting, Social Insurance (ZUS) obligations, and Income Tax (PIT) recognition rules and lists filing triggers, key data elements, and deadlines (Reporting Calendar Summary 2026).

## 1. VAT Reporting (JPK & Summary Statements)

> Applies only to entities that are registered as active VAT taxpayers.

### JPK_V7 (Standard Audit File)

- Trigger: Mandatory for VAT-registered taxpayers.
- Variants: `JPK_V7M` for monthly filers and `JPK_V7K` for quarterly filers.
- Data fields: Includes domestic and cross-border operations; cross-border B2B services supplied outside Poland must be reported in dedicated JPK fields (follow current official JPK schema version and mappings).
- Deadline: 25th day of the month following the reporting period.

### VAT-UE (Summary Statement)

- Trigger: Required for intra-Community B2B services under Art. 28b of the VAT Act when the recipient is an EU VAT-registered business and the transaction is reportable in VAT-UE.
- Data content: Client VAT-EU ID (VAT ID) and aggregate transaction value in PLN.
- Deadline: 25th day of the month following the reporting period.

### UPO (Urzędowe Poświadczenie Odbioru)

- Requirement: An UPO must be generated and retained for every electronic submission (JPK, VAT-UE, ZUS, PIT). The UPO is the primary proof of successful filing and must be archived.

## 2. Social Insurance Reporting (ZUS)

### ZUS DRA (Monthly Declaration)

- Trigger: Generally submitted monthly for active contributors. Even in simplified cases with unchanged contribution amounts, a DRA is normally filed with the current values rather than omitted.
- Specifics for Ryczałt: Health insurance contributions for Ryczałt taxpayers are determined using annual revenue thresholds and rules defined by current regulations (update parameters yearly).
- Deadline: 20th day of the month following the reporting period.

### Annual Health Contribution Reconciliation (Roczne rozliczenie składki zdrowotnej)

- Description: Annual reconciliation comparing monthly health insurance payments to the final annual obligation computed from the taxpayer’s annual revenue.
- Trigger: Mandatory annually for all Ryczałt taxpayers.
- Submission: Included in the ZUS DRA for April (filed in May).
- Deadline: May 20th.

## 3. Income Tax Reporting (PIT — Ryczałt)

Under Ryczałt, the monthly tax liability is settled by payment; formal annual reporting occurs once per year.

### PIT-28 (Annual Tax Return)

- Trigger: Mandatory for taxpayers who used the Ryczałt method during the fiscal year.
- Revenue recognition: Ryczałt revenue is generally cash-based (recognized on receipt of payment), and therefore recognition can differ from VAT tax points.
- Deadline: April 30th of the year following the tax year.

## 4. Reporting Calendar Summary (2026)

| Frequency |             Report Symbol | Fiscal Domain | Trigger Condition                   | Deadline         |
| --------- | ------------------------: | ------------- | ----------------------------------- | ---------------- |
| Monthly   |                   ZUS DRA | Social        | Active JDG (standard setup)         | 20th             |
| Monthly   |                   JPK_V7M | VAT           | Active VAT registration (monthly)   | 25th             |
| Quarterly |                   JPK_V7K | VAT           | Active VAT registration (quarterly) | 25th (quarterly) |
| Monthly   |                    VAT-UE | VAT           | Art. 28b services to EU VAT clients | 25th             |
| Annual    |                    PIT-28 | Income Tax    | Active Ryczałt status during year   | April 30th       |
| Annual    | ZUS Health Reconciliation | Social        | Annual revenue adjustment (Ryczałt) | May 20th         |

## 5. Technical Compliance & Archiving

- Authentication: Electronic submissions must use accepted authentication methods (Qualified Electronic Signature, Profil Zaufany, or other authorized authentication mechanisms supported by the receiving authority).
- Suspension exception: During business suspension (`zawieszenie`), most recurring reporting obligations are paused; however, certain VAT duties (e.g., corrections, intra‑EU adjustments) may still apply depending on transaction types.
- Retention: Retain all records (XML files, generated PDFs, UPOs, and supporting documentation) until the end of the 5th year following the year in which the tax obligation arose.

## Implementation / Practical Notes

- Keep JPK schema versions and field mappings up to date — the JPK schema is versioned and occasionally revised; map cross-border services to the official fields for the schema year used for submission.
- Maintain a secure archive of UPOs tied to each electronic submission (ideally stored alongside the submitted file and metadata: submission date, filing period, and filing method).
- For Ryczałt health contribution calculations and thresholds, source annual parameters from official guidance and store them in a dedicated data module (e.g., `src/data/ryczalt2026.ts`) so the calculator and reports remain auditable and updatable.

## References

- Polish tax and social security regulations (current year guidance and statutory deadlines).
- Official JPK (SAF-T) schema and submission guidance from the Ministry of Finance.
