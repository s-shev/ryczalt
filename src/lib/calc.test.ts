import { describe, expect, it } from "vitest";
import Decimal from "decimal.js";
import { calcRyczalt } from "./calc";

describe("calcRyczalt", () => {
  it("calculates ulga na start without social insurance", () => {
    const result = calcRyczalt({
      grossIncome: 10000,
      ryczaltRate: 0.12,
      zusStage: "ulga",
      sicknessPaid: true,
    });

    const expectedHealth = new Decimal(0.09).mul(9228.64).mul(1.0);
    const expectedTaxBaseRaw = new Decimal(10000).sub(expectedHealth.mul(0.5));
    const expectedTaxBaseRounded = expectedTaxBaseRaw.toDecimalPlaces(
      0,
      Decimal.ROUND_HALF_UP,
    );
    const expectedTaxRaw = expectedTaxBaseRounded.mul(0.12);
    const expectedTax = expectedTaxRaw.toDecimalPlaces(
      0,
      Decimal.ROUND_HALF_UP,
    );
    const expectedNet = new Decimal(10000).sub(expectedTax).sub(expectedHealth);

    expect(result.socialInsurance.toNumber()).toBeCloseTo(0, 6);
    expect(result.healthContribution.toNumber()).toBeCloseTo(
      expectedHealth.toNumber(),
      6,
    );
    expect(result.taxableBaseRaw.toNumber()).toBeCloseTo(
      expectedTaxBaseRaw.toNumber(),
      6,
    );
    expect(result.taxableBaseRounded.toNumber()).toBe(
      expectedTaxBaseRounded.toNumber(),
    );
    expect(result.taxDueRaw.toNumber()).toBeCloseTo(
      expectedTaxRaw.toNumber(),
      6,
    );
    expect(result.taxDue.toNumber()).toBeCloseTo(expectedTax.toNumber(), 6);
    expect(result.netIncome.toNumber()).toBeCloseTo(expectedNet.toNumber(), 6);
  });

  it("rounds taxable base to nearest full PLN (.49 down, .50 up)", () => {
    const resultDown = calcRyczalt({
      grossIncome: 1249.66328,
      ryczaltRate: 0.12,
      zusStage: "ulga",
      sicknessPaid: true,
    });

    const resultUp = calcRyczalt({
      grossIncome: 1249.67328,
      ryczaltRate: 0.12,
      zusStage: "ulga",
      sicknessPaid: true,
    });

    expect(resultDown.taxableBaseRaw.toNumber()).toBeCloseTo(1000.49, 6);
    expect(resultDown.taxableBaseRounded.toNumber()).toBe(1000);

    expect(resultUp.taxableBaseRaw.toNumber()).toBeCloseTo(1000.5, 6);
    expect(resultUp.taxableBaseRounded.toNumber()).toBe(1001);
  });

  it("rounds tax due to nearest full PLN after applying rate", () => {
    const resultDown = calcRyczalt({
      grossIncome: 1253.37328,
      ryczaltRate: 0.12,
      zusStage: "ulga",
      sicknessPaid: true,
    });

    const resultUp = calcRyczalt({
      grossIncome: 1254.37328,
      ryczaltRate: 0.12,
      zusStage: "ulga",
      sicknessPaid: true,
    });

    expect(resultDown.taxableBaseRounded.toNumber()).toBe(1004);
    expect(resultDown.taxDueRaw.toNumber()).toBeCloseTo(120.48, 6);
    expect(resultDown.taxDue.toNumber()).toBe(120);

    expect(resultUp.taxableBaseRounded.toNumber()).toBe(1005);
    expect(resultUp.taxDueRaw.toNumber()).toBeCloseTo(120.6, 6);
    expect(resultUp.taxDue.toNumber()).toBe(121);
  });
});
