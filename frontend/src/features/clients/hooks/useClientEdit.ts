import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WellnessAPI } from "@/shared/services/api";
import { useClientCrud } from "@/features/clients/hooks/useClientCrud";
import type { Client, CreateClientData } from "@/shared/types";
import { useToast } from "@/shared/hooks/useToast";
import { handleApiError } from "@/shared/utils/errorHandling";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface UseClientEditReturn {
  client: Client | null;
  formData: FormData;
  loading: boolean;
  updating: boolean;
  fetchError: string;
  handleInputChange: (
    field: keyof FormData,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => void;
  handleCancel: () => void;
}

interface FetchClientParams {
  id: string;
  setClient: (client: Client | null) => void;
  setFormData: (data: FormData) => void;
  setFetchError: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

// Helper function to fetch client data
const fetchClientData = async (params: FetchClientParams): Promise<void> => {
  const { id, setClient, setFormData, setFetchError, setLoading } = params;

  try {
    const clients = await WellnessAPI.getClients();
    const foundClient = clients.find((c) => c.external_id === id);

    if (!foundClient) {
      setFetchError("Client not found");
      return;
    }

    setClient(foundClient);
    setFormData({
      name: foundClient.name,
      email: foundClient.email,
      phone: foundClient.phone || "",
    });
  } catch (err) {
    setFetchError(err instanceof Error ? err.message : "Failed to fetch client");
  } finally {
    setLoading(false);
  }
};

export const useClientEdit = (id: string | undefined): UseClientEditReturn => {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>("");
  const { showError } = useToast();

  const { updateClient, loading: updating } = useClientCrud((action) => {
    if (action === "update") {
      navigate("/clients");
    }
  });

  useEffect(() => {
    if (!id) {
      const errorMsg = handleApiError("Client ID is required", "client");
      setFetchError(errorMsg);
      showError(errorMsg);
      setLoading(false);
      return;
    }

    fetchClientData({ id, setClient, setFormData, setFetchError, setLoading });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // showError is stable but not needed as dependency for this effect

  const handleInputChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!id || !client) return;

    const updateData: Partial<CreateClientData> = {};

    if (formData.name !== client.name) updateData.name = formData.name;
    if (formData.email !== client.email) updateData.email = formData.email;
    if (formData.phone !== (client.phone || "")) updateData.phone = formData.phone;

    if (Object.keys(updateData).length === 0) {
      navigate("/clients");
      return;
    }

    await updateClient(id, updateData);
  };

  const handleCancel = (): void => {
    navigate("/clients");
  };

  return {
    client,
    formData,
    loading,
    updating,
    fetchError,
    handleInputChange,
    handleSubmit,
    handleCancel,
  };
};
