---
title: Structured Invoicing (B2B IT Services, 2026)
---

# Technical Documentation: B2B Invoicing Protocol for IT Services (Poland)

This document is a technical reference for issuing compliant B2B invoices by service providers operating under the Ryczałt (lump-sum) tax regime. It covers VAT reporting, income recognition differences, FX handling, and recommended technical metadata.

## 1. Regulatory Context and KSeF

- Adoption Status: KSeF is expected to be mandatory in Poland subject to final legislation and transitional rules.
- Document Format: Invoices are issued as structured XML datasets conforming to the ministerial KSeF FA schema (current version).
- Legal Issuance: An invoice is legally issued only upon successful acceptance by the KSeF platform and assignment of a unique KSeF ID (UUID).
- Verification: Archive the KSeF ID and the Official Receipt (UPO) as primary technical proof of a valid transaction.

## 2. Period Recognition: VAT vs. Ryczałt

- VAT Tax Point (Obowiązek Podatkowy): Determines the VAT reporting period. For IT services, the VAT tax point is typically the earliest of:
  - Service completion (Data sprzedaży);
  - The end of a settlement period for continuous services;
  - Receipt of a prepayment (advance payment).

- Ryczałt Revenue Recognition: For income tax under the ryczałt regime revenue is generally recognized on a cash basis (date of payment receipt), independent from the VAT tax point.

- Issue Date Logic: `Data wystawienia` in the XML must not be set to a future period relative to the KSeF submission timestamp.

## 3. VAT Configuration: Cross‑Border B2B Transactions

- Tax Treatment: Cross‑border B2B services are typically marked as `np` (nie podlega opodatkowaniu) — outside Polish VAT scope.
- Legal Basis: Per Art. 28b of the VAT Act, place of supply is determined by the buyer’s country of establishment.

Required notations:

- EU Clients: The remark "Reverse Charge" ("Odwrotne obciążenie") is mandatory. Include seller and buyer VAT‑EU IDs with country prefixes.
- Non‑EU Clients: The "Reverse Charge" remark is typically optional; VAT treatment is governed by the buyer's jurisdiction.

## 4. Currency Conversion (FX Logic)

- Reporting Requirement: Convert VAT base and relevant totals to PLN for tax reporting.
- Reference Rate: Use the Average Exchange Rate published by the National Bank of Poland (NBP).
- Date Selection: Pull the NBP rate from the last working day immediately preceding the VAT tax point.

Note: If an invoice is issued before the tax point occurs, the invoice date may determine the applicable rate per VAT regulations — document your chosen logic and store the NBP rate date in metadata.

## 5. Precision and Rounding Standards

- Invoice Precision: Record Net, VAT and Gross values with two decimal places (PLN/groszy).
- Tax Summaries: Rounding to whole PLN (rounding up from 0.50) is applied only in specific tax reporting contexts (e.g., tax return totals) and should not be used for individual invoice line items.

## 6. Compliance and Safeguards

- White List (Biała Lista): For domestic payments > 15,000 PLN between VAT taxpayers, use a bank account registered on the official White List to ensure expense deductibility.
- Service Classification: Map services to PKWiU; e.g., `62.01.1` for software development to support eligibility for the 12% ryczałt rate.

## 7. Technical Metadata Summary

| Component                  | Specification                      |
| -------------------------- | ---------------------------------- |
| Data Schema                | KSeF FA (XML)                      |
| VAT Treatment              | `np` (per Art. 28b VAT Act)        |
| FX Logic                   | NBP average (T‑1 of VAT tax point) |
| Validation                 | KSeF UUID + UPO receipt            |
| Tax Rate (ryczałt mapping) | 12% (PKWiU `62.01.1`)              |

## Implementation notes / quick checklist

- Store KSeF response metadata: KSeF ID (UUID), UPO, submission timestamp.
- Populate `Data wystawienia` with actual submission timestamp; populate `Data sprzedaży` with service completion or settlement date as applicable.
- For FX: fetch NBP average rate for chosen reference date, store rate and source in invoice metadata, then convert and round to 2 decimal places.
- Include VAT IDs (with country prefixes) and the "Reverse Charge" remark for cross‑border B2B where required.

---

Last updated: 2026-04-13
