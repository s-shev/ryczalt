import { useMemo, useState } from "react";
import { Grid, Stack } from "@mui/material";
import { calcRyczalt, ZusStage } from "../lib/calc";
import AssumptionsPanel from "../components/AssumptionsPanel";
import BreakdownPanel from "../components/BreakdownPanel";
import CalculatorHeader from "../components/CalculatorHeader";
import InputsPanel from "../components/InputsPanel";
import NetIncomePanel from "../components/NetIncomePanel";

const CalculatorPage = () => {
  const [grossIncome, setGrossIncome] = useState("15000");
  const [rate, setRate] = useState<number>(0.12);
  const [zusStage, setZusStage] = useState<ZusStage>("maly");
  const [sicknessPaid, setSicknessPaid] = useState(true);

  const grossValue = useMemo(() => {
    const normalized = grossIncome.replace(/,/g, ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [grossIncome]);

  const result = useMemo(
    () =>
      calcRyczalt({
        grossIncome: grossValue,
        ryczaltRate: rate,
        zusStage,
        sicknessPaid,
      }),
    [grossValue, rate, zusStage, sicknessPaid],
  );

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <CalculatorHeader />

      <Grid
        container
        gap={{ xs: 2, md: "24px" }}
        spacing={{ xs: 0, md: 0 }}
        className="section-fade delay-1"
      >
        <Grid
          item
          xs={12}
          md={6}
          flex="1 1 auto !important"
          maxWidth={{ md: "calc(50% - 24px) !important" }}
        >
          <InputsPanel
            grossIncome={grossIncome}
            onGrossIncomeChange={setGrossIncome}
            rate={rate}
            onRateChange={setRate}
            zusStage={zusStage}
            onZusStageChange={setZusStage}
            sicknessPaid={sicknessPaid}
            onSicknessPaidChange={setSicknessPaid}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          flex="1 1 auto !important"
          maxWidth={{ md: "calc(50% - 24px) !important" }}
        >
          <Stack spacing={{ xs: 2, md: 3 }}>
            <NetIncomePanel
              netIncome={result.netIncome}
              taxDue={result.taxDue}
              taxDueRaw={result.taxDueRaw}
              zusTotal={result.zusTotal}
              grossIncome={grossValue}
              healthContribution={result.healthContribution}
              socialInsurance={result.socialInsurance}
              taxableBaseRaw={result.taxableBaseRaw}
              taxableBaseRounded={result.taxableBaseRounded}
              ryczaltRate={rate}
            />

            <BreakdownPanel
              healthContribution={result.healthContribution}
              annualRevenue={result.annualRevenue}
              socialBreakdown={result.socialBreakdown}
              socialInsurance={result.socialInsurance}
              socialInsuranceBase={result.socialInsuranceBase}
              tierMultiplier={result.tierMultiplier}
              zusStage={zusStage}
              sicknessPaid={sicknessPaid}
            />
          </Stack>
        </Grid>
      </Grid>

      <AssumptionsPanel />
    </Stack>
  );
};

export default CalculatorPage;
