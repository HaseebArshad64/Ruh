import { WellnessAPI } from "@/shared/services/api";
import type { AppointmentFormData, NewClientFormData } from "@/features/appointments/types";
import { CLIENT_MODE } from "@/features/appointments/constants";

// Helper function to create new client and appointment (atomic operation)
export const createNewClientAndAppointment = async (
  newClientData: NewClientFormData,
  appointmentTime: string,
): Promise<void> => {
  console.log("🚀 createNewClientAndAppointment - Starting with data:", {
    newClientData,
    appointmentTime,
  });

  // Validate new client data
  if (!newClientData.name || !newClientData.email) {
    console.error("❌ Validation failed: Name and email are required");
    throw new Error("Name and email are required for new clients");
  }

  const requestData = {
    name: newClientData.name,
    email: newClientData.email,
    phone: newClientData.phone,
    time: appointmentTime,
  };

  console.log("📤 Sending atomic request with data:", requestData);

  try {
    // Create both client and appointment atomically
    const result = await WellnessAPI.createAppointmentWithNewClient(requestData);
    console.log("✅ Atomic creation successful:", result);
  } catch (error) {
    console.error("💥 Atomic creation failed:", error);
    throw error;
  }
};

// Helper function to create appointment with existing client
export const createAppointmentWithExistingClient = async (
  formData: AppointmentFormData,
): Promise<void> => {
  console.log("🚀 createAppointmentWithExistingClient - Starting with data:", formData);

  // Validate existing client selection
  if (!formData.client_id) {
    console.error("❌ Validation failed: No client selected");
    throw new Error("Please select a client");
  }

  const requestData = {
    client_id: formData.client_id,
    time: formData.time,
  };

  console.log("📤 Sending appointment request with data:", requestData);

  try {
    // Create appointment with existing client
    const result = await WellnessAPI.createAppointment(requestData);
    console.log("✅ Appointment creation successful:", result);
  } catch (error) {
    console.error("💥 Appointment creation failed:", error);
    throw error;
  }
};

// Main submit handler
export const handleAppointmentSubmit = async (
  clientMode: "existing" | "new",
  formData: AppointmentFormData,
  newClientData: NewClientFormData,
): Promise<void> => {
  if (clientMode === CLIENT_MODE.NEW) {
    await createNewClientAndAppointment(newClientData, formData.time);
  } else {
    await createAppointmentWithExistingClient(formData);
  }
};
