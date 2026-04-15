import { TaskStatus } from "../../lib/jdgCalendar";

export const WEEKDAY_HEADERS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export const TASK_COMPLETION_STORAGE_KEY = "jdg-calendar-task-completion-v1";

export const STATUS_META: Record<
  TaskStatus,
  { label: string; text: string; bg: string; border: string }
> = {
  overdue: {
    label: "Overdue",
    text: "#8A1A1A",
    bg: "#FFE3E1",
    border: "#F2B8B5",
  },
  dueToday: {
    label: "Due today",
    text: "#7A4A00",
    bg: "#FFF1CD",
    border: "#E4C47A",
  },
  activeWindow: {
    label: "Active window",
    text: "#0A5E4F",
    bg: "#DDF4EE",
    border: "#9CCFC4",
  },
  upcoming: {
    label: "Upcoming",
    text: "#154A8C",
    bg: "#E3F0FF",
    border: "#A7C8F2",
  },
  later: {
    label: "Later",
    text: "#465158",
    bg: "#EDF1F3",
    border: "#CDD6DA",
  },
  info: {
    label: "Info",
    text: "#5E4B2D",
    bg: "#F9F0DF",
    border: "#E7D1AC",
  },
};
