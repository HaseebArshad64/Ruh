import React from "react";
import type { Client } from "@/shared/types";
import { TextField } from "@/shared/components/atoms/TextField";
import { Stack } from "@/shared/components/molecules/Stack";
import { CLIENT_MODE } from "@/features/appointments/constants";
import { ClientModeSelector } from "@/features/appointments/components/atoms/ClientModeSelector";
import { ClientSelector } from "@/features/appointments/components/atoms/ClientSelector";
import { NewClientForm } from "@/features/appointments/components/molecules/NewClientForm";
import { AppointmentFormActions } from "@/features/appointments/components/molecules/AppointmentFormActions";
import type { AppointmentFormData, NewClientFormData } from "@/features/appointments/types";
import type { ClientMode } from "@/features/appointments/constants";

interface AppointmentFormContentProps {
  clients: Client[];
  clientMode: ClientMode;
  formData: AppointmentFormData;
  newClientData: NewClientFormData;
  loading: boolean;
  onClientModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNewClientChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export const AppointmentFormContent: React.FC<AppointmentFormContentProps> = ({
  clients,
  clientMode,
  formData,
  newClientData,
  loading,
  onClientModeChange,
  onInputChange,
  onNewClientChange,
  onCancel,
}) => {
  return (
    <Stack spacing={3}>
      {/* Client Mode Selection */}
      <ClientModeSelector value={clientMode} onChange={onClientModeChange} />

      {/* Client Selection */}
      {clientMode === CLIENT_MODE.EXISTING ? (
        <ClientSelector clients={clients} value={formData.client_id} onChange={onInputChange} />
      ) : (
        <NewClientForm data={newClientData} onChange={onNewClientChange} />
      )}

      {/* Appointment Time */}
      <TextField
        fullWidth
        type="datetime-local"
        label="Appointment Date & Time"
        name="time"
        value={formData.time}
        onChange={onInputChange}
        required
        helperText="Select the date and time for the appointment"
        InputLabelProps={{ shrink: true }}
      />

      {/* Form Actions */}
      <AppointmentFormActions loading={loading} onCancel={onCancel} />
    </Stack>
  );
};
