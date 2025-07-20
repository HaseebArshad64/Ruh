import type { ClientMode } from "@/features/appointments/constants";

// Form data interfaces specific to appointments feature
export interface AppointmentFormData {
  client_id: string;
  time: string;
}

export interface NewClientFormData {
  name: string;
  email: string;
  phone: string;
}

export interface AppointmentFormState {
  formData: AppointmentFormData;
  newClientData: NewClientFormData;
  clientMode: ClientMode;
  loading: boolean;
  loadingClients: boolean;
  error: string;
  success: string;
}

export interface AppointmentFormHandlers {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewClientChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClientModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleBack: () => void;
}
