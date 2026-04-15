import { Tabs, Tab } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const AppNavigation = () => {
  const location = useLocation();
  const activeTab = location.pathname.startsWith("/calendar")
    ? "/calendar"
    : "/";

  return (
    <Tabs
      value={activeTab}
      aria-label="Main navigation"
      sx={{
        px: 0.5,
        borderRadius: 999,
        bgcolor: "rgba(255,255,255,0.72)",
        border: "1px solid #E6DDD0",
        backdropFilter: "blur(6px)",
        width: "fit-content",
      }}
    >
      <Tab label="Calculator" value="/" component={Link} to="/" />
      <Tab
        label="JDG Calendar"
        value="/calendar"
        component={Link}
        to="/calendar"
      />
    </Tabs>
  );
};

export default AppNavigation;
