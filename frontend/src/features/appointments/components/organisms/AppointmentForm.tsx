import React from "react";
import { ArrowBack } from "@mui/icons-material";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";
import { Button } from "@/shared/components/atoms/Button";
import { CircularProgress } from "@/shared/components/atoms/CircularProgress";
import { Paper } from "@/shared/components/molecules/Paper";
import { Stack } from "@/shared/components/molecules/Stack";
import { AppointmentFormContent } from "@/features/appointments/components/molecules/AppointmentFormContent";
import { AppointmentInstructions } from "@/features/appointments/components/molecules/AppointmentInstructions";
import { useAppointmentForm } from "@/features/appointments/hooks/useAppointmentForm";

/**
 * Pure AppointmentForm UI component
 * All business logic is handled by useAppointmentForm hook
 */
const AppointmentForm: React.FC = () => {
  const {
    clients,
    formData,
    newClientData,
    clientMode,
    loading,
    loadingClients,
    handleInputChange,
    handleNewClientChange,
    handleClientModeChange,
    handleSubmit,
    handleBack,
  } = useAppointmentForm();

  if (loadingClients) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mr: 2 }}>
          Back to Appointments
        </Button>
        <Typography variant="h4" component="h1">
          Schedule New Appointment
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        {/* Form Section */}
        <Box sx={{ flex: { md: 2 } }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <AppointmentFormContent
                clients={clients}
                clientMode={clientMode}
                formData={formData}
                newClientData={newClientData}
                loading={loading}
                onClientModeChange={handleClientModeChange}
                onInputChange={handleInputChange}
                onNewClientChange={handleNewClientChange}
                onCancel={handleBack}
              />
            </form>
          </Paper>
        </Box>

        {/* Instructions Section */}
        <Box sx={{ flex: { md: 1 } }}>
          <AppointmentInstructions clientMode={clientMode} />
        </Box>
      </Stack>
    </Box>
  );
};

export default AppointmentForm;
