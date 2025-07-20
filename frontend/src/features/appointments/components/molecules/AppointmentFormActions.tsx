import React from "react";
import { Save } from "@mui/icons-material";
import { Box } from "@/shared/components/atoms/Box";
import { Button } from "@/shared/components/atoms/Button";

interface AppointmentFormActionsProps {
  loading: boolean;
  onCancel: () => void;
}

export const AppointmentFormActions: React.FC<AppointmentFormActionsProps> = ({
  loading,
  onCancel,
}) => {
  return (
    <Box display="flex" gap={2} justifyContent="flex-end">
      <Button type="button" variant="outlined" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        startIcon={<Save />}
        disabled={loading}
        loading={loading}
        loadingText="Creating..."
        sx={{ minWidth: 150 }}
      >
        Schedule Appointment
      </Button>
    </Box>
  );
};
