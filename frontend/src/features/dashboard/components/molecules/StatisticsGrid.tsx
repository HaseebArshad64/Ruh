import React from "react";
import { People, CalendarToday, Schedule } from "@mui/icons-material";
import { Stack } from "@/shared/components/molecules/Stack";
import { StatisticCard } from "@/features/dashboard/components/atoms/StatisticCard";
import {
  TOTAL_CLIENTS_LABEL,
  TOTAL_APPOINTMENTS_LABEL,
  SCHEDULED_LABEL,
} from "@/features/dashboard/constants";

interface StatisticsGridProps {
  clientsCount: number;
  totalAppointments: number;
  scheduledAppointments: number;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  clientsCount,
  totalAppointments,
  scheduledAppointments,
}) => {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={4}>
      <StatisticCard
        label={TOTAL_CLIENTS_LABEL}
        value={clientsCount}
        icon={<People />}
        iconColor="primary.main"
      />
      <StatisticCard
        label={TOTAL_APPOINTMENTS_LABEL}
        value={totalAppointments}
        icon={<CalendarToday />}
        iconColor="secondary.main"
      />
      <StatisticCard
        label={SCHEDULED_LABEL}
        value={scheduledAppointments}
        icon={<Schedule />}
        iconColor="success.main"
      />
    </Stack>
  );
};
