import React from "react";
import { Person, Schedule, CheckCircle, Cancel, Event } from "@mui/icons-material";
import { CardContent } from "@mui/material";
import type { AppointmentWithClient } from "@/shared/types";
import { Card } from "@/shared/components/atoms/Card";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";
import { Chip } from "@/shared/components/atoms/Chip";
import { WellnessAPI } from "@/shared/services/api";
import { AppointmentActions } from "@/features/appointments/components/atoms/AppointmentActions";

interface AppointmentCardProps {
  appointment: AppointmentWithClient;
  onEdit?: (appointment: AppointmentWithClient) => void;
  onCancel?: (appointment: AppointmentWithClient) => void;
  onDelete?: (appointment: AppointmentWithClient) => void;
  onComplete?: (appointment: AppointmentWithClient) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "scheduled":
      return <Schedule sx={{ fontSize: 18 }} />;
    case "completed":
      return <CheckCircle sx={{ fontSize: 18 }} />;
    case "cancelled":
      return <Cancel sx={{ fontSize: 18 }} />;
    default:
      return <Event sx={{ fontSize: 18 }} />;
  }
};

const getStatusColor = (status: string): "primary" | "success" | "error" => {
  switch (status) {
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "primary";
  }
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onCancel,
  onDelete,
  onComplete,
}) => {
  const showActions = onEdit || onCancel || onDelete || onComplete;

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {appointment.client_name}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Person sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {appointment.client_email}
              </Typography>
            </Box>
            {appointment.client_phone && (
              <Typography variant="body2" color="text.secondary">
                Phone: {appointment.client_phone}
              </Typography>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={getStatusIcon(appointment.status)}
              label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              color={getStatusColor(appointment.status)}
              size="small"
            />
            {showActions && (
              <AppointmentActions
                appointment={appointment}
                onEdit={onEdit || (() => {})}
                onCancel={onCancel || (() => {})}
                onDelete={onDelete || (() => {})}
                onComplete={onComplete || undefined}
              />
            )}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" fontWeight="medium">
            {WellnessAPI.formatDate(appointment.appointment_time)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {appointment.external_id}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
