import React from "react";
import { CalendarToday } from "@mui/icons-material";
import { CardContent } from "@mui/material";
import type { ClientMode } from "@/features/appointments/constants";
import { CLIENT_MODE } from "@/features/appointments/constants";
import { Box } from "@/shared/components/atoms/Box";
import { Card } from "@/shared/components/atoms/Card";
import { Typography } from "@/shared/components/atoms/Typography";
import { Alert } from "@/shared/components/molecules/Alert";

interface AppointmentInstructionsProps {
  clientMode: ClientMode;
}

export const AppointmentInstructions: React.FC<AppointmentInstructionsProps> = ({ clientMode }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">Instructions</Typography>
        </Box>

        <Typography variant="body2" paragraph>
          Fill out the form to schedule a new appointment:
        </Typography>

        <Typography variant="body2" component="div">
          <strong>1. Choose Client Option:</strong> Select an existing client or add a new one
        </Typography>

        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
          <strong>2. Client Details:</strong>
          {clientMode === CLIENT_MODE.EXISTING
            ? " Choose from your existing clients"
            : " Enter new client information (name and email required)"}
        </Typography>

        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
          <strong>3. Choose Time:</strong> Select a future date and time for the appointment
        </Typography>

        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
          <strong>4. Submit:</strong> Click "Schedule Appointment" to create the appointment
        </Typography>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>💡 Tip:</strong> You can add new clients directly when scheduling appointments!
            This saves time when working with first-time clients.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};
