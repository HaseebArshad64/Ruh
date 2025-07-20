import React from "react";
import { Search } from "@mui/icons-material";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";
import { TextField } from "@/shared/components/atoms/TextField";
import { SEARCH_PLACEHOLDER } from "@/features/clients/constants";

interface ClientListHeaderProps {
  clientCount: number;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientListHeader: React.FC<ClientListHeaderProps> = ({
  clientCount,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Clients ({clientCount})
      </Typography>

      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <TextField
          fullWidth
          placeholder={SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
          }}
        />
      </Box>
    </Box>
  );
};
