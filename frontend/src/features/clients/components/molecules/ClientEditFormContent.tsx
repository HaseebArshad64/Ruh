import React from "react";
import { Save, Cancel } from "@mui/icons-material";
import { CardContent } from "@mui/material";
import { Box } from "@/shared/components/atoms/Box";
import { Button } from "@/shared/components/atoms/Button";
import { TextField } from "@/shared/components/atoms/TextField";
import { Card } from "@/shared/components/atoms/Card";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface ClientEditFormContentProps {
  formData: FormData;
  updating: boolean;
  onInputChange: (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}

export const ClientEditFormContent: React.FC<ClientEditFormContentProps> = ({
  formData,
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
            label="Full Name"
            value={formData.name}
            onChange={onInputChange("name")}
            required
            fullWidth
            margin="normal"
            disabled={updating}
          />

          <TextField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={onInputChange("email")}
            required
            fullWidth
            margin="normal"
            disabled={updating}
          />

          <TextField
            label="Phone Number"
            value={formData.phone}
            onChange={onInputChange("phone")}
            fullWidth
            margin="normal"
            disabled={updating}
          />

          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={updating}
              fullWidth
            >
              {updating ? "Updating..." : "Update Client"}
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
