import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  InputAdornment,
  Stack,
} from '@mui/material';
import { Search, Person, Email, Phone } from '@mui/icons-material';
import { Client } from '../types';
import { WellnessAPI } from '../services/api';

/**
 * ClientList component for displaying and searching clients
 * @returns JSX.Element
 */
const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async (): Promise<void> => {
      try {
        setLoading(true);
        const clientsData = await WellnessAPI.getClients();
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch clients'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.phone && client.phone.includes(searchTerm))
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  /**
   * Handle search input change
   * @param event - Input change event
   */
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(event.target.value);
  };

  /**
   * Generate avatar color based on client name
   * @param name - Client name
   * @returns Color string
   */
  const getAvatarColor = (name: string): string => {
    const colors = ['#1976d2', '#2e7d32', '#d32f2f', '#7b1fa2', '#f57c00'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
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
      <Typography variant='h4' component='h1' gutterBottom>
        Clients ({filteredClients.length})
      </Typography>

      {/* Search Field */}
      <TextField
        fullWidth
        variant='outlined'
        placeholder='Search clients by name, email, or phone...'
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* No clients message */}
      {filteredClients.length === 0 && !loading && (
        <Alert severity='info'>
          {searchTerm
            ? 'No clients found matching your search.'
            : 'No clients available.'}
        </Alert>
      )}

      {/* Clients Stack */}
      <Stack spacing={2}>
        {filteredClients.map((client) => (
          <Card
            key={client.id}
            elevation={2}
            sx={{
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                elevation: 4,
              },
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <Avatar
                  sx={{
                    bgcolor: getAvatarColor(client.name),
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  {client.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant='h6' component='h2'>
                    {client.name}
                  </Typography>
                  <Chip
                    label={`ID: ${client.external_id}`}
                    size='small'
                    color='primary'
                    variant='outlined'
                  />
                </Box>
              </Box>

              <Box display='flex' alignItems='center' mb={1}>
                <Email sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant='body2' color='text.secondary'>
                  {client.email}
                </Typography>
              </Box>

              {client.phone && (
                <Box display='flex' alignItems='center' mb={1}>
                  <Phone
                    sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }}
                  />
                  <Typography variant='body2' color='text.secondary'>
                    {client.phone}
                  </Typography>
                </Box>
              )}

              <Box display='flex' alignItems='center' mt={2}>
                <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                <Typography variant='caption' color='text.secondary'>
                  Added: {WellnessAPI.formatDate(client.created_at)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ClientList;
