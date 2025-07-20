import type { AxiosResponse } from "axios";
import type { Appointment, AppointmentWithClient, CreateAppointmentData } from "@/shared/types";
import { apiClient } from "@/shared/services/apiClient";

/**
 * Appointment-related API operations
 */
export class AppointmentAPI {
  /**
   * Fetch all appointments from the backend
   */
  static async getAppointments(): Promise<Appointment[]> {
    const response: AxiosResponse<Appointment[]> = await apiClient.get("/api/appointments");
    return response.data;
  }

  /**
   * Fetch appointments with client details
   */
  static async getAppointmentsWithClients(): Promise<AppointmentWithClient[]> {
    const response: AxiosResponse<AppointmentWithClient[]> = await apiClient.get(
      "/api/appointments/with_clients",
    );
    return response.data;
  }

  /**
   * Create a new appointment
   */
  static async createAppointment(appointmentData: CreateAppointmentData): Promise<Appointment> {
    console.log("🌐 AppointmentAPI.createAppointment - Sending request:", {
      url: "/api/appointments",
      data: appointmentData,
    });

    try {
      const response: AxiosResponse<Appointment> = await apiClient.post(
        "/api/appointments",
        appointmentData,
      );
      console.log("✅ AppointmentAPI.createAppointment - Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("💥 AppointmentAPI.createAppointment - Failed:", error);
      throw error;
    }
  }

  /**
   * Create appointment with new client (atomic operation)
   */
  static async createAppointmentWithNewClient(data: {
    name: string;
    email: string;
    phone?: string;
    time: string;
  }): Promise<AppointmentWithClient> {
    console.log("🌐 AppointmentAPI.createAppointmentWithNewClient - Sending request:", {
      url: "/api/appointments/with_new_client",
      data: data,
    });

    try {
      const response: AxiosResponse<AppointmentWithClient> = await apiClient.post(
        "/api/appointments/with_new_client",
        data,
      );
      console.log("✅ AppointmentAPI.createAppointmentWithNewClient - Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("💥 AppointmentAPI.createAppointmentWithNewClient - Failed:", error);
      throw error;
    }
  }

  /**
   * Update an existing appointment
   */
  static async updateAppointment(
    appointmentId: string,
    appointmentData: Partial<CreateAppointmentData & { status: string }>,
  ): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await apiClient.put(
      `/api/appointments/${appointmentId}`,
      appointmentData,
    );
    return response.data;
  }

  /**
   * Cancel an appointment
   */
  static async cancelAppointment(appointmentId: string): Promise<Appointment> {
    const response: AxiosResponse<Appointment> = await apiClient.put(
      `/api/appointments/${appointmentId}/cancel`,
    );
    return response.data;
  }

  /**
   * Delete an appointment
   */
  static async deleteAppointment(appointmentId: string): Promise<void> {
    await apiClient.delete(`/api/appointments/${appointmentId}`);
  }

  /**
   * Sync data with external API
   */
  static async syncData(): Promise<void> {
    await apiClient.post("/api/sync");
  }
}
