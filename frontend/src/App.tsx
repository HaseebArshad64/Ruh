import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { LocalHospital, People, CalendarToday } from "@mui/icons-material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import components
import ClientList from "@/features/clients/components/organisms/ClientList";
import ClientEditForm from "@/features/clients/components/organisms/ClientEditForm";
import AppointmentListContainer from "@/features/appointments/components/organisms/AppointmentListContainer";
import AppointmentForm from "@/features/appointments/components/organisms/AppointmentForm";
import AppointmentEditForm from "@/features/appointments/components/organisms/AppointmentEditForm";
import Dashboard from "@/features/dashboard/components/organisms/Dashboard";

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green color for wellness theme
    },
    secondary: {
      main: "#1976d2",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

/**
 * Main App component with routing and navigation
 * @returns JSX.Element
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <LocalHospital sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Virtual Wellness Platform
              </Typography>
              <Button color="inherit" component={Link} to="/" startIcon={<LocalHospital />}>
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/clients" startIcon={<People />}>
                Clients
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/appointments"
                startIcon={<CalendarToday />}
              >
                Appointments
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/clients/:id/edit" element={<ClientEditForm />} />
              <Route path="/appointments" element={<AppointmentListContainer />} />
              <Route path="/appointments/new" element={<AppointmentForm />} />
              <Route path="/appointments/:id/edit" element={<AppointmentEditForm />} />
            </Routes>
          </Container>

          {/* Toast Container with beautiful styling */}
          <ToastContainer
            position="bottom-left"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              borderRadius: "12px",
              fontFamily: theme.typography.fontFamily,
            }}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
