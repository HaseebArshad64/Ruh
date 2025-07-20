import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  Client,
  Appointment,
  AppointmentWithClient,
  CreateAppointmentData,
  CreateClientData,
  ApiResponse,
} from '../types';

// API configuration
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:4567';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

/**
 * API service class for managing HTTP requests to the Ruby backend
 */
export class WellnessAPI {
  /**
   * Fetch all clients from the backend
   * @returns Promise<Client[]> Array of clients
   * @throws Error if request fails
   */
  static async getClients(): Promise<Client[]> {
    try {
      const response: AxiosResponse<Client[]> = await apiClient.get(
        '/api/clients'
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch clients: ${error}`);
    }
  }

  /**
   * Create a new client
   * @param clientData - The client data to create
   * @returns Promise<Client> The created client
   * @throws Error if request fails
   */
  static async createClient(clientData: CreateClientData): Promise<Client> {
    try {
      const response: AxiosResponse<Client> = await apiClient.post(
        '/api/clients',
        clientData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.error || 'Failed to create client';
        throw new Error(errorMessage);
      }
      throw new Error(`Failed to create client: ${error}`);
    }
  }

  /**
   * Fetch all appointments from the backend
   * @returns Promise<Appointment[]> Array of appointments
   * @throws Error if request fails
   */
  static async getAppointments(): Promise<Appointment[]> {
    try {
      const response: AxiosResponse<Appointment[]> = await apiClient.get(
        '/api/appointments'
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch appointments: ${error}`);
    }
  }

  /**
   * Fetch appointments with client details
   * @returns Promise<AppointmentWithClient[]> Array of appointments with client info
   * @throws Error if request fails
   */
  static async getAppointmentsWithClients(): Promise<AppointmentWithClient[]> {
    try {
      const response: AxiosResponse<AppointmentWithClient[]> =
        await apiClient.get('/api/appointments/with_clients');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch appointments with clients: ${error}`);
    }
  }

  /**
   * Create a new appointment
   * @param appointmentData - The appointment data to create
   * @returns Promise<Appointment> The created appointment
   * @throws Error if request fails
   */
  static async createAppointment(
    appointmentData: CreateAppointmentData
  ): Promise<Appointment> {
    try {
      const response: AxiosResponse<Appointment> = await apiClient.post(
        '/api/appointments',
        appointmentData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.error || 'Failed to create appointment';
        throw new Error(errorMessage);
      }
      throw new Error(`Failed to create appointment: ${error}`);
    }
  }

  /**
   * Trigger manual sync with external API
   * @returns Promise<ApiResponse<string>> Sync result message
   * @throws Error if request fails
   */
  static async syncData(): Promise<ApiResponse<string>> {
    try {
      const response: AxiosResponse<ApiResponse<string>> = await apiClient.post(
        '/api/sync'
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to sync data: ${error}`);
    }
  }

  /**
   * Check API health status
   * @returns Promise<{ status: string, timestamp: string }> Health status
   * @throws Error if request fails
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response: AxiosResponse<{ status: string; timestamp: string }> =
        await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error}`);
    }
  }

  /**
   * Validate appointment data before submission
   * @param data - Appointment data to validate
   * @returns Object with validation results
   */
  static validateAppointmentData(data: CreateAppointmentData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.client_id || data.client_id.trim() === '') {
      errors.push('Client ID is required');
    }

    if (!data.time || data.time.trim() === '') {
      errors.push('Appointment time is required');
    } else {
      const appointmentDate = new Date(data.time);
      const now = new Date();

      if (isNaN(appointmentDate.getTime())) {
        errors.push('Invalid appointment time format');
      } else if (appointmentDate <= now) {
        errors.push('Appointment time must be in the future');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format date string for display
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  }

  /**
   * Format date for form input (datetime-local)
   * @param date - Date object
   * @returns Formatted date string for input
   */
  static formatDateForInput(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
