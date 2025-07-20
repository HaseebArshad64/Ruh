import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Client, AppointmentWithClient } from "@/shared/types";
import { WellnessAPI } from "@/shared/services/api";
import { SYNC_DELAY } from "@/features/dashboard/constants";
import { filterUpcomingAppointments, countScheduledAppointments } from "@/features/dashboard/utils";
import { useToast } from "@/shared/hooks/useToast";
import { handleApiError } from "@/shared/utils/errorHandling";

export interface UseDashboardReturn {
  clients: Client[];
  upcomingAppointments: AppointmentWithClient[];
  totalAppointments: number;
  scheduledAppointments: number;
  loading: boolean;
  syncing: boolean;
  lastSync: string;
  handleSync: () => void;
  navigateToClients: () => void;
  navigateToAppointments: () => void;
  navigateToNewAppointment: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [allAppointments, setAllAppointments] = useState<AppointmentWithClient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSync, setLastSync] = useState<string>("Never");
  const navigate = useNavigate();
  const { showError, showLoading, updateToast } = useToast();

  // Computed values using helper functions
  const upcomingAppointments = filterUpcomingAppointments(allAppointments);
  const scheduledAppointments = countScheduledAppointments(allAppointments);

  // Data fetching effect
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        const [clientsData, appointmentsData] = await Promise.all([
          WellnessAPI.getClients(),
          WellnessAPI.getAppointmentsWithClients(),
        ]);
        setClients(clientsData);
        setAllAppointments(appointmentsData);
        setLastSync(new Date().toLocaleTimeString());
      } catch (err) {
        showError(handleApiError(err, "fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // showError is stable but not needed as dependency for this effect

  // Sync handler
  const handleSync = async (): Promise<void> => {
    const toastId = showLoading("🔄 Syncing data...");

    try {
      setSyncing(true);
      await WellnessAPI.syncData();
      await new Promise((resolve) => setTimeout(resolve, SYNC_DELAY));
      const [clientsData, appointmentsData] = await Promise.all([
        WellnessAPI.getClients(),
        WellnessAPI.getAppointmentsWithClients(),
      ]);
      setClients(clientsData);
      setAllAppointments(appointmentsData);
      setLastSync(new Date().toLocaleTimeString());

      updateToast(toastId, "✅ Data synced successfully!", "success");
    } catch (err) {
      updateToast(toastId, handleApiError(err, "fetch"), "error");
    } finally {
      setSyncing(false);
    }
  };

  // Navigation handlers
  const navigateToClients = (): void => {
    navigate("/clients");
  };

  const navigateToAppointments = (): void => {
    navigate("/appointments");
  };

  const navigateToNewAppointment = (): void => {
    navigate("/appointments/new");
  };

  return {
    clients,
    upcomingAppointments,
    totalAppointments: allAppointments.length,
    scheduledAppointments,
    loading,
    syncing,
    lastSync,
    handleSync,
    navigateToClients,
    navigateToAppointments,
    navigateToNewAppointment,
  };
};
