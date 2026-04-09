# ryczalt

Personal research project for simplifying Polish ryczałt (flat-rate) tax calculations.

## What's here

- React + TypeScript + MUI web calculator (Vite)
- Calculation notes and parameters for 2026 in [docs/tax-notes.md](docs/tax-notes.md)
- References to official sources (GUS, Monitor Polski, ZUS)

## Current scope

- Gross-to-net calculator for ryczałt tax + ZUS
- ZUS stages (Ulga na start, Maly ZUS, Duzy ZUS)
- Optional sickness insurance toggle
- Parameter values and rate tables for 2026 (hard-coded)

## Run locally

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Run tests: `npm test`

## Notes

- The calculator currently assumes monthly gross income and annualizes it for tier selection.
