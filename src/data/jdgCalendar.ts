export type CalendarTaskDomain =
  | "invoicing"
  | "zus"
  | "pit"
  | "vat"
  | "fx"
  | "setup";

export type CalendarTaskRecurrence =
  | "monthlyDeadline"
  | "monthlyWindow"
  | "annualDeadline"
  | "annualWindow"
  | "eventDriven";

export type CalendarTaskDefinition = {
  id: string;
  title: string;
  domain: CalendarTaskDomain;
  requiresVatRegistration?: boolean;
  recurrence: CalendarTaskRecurrence;
  description: string;
  action: string;
  monthlyDay?: number;
  annualMonth?: number;
  annualDay?: number;
  windowStartMonth?: number;
  windowStartDay?: number;
  windowEndMonth?: number;
  windowEndDay?: number;
  reference?: string;
};

export const CALENDAR_DOMAIN_META: Record<
  CalendarTaskDomain,
  { label: string; color: string; bg: string }
> = {
  invoicing: {
    label: "Invoicing",
    color: "#085E51",
    bg: "#DDF4EE",
  },
  zus: {
    label: "ZUS",
    color: "#7A4A00",
    bg: "#FFEFCB",
  },
  pit: {
    label: "PIT",
    color: "#4A2A73",
    bg: "#EDE3FF",
  },
  vat: {
    label: "VAT",
    color: "#154A8C",
    bg: "#DBEBFF",
  },
  fx: {
    label: "FX",
    color: "#6D3A00",
    bg: "#FFE7CC",
  },
  setup: {
    label: "Annual Setup",
    color: "#5E4B2D",
    bg: "#F7EBD8",
  },
};

export const JDG_CALENDAR_TASKS: CalendarTaskDefinition[] = [
  {
    id: "invoice-window",
    title: "Issue prior-month invoices",
    domain: "invoicing",
    recurrence: "monthlyWindow",
    description:
      "Operational target window for issuing invoices for the previous month.",
    action:
      "Issue invoice for completed settlement period and include required cross-border annotations when relevant.",
    windowStartDay: 1,
    windowEndDay: 5,
    reference: "JDG calendar: invoicing target 1st-5th",
  },
  {
    id: "invoice-legal-deadline",
    title: "Invoice legal latest date",
    domain: "invoicing",
    recurrence: "monthlyDeadline",
    description:
      "Typical VAT invoicing legal latest date: by the 15th of the following month.",
    action:
      "Ensure prior-month service invoices are legally issued by this date.",
    monthlyDay: 15,
    reference: "JDG calendar: invoicing legal latest date",
  },
  {
    id: "zus-dra",
    title: "Submit ZUS DRA",
    domain: "zus",
    recurrence: "monthlyDeadline",
    description: "Monthly ZUS declaration filing deadline.",
    action: "Submit ZUS DRA in PUE ZUS or via accounting software.",
    monthlyDay: 20,
    reference: "JDG calendar: ZUS DRA deadline",
  },
  {
    id: "zus-payment",
    title: "Pay ZUS contributions",
    domain: "zus",
    recurrence: "monthlyDeadline",
    description: "Payment deadline for ZUS contributions.",
    action: "Pay ZUS according to submitted DRA values.",
    monthlyDay: 20,
    reference: "JDG calendar: ZUS payment deadline",
  },
  {
    id: "ryczalt-advance",
    title: "Pay monthly ryczalt advance",
    domain: "pit",
    recurrence: "monthlyDeadline",
    description:
      "Monthly ryczalt income tax advance payment (no monthly declaration).",
    action:
      "Calculate ryczalt from cash-recognized revenue and pay to your tax micro-account.",
    monthlyDay: 20,
    reference: "JDG calendar: monthly ryczalt payment",
  },
  {
    id: "jpk-vat-ue",
    title: "Submit VAT filings (if VAT-registered)",
    domain: "vat",
    requiresVatRegistration: true,
    recurrence: "monthlyDeadline",
    description:
      "Submit JPK_V7M/JPK_V7K and VAT-UE when reportable transactions occurred.",
    action:
      "File required VAT reports and archive UPO receipts for each submission.",
    monthlyDay: 25,
    reference: "Reporting: VAT deadlines",
  },
  {
    id: "fx-differences",
    title: "Track FX differences on each payment",
    domain: "fx",
    recurrence: "eventDriven",
    description:
      "Event-driven obligation whenever foreign currency payment is received.",
    action:
      "Compare PLN value at invoicing/tax-point conversion vs payment-date conversion and account for positive differences.",
    reference: "JDG calendar: exchange differences",
  },
  {
    id: "annual-setup-window",
    title: "Collect annual ZUS base parameters",
    domain: "setup",
    recurrence: "annualWindow",
    description:
      "Practical control window to collect yearly base values for social and health contributions.",
    action:
      "Confirm GUS average wage, forecasted average wage, and minimum salary values for the year.",
    windowStartMonth: 1,
    windowStartDay: 21,
    windowEndMonth: 2,
    windowEndDay: 1,
    reference: "JDG annual calendar: Jan 21 - Feb 1",
  },
  {
    id: "pit-28",
    title: "File PIT-28",
    domain: "pit",
    recurrence: "annualWindow",
    description: "Annual ryczalt tax return filing window.",
    action: "File PIT-28 and reconcile annual tax balance.",
    windowStartMonth: 2,
    windowStartDay: 15,
    windowEndMonth: 4,
    windowEndDay: 30,
    reference: "JDG annual calendar: PIT-28 window",
  },
  {
    id: "annual-health-reconciliation",
    title: "Annual health contribution reconciliation",
    domain: "zus",
    recurrence: "annualDeadline",
    description:
      "Annual health contribution settlement included in April DRA (filed in May).",
    action:
      "Reconcile annual health contribution and pay shortfall or request refund.",
    annualMonth: 5,
    annualDay: 20,
    reference: "JDG annual calendar: annual health reconciliation",
  },
];
