import type { AxiosResponse } from "axios";
import type { Client, CreateClientData } from "@/shared/types";
import { apiClient } from "@/shared/services/apiClient";

/**
 * Client-related API operations
 */
export class ClientAPI {
  /**
   * Fetch all clients from the backend
   */
  static async getClients(): Promise<Client[]> {
    const response: AxiosResponse<Client[]> = await apiClient.get("/api/clients");
    return response.data;
  }

  /**
   * Create a new client
   */
  static async createClient(clientData: CreateClientData): Promise<Client> {
    const response: AxiosResponse<Client> = await apiClient.post("/api/clients", clientData);
    return response.data;
  }

  /**
   * Update an existing client
   */
  static async updateClient(
    clientId: string,
    clientData: Partial<CreateClientData>,
  ): Promise<Client> {
    const response: AxiosResponse<Client> = await apiClient.put(
      `/api/clients/${clientId}`,
      clientData,
    );
    return response.data;
  }

  /**
   * Delete a client
   */
  static async deleteClient(clientId: string): Promise<void> {
    await apiClient.delete(`/api/clients/${clientId}`);
  }
}
