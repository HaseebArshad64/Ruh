import { useNavigate } from "react-router-dom";
import { handleAppointmentSubmit } from "@/features/appointments/utils/appointmentFormHelpers";
import { useAppointmentFormState } from "@/features/appointments/hooks/useAppointmentFormState";
import { useToast } from "@/shared/hooks/useToast";
import { handleApiError } from "@/shared/utils/errorHandling";

export const useAppointmentForm = () => {
  const navigate = useNavigate();
  const state = useAppointmentFormState();
  const { showSuccess, showError } = useToast();

  // Event handlers
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    state.setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewClientChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    state.setNewClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    console.log("🎯 Form submitted - Starting appointment creation");
    console.log("📝 Form state:", {
      clientMode: state.clientMode,
      formData: state.formData,
      newClientData: state.newClientData,
    });

    state.setLoading(true);

    try {
      console.log("📞 Calling handleAppointmentSubmit...");
      await handleAppointmentSubmit(state.clientMode, state.formData, state.newClientData);
      console.log("🎉 Appointment submission successful!");
      showSuccess("🎉 Appointment scheduled successfully!");

      // Navigate back to appointments list after a short delay
      setTimeout(() => {
        navigate("/appointments");
      }, 1500);
    } catch (err) {
      console.error("💥 Appointment submission failed:", err);
      const errorMessage = handleApiError(err, "appointment");
      console.log("📝 Error message to show:", errorMessage);
      showError(errorMessage);
    } finally {
      state.setLoading(false);
    }
  };

  const handleBack = (): void => {
    navigate("/appointments");
  };

  return {
    ...state,
    handleInputChange,
    handleNewClientChange,
    handleSubmit,
    handleBack,
    navigate,
  };
};
