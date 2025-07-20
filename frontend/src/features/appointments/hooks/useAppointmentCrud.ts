import { useState } from "react";
import { WellnessAPI } from "@/shared/services/api";
import type { AppointmentWithClient } from "@/shared/types";
import { useToast } from "@/shared/hooks/useToast";
import { handleApiError } from "@/shared/utils/errorHandling";

interface UseAppointmentCrudReturn {
  loading: boolean;
  updateAppointment: (
    appointmentId: string,
    data: { client_id?: string; time?: string; status?: string },
  ) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  deleteAppointment: (appointmentId: string) => Promise<void>;
  completeAppointment: (appointmentId: string) => Promise<void>;
}

export const useAppointmentCrud = (
  onSuccess?: (action: string, appointment?: AppointmentWithClient) => void,
): UseAppointmentCrudReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const { showSuccess, showError } = useToast();

  const updateAppointment = async (
    appointmentId: string,
    data: { client_id?: string; time?: string; status?: string },
  ): Promise<void> => {
    try {
      setLoading(true);
      const updatedAppointment = await WellnessAPI.updateAppointment(appointmentId, data);
      showSuccess("✅ Appointment updated successfully!");
      onSuccess?.("update", updatedAppointment as AppointmentWithClient);
    } catch (err) {
      showError(handleApiError(err, "update"));
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string): Promise<void> => {
    try {
      setLoading(true);
      const cancelledAppointment = await WellnessAPI.cancelAppointment(appointmentId);
      showSuccess("⚠️ Appointment cancelled successfully");
      onSuccess?.("cancel", cancelledAppointment as AppointmentWithClient);
    } catch (err) {
      showError(handleApiError(err, "update"));
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (appointmentId: string): Promise<void> => {
    try {
      setLoading(true);
      await WellnessAPI.deleteAppointment(appointmentId);
      showSuccess("🗑️ Appointment deleted permanently");
      onSuccess?.("delete");
    } catch (err) {
      showError(handleApiError(err, "delete"));
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async (appointmentId: string): Promise<void> => {
    try {
      setLoading(true);
      const completedAppointment = await WellnessAPI.updateAppointment(appointmentId, {
        status: "completed",
      });
      showSuccess("🎉 Appointment marked as completed!");
      onSuccess?.("complete", completedAppointment as AppointmentWithClient);
    } catch (err) {
      showError(handleApiError(err, "update"));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    completeAppointment,
  };
};
