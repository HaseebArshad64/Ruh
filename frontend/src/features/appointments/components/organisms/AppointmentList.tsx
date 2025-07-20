import React from "react";
import { Add } from "@mui/icons-material";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";
import { Button } from "@/shared/components/atoms/Button";
import { Alert } from "@/shared/components/molecules/Alert";
import { Stack } from "@/shared/components/molecules/Stack";
import { CircularProgress } from "@/shared/components/atoms/CircularProgress";
import { AppointmentCard } from "@/features/appointments/components/molecules/AppointmentCard";
import type { AppointmentWithClient } from "@/shared/types";

interface AppointmentListProps {
  appointments: AppointmentWithClient[];
  loading: boolean;
  error: string;
  navigateToNewAppointment: () => void;
  onEdit: (appointment: AppointmentWithClient) => void;
  onCancel: (appointment: AppointmentWithClient) => void;
  onDelete: (appointment: AppointmentWithClient) => void;
  onComplete: (appointment: AppointmentWithClient) => void;
}

/**
 * Pure AppointmentList UI component
 */
const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  loading,
  error,
  navigateToNewAppointment,
  onEdit,
  onCancel,
  onDelete,
  onComplete,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Appointments ({appointments.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={navigateToNewAppointment}
          size="large"
        >
          Schedule New Appointment
        </Button>
      </Box>

      {appointments.length === 0 ? (
        <Alert severity="info">
          No appointments found. Start by scheduling your first appointment!
        </Alert>
      ) : (
        <Stack spacing={2}>
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onEdit={onEdit}
              onCancel={onCancel}
              onDelete={onDelete}
              onComplete={onComplete}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default AppointmentList;
