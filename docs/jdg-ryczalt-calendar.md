# JDG (Ryczalt) Compliance Calendar - 2026

Practical checklist for a Polish sole proprietorship (JDG) on ryczalt, providing B2B services (including EU clients).

> Status note (2026-04-15): This is an operational checklist, not legal advice. For edge cases, confirm with your accountant.

## Monthly Calendar

### 1. Invoicing (previous month)

- Internal target: 1st-5th day of month.
- Legal latest date (typical VAT invoice rule): by 15th day of month following the service month.
- Action:
  - Issue invoice for completed settlement period.
  - Include seller VAT-UE ID (usually `PL...`) and buyer VAT ID with country prefix.
  - For EU B2B services under art. 28b: add `Reverse Charge` / `Odwrotne obciazenie`.
  - VAT marking is typically `np` (outside Polish VAT scope) for such services.
- FX (invoice/tax reporting amount in PLN):
  - Use NBP average rate from the last working day before the VAT tax point (not automatically "last day of previous month").
- KSeF:
  - Keep KSeF ID and UPO if invoice is sent via KSeF.
  - Follow current legal status/schedule for mandatory KSeF rollout.

### 2. ZUS DRA declaration

- Deadline: by the 20th of month following the settlement month.
- Action:
  - Submit ZUS DRA in PUE ZUS (or via accounting software/office).
- Note:
  - Health contribution on ryczalt depends on annual revenue bracket:
    - up to 60,000 PLN
    - 60,000-300,000 PLN
    - above 300,000 PLN
  - Track cumulative yearly revenue to switch bracket when required.

### 3. ZUS payment

- Deadline: by the 20th of month following the settlement month.
- Action:
  - Pay ZUS exactly according to submitted DRA.

### 4. Ryczalt income tax advance (e.g., 12%)

- Deadline: by the 20th of month following the settlement month.
- Action:
  - Calculate ryczalt from revenue recognized for income-tax purposes.
  - Pay to your tax micro-account (`mikrorachunek podatkowy`).
- Important notes:
  - No monthly declaration to Tax Office (payment only; annual filing is PIT-28).
  - Deduct from tax base:
    - 100% of social contributions paid in the given calendar month,
    - 50% of health contribution paid in the given calendar month.

### 5. Exchange differences (roznice kursowe)

- Event-driven: each time foreign-currency payment is received.
- Action:
  - Compare PLN value at invoicing/tax-point conversion vs PLN at payment-date conversion.
- Tax effect on ryczalt:
  - Positive difference: increases taxable revenue.
  - Negative difference: does not reduce tax base on ryczalt.

### 6. VAT declarations (only if you are VAT-registered)

- Deadline: by the 25th of month following period.
- Action:
  - JPK_V7M (or JPK_V7K if quarterly regime applies): submit VAT register file.
  - VAT-UE: submit when reportable intra-EU B2B services occurred.
- Note:
  - Archive UPO for each submission.

## Annual Calendar

### 1. Collect ZUS base data for the new year

- Deadline window: January 21 - February 1 (practical control window).
- Goal:
  - Confirm yearly parameters used for health and social contribution calculations.

#### 1.1 Health insurance metric

- Data:
  - Average wage in the enterprise sector in Q4 (including payments from profit).
- Source:
  - GUS announcement.
- Why:
  - Used to calculate health contribution on ryczalt.
  - Usually published around January 20-22.

#### 1.2 Social ZUS metric (Standard/Big ZUS)

- Data:
  - Forecasted average monthly wage.
- Source:
  - Budget Act / official yearly regulations.
- Why:
  - Defines the base for standard social contributions (e.g., pension and disability in Big ZUS).
  - Typically known in late December.

#### 1.3 Maly ZUS metric (preferential period)

- Data:
  - Minimum salary (minimalne wynagrodzenie).
- Source:
  - Government regulation/decree.
- Why:
  - Defines the base for preferential social contributions (Maly ZUS period).
  - Typically known in September/October of the previous year.

### 2. PIT-28 annual return

- Deadline: February 15 - April 30.
- Action:
  - File PIT-28 for previous year.
  - Reconcile annual tax and settle any underpayment/overpayment.

### 3. Annual health contribution reconciliation (ZUS)

- Deadline: by May 20.
- Action:
  - Performed in ZUS DRA for April (filed in May).
  - Recalculate annual health contribution from final annual revenue.
  - Pay shortfall by deadline or request refund if overpaid.
