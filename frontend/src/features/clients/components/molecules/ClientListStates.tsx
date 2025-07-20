import React from "react";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";
import { Alert } from "@/shared/components/molecules/Alert";
import { CircularProgress } from "@/shared/components/atoms/CircularProgress";
import { NO_CLIENTS_FOUND, NO_CLIENTS_AVAILABLE } from "@/features/clients/constants";

interface ClientListStatesProps {
  loading?: boolean;
  error?: string;
  isEmpty?: boolean;
  isFiltered?: boolean;
}

export const ClientListStates: React.FC<ClientListStatesProps> = ({
  loading,
  error,
  isEmpty,
  isFiltered,
}) => {
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

  if (isEmpty) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {isFiltered ? NO_CLIENTS_FOUND : NO_CLIENTS_AVAILABLE}
        </Typography>
        {isFiltered && (
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria.
          </Typography>
        )}
      </Box>
    );
  }

  return null;
};
