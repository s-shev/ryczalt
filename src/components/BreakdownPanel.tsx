import {
  ButtonBase,
  Collapse,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import Decimal from "decimal.js";
import { CalcOutput, ZusStage } from "../lib/calc";
import { formatCurrency, formatPercent } from "../lib/formatters";
import { RYCZALT_2026 } from "../data/ryczalt2026";
import FormulaBlock from "./FormulaBlock";
import FormulaBadge from "./FormulaBadge";
import InfoTooltip from "./InfoTooltip";

type BreakdownPanelProps = {
  healthContribution: CalcOutput["healthContribution"];
  annualRevenue: CalcOutput["annualRevenue"];
  socialBreakdown: CalcOutput["socialBreakdown"];
  socialInsurance: CalcOutput["socialInsurance"];
  socialInsuranceBase: CalcOutput["socialInsuranceBase"];
  tierMultiplier: CalcOutput["tierMultiplier"];
  zusStage: ZusStage;
  sicknessPaid: boolean;
};

type FormulaParamProps = {
  label: string;
  value: string;
};

const FormulaParam = ({ label, value }: FormulaParamProps) => {
  return (
    <Stack direction="row" spacing={0.4} alignItems="center">
      <Typography variant="caption" color="inherit">
        {label}
      </Typography>
      <FormulaBadge>{value}</FormulaBadge>
    </Stack>
  );
};

type FormulaLineProps = {
  children: React.ReactNode;
};

const FormulaLine = ({ children }: FormulaLineProps) => {
  return (
    <Typography
      variant="caption"
      color="inherit"
      component="div"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 0.4,
      }}
    >
      {children}
    </Typography>
  );
};

type FormulaNoteProps = {
  children: React.ReactNode;
};

const FormulaNote = ({ children }: FormulaNoteProps) => {
  return (
    <Typography variant="caption" color="text.secondary" component="div">
      {children}
    </Typography>
  );
};

type BreakdownRowProps = {
  label: string;
  value: CalcOutput["healthContribution"];
  children: React.ReactNode;
};

const BreakdownRow = ({ label, value, children }: BreakdownRowProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Stack spacing={0.6}>
      <Stack direction="row" justifyContent="space-between" spacing={1.5}>
        <ButtonBase
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            color: "text.secondary",
            borderRadius: 1,
            px: 0.4,
            py: 0.2,
          }}
        >
          <Typography color="text.secondary">{label}</Typography>
          {open ? (
            <ExpandLess fontSize="small" />
          ) : (
            <ExpandMore fontSize="small" />
          )}
        </ButtonBase>
        <Typography>{formatCurrency(value)}</Typography>
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <FormulaBlock>
          <Stack spacing={0.4}>{children}</Stack>
        </FormulaBlock>
      </Collapse>
    </Stack>
  );
};

const BreakdownPanel = ({
  healthContribution,
  annualRevenue,
  socialBreakdown,
  socialInsurance,
  socialInsuranceBase,
  tierMultiplier,
  zusStage,
  sicknessPaid,
}: BreakdownPanelProps) => {
  const tierThresholds = RYCZALT_2026.tierThresholds;
  const lowMax = new Decimal(tierThresholds.lowMax);
  const midMax = new Decimal(tierThresholds.midMax);
  const tierRangeLabel = annualRevenue.lte(lowMax)
    ? `Up to ${formatCurrency(lowMax)}`
    : annualRevenue.lte(midMax)
      ? `${formatCurrency(lowMax)} - ${formatCurrency(midMax)}`
      : `Above ${formatCurrency(midMax)}`;
  const isUlga = zusStage === "ulga";
  const isMaly = zusStage === "maly";

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 2.5, md: 4 }, border: "1px solid #E6DDD0" }}
    >
      <Stack spacing={{ xs: 1.3, md: 2 }}>
        <Typography variant="h3">Breakdown</Typography>
        <Stack spacing={{ xs: 0.9, md: 1.2 }}>
          <BreakdownRow label="Health contribution" value={healthContribution}>
            <FormulaLine>
              Tier multiplier
              <FormulaBadge>{tierMultiplier.toFixed(2)}</FormulaBadge>
              <InfoTooltip
                ariaLabel="Why this tier multiplier is used"
                placement="right"
                title={
                  <Stack spacing={0.4}>
                    <Typography variant="caption" color="inherit">
                      Your annual revenue is {formatCurrency(annualRevenue)}.
                    </Typography>
                    <Typography variant="caption" color="inherit">
                      This fits the {tierRangeLabel} bracket, so the multiplier
                      is {tierMultiplier.toFixed(2)}.
                    </Typography>
                  </Stack>
                }
              />
            </FormulaLine>
            <FormulaLine>
              Health contribution =
              <FormulaParam
                label="Rate"
                value={formatPercent(RYCZALT_2026.healthContributionRate)}
              />
              *
              <FormulaParam
                label="Average wage"
                value={formatCurrency(
                  new Decimal(RYCZALT_2026.averageWageEnterpriseSector),
                )}
              />
              *
              <FormulaParam
                label="Tier multiplier"
                value={tierMultiplier.toFixed(2)}
              />
            </FormulaLine>
            <FormulaLine>= {formatCurrency(healthContribution)}</FormulaLine>
          </BreakdownRow>

          <BreakdownRow label="Pension" value={socialBreakdown.pension}>
            {isUlga ? (
              <FormulaNote>Not applicable under Ulga na start.</FormulaNote>
            ) : (
              <>
                <FormulaLine>
                  Pension =
                  <FormulaParam
                    label="Social insurance base"
                    value={formatCurrency(socialInsuranceBase)}
                  />
                  *
                  <FormulaParam
                    label="Rate"
                    value={formatPercent(RYCZALT_2026.socialRates.pension)}
                  />
                </FormulaLine>
                <FormulaLine>
                  = {formatCurrency(socialBreakdown.pension)}
                </FormulaLine>
              </>
            )}
          </BreakdownRow>

          <BreakdownRow label="Disability" value={socialBreakdown.disability}>
            {isUlga ? (
              <FormulaNote>Not applicable under Ulga na start.</FormulaNote>
            ) : (
              <>
                <FormulaLine>
                  Disability =
                  <FormulaParam
                    label="Social insurance base"
                    value={formatCurrency(socialInsuranceBase)}
                  />
                  *
                  <FormulaParam
                    label="Rate"
                    value={formatPercent(RYCZALT_2026.socialRates.disability)}
                  />
                </FormulaLine>
                <FormulaLine>
                  = {formatCurrency(socialBreakdown.disability)}
                </FormulaLine>
              </>
            )}
          </BreakdownRow>

          <BreakdownRow label="Sickness" value={socialBreakdown.sickness}>
            {isUlga ? (
              <FormulaNote>Not applicable under Ulga na start.</FormulaNote>
            ) : !sicknessPaid ? (
              <FormulaNote>
                Optional sickness contribution not selected.
              </FormulaNote>
            ) : (
              <>
                <FormulaLine>
                  Sickness =
                  <FormulaParam
                    label="Social insurance base"
                    value={formatCurrency(socialInsuranceBase)}
                  />
                  *
                  <FormulaParam
                    label="Rate"
                    value={formatPercent(RYCZALT_2026.socialRates.sickness)}
                  />
                </FormulaLine>
                <FormulaLine>
                  = {formatCurrency(socialBreakdown.sickness)}
                </FormulaLine>
              </>
            )}
          </BreakdownRow>

          <BreakdownRow label="Accident" value={socialBreakdown.accident}>
            {isUlga ? (
              <FormulaNote>Not applicable under Ulga na start.</FormulaNote>
            ) : (
              <>
                <FormulaLine>
                  Accident =
                  <FormulaParam
                    label="Social insurance base"
                    value={formatCurrency(socialInsuranceBase)}
                  />
                  *
                  <FormulaParam
                    label="Rate"
                    value={formatPercent(RYCZALT_2026.socialRates.accident)}
                  />
                </FormulaLine>
                <FormulaLine>
                  = {formatCurrency(socialBreakdown.accident)}
                </FormulaLine>
              </>
            )}
          </BreakdownRow>

          <BreakdownRow label="Labor Fund" value={socialBreakdown.laborFund}>
            {isUlga ? (
              <FormulaNote>Not applicable under Ulga na start.</FormulaNote>
            ) : isMaly ? (
              <FormulaNote>Applies only to Duzy ZUS.</FormulaNote>
            ) : (
              <>
                <FormulaLine>
                  Labor Fund =
                  <FormulaParam
                    label="Social insurance base"
                    value={formatCurrency(socialInsuranceBase)}
                  />
                  *
                  <FormulaParam
                    label="Rate"
                    value={formatPercent(RYCZALT_2026.socialRates.laborFund)}
                  />
                </FormulaLine>
                <FormulaLine>
                  = {formatCurrency(socialBreakdown.laborFund)}
                </FormulaLine>
              </>
            )}
          </BreakdownRow>

          <Divider />

          <BreakdownRow label="Social insurance total" value={socialInsurance}>
            {isUlga ? (
              <FormulaNote>
                No social insurance is due under Ulga na start.
              </FormulaNote>
            ) : (
              <>
                <FormulaLine>
                  Social insurance total =
                  <FormulaParam
                    label="Pension"
                    value={formatCurrency(socialBreakdown.pension)}
                  />
                  +
                  <FormulaParam
                    label="Disability"
                    value={formatCurrency(socialBreakdown.disability)}
                  />
                  +
                  <FormulaParam
                    label="Sickness"
                    value={formatCurrency(socialBreakdown.sickness)}
                  />
                  +
                  <FormulaParam
                    label="Accident"
                    value={formatCurrency(socialBreakdown.accident)}
                  />
                  +
                  <FormulaParam
                    label="Labor Fund"
                    value={formatCurrency(socialBreakdown.laborFund)}
                  />
                </FormulaLine>
                <FormulaLine>= {formatCurrency(socialInsurance)}</FormulaLine>
              </>
            )}
          </BreakdownRow>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default BreakdownPanel;
