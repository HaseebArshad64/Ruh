import React from "react";
import { People, CalendarToday, Schedule } from "@mui/icons-material";
import { CardContent } from "@mui/material";
import { Card } from "@/shared/components/atoms/Card";
import { Typography } from "@/shared/components/atoms/Typography";
import { Stack } from "@/shared/components/molecules/Stack";
import { QuickActionButton } from "@/features/dashboard/components/atoms/QuickActionButton";
import {
  QUICK_ACTIONS_TITLE,
  VIEW_ALL_CLIENTS,
  VIEW_ALL_APPOINTMENTS,
  SCHEDULE_NEW_APPOINTMENT,
} from "@/features/dashboard/constants";

interface QuickActionsSectionProps {
  onViewClients: () => void;
  onViewAppointments: () => void;
  onNewAppointment: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onViewClients,
  onViewAppointments,
  onNewAppointment,
}) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {QUICK_ACTIONS_TITLE}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <QuickActionButton label={VIEW_ALL_CLIENTS} icon={<People />} onClick={onViewClients} />
          <QuickActionButton
            label={VIEW_ALL_APPOINTMENTS}
            icon={<CalendarToday />}
            onClick={onViewAppointments}
          />
          <QuickActionButton
            label={SCHEDULE_NEW_APPOINTMENT}
            icon={<Schedule />}
            onClick={onNewAppointment}
            variant="outlined"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
