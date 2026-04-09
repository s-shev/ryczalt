# Copilot Instructions for ryczalt-2026

## Project Overview

Personal research project analyzing the Polish "ryczałt" (flat-rate) tax system, now implemented as a web calculator.

## Tech Stack

- **Runtime**: React + TypeScript (Vite)
- **UI**: Material UI (MUI)
- **Precision**: `decimal.js`

## Development Context

### Project Purpose

This project focuses on Polish tax law, specifically the ryczałt system - a flat-rate taxation method used by small businesses and freelancers in Poland. When implementing features:

- Assume financial calculations require precision (use appropriate decimal libraries)
- Tax calculations must reference current 2026 Polish tax law
- Consider different ryczałt rates (2%, 3%, 5.5%, 8.5%, 12%, 14%, 15%, 17%) for different business activities

### Existing Reference Material

- Primary formulas and parameters are documented in [docs/tax-notes.md](docs/tax-notes.md); keep any implementation aligned with those formulas and sources.
- 2026 parameters should stay in a dedicated data module (currently [src/data/ryczalt2026.ts](src/data/ryczalt2026.ts)).

### Code Standards

- Use clear variable names that reflect Polish tax terminology where appropriate (e.g., `przychod`, `stawkaRyczaltu`)
- Include JSDoc comments explaining tax calculation logic and legal references
- Write tests for all tax calculations to ensure accuracy

### Key Considerations

- **Precision**: Use libraries like `decimal.js` or `big.js` for financial calculations
- **Date sensitivity**: Tax rates and thresholds change yearly; make year-based calculations configurable
- **Validation**: Validate inputs against Polish business activity categories (PKD codes)

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Run tests: `npm test`

## Helpful Resources

- Polish tax law uses zloty (PLN) as currency
- Ryczałt eligibility depends on annual revenue thresholds and business type
- Consider ZUS (social insurance) contributions alongside tax calculations
