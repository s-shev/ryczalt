import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Event, Schedule, TaskAlt } from "@mui/icons-material";
import { resolveTasksForDate } from "../lib/jdgCalendar";
import CalendarTaskCard from "../components/jdgCalendar/CalendarTaskCard";
import MonthGrid from "../components/jdgCalendar/MonthGrid";
import {
  formatLongDate,
  parseInputDate,
  toInputDate,
} from "../components/jdgCalendar/dateUtils";
import {
  STATUS_META,
  TASK_COMPLETION_STORAGE_KEY,
} from "../components/jdgCalendar/statusMeta";

const JdgCalendarPage = () => {
  const [selectedDateInput, setSelectedDateInput] = useState(
    toInputDate(new Date()),
  );
  const [vatRegistered, setVatRegistered] = useState(true);
  const [showOverdue, setShowOverdue] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(
    () => {
      if (typeof window === "undefined") {
        return {};
      }

      try {
        const raw = window.localStorage.getItem(TASK_COMPLETION_STORAGE_KEY);
        if (!raw) {
          return {};
        }

        const parsed = JSON.parse(raw) as Record<string, boolean>;
        return parsed ?? {};
      } catch {
        return {};
      }
    },
  );
  const selectedDate = useMemo(
    () => parseInputDate(selectedDateInput),
    [selectedDateInput],
  );
  const selectedDateKey = selectedDateInput;

  const [calendarMonth, setCalendarMonth] = useState(
    () =>
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
        12,
        0,
        0,
        0,
      ),
  );

  const resolvedTasks = useMemo(
    () => resolveTasksForDate(selectedDate, { vatRegistered }),
    [selectedDate, vatRegistered],
  );

  const summary = useMemo(
    () => ({
      overdue: resolvedTasks.filter((task) => task.status === "overdue").length,
      dueNow: resolvedTasks.filter(
        (task) => task.status === "dueToday" || task.status === "activeWindow",
      ).length,
      upcoming: resolvedTasks.filter((task) => task.status === "upcoming")
        .length,
    }),
    [resolvedTasks],
  );

  useEffect(() => {
    window.localStorage.setItem(
      TASK_COMPLETION_STORAGE_KEY,
      JSON.stringify(completedTasks),
    );
  }, [completedTasks]);

  const isTaskCompleted = (dateKey: string, taskId: string) =>
    Boolean(completedTasks[`${dateKey}|${taskId}`]);

  const toggleTaskCompleted = (
    dateKey: string,
    taskId: string,
    next: boolean,
  ) => {
    const storageKey = `${dateKey}|${taskId}`;
    setCompletedTasks((prev) => {
      if (next) {
        return { ...prev, [storageKey]: true };
      }

      if (!prev[storageKey]) {
        return prev;
      }

      const copy = { ...prev };
      delete copy[storageKey];
      return copy;
    });
  };

  const visibleTasks = useMemo(() => {
    const filtered = resolvedTasks.filter((task) => {
      if (task.status === "dueToday" || task.status === "activeWindow") {
        return true;
      }

      if (task.status === "overdue") {
        return showOverdue;
      }

      if (task.status === "upcoming") {
        return showUpcoming;
      }

      return false;
    });

    return filtered.sort((a, b) => {
      const aDone = isTaskCompleted(selectedDateKey, a.id) ? 1 : 0;
      const bDone = isTaskCompleted(selectedDateKey, b.id) ? 1 : 0;
      return aDone - bDone;
    });
  }, [
    completedTasks,
    resolvedTasks,
    selectedDateKey,
    showOverdue,
    showUpcoming,
  ]);

  const goToMonth = (direction: -1 | 1) => {
    setCalendarMonth(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + direction,
          1,
          12,
          0,
          0,
          0,
        ),
    );
  };

  const selectDay = (date: Date) => {
    setSelectedDateInput(toInputDate(date));
    setCalendarMonth(
      new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0),
    );
  };

  const getDaySignal = (day: Date) => {
    const dayTasks = resolveTasksForDate(day, { vatRegistered });
    const dayKey = toInputDate(day);
    const remainingTasks = dayTasks.filter(
      (task) => !isTaskCompleted(dayKey, task.id),
    );
    const active = remainingTasks.filter(
      (task) => task.status === "dueToday" || task.status === "activeWindow",
    ).length;
    const overdue = showOverdue
      ? remainingTasks.filter((task) => task.status === "overdue").length
      : 0;
    const upcoming = showUpcoming
      ? remainingTasks.filter((task) => task.status === "upcoming").length
      : 0;

    return {
      active,
      overdue,
      upcoming,
    };
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 3.5 }}>
      <Box className="section-fade">
        <Stack spacing={{ xs: 1, md: 1.4 }}>
          <Typography variant="h1">JDG Compliance Calendar</Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 780 }}
          >
            Select any date to see what must be done in your JDG ryczalt
            workflow. Tasks are color-coded by compliance domain and prioritized
            by urgency.
          </Typography>
        </Stack>
      </Box>

      <Paper
        elevation={0}
        className="section-fade delay-1"
        sx={{ p: { xs: 2, sm: 2.5, md: 3 }, border: "1px solid #E6DDD0" }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              label="Reference date"
              type="date"
              value={selectedDateInput}
              onChange={(event) => setSelectedDateInput(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ maxWidth: { sm: 280 } }}
            />
            <Button
              variant="outlined"
              onClick={() => setSelectedDateInput(toInputDate(new Date()))}
            >
              Jump to today
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={vatRegistered}
                  onChange={(event) => setVatRegistered(event.target.checked)}
                />
              }
              label="VAT registered"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showOverdue}
                  onChange={(event) => setShowOverdue(event.target.checked)}
                />
              }
              label="Show overdue"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showUpcoming}
                  onChange={(event) => setShowUpcoming(event.target.checked)}
                />
              }
              label="Show upcoming"
            />
          </Stack>

          <Typography variant="body1">
            View for <strong>{formatLongDate(selectedDate)}</strong>
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Active tasks are always visible. Overdue and upcoming tasks can be
            enabled with the toggles.
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<Schedule />}
              label={`${summary.overdue} overdue`}
              sx={{
                color: STATUS_META.overdue.text,
                bgcolor: STATUS_META.overdue.bg,
                border: `1px solid ${STATUS_META.overdue.border}`,
              }}
            />
            <Chip
              icon={<TaskAlt />}
              label={`${summary.dueNow} active now`}
              sx={{
                color: STATUS_META.activeWindow.text,
                bgcolor: STATUS_META.activeWindow.bg,
                border: `1px solid ${STATUS_META.activeWindow.border}`,
              }}
            />
            <Chip
              icon={<Event />}
              label={`${summary.upcoming} upcoming soon`}
              sx={{
                color: STATUS_META.upcoming.text,
                bgcolor: STATUS_META.upcoming.bg,
                border: `1px solid ${STATUS_META.upcoming.border}`,
              }}
            />
          </Stack>

          {(summary.overdue > 0 || summary.dueNow > 0) && (
            <Alert severity={summary.overdue > 0 ? "warning" : "info"}>
              {summary.overdue > 0
                ? "Some obligations are past their indicated due date/window for this period."
                : "You have active obligations for the selected date."}
            </Alert>
          )}
        </Stack>
      </Paper>

      <MonthGrid
        calendarMonth={calendarMonth}
        selectedDate={selectedDate}
        onGoToMonth={goToMonth}
        onSelectDay={selectDay}
        getDaySignal={getDaySignal}
      />

      <Grid
        container
        spacing={{ xs: 1.6, md: 2.2 }}
        className="section-fade delay-2"
      >
        {visibleTasks.map((task) => (
          <Grid item xs={12} md={6} key={task.id}>
            <CalendarTaskCard
              task={task}
              completed={isTaskCompleted(selectedDateKey, task.id)}
              onToggleComplete={(nextCompleted) =>
                toggleTaskCompleted(selectedDateKey, task.id, nextCompleted)
              }
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default JdgCalendarPage;
