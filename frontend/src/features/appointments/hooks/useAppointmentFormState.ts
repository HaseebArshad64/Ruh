import { useState, useEffect } from "react";
import type { Client } from "@/shared/types";
import { WellnessAPI } from "@/shared/services/api";
import type { AppointmentFormData, NewClientFormData } from "@/features/appointments/types";
import { CLIENT_MODE } from "@/features/appointments/constants";
import { useToast } from "@/shared/hooks/useToast";
import { handleApiError } from "@/shared/utils/errorHandling";

// Initial state creators
const createInitialFormData = (): AppointmentFormData => ({
  client_id: "",
  time: WellnessAPI.formatDateForInput(new Date()),
});

const createInitialClientData = (): NewClientFormData => ({
  name: "",
  email: "",
  phone: "",
});

export const useAppointmentFormState = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientMode, setClientMode] = useState<"existing" | "new">("existing");
  const [formData, setFormData] = useState<AppointmentFormData>(createInitialFormData());
  const [newClientData, setNewClientData] = useState<NewClientFormData>(createInitialClientData());
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const { showError } = useToast();

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async (): Promise<void> => {
      try {
        setLoadingClients(true);
        const clientsData = await WellnessAPI.getClients();
        setClients(clientsData);
      } catch (err) {
        showError(handleApiError(err, "fetch"));
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // showError is stable but not needed as dependency for this effect

  const handleClientModeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const mode = event.target.value as "existing" | "new";
    setClientMode(mode);
    if (mode === CLIENT_MODE.NEW) {
      setFormData((prev) => ({ ...prev, client_id: "" }));
    } else {
      setNewClientData(createInitialClientData());
    }
  };

  return {
    clients,
    clientMode,
    formData,
    setFormData,
    newClientData,
    setNewClientData,
    loading,
    setLoading,
    loadingClients,
    handleClientModeChange,
  };
};
