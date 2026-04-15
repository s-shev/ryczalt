import {
  CalendarTaskDefinition,
  CalendarTaskRecurrence,
  JDG_CALENDAR_TASKS,
} from "../data/jdgCalendar";

export type TaskStatus =
  | "overdue"
  | "dueToday"
  | "activeWindow"
  | "upcoming"
  | "later"
  | "info";

export type ResolvedCalendarTask = CalendarTaskDefinition & {
  status: TaskStatus;
  deadlineText: string;
  statusText: string;
  dayOffset?: number;
};

export type CalendarResolveOptions = {
  vatRegistered?: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const atNoon = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);

const dayDiff = (fromDate: Date, toDate: Date) => {
  const from = atNoon(fromDate).getTime();
  const to = atNoon(toDate).getTime();
  return Math.round((to - from) / DAY_MS);
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

const formatWindow = (start: Date, end: Date) =>
  `${formatDate(start)} - ${formatDate(end)}`;

const withStatus = (
  task: CalendarTaskDefinition,
  status: TaskStatus,
  deadlineText: string,
  statusText: string,
  dayOffset?: number,
): ResolvedCalendarTask => ({
  ...task,
  status,
  deadlineText,
  statusText,
  dayOffset,
});

const resolveMonthlyDeadline = (
  task: CalendarTaskDefinition,
  selectedDate: Date,
): ResolvedCalendarTask => {
  const periodStart = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  );
  const deadline = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    task.monthlyDay,
  );
  const toPeriodStart = dayDiff(selectedDate, periodStart);
  const offset = dayDiff(selectedDate, deadline);

  if (offset === 0) {
    return withStatus(
      task,
      "dueToday",
      `Deadline: ${formatDate(deadline)}`,
      "Due today",
      offset,
    );
  }

  if (toPeriodStart <= 0 && offset > 0) {
    return withStatus(
      task,
      "activeWindow",
      `Period: ${formatWindow(periodStart, deadline)}`,
      `Active now (${offset} day(s) left)`,
      offset,
    );
  }

  if (offset < 0) {
    return withStatus(
      task,
      "overdue",
      `Deadline: ${formatDate(deadline)}`,
      `${Math.abs(offset)} day(s) overdue`,
      offset,
    );
  }

  return withStatus(
    task,
    offset <= 7 ? "upcoming" : "later",
    `Deadline: ${formatDate(deadline)}`,
    `Due in ${offset} day(s)`,
    offset,
  );
};

const resolveAnnualDeadline = (
  task: CalendarTaskDefinition,
  selectedDate: Date,
): ResolvedCalendarTask => {
  const periodStart = new Date(
    selectedDate.getFullYear(),
    (task.annualMonth ?? 1) - 1,
    1,
  );
  const deadline = new Date(
    selectedDate.getFullYear(),
    (task.annualMonth ?? 1) - 1,
    task.annualDay,
  );
  const toPeriodStart = dayDiff(selectedDate, periodStart);
  const offset = dayDiff(selectedDate, deadline);

  if (offset === 0) {
    return withStatus(
      task,
      "dueToday",
      `Deadline: ${formatDate(deadline)}`,
      "Due today",
      offset,
    );
  }

  if (toPeriodStart <= 0 && offset > 0) {
    return withStatus(
      task,
      "activeWindow",
      `Period: ${formatWindow(periodStart, deadline)}`,
      `Active now (${offset} day(s) left)`,
      offset,
    );
  }

  if (offset < 0) {
    return withStatus(
      task,
      "overdue",
      `Deadline: ${formatDate(deadline)}`,
      `${Math.abs(offset)} day(s) overdue`,
      offset,
    );
  }

  return withStatus(
    task,
    offset <= 14 ? "upcoming" : "later",
    `Deadline: ${formatDate(deadline)}`,
    `Due in ${offset} day(s)`,
    offset,
  );
};

const resolveWindowStatus = (
  recurrence: CalendarTaskRecurrence,
  task: CalendarTaskDefinition,
  selectedDate: Date,
): ResolvedCalendarTask => {
  const year = selectedDate.getFullYear();
  const startMonth =
    recurrence === "monthlyWindow"
      ? selectedDate.getMonth()
      : (task.windowStartMonth ?? 1) - 1;
  const start = new Date(year, startMonth, task.windowStartDay);

  const endMonth =
    recurrence === "monthlyWindow"
      ? selectedDate.getMonth()
      : (task.windowEndMonth ?? 1) - 1;
  const end = new Date(year, endMonth, task.windowEndDay);

  const toStart = dayDiff(selectedDate, start);
  const toEnd = dayDiff(selectedDate, end);
  const windowText = `Window: ${formatWindow(start, end)}`;

  if (toStart > 0) {
    return withStatus(
      task,
      toStart <= 7 ? "upcoming" : "later",
      windowText,
      `Starts in ${toStart} day(s)`,
      toStart,
    );
  }

  if (toEnd >= 0) {
    return withStatus(
      task,
      "activeWindow",
      windowText,
      `Active now (${toEnd} day(s) left)`,
      toEnd,
    );
  }

  return withStatus(
    task,
    "overdue",
    windowText,
    `Window closed ${Math.abs(toEnd)} day(s) ago`,
    toEnd,
  );
};

const resolveTask = (
  task: CalendarTaskDefinition,
  selectedDate: Date,
): ResolvedCalendarTask => {
  switch (task.recurrence) {
    case "monthlyDeadline":
      return resolveMonthlyDeadline(task, selectedDate);
    case "annualDeadline":
      return resolveAnnualDeadline(task, selectedDate);
    case "monthlyWindow":
    case "annualWindow":
      return resolveWindowStatus(task.recurrence, task, selectedDate);
    case "eventDriven":
      return withStatus(
        task,
        "info",
        "Timing: whenever qualifying payment event occurs",
        "Event-driven",
      );
    default:
      return withStatus(task, "info", "Timing: check guidance", "Info only");
  }
};

export const TASK_STATUS_SORT_ORDER: Record<TaskStatus, number> = {
  overdue: 0,
  dueToday: 1,
  activeWindow: 2,
  upcoming: 3,
  later: 4,
  info: 5,
};

export const resolveTasksForDate = (
  selectedDate: Date,
  options?: CalendarResolveOptions,
): ResolvedCalendarTask[] =>
  JDG_CALENDAR_TASKS.filter((task) => {
    if (!task.requiresVatRegistration) {
      return true;
    }

    return options?.vatRegistered ?? true;
  })
    .map((task) => resolveTask(task, selectedDate))
    .sort((a, b) => {
      const rank =
        TASK_STATUS_SORT_ORDER[a.status] - TASK_STATUS_SORT_ORDER[b.status];
      if (rank !== 0) {
        return rank;
      }

      const aOffset = a.dayOffset ?? Number.POSITIVE_INFINITY;
      const bOffset = b.dayOffset ?? Number.POSITIVE_INFINITY;
      return Math.abs(aOffset) - Math.abs(bOffset);
    });
