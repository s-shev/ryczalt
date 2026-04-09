import { InfoOutlined } from "@mui/icons-material";
import { IconButton, Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TooltipProps } from "@mui/material";
import type { ReactNode } from "react";

type InfoTooltipProps = {
  title: ReactNode;
  ariaLabel: string;
  placement?: TooltipProps["placement"];
};

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#0F1F1A",
    color: "#F7F2E9",
    borderRadius: 12,
    padding: theme.spacing(1.2, 1.4),
    boxShadow: "0 16px 40px rgba(9, 20, 16, 0.25)",
    maxWidth: 280,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#0F1F1A",
  },
}));

const InfoTooltip = ({
  title,
  ariaLabel,
  placement = "top",
}: InfoTooltipProps) => {
  return (
    <StyledTooltip title={title} placement={placement} arrow>
      <IconButton size="small" aria-label={ariaLabel}>
        <InfoOutlined fontSize="small" />
      </IconButton>
    </StyledTooltip>
  );
};

export default InfoTooltip;
