import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import {
  People,
  CalendarToday,
  Sync,
  CheckCircle,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Client, AppointmentWithClient } from '../types';
import { WellnessAPI } from '../services/api';

/**
 * Dashboard component showing overview statistics and quick actions
 * @returns JSX.Element
 */
const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lastSync, setLastSync] = useState<string>('');
  const navigate = useNavigate();

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [clientsData, appointmentsData] = await Promise.all([
        WellnessAPI.getClients(),
        WellnessAPI.getAppointmentsWithClients(),
      ]);

      setClients(clientsData);
      setAppointments(appointmentsData);
      setLastSync(new Date().toLocaleString());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle manual sync with external API
   */
  const handleSync = async (): Promise<void> => {
    try {
      setSyncing(true);
      await WellnessAPI.syncData();
      await fetchDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync data');
    } finally {
      setSyncing(false);
    }
  };

  /**
   * Get upcoming appointments (next 7 days)
   */
  const getUpcomingAppointments = (): AppointmentWithClient[] => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.appointment_time);
        return (
          aptDate >= new Date() &&
          aptDate <= oneWeekFromNow &&
          apt.status === 'scheduled'
        );
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_time).getTime() -
          new Date(b.appointment_time).getTime()
      )
      .slice(0, 5);
  };

  const upcomingAppointments = getUpcomingAppointments();
  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled'
  ).length;

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight={400}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={4}
      >
        <Typography variant='h4' component='h1'>
          Dashboard
        </Typography>
        <Button
          variant='outlined'
          startIcon={syncing ? <CircularProgress size={20} /> : <Sync />}
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? 'Syncing...' : 'Sync Data'}
        </Button>
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box>
                <Typography color='text.secondary' gutterBottom>
                  Total Clients
                </Typography>
                <Typography variant='h4' component='div'>
                  {clients.length}
                </Typography>
              </Box>
              <People sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box>
                <Typography color='text.secondary' gutterBottom>
                  Total Appointments
                </Typography>
                <Typography variant='h4' component='div'>
                  {totalAppointments}
                </Typography>
              </Box>
              <CalendarToday sx={{ fontSize: 40, color: 'secondary.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box>
                <Typography color='text.secondary' gutterBottom>
                  Scheduled
                </Typography>
                <Typography variant='h4' component='div'>
                  {scheduledAppointments}
                </Typography>
              </Box>
              <Schedule sx={{ fontSize: 40, color: 'success.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Quick Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant='contained'
              startIcon={<People />}
              onClick={() => navigate('/clients')}
            >
              View All Clients
            </Button>
            <Button
              variant='contained'
              startIcon={<CalendarToday />}
              onClick={() => navigate('/appointments')}
            >
              View All Appointments
            </Button>
            <Button
              variant='outlined'
              startIcon={<Schedule />}
              onClick={() => navigate('/appointments/new')}
            >
              Schedule New Appointment
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardContent>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            mb={2}
          >
            <Typography variant='h6'>Upcoming Appointments</Typography>
            <Chip
              icon={<TrendingUp />}
              label={`${upcomingAppointments.length} this week`}
              color='primary'
              variant='outlined'
            />
          </Box>

          {upcomingAppointments.length === 0 ? (
            <Typography color='text.secondary'>
              No upcoming appointments scheduled for the next 7 days.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {upcomingAppointments.map((appointment) => (
                <Box
                  key={appointment.id}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Box>
                      <Typography variant='subtitle1' fontWeight='medium'>
                        {appointment.client_name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {appointment.client_email}
                      </Typography>
                    </Box>
                    <Box textAlign='right'>
                      <Typography variant='body2' fontWeight='medium'>
                        {WellnessAPI.formatDate(appointment.appointment_time)}
                      </Typography>
                      <Chip
                        label={appointment.status}
                        color='primary'
                        size='small'
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <Box display='flex' alignItems='center' justifyContent='center' mt={3}>
        <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
        <Typography variant='body2' color='text.secondary'>
          System Status: Online | Last sync: {lastSync}
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
