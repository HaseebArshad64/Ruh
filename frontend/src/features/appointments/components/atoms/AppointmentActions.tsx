import React from "react";
import { Edit, Delete, Cancel, EventAvailable } from "@mui/icons-material";
import { Box } from "@/shared/components/atoms/Box";
import { IconButton } from "@/shared/components/atoms/IconButton";
import type { AppointmentWithClient } from "@/shared/types";

interface AppointmentActionsProps {
  appointment: AppointmentWithClient;
  onEdit: (appointment: AppointmentWithClient) => void;
  onCancel: (appointment: AppointmentWithClient) => void;
  onDelete: (appointment: AppointmentWithClient) => void;
  onComplete?: ((appointment: AppointmentWithClient) => void) | undefined;
}

export const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointment,
  onEdit,
  onCancel,
  onDelete,
  onComplete,
}) => {
  const { status } = appointment;
  const isScheduled = status === "scheduled";

  return (
    <Box display="flex" gap={1}>
      {/* Edit - Available for scheduled appointments */}
      {isScheduled && (
        <IconButton
          aria-label="Edit appointment"
          size="small"
          color="primary"
          onClick={() => onEdit(appointment)}
        >
          <Edit fontSize="small" />
        </IconButton>
      )}

      {/* Complete - Available for scheduled appointments */}
      {isScheduled && onComplete && (
        <IconButton
          aria-label="Mark as completed"
          size="small"
          color="success"
          onClick={() => onComplete(appointment)}
        >
          <EventAvailable fontSize="small" />
        </IconButton>
      )}

      {/* Cancel - Available for scheduled appointments */}
      {isScheduled && (
        <IconButton
          aria-label="Cancel appointment"
          size="small"
          color="warning"
          onClick={() => onCancel(appointment)}
        >
          <Cancel fontSize="small" />
        </IconButton>
      )}

      {/* Delete - Available for all appointments */}
      <IconButton
        aria-label="Delete appointment"
        size="small"
        color="error"
        onClick={() => onDelete(appointment)}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
};
