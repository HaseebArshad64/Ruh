import React from "react";
import { CardContent, SxProps, Theme } from "@mui/material";
import { Card } from "@/shared/components/atoms/Card";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";

interface StatisticCardProps {
  label: string;
  value: number;
  icon: React.ReactElement;
  iconColor?: string;
  sx?: SxProps<Theme>;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  label,
  value,
  icon,
  iconColor = "primary.main",
  sx,
}) => {
  return (
    <Card sx={{ flex: 1, ...sx }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {label}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ fontSize: 40, color: iconColor }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};
