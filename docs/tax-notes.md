# Ryczałt 2026 - calculation notes

Clean reference for the formulas and parameters used in the ryczałt tax calculation.

## Terms

- Gross income (przychod): income before any deductions
- Net income: gross income minus tax and ZUS
- Ryczałt rate: rate for the activity (2% - 17%)
- Health contribution: składka zdrowotna
- Social insurance: sum of pension, disability, sickness, accident, and labor fund
- ZUS total: health contribution plus social insurance
- Social insurance base: base used for the social insurance components
- Tier multiplier: multiplier for health contribution based on yearly revenue

## High-level formulas

```
Net income = Gross income - Tax due - ZUS total

Taxable base (raw) = Gross income - 0.5 * Health contribution - Social insurance

Taxable base (rounded to full PLN) = round(Taxable base raw)

Tax due (raw) = Taxable base (rounded) * Ryczałt rate

Tax due (rounded to full PLN) = round(Tax due raw)

ZUS total = Health contribution + Social insurance

Social insurance = Pension + Disability + Sickness + Accident + Labor Fund
```

## Tax rounding (Ordynacja podatkowa)

Polish tax law rounds monetary tax values to full PLN using standard mathematical rounding, not always up.

- Amounts ending with 0.01-0.49 PLN are rounded down.
- Amounts ending with 0.50-0.99 PLN are rounded up.

Legal basis:

- Ustawa z dnia 29 sierpnia 1997 r. - Ordynacja podatkowa, Art. 63 § 1
- ISAP: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19971370926 (search for "Art. 63")

## ZUS stages (JDG)

- Ulga na start: first 6 months
- Maly ZUS: next 24 months
- Duzy ZUS: after 24 months

## Component coverage by stage

| Component       | Ulga | Maly ZUS | Duzy ZUS |
| --------------- | ---- | -------- | -------- |
| Health          | ✅   | ✅       | ✅       |
| Pension         | ❌   | ✅       | ✅       |
| Disability      | ❌   | ✅       | ✅       |
| Accident        | ❌   | ✅       | ✅       |
| Sickness        | ❌   | Optional | Optional |
| Labor Fund (FP) | ❌   | ❌       | ✅       |

## Parameters (2026)

### Core values

| Parameter                             | Value        | Notes                                                                                                                                                          | Source                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Average wage in the enterprise sector | 9,228.64 PLN | GUS wage: use the value marked as "wynagrodzenie w sektorze przedsiębiorstw + włącznie z wypłatami z zysku"; published late January, applies for the next year | [GUS announcement (publikacje.new.stat.gov.pl)](https://publikacje.new.stat.gov.pl/portal-publikacje/obwieszczenie-prezesa-gus-w-w-sprawie-przecietnego-miesiecznego-wynagrodzenia-w-sektorze-przedsiebiorstw-bez-wyplat-nagrod-z-zysku-w-czwartym-kwartale-2025-r)<br>[GUS PDF (stat.gov.pl)](https://stat.gov.pl/sygnalne/komunikaty-i-obwieszczenia/lista-komunikatow-i-obwieszczen/obwieszczenie-w-sprawie-przecietnego-miesiecznego-wynagrodzenia-w-sektorze-przedsiebiorstw-bez-wyplat-nagrod-z-zysku-w-czwartym-kwartale-2025-r-%2C59%2C49.html?pdf=1&utm_source=chatgpt.com) |
| Forecasted average monthly wage       | 9,420.00 PLN | Art 24. "Prognozowane przeciętne miesięczne wynagrodzenie"                                                                                                     | [Monitor Polski 2026/62](https://monitorpolski.gov.pl/DU/rok/2026/pozycja/62)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Minimum salary                        | 4,806.00 PLN | Minimum salary                                                                                                                                                 | [ZUS minimum and average wages](https://www.zus.pl/baza-wiedzy/skladki-wskazniki-odsetki/wskazniki/minimalne-i-przecietne-wynagrodzenie)                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Accident insurance rate               | 1.67%        | Confirm yearly in ZUS                                                                                                                                          | [ZUS contributions](https://lang.zus.pl/finances/contributions?utm_source=chatgpt.com)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

### Tier multiplier (by yearly revenue)

| Yearly revenue       | Tier multiplier |
| -------------------- | --------------- |
| <= 60,000 PLN        | 0.60            |
| 60,000 - 300,000 PLN | 1.00            |
| > 300,000 PLN        | 1.80            |

### Base for social insurance

```
Maly ZUS: Social insurance base = 0.30 * Minimum salary
Duzy ZUS: Social insurance base = 0.60 * Forecasted average monthly wage
```

## Calculation details

### Health contribution

```
Health contribution = 0.09 * Average wage in the enterprise sector * Tier multiplier
```

### Social insurance components

```
Pension = 0.1952 * Social insurance base
Disability = 0.08 * Social insurance base
Sickness = 0.0245 * Social insurance base
Accident = Accident insurance rate * Social insurance base
Labor Fund = 0.0245 * Social insurance base
```
