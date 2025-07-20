import type {
  Client,
  Appointment,
  AppointmentWithClient,
  CreateAppointmentData,
  CreateClientData,
} from "@/shared/types";
import { ClientAPI } from "@/shared/services/clientApi";
import { AppointmentAPI } from "@/shared/services/appointmentApi";
import { DateUtils } from "@/shared/services/dateUtils";

/**
 * Main API service class that delegates to specialized API modules
 * This provides a unified interface while keeping the code modular
 */
export class WellnessAPI {
  // Client operations
  static async getClients(): Promise<Client[]> {
    return ClientAPI.getClients();
  }

  static async createClient(clientData: CreateClientData): Promise<Client> {
    return ClientAPI.createClient(clientData);
  }

  static async updateClient(
    clientId: string,
    clientData: Partial<CreateClientData>,
  ): Promise<Client> {
    return ClientAPI.updateClient(clientId, clientData);
  }

  static async deleteClient(clientId: string): Promise<void> {
    return ClientAPI.deleteClient(clientId);
  }

  // Appointment operations
  static async getAppointments(): Promise<Appointment[]> {
    return AppointmentAPI.getAppointments();
  }

  static async getAppointmentsWithClients(): Promise<AppointmentWithClient[]> {
    return AppointmentAPI.getAppointmentsWithClients();
  }

  static async createAppointment(appointmentData: CreateAppointmentData): Promise<Appointment> {
    return AppointmentAPI.createAppointment(appointmentData);
  }

  static async createAppointmentWithNewClient(data: {
    name: string;
    email: string;
    phone?: string;
    time: string;
  }): Promise<AppointmentWithClient> {
    return AppointmentAPI.createAppointmentWithNewClient(data);
  }

  static async updateAppointment(
    appointmentId: string,
    appointmentData: Partial<CreateAppointmentData & { status: string }>,
  ): Promise<Appointment> {
    return AppointmentAPI.updateAppointment(appointmentId, appointmentData);
  }

  static async cancelAppointment(appointmentId: string): Promise<Appointment> {
    return AppointmentAPI.cancelAppointment(appointmentId);
  }

  static async deleteAppointment(appointmentId: string): Promise<void> {
    return AppointmentAPI.deleteAppointment(appointmentId);
  }

  static async syncData(): Promise<void> {
    return AppointmentAPI.syncData();
  }

  // Date utilities
  static formatDate(dateString: string): string {
    return DateUtils.formatDate(dateString);
  }

  static formatDateForInput(date?: Date): string {
    return DateUtils.formatDateForInput(date);
  }
}
