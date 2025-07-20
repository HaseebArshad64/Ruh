import React from "react";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import type { ClientMode } from "@/features/appointments/constants";
import { CLIENT_MODE } from "@/features/appointments/constants";

interface ClientModeSelectorProps {
  value: ClientMode;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientModeSelector: React.FC<ClientModeSelectorProps> = ({ value, onChange }) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Client Selection</FormLabel>
      <RadioGroup row value={value} onChange={onChange} sx={{ mt: 1 }}>
        <FormControlLabel
          value={CLIENT_MODE.EXISTING}
          control={<Radio />}
          label="Select Existing Client"
        />
        <FormControlLabel value={CLIENT_MODE.NEW} control={<Radio />} label="Add New Client" />
      </RadioGroup>
    </FormControl>
  );
};
