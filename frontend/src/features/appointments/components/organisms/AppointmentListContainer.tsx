import React, { useState } from "react";
import { Box } from "@/shared/components/atoms/Box";
import { ConfirmationDialog } from "@/shared/components/molecules/ConfirmationDialog";
import { useAppointmentList } from "@/features/appointments/hooks/useAppointmentList";
import { useAppointmentCrud } from "@/features/appointments/hooks/useAppointmentCrud";
import AppointmentList from "@/features/appointments/components/organisms/AppointmentList";
import type { AppointmentWithClient } from "@/shared/types";
import { useNavigate } from "react-router-dom";

interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  action: () => void;
  color: "primary" | "error" | "warning";
}

// Helper hook for appointment actions
const useAppointmentActions = () => {
  const navigate = useNavigate();
  const { appointments, loading, error, navigateToNewAppointment, refreshAppointments } =
    useAppointmentList();

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    title: "",
    message: "",
    action: () => {},
    color: "primary",
  });

  const { cancelAppointment, deleteAppointment, completeAppointment } = useAppointmentCrud(() => {
    refreshAppointments();
  });

  const handleEdit = (appointment: AppointmentWithClient): void => {
    navigate(`/appointments/${appointment.external_id}/edit`);
  };

  const handleCancel = (appointment: AppointmentWithClient): void => {
    setConfirmDialog({
      open: true,
      title: "Cancel Appointment",
      message: `Are you sure you want to cancel the appointment with ${appointment.client_name}?`,
      action: async () => {
        try {
          await cancelAppointment(appointment.external_id);
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
      color: "warning",
    });
  };

  const handleDelete = (appointment: AppointmentWithClient): void => {
    setConfirmDialog({
      open: true,
      title: "Delete Appointment",
      message: `Are you sure you want to permanently delete the appointment with ${appointment.client_name}? This action cannot be undone.`,
      action: async () => {
        try {
          await deleteAppointment(appointment.external_id);
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
      color: "error",
    });
  };

  const handleComplete = (appointment: AppointmentWithClient): void => {
    setConfirmDialog({
      open: true,
      title: "Complete Appointment",
      message: `Mark the appointment with ${appointment.client_name} as completed?`,
      action: async () => {
        try {
          await completeAppointment(appointment.external_id);
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
      color: "primary",
    });
  };

  const closeConfirmDialog = (): void => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  return {
    appointments,
    loading,
    error,
    confirmDialog,
    navigateToNewAppointment,
    handleEdit,
    handleCancel,
    handleDelete,
    handleComplete,
    closeConfirmDialog,
  };
};

/**
 * Container component that handles CRUD operations for appointments
 */
const AppointmentListContainer: React.FC = () => {
  const {
    appointments,
    loading,
    error,
    confirmDialog,
    navigateToNewAppointment,
    handleEdit,
    handleCancel,
    handleDelete,
    handleComplete,
    closeConfirmDialog,
  } = useAppointmentActions();

  return (
    <Box>
      <AppointmentList
        appointments={appointments}
        loading={loading}
        error={error}
        navigateToNewAppointment={navigateToNewAppointment}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmColor={confirmDialog.color}
        onConfirm={confirmDialog.action}
        onCancel={closeConfirmDialog}
      />
    </Box>
  );
};

export default AppointmentListContainer;
