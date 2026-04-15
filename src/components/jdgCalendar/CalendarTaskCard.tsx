import {
  Checkbox,
  Chip,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { CALENDAR_DOMAIN_META } from "../../data/jdgCalendar";
import { ResolvedCalendarTask } from "../../lib/jdgCalendar";
import { STATUS_META } from "./statusMeta";

type CalendarTaskCardProps = {
  task: ResolvedCalendarTask;
  completed: boolean;
  onToggleComplete: (nextCompleted: boolean) => void;
};

const CalendarTaskCard = ({
  task,
  completed,
  onToggleComplete,
}: CalendarTaskCardProps) => {
  const domainMeta = CALENDAR_DOMAIN_META[task.domain];
  const statusMeta = STATUS_META[task.status];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        border: "1px solid #E6DDD0",
        borderLeft: `6px solid ${domainMeta.color}`,
        height: "100%",
        opacity: completed ? 0.76 : 1,
      }}
    >
      <Stack spacing={1.1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1}
          flexWrap="wrap"
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <Chip
              label={domainMeta.label}
              size="small"
              sx={{
                color: domainMeta.color,
                bgcolor: domainMeta.bg,
                border: `1px solid ${domainMeta.color}22`,
              }}
            />
            <Chip
              label={statusMeta.label}
              size="small"
              sx={{
                color: statusMeta.text,
                bgcolor: statusMeta.bg,
                border: `1px solid ${statusMeta.border}`,
              }}
            />
            {completed ? (
              <Chip
                label="Done"
                size="small"
                sx={{
                  color: "#085E51",
                  bgcolor: "#DDF4EE",
                  border: "1px solid #9CCFC4",
                }}
              />
            ) : null}
          </Stack>
        </Stack>

        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "1.08rem", md: "1.2rem" },
            textDecoration: completed ? "line-through" : "none",
          }}
        >
          {task.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 1.1,
            borderRadius: 1.5,
            border: "1px dashed #D7CCBD",
            bgcolor: "#FFFEFB",
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">Action</Typography>
            <Typography variant="body2" color="text.secondary">
              {task.action}
            </Typography>
          </Stack>
        </Paper>

        <Stack spacing={0.2}>
          <Typography variant="body2">{task.deadlineText}</Typography>
          <Typography variant="caption" color="text.secondary">
            {task.statusText}
          </Typography>
        </Stack>

        {task.reference ? (
          <Typography variant="caption" color="text.secondary">
            Source: {task.reference}
          </Typography>
        ) : null}

        <FormControlLabel
          control={
            <Checkbox
              checked={completed}
              onChange={(event) => onToggleComplete(event.target.checked)}
            />
          }
          label={completed ? "Marked as done" : "Mark as done"}
        />
      </Stack>
    </Paper>
  );
};

export default CalendarTaskCard;
