import { Client } from "@/shared/types";

/**
 * Get the name of a client by their external ID
 */
export const getClientNameById = (clients: Client[], clientId: string): string => {
  const client = clients.find((c) => c.external_id === clientId);
  return client?.name || "Unknown";
};

/**
 * Validate if appointment time is in the future
 */
export const isAppointmentTimeValid = (timeString: string): boolean => {
  const appointmentDate = new Date(timeString);
  return appointmentDate > new Date();
};

/**
 * Generate avatar color based on name
 */
export const getAvatarColor = (name: string): string => {
  const colors = ["#1976d2", "#2e7d32", "#d32f2f", "#7b1fa2", "#f57c00"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] ?? "#1976d2";
};

/**
 * Get initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
