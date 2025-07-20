import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { Add, CalendarToday, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppointmentWithClient } from '../types';
import { WellnessAPI } from '../services/api';

/**
 * AppointmentList component for displaying appointments with client details
 * @returns JSX.Element
 */
const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async (): Promise<void> => {
      try {
        setLoading(true);
        const appointmentsData = await WellnessAPI.getAppointmentsWithClients();
        setAppointments(appointmentsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch appointments'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /**
   * Navigate to create appointment form
   */
  const handleCreateAppointment = (): void => {
    navigate('/appointments/new');
  };

  /**
   * Get status color for appointment status chip
   * @param status - Appointment status
   * @returns Color variant
   */
  const getStatusColor = (
    status: string
  ):
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning' => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={3}
      >
        <Typography variant='h4' component='h1'>
          Appointments ({appointments.length})
        </Typography>
        <Button
          variant='contained'
          startIcon={<Add />}
          onClick={handleCreateAppointment}
          sx={{ minWidth: 200 }}
        >
          Schedule Appointment
        </Button>
      </Box>

      {/* No appointments message */}
      {appointments.length === 0 && !loading && (
        <Alert severity='info'>
          No appointments scheduled. Click "Schedule Appointment" to create one.
        </Alert>
      )}

      {/* Appointments List */}
      <Stack spacing={2}>
        {appointments.map((appointment) => (
          <Card key={appointment.id} elevation={2}>
            <CardContent>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='flex-start'
              >
                <Box flex={1}>
                  <Box display='flex' alignItems='center' mb={1}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant='h6' component='h3'>
                      {appointment.client_name}
                    </Typography>
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                      size='small'
                      sx={{ ml: 2 }}
                    />
                  </Box>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 1 }}
                  >
                    {appointment.client_email}
                  </Typography>

                  {appointment.client_phone && (
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mb: 2 }}
                    >
                      {appointment.client_phone}
                    </Typography>
                  )}

                  <Box display='flex' alignItems='center'>
                    <CalendarToday
                      sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }}
                    />
                    <Typography variant='body1' fontWeight='medium'>
                      {WellnessAPI.formatDate(appointment.appointment_time)}
                    </Typography>
                  </Box>
                </Box>

                <Box textAlign='right'>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    display='block'
                  >
                    Appointment ID
                  </Typography>
                  <Typography variant='body2' fontWeight='medium'>
                    {appointment.external_id}
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    display='block'
                    sx={{ mt: 1 }}
                  >
                    Created: {WellnessAPI.formatDate(appointment.created_at)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default AppointmentList;
