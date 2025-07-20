import React from "react";
import { Edit, Delete } from "@mui/icons-material";
import { Box } from "@/shared/components/atoms/Box";
import { IconButton } from "@/shared/components/atoms/IconButton";
import type { Client } from "@/shared/types";

interface ClientActionsProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientActions: React.FC<ClientActionsProps> = ({ client, onEdit, onDelete }) => {
  return (
    <Box display="flex" gap={1}>
      <IconButton
        aria-label="Edit client"
        size="small"
        color="primary"
        onClick={() => onEdit(client)}
      >
        <Edit fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="Delete client"
        size="small"
        color="error"
        onClick={() => onDelete(client)}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
};
