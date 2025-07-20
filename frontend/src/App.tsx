import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
} from '@mui/material';
import { LocalHospital, People, CalendarToday } from '@mui/icons-material';

// Import components
import ClientList from './components/ClientList';
import AppointmentList from './components/AppointmentList';
import AppointmentForm from './components/AppointmentForm';
import Dashboard from './components/Dashboard';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green color for wellness theme
    },
    secondary: {
      main: '#1976d2',
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
          <AppBar position='static'>
            <Toolbar>
              <LocalHospital sx={{ mr: 2 }} />
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                Virtual Wellness Platform
              </Typography>
              <Button
                color='inherit'
                component={Link}
                to='/'
                startIcon={<LocalHospital />}
              >
                Dashboard
              </Button>
              <Button
                color='inherit'
                component={Link}
                to='/clients'
                startIcon={<People />}
              >
                Clients
              </Button>
              <Button
                color='inherit'
                component={Link}
                to='/appointments'
                startIcon={<CalendarToday />}
              >
                Appointments
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/clients' element={<ClientList />} />
              <Route path='/appointments' element={<AppointmentList />} />
              <Route path='/appointments/new' element={<AppointmentForm />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
