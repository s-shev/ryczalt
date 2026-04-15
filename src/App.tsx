import { Box, Container, Stack } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import AppNavigation from "./components/AppNavigation";
import CalculatorPage from "./pages/CalculatorPage";
import JdgCalendarPage from "./pages/JdgCalendarPage";

const App = () => {
  return (
    <Box position="relative" overflow="hidden">
      <Box className="hero-glow" />
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2.5, sm: 4, md: 8 },
          px: { xs: 2, sm: 3 },
          position: "relative",
          maxWidth: "100%",
        }}
      >
        <Stack spacing={{ xs: 2.2, md: 3.2 }}>
          <AppNavigation />

          <Routes>
            <Route path="/" element={<CalculatorPage />} />
            <Route path="/calendar" element={<JdgCalendarPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Stack>
      </Container>
    </Box>
  );
};

export default App;
