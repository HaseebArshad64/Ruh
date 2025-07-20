import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@/shared/components/atoms/Box";
import { Alert } from "@/shared/components/molecules/Alert";
import { CircularProgress } from "@/shared/components/atoms/CircularProgress";
import { ConfirmationDialog } from "@/shared/components/molecules/ConfirmationDialog";
import { ClientGrid } from "@/features/clients/components/molecules/ClientGrid";
import { useClientList } from "@/features/clients/hooks/useClientList";
import { useClientCrud } from "@/features/clients/hooks/useClientCrud";
import type { Client } from "@/shared/types";

interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  action: () => void;
  color: "primary" | "error" | "warning";
}

/**
 * Pure ClientList UI component with CRUD operations
 */
const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const { clients, loading, error, getAvatarColor, getInitials, refreshClients } = useClientList();

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    title: "",
    message: "",
    action: () => {},
    color: "primary",
  });

  const { deleteClient } = useClientCrud(() => {
    refreshClients();
  });

  const handleEdit = (client: Client): void => {
    navigate(`/clients/${client.external_id}/edit`);
  };

  const handleDelete = (client: Client): void => {
    setConfirmDialog({
      open: true,
      title: "Delete Client",
      message: `Are you sure you want to permanently delete ${client.name}? This action cannot be undone.`,
      action: async () => {
        try {
          await deleteClient(client.external_id);
        } finally {
          // Close modal regardless of success or failure
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
      color: "error",
    });
  };

  const closeConfirmDialog = (): void => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {clients.length === 0 ? (
        <Alert severity="info">No clients found. Start by adding your first client!</Alert>
      ) : (
        <ClientGrid
          clients={clients}
          getAvatarColor={getAvatarColor}
          getInitials={getInitials}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmColor={confirmDialog.color}
        onConfirm={confirmDialog.action}
        onCancel={closeConfirmDialog}
      />
    </Box>
  );
};

export default ClientList;
