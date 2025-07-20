import React from "react";
import { MenuItem } from "@mui/material";
import type { Client } from "@/shared/types";
import { TextField } from "@/shared/components/atoms/TextField";

interface ClientSelectorProps {
  clients: Client[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({ clients, value, onChange }) => {
  return (
    <TextField
      select
      fullWidth
      label="Select Client"
      name="client_id"
      value={value}
      onChange={onChange}
      required
      helperText="Choose the client for this appointment"
    >
      <MenuItem value="">
        <em>Select a client...</em>
      </MenuItem>
      {clients.map((client) => (
        <MenuItem key={client.id} value={client.external_id}>
          {client.name} ({client.email})
        </MenuItem>
      ))}
    </TextField>
  );
};
