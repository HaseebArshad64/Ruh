import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";
import { Button } from "@/shared/components/atoms/Button";
import { Alert } from "@/shared/components/molecules/Alert";
import { CircularProgress } from "@/shared/components/atoms/CircularProgress";
import { AppointmentEditFormContent } from "@/features/appointments/components/molecules/AppointmentEditFormContent";
import { useAppointmentEdit } from "@/features/appointments/hooks/useAppointmentEdit";

/**
 * Appointment edit form page component
 */
const AppointmentEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    clients,
    formData,
    loading,
    updating,
    fetchError,
    handleInputChange,
    handleSubmit,
    handleCancel,
  } = useAppointmentEdit(id);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
        <Button onClick={handleCancel}>Back to Appointments</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Appointment
      </Typography>

      <AppointmentEditFormContent
        formData={formData}
        clients={clients}
        updating={updating}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default AppointmentEditForm;
