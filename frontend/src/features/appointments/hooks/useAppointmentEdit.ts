import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointmentCrud } from "@/features/appointments/hooks/useAppointmentCrud";
import type { AppointmentWithClient, Client } from "@/shared/types";
import {
  FormData,
  fetchAppointmentData,
  prepareUpdateData,
} from "@/features/appointments/utils/appointmentEditHelpers";
import { useToast } from "@/shared/hooks/useToast";
import { handleApiError } from "@/shared/utils/errorHandling";

interface UseAppointmentEditReturn {
  appointment: AppointmentWithClient | null;
  clients: Client[];
  formData: FormData;
  loading: boolean;
  updating: boolean;
  fetchError: string;
  handleInputChange: (
    field: keyof FormData,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => void;
  handleCancel: () => void;
}

export const useAppointmentEdit = (id: string | undefined): UseAppointmentEditReturn => {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<AppointmentWithClient | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<FormData>({
    client_id: "",
    time: "",
    status: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>("");
  const { showError } = useToast();

  const { updateAppointment, loading: updating } = useAppointmentCrud((action) => {
    if (action === "update") {
      navigate("/appointments");
    }
  });

  useEffect(() => {
    if (!id) {
      const errorMsg = handleApiError("Appointment ID is required", "appointment");
      setFetchError(errorMsg);
      showError(errorMsg);
      setLoading(false);
      return;
    }

    fetchAppointmentData({
      id,
      setAppointment,
      setClients,
      setFormData,
      setFetchError,
      setLoading,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // showError is stable but not needed as dependency for this effect

  const handleInputChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!id || !appointment) return;

    const updateData = prepareUpdateData(formData, appointment);

    if (Object.keys(updateData).length === 0) {
      navigate("/appointments");
      return;
    }

    await updateAppointment(id, updateData);
  };

  const handleCancel = (): void => {
    navigate("/appointments");
  };

  return {
    appointment,
    clients,
    formData,
    loading,
    updating,
    fetchError,
    handleInputChange,
    handleSubmit,
    handleCancel,
  };
};
