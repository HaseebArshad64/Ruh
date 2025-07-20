import { useState, useEffect, useCallback } from "react";
import type { Client } from "@/shared/types";
import { WellnessAPI } from "@/shared/services/api";
import { useToast } from "@/shared/hooks/useToast";
import { handleApiError } from "@/shared/utils/errorHandling";

const avatarColors: readonly string[] = [
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
] as const;

export interface UseClientListReturn {
  clients: Client[];
  loading: boolean;
  error: string;
  getAvatarColor: (name: string) => string;
  getInitials: (name: string) => string;
  refreshClients: () => Promise<void>;
}

export const useClientList = (): UseClientListReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { showError } = useToast();

  // Fetch clients function - memoized to prevent unnecessary re-renders
  const fetchClients = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const clientsData = await WellnessAPI.getClients();
      setClients(clientsData);
      setError("");
    } catch (err) {
      const errorMessage = handleApiError(err, "fetch");
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Refresh clients function for external use
  const refreshClients = useCallback(async (): Promise<void> => {
    try {
      const clientsData = await WellnessAPI.getClients();
      setClients(clientsData);
      setError("");
    } catch (err) {
      const errorMessage = handleApiError(err, "fetch");
      setError(errorMessage);
      showError(errorMessage);
    }
  }, [showError]);

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Helper function to get avatar color
  const getAvatarColor = (name: string): string => {
    const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    const index = hash % avatarColors.length;
    return avatarColors[index] || "#2196f3";
  };

  // Helper function to get initials
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    clients,
    loading,
    error,
    getAvatarColor,
    getInitials,
    refreshClients,
  };
};
