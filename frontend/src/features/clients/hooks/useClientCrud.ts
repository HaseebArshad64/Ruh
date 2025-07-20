import { useState } from "react";
import type { Client, CreateClientData } from "@/shared/types";
import { WellnessAPI } from "@/shared/services/api";
import { useToast } from "@/shared/hooks/useToast";
import { handleApiError } from "@/shared/utils/errorHandling";

interface UseClientCrudReturn {
  loading: boolean;
  updateClient: (clientId: string, data: Partial<CreateClientData>) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
}

export const useClientCrud = (
  onSuccess?: (action: string, client?: Client) => void,
): UseClientCrudReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const { showSuccess, showError } = useToast();

  const updateClient = async (clientId: string, data: Partial<CreateClientData>): Promise<void> => {
    try {
      setLoading(true);
      const updatedClient = await WellnessAPI.updateClient(clientId, data);
      showSuccess("✅ Client updated successfully!");
      onSuccess?.("update", updatedClient);
    } catch (err) {
      showError(handleApiError(err, "client"));
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (clientId: string): Promise<void> => {
    try {
      setLoading(true);
      console.log("🚀 Starting client deletion for ID:", clientId);
      await WellnessAPI.deleteClient(clientId);
      showSuccess("🗑️ Client deleted successfully");
      onSuccess?.("delete");
    } catch (err) {
      console.error("💥 Client deletion failed:", err);
      const errorMessage = handleApiError(err, "delete");
      console.log("📝 Final error message to show:", errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateClient,
    deleteClient,
  };
};
