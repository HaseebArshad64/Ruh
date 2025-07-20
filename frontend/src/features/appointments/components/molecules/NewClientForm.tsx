import React from "react";
import { Divider } from "@mui/material";
import { Typography } from "@/shared/components/atoms/Typography";
import { TextField } from "@/shared/components/atoms/TextField";
import { Stack } from "@/shared/components/molecules/Stack";
import type { NewClientFormData } from "@/features/appointments/types";

interface NewClientFormProps {
  data: NewClientFormData;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NewClientForm: React.FC<NewClientFormProps> = ({ data, onChange }) => {
  return (
    <>
      <Divider>
        <Typography variant="body2" color="text.secondary">
          New Client Information
        </Typography>
      </Divider>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Client Name"
          name="name"
          value={data.name}
          onChange={onChange}
          required
          helperText="Enter the client's full name"
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={data.email}
          onChange={onChange}
          required
          helperText="Enter the client's email address"
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={data.phone}
          onChange={onChange}
          helperText="Enter the client's phone number (optional)"
        />
      </Stack>
    </>
  );
};
