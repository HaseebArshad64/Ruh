import React from "react";
import type { AppointmentWithClient } from "@/shared/types";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";
import { Chip } from "@/shared/components/atoms/Chip";
import { WellnessAPI } from "@/shared/services/api";

interface UpcomingAppointmentCardProps {
  appointment: AppointmentWithClient;
}

export const UpcomingAppointmentCard: React.FC<UpcomingAppointmentCardProps> = ({
  appointment,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        backgroundColor: "background.paper",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {appointment.client_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {appointment.client_email}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="body2" fontWeight="medium">
            {WellnessAPI.formatDate(appointment.appointment_time)}
          </Typography>
          <Chip label={appointment.status} color="primary" size="small" />
        </Box>
      </Box>
    </Box>
  );
};
