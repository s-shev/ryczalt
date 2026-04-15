import {
  Box,
  ButtonBase,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import {
  formatMonth,
  getMonthMatrix,
  isSameDay,
  normalizeDate,
  toInputDate,
} from "./dateUtils";
import { STATUS_META, WEEKDAY_HEADERS } from "./statusMeta";

type DaySignals = {
  active: number;
  overdue: number;
  upcoming: number;
};

type MonthGridProps = {
  calendarMonth: Date;
  selectedDate: Date;
  onGoToMonth: (direction: -1 | 1) => void;
  onSelectDay: (day: Date) => void;
  getDaySignal: (day: Date) => DaySignals;
};

const MonthGrid = ({
  calendarMonth,
  selectedDate,
  onGoToMonth,
  onSelectDay,
  getDaySignal,
}: MonthGridProps) => {
  const monthCells = getMonthMatrix(calendarMonth);

  return (
    <Paper
      elevation={0}
      className="section-fade delay-2"
      sx={{ p: { xs: 1.6, sm: 2 }, border: "1px solid #E6DDD0" }}
    >
      <Stack spacing={1.3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton
            aria-label="Previous month"
            onClick={() => onGoToMonth(-1)}
            size="small"
          >
            <NavigateBefore />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {formatMonth(calendarMonth)}
          </Typography>
          <IconButton
            aria-label="Next month"
            onClick={() => onGoToMonth(1)}
            size="small"
          >
            <NavigateNext />
          </IconButton>
        </Stack>

        <Grid container spacing={0.7}>
          {WEEKDAY_HEADERS.map((weekday) => (
            <Grid item xs={12 / 7} key={weekday}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center" }}
              >
                {weekday}
              </Typography>
            </Grid>
          ))}

          {monthCells.map((day, index) => {
            if (!day) {
              return (
                <Grid item xs={12 / 7} key={`empty-${index}`}>
                  <Box sx={{ height: 62 }} />
                </Grid>
              );
            }

            const signals = getDaySignal(day);
            const selected = isSameDay(
              normalizeDate(day),
              normalizeDate(selectedDate),
            );
            const today = isSameDay(
              normalizeDate(day),
              normalizeDate(new Date()),
            );

            return (
              <Grid item xs={12 / 7} key={toInputDate(day)}>
                <ButtonBase
                  onClick={() => onSelectDay(day)}
                  sx={{
                    width: "100%",
                    borderRadius: 1.6,
                    p: 0.8,
                    border: selected
                      ? "2px solid #0C7C6A"
                      : today
                        ? "1px solid #9CCFC4"
                        : "1px solid #E6DDD0",
                    bgcolor: selected ? "#EEFAF7" : "#FFFFFF",
                    minHeight: 62,
                  }}
                >
                  <Stack spacing={0.35} sx={{ width: "100%" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "left",
                        fontWeight: selected ? 700 : 500,
                      }}
                    >
                      {day.getDate()}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.4}
                      justifyContent="flex-start"
                    >
                      {signals.active > 0 ? (
                        <Chip
                          size="small"
                          label={`A${signals.active}`}
                          sx={{
                            height: 18,
                            fontSize: "0.65rem",
                            color: STATUS_META.activeWindow.text,
                            bgcolor: STATUS_META.activeWindow.bg,
                            border: `1px solid ${STATUS_META.activeWindow.border}`,
                          }}
                        />
                      ) : null}
                      {signals.overdue > 0 ? (
                        <Chip
                          size="small"
                          label={`!${signals.overdue}`}
                          sx={{
                            height: 18,
                            fontSize: "0.65rem",
                            color: STATUS_META.overdue.text,
                            bgcolor: STATUS_META.overdue.bg,
                            border: `1px solid ${STATUS_META.overdue.border}`,
                          }}
                        />
                      ) : null}
                      {signals.upcoming > 0 ? (
                        <Chip
                          size="small"
                          label={`~${signals.upcoming}`}
                          sx={{
                            height: 18,
                            fontSize: "0.65rem",
                            color: STATUS_META.upcoming.text,
                            bgcolor: STATUS_META.upcoming.bg,
                            border: `1px solid ${STATUS_META.upcoming.border}`,
                          }}
                        />
                      ) : null}
                    </Stack>
                  </Stack>
                </ButtonBase>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Paper>
  );
};

export type { DaySignals };
export default MonthGrid;
