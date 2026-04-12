import {
  Box,
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
import { formatCurrency, formatPercent } from "../lib/formatters";
import FormulaBlock from "./FormulaBlock";

type NetIncomePanelProps = {
  grossIncome: number;
  netIncome: Decimal;
  taxDue: Decimal;
  taxDueRaw: Decimal;
  zusTotal: Decimal;
  healthContribution: Decimal;
  socialInsurance: Decimal;
  taxableBaseRaw: Decimal;
  taxableBaseRounded: Decimal;
  ryczaltRate: number;
};

type FormulaParamProps = {
  label: string;
  value: string;
};

const FormulaParam = ({ label, value }: FormulaParamProps) => {
  return (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.4 }}
    >
      <Box component="span">{label}</Box>
      <Box
        component="span"
        sx={{
          px: 0.6,
          py: 0.15,
          borderRadius: 999,
          border: "1px solid #D5CBB8",
          backgroundColor: "#EFE6D5",
          color: "#4A4238",
          fontSize: "0.7rem",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Box>
    </Box>
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

const NetIncomePanel = ({
  grossIncome,
  netIncome,
  taxDue,
  taxDueRaw,
  zusTotal,
  healthContribution,
  socialInsurance,
  taxableBaseRaw,
  taxableBaseRounded,
  ryczaltRate,
}: NetIncomePanelProps) => {
  const [taxOpen, setTaxOpen] = useState(false);
  const [zusOpen, setZusOpen] = useState(false);
  const grossDecimal = new Decimal(grossIncome);

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, sm: 2.5, md: 4 }, border: "1px solid #E6DDD0" }}
    >
      <Stack spacing={{ xs: 1.3, md: 2 }}>
        <Typography variant="h3">Net income</Typography>
        <Typography variant="h2" color="primary">
          {formatCurrency(netIncome)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          After tax and ZUS contributions.
        </Typography>
        <Divider />
        <Stack spacing={{ xs: 1, md: 1.5 }}>
          <Stack spacing={0.6}>
            <Stack direction="row" justifyContent="space-between" spacing={1.5}>
              <ButtonBase
                onClick={() => setTaxOpen((prev) => !prev)}
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
                <Typography color="text.secondary">Tax due</Typography>
                {taxOpen ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </ButtonBase>
              <Typography>{formatCurrency(taxDue)}</Typography>
            </Stack>
            <Collapse in={taxOpen} timeout="auto" unmountOnExit>
              <FormulaBlock>
                <Stack spacing={0.4}>
                  <FormulaLine>
                    Taxable base (raw) =
                    <FormulaParam
                      label="Gross income"
                      value={formatCurrency(grossDecimal)}
                    />
                    - 0.5 *
                    <FormulaParam
                      label="Health contribution"
                      value={formatCurrency(healthContribution)}
                    />
                    -
                    <FormulaParam
                      label="Social insurance"
                      value={formatCurrency(socialInsurance)}
                    />
                    = {formatCurrency(taxableBaseRaw)}
                  </FormulaLine>
                  <FormulaLine>
                    Taxable base (rounded, Art. 63 § 1) =
                    <FormulaParam
                      label="Taxable base (raw)"
                      value={formatCurrency(taxableBaseRaw)}
                    />
                    = {formatCurrency(taxableBaseRounded)}
                  </FormulaLine>
                  <FormulaLine>
                    Tax due (raw) =
                    <FormulaParam
                      label="Taxable base (rounded)"
                      value={formatCurrency(taxableBaseRounded)}
                    />
                    *
                    <FormulaParam
                      label="Ryczałt rate"
                      value={formatPercent(ryczaltRate)}
                    />
                    = {formatCurrency(taxDueRaw)}
                  </FormulaLine>
                  <FormulaLine>
                    Tax due (rounded, Art. 63 § 1) =
                    <FormulaParam
                      label="Tax due (raw)"
                      value={formatCurrency(taxDueRaw)}
                    />
                    = {formatCurrency(taxDue)}
                  </FormulaLine>
                </Stack>
              </FormulaBlock>
            </Collapse>
          </Stack>

          <Stack spacing={0.6}>
            <Stack direction="row" justifyContent="space-between" spacing={1.5}>
              <ButtonBase
                onClick={() => setZusOpen((prev) => !prev)}
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
                <Typography color="text.secondary">ZUS total</Typography>
                {zusOpen ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </ButtonBase>
              <Typography>{formatCurrency(zusTotal)}</Typography>
            </Stack>
            <Collapse in={zusOpen} timeout="auto" unmountOnExit>
              <FormulaBlock>
                <Stack spacing={0.4}>
                  <FormulaLine>
                    ZUS total =
                    <FormulaParam
                      label="Health contribution"
                      value={formatCurrency(healthContribution)}
                    />
                    +
                    <FormulaParam
                      label="Social insurance"
                      value={formatCurrency(socialInsurance)}
                    />
                    = {formatCurrency(zusTotal)}
                  </FormulaLine>
                </Stack>
              </FormulaBlock>
            </Collapse>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default NetIncomePanel;
