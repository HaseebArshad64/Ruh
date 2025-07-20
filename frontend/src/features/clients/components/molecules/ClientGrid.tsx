import React from "react";
import { Email, Phone } from "@mui/icons-material";
import { Grid, CardContent } from "@mui/material";
import type { Client } from "@/shared/types";
import { Avatar } from "@/shared/components/atoms/Avatar";
import { Box } from "@/shared/components/atoms/Box";
import { Card } from "@/shared/components/atoms/Card";
import { Typography } from "@/shared/components/atoms/Typography";
import { ClientActions } from "@/features/clients/components/atoms/ClientActions";

interface ClientGridProps {
  clients: Client[];
  getAvatarColor: (name: string) => string;
  getInitials: (name: string) => string;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

export const ClientGrid: React.FC<ClientGridProps> = ({
  clients,
  getAvatarColor,
  getInitials,
  onEdit,
  onDelete,
}) => {
  const showActions = onEdit || onDelete;

  return (
    <Grid container spacing={3}>
      {clients.map((client) => (
        <Grid item xs={12} sm={6} md={4} key={client.id}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: getAvatarColor(client.name),
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  {getInitials(client.name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="h2">
                    {client.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {client.external_id}
                  </Typography>
                </Box>
                {showActions && (
                  <Box>
                    <ClientActions
                      client={client}
                      onEdit={onEdit || (() => {})}
                      onDelete={onDelete || (() => {})}
                    />
                  </Box>
                )}
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <Email sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">{client.email}</Typography>
              </Box>

              {client.phone && (
                <Box display="flex" alignItems="center">
                  <Phone sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2">{client.phone}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
