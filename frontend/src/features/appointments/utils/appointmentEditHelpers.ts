import { WellnessAPI } from "@/shared/services/api";
import type { AppointmentWithClient, Client } from "@/shared/types";
import { handleApiError } from "@/shared/utils/errorHandling";

export interface FormData {
  client_id: string;
  time: string;
  status: string;
}

export interface FetchAppointmentParams {
  id: string;
  setAppointment: (appointment: AppointmentWithClient | null) => void;
  setClients: (clients: Client[]) => void;
  setFormData: (data: FormData) => void;
  setFetchError: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

// Helper function to prepare form data from appointment
export const prepareFormData = (appointment: AppointmentWithClient): FormData => ({
  client_id: appointment.client_id,
  time: WellnessAPI.formatDateForInput(new Date(appointment.appointment_time)),
  status: appointment.status,
});

// Helper function to prepare update data
export const prepareUpdateData = (
  formData: FormData,
  appointment: AppointmentWithClient,
): { client_id?: string; time?: string; status?: string } => {
  const updateData: { client_id?: string; time?: string; status?: string } = {};

  if (formData.client_id !== appointment.client_id) {
    updateData.client_id = formData.client_id;
  }

  const originalTime = WellnessAPI.formatDateForInput(new Date(appointment.appointment_time));
  if (formData.time !== originalTime) {
    updateData.time = formData.time;
  }

  if (formData.status !== appointment.status) {
    updateData.status = formData.status;
  }

  return updateData;
};

// Helper function to fetch appointment and client data
export const fetchAppointmentData = async (params: FetchAppointmentParams): Promise<void> => {
  const { id, setAppointment, setClients, setFormData, setFetchError, setLoading } = params;

  try {
    const [appointmentsData, clientsData] = await Promise.all([
      WellnessAPI.getAppointmentsWithClients(),
      WellnessAPI.getClients(),
    ]);

    const foundAppointment = appointmentsData.find((a) => a.external_id === id);

    if (!foundAppointment) {
      setFetchError("Appointment not found");
      return;
    }

    setAppointment(foundAppointment);
    setClients(clientsData);
    setFormData(prepareFormData(foundAppointment));
  } catch (err) {
    setFetchError(handleApiError(err, "fetch"));
  } finally {
    setLoading(false);
  }
};
