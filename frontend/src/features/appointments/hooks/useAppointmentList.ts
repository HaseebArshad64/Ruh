import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppointmentWithClient } from "@/shared/types";
import { WellnessAPI } from "@/shared/services/api";
import { APPOINTMENT_STATUS } from "@/features/appointments/constants";
import { useToast } from "@/shared/hooks/useToast";
import { handleApiError } from "@/shared/utils/errorHandling";

export interface UseAppointmentListReturn {
  appointments: AppointmentWithClient[];
  loading: boolean;
  error: string;
  handleCreateAppointment: () => void;
  navigateToNewAppointment: () => void;
  refreshAppointments: () => Promise<void>;
  getStatusColor: (
    status: string,
  ) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

export const useAppointmentList = (): UseAppointmentListReturn => {
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { showError } = useToast();

  // Fetch appointments function - memoized to prevent unnecessary re-renders
  const fetchAppointments = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const appointmentsData = await WellnessAPI.getAppointmentsWithClients();
      setAppointments(appointmentsData);
      setError("");
    } catch (err) {
      const errorMessage = handleApiError(err, "fetch");
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Refresh appointments function for external use
  const refreshAppointments = useCallback(async (): Promise<void> => {
    try {
      const appointmentsData = await WellnessAPI.getAppointmentsWithClients();
      setAppointments(appointmentsData);
      setError("");
    } catch (err) {
      const errorMessage = handleApiError(err, "fetch");
      setError(errorMessage);
      showError(errorMessage);
    }
  }, [showError]);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCreateAppointment = (): void => {
    navigate("/appointments/new");
  };

  const navigateToNewAppointment = (): void => {
    navigate("/appointments/new");
  };

  const getStatusColor = (
    status: string,
  ): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case APPOINTMENT_STATUS.SCHEDULED:
        return "primary";
      case APPOINTMENT_STATUS.COMPLETED:
        return "success";
      case APPOINTMENT_STATUS.CANCELLED:
        return "error";
      default:
        return "default";
    }
  };

  return {
    appointments,
    loading,
    error,
    handleCreateAppointment,
    navigateToNewAppointment,
    refreshAppointments,
    getStatusColor,
  };
};
