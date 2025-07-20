import React from "react";
import { Save, Cancel } from "@mui/icons-material";
import { CardContent, MenuItem } from "@mui/material";
import { Box } from "@/shared/components/atoms/Box";
import { Button } from "@/shared/components/atoms/Button";
import { TextField } from "@/shared/components/atoms/TextField";
import { Card } from "@/shared/components/atoms/Card";
import type { Client } from "@/shared/types";
import { APPOINTMENT_STATUS } from "@/features/appointments/constants";

interface FormData {
  client_id: string;
  time: string;
  status: string;
}

interface AppointmentEditFormContentProps {
  formData: FormData;
  clients: Client[];
  updating: boolean;
  onInputChange: (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}

export const AppointmentEditFormContent: React.FC<AppointmentEditFormContentProps> = ({
  formData,
  clients,
  updating,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <Card sx={{ maxWidth: 600 }}>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <TextField
            select
            label="Client"
            value={formData.client_id}
            onChange={onInputChange("client_id")}
            required
            fullWidth
            margin="normal"
            disabled={updating}
          >
            {clients.map((client) => (
              <MenuItem key={client.external_id} value={client.external_id}>
                {client.name} ({client.email})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Appointment Date & Time"
            type="datetime-local"
            value={formData.time}
            onChange={onInputChange("time")}
            required
            fullWidth
            margin="normal"
            disabled={updating}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={onInputChange("status")}
            required
            fullWidth
            margin="normal"
            disabled={updating}
          >
            <MenuItem value={APPOINTMENT_STATUS.SCHEDULED}>Scheduled</MenuItem>
            <MenuItem value={APPOINTMENT_STATUS.COMPLETED}>Completed</MenuItem>
            <MenuItem value={APPOINTMENT_STATUS.CANCELLED}>Cancelled</MenuItem>
          </TextField>

          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={updating}
              fullWidth
            >
              {updating ? "Updating..." : "Update Appointment"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={onCancel}
              disabled={updating}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};
