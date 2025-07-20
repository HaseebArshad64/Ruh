import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  CircularProgress,
  Paper,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
} from '@mui/material';
import { Save, ArrowBack, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Client, CreateAppointmentData, CreateClientData } from '../types';
import { WellnessAPI } from '../services/api';

/**
 * AppointmentForm component for creating new appointments
 * @returns JSX.Element
 */
const AppointmentForm: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientMode, setClientMode] = useState<'existing' | 'new'>('existing');
  const [formData, setFormData] = useState<CreateAppointmentData>({
    client_id: '',
    time: WellnessAPI.formatDateForInput(new Date()),
  });
  const [newClientData, setNewClientData] = useState<CreateClientData>({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async (): Promise<void> => {
      try {
        setLoadingClients(true);
        const clientsData = await WellnessAPI.getClients();
        setClients(clientsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch clients'
        );
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  /**
   * Handle form input changes
   * @param event - Input change event
   */
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  /**
   * Handle new client data changes
   * @param event - Input change event
   */
  const handleNewClientChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setNewClientData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  /**
   * Handle client mode change (existing vs new)
   * @param event - Radio button change event
   */
  const handleClientModeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const mode = event.target.value as 'existing' | 'new';
    setClientMode(mode);

    // Clear form data when switching modes
    if (mode === 'new') {
      setFormData((prev) => ({ ...prev, client_id: '' }));
    } else {
      setNewClientData({ name: '', email: '', phone: '' });
    }

    // Clear errors
    if (error) setError('');
    if (success) setSuccess('');
  };

  /**
   * Handle form submission
   * @param event - Form submit event
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      let clientId = formData.client_id;

      // If creating a new client, create client first
      if (clientMode === 'new') {
        // Validate new client data
        if (!newClientData.name.trim() || !newClientData.email.trim()) {
          setError('Please fill in name and email for the new client');
          return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newClientData.email)) {
          setError('Please enter a valid email address');
          return;
        }

        try {
          const createdClient = await WellnessAPI.createClient(newClientData);
          clientId = createdClient.external_id;

          // Refresh clients list
          const updatedClients = await WellnessAPI.getClients();
          setClients(updatedClients);
        } catch (clientError) {
          setError(
            clientError instanceof Error
              ? clientError.message
              : 'Failed to create client'
          );
          return;
        }
      } else {
        // Validate existing client selection
        if (!clientId) {
          setError('Please select a client');
          return;
        }
      }

      // Validate appointment time
      if (!formData.time) {
        setError('Please select an appointment time');
        return;
      }

      const appointmentDate = new Date(formData.time);
      if (appointmentDate <= new Date()) {
        setError('Appointment time must be in the future');
        return;
      }

      // Create appointment with the client ID
      const appointmentData = {
        client_id: clientId,
        time: formData.time,
      };

      const newAppointment = await WellnessAPI.createAppointment(
        appointmentData
      );

      const clientName =
        clientMode === 'new'
          ? newClientData.name
          : clients.find((c) => c.external_id === clientId)?.name || 'Unknown';

      setSuccess(
        `Appointment created successfully for ${clientName}! ID: ${newAppointment.external_id}`
      );

      // Reset form
      setFormData({
        client_id: '',
        time: WellnessAPI.formatDateForInput(new Date()),
      });
      setNewClientData({ name: '', email: '', phone: '' });
      setClientMode('existing');

      // Navigate back to appointments list after a delay
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create appointment'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate back to appointments list
   */
  const handleBack = (): void => {
    navigate('/appointments');
  };

  if (loadingClients) {
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

  return (
    <Box>
      <Box display='flex' alignItems='center' mb={3}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mr: 2 }}>
          Back to Appointments
        </Button>
        <Typography variant='h4' component='h1'>
          Schedule New Appointment
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ flex: { md: 2 } }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity='success' sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Client Mode Selection */}
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Client Selection</FormLabel>
                  <RadioGroup
                    row
                    value={clientMode}
                    onChange={handleClientModeChange}
                    sx={{ mt: 1 }}
                  >
                    <FormControlLabel
                      value='existing'
                      control={<Radio />}
                      label='Select Existing Client'
                    />
                    <FormControlLabel
                      value='new'
                      control={<Radio />}
                      label='Add New Client'
                    />
                  </RadioGroup>
                </FormControl>

                {/* Existing Client Selection */}
                {clientMode === 'existing' && (
                  <TextField
                    select
                    fullWidth
                    label='Select Client'
                    name='client_id'
                    value={formData.client_id}
                    onChange={handleInputChange}
                    required
                    helperText='Choose the client for this appointment'
                  >
                    <MenuItem value=''>
                      <em>Select a client...</em>
                    </MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.external_id}>
                        {client.name} ({client.email})
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {/* New Client Fields */}
                {clientMode === 'new' && (
                  <>
                    <Divider>
                      <Typography variant='body2' color='text.secondary'>
                        New Client Information
                      </Typography>
                    </Divider>

                    <TextField
                      fullWidth
                      label='Client Name'
                      name='name'
                      value={newClientData.name}
                      onChange={handleNewClientChange}
                      required
                      helperText="Enter the client's full name"
                    />

                    <TextField
                      fullWidth
                      label='Email Address'
                      name='email'
                      type='email'
                      value={newClientData.email}
                      onChange={handleNewClientChange}
                      required
                      helperText="Enter the client's email address"
                    />

                    <TextField
                      fullWidth
                      label='Phone Number'
                      name='phone'
                      value={newClientData.phone}
                      onChange={handleNewClientChange}
                      helperText="Enter the client's phone number (optional)"
                    />
                  </>
                )}

                <TextField
                  fullWidth
                  type='datetime-local'
                  label='Appointment Date & Time'
                  name='time'
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  helperText='Select the date and time for the appointment'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <Box display='flex' gap={2} justifyContent='flex-end'>
                  <Button
                    type='button'
                    variant='outlined'
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <Save />
                    }
                    disabled={loading}
                    sx={{ minWidth: 150 }}
                  >
                    {loading ? 'Creating...' : 'Schedule Appointment'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Box>

        <Box sx={{ flex: { md: 1 } }}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant='h6'>Instructions</Typography>
              </Box>

              <Typography variant='body2' paragraph>
                Fill out the form to schedule a new appointment:
              </Typography>

              <Typography variant='body2' component='div'>
                <strong>1. Choose Client Option:</strong> Select an existing
                client or add a new one
              </Typography>

              <Typography variant='body2' component='div' sx={{ mt: 1 }}>
                <strong>2. Client Details:</strong>
                {clientMode === 'existing'
                  ? ' Choose from your existing clients'
                  : ' Enter new client information (name and email required)'}
              </Typography>

              <Typography variant='body2' component='div' sx={{ mt: 1 }}>
                <strong>3. Choose Time:</strong> Select a future date and time
                for the appointment
              </Typography>

              <Typography variant='body2' component='div' sx={{ mt: 1 }}>
                <strong>4. Submit:</strong> Click "Schedule Appointment" to
                create the appointment
              </Typography>

              <Alert severity='info' sx={{ mt: 2 }}>
                <Typography variant='body2'>
                  <strong>💡 Tip:</strong> You can add new clients directly when
                  scheduling appointments! This saves time when working with
                  first-time clients.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default AppointmentForm;
