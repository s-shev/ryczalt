import Decimal from "decimal.js";
import { RYCZALT_2026 } from "../data/ryczalt2026";

export type ZusStage = "ulga" | "maly" | "duzy";

export type CalcInput = {
  grossIncome: number;
  ryczaltRate: number;
  zusStage: ZusStage;
  sicknessPaid: boolean;
};

export type SocialBreakdown = {
  pension: Decimal;
  disability: Decimal;
  sickness: Decimal;
  accident: Decimal;
  laborFund: Decimal;
};

export type CalcOutput = {
  annualRevenue: Decimal;
  tierMultiplier: Decimal;
  healthContribution: Decimal;
  socialInsuranceBase: Decimal;
  socialBreakdown: SocialBreakdown;
  socialInsurance: Decimal;
  taxableBaseRaw: Decimal;
  taxableBaseRounded: Decimal;
  taxDueRaw: Decimal;
  taxDue: Decimal;
  zusTotal: Decimal;
  netIncome: Decimal;
};

const toDecimal = (value: number) => new Decimal(value || 0);
const roundToFullPln = (value: Decimal) =>
  value.toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

const resolveTierMultiplier = (annualRevenue: Decimal) => {
  const { tierThresholds, tierMultipliers } = RYCZALT_2026;
  if (annualRevenue.lte(tierThresholds.lowMax)) {
    return new Decimal(tierMultipliers.low);
  }
  if (annualRevenue.lte(tierThresholds.midMax)) {
    return new Decimal(tierMultipliers.mid);
  }
  return new Decimal(tierMultipliers.high);
};

const calcSocialBreakdown = (
  zusStage: ZusStage,
  sicknessPaid: boolean,
  base: Decimal,
): SocialBreakdown => {
  if (zusStage === "ulga") {
    return {
      pension: new Decimal(0),
      disability: new Decimal(0),
      sickness: new Decimal(0),
      accident: new Decimal(0),
      laborFund: new Decimal(0),
    };
  }

  const { socialRates } = RYCZALT_2026;
  return {
    pension: base.mul(socialRates.pension),
    disability: base.mul(socialRates.disability),
    sickness: sicknessPaid ? base.mul(socialRates.sickness) : new Decimal(0),
    accident: base.mul(socialRates.accident),
    laborFund:
      zusStage === "duzy" ? base.mul(socialRates.laborFund) : new Decimal(0),
  };
};

/**
 * Calculates monthly ryczalt figures based on the 2026 parameters in docs/tax-notes.md.
 * Assumes the gross income is provided as a monthly value.
 */
export const calcRyczalt = (input: CalcInput): CalcOutput => {
  const grossIncome = toDecimal(Math.max(0, input.grossIncome));
  const annualRevenue = grossIncome.mul(12);
  const tierMultiplier = resolveTierMultiplier(annualRevenue);

  const healthContribution = new Decimal(RYCZALT_2026.healthContributionRate)
    .mul(RYCZALT_2026.averageWageEnterpriseSector)
    .mul(tierMultiplier);

  let socialInsuranceBase = new Decimal(0);
  if (input.zusStage === "maly") {
    socialInsuranceBase = new Decimal(
      RYCZALT_2026.socialInsuranceBase.malyZUS,
    ).mul(RYCZALT_2026.minimumSalary);
  }
  if (input.zusStage === "duzy") {
    socialInsuranceBase = new Decimal(
      RYCZALT_2026.socialInsuranceBase.duzyZUS,
    ).mul(RYCZALT_2026.forecastedAverageMonthlyWage);
  }

  const socialBreakdown = calcSocialBreakdown(
    input.zusStage,
    input.sicknessPaid,
    socialInsuranceBase,
  );
  const socialInsurance = Object.values(socialBreakdown).reduce(
    (sum, value) => sum.add(value),
    new Decimal(0),
  );

  const taxableBaseRaw = Decimal.max(
    grossIncome.sub(healthContribution.mul(0.5)).sub(socialInsurance),
    0,
  );
  const taxableBaseRounded = roundToFullPln(taxableBaseRaw);
  const taxDueRaw = taxableBaseRounded.mul(input.ryczaltRate);
  const taxDue = roundToFullPln(taxDueRaw);
  const zusTotal = healthContribution.add(socialInsurance);
  const netIncome = grossIncome.sub(taxDue).sub(zusTotal);

  return {
    annualRevenue,
    tierMultiplier,
    healthContribution,
    socialInsuranceBase,
    socialBreakdown,
    socialInsurance,
    taxableBaseRaw,
    taxableBaseRounded,
    taxDueRaw,
    taxDue,
    zusTotal,
    netIncome,
  };
};
