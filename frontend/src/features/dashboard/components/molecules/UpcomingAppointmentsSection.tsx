import React from "react";
import { TrendingUp } from "@mui/icons-material";
import { CardContent } from "@mui/material";
import type { AppointmentWithClient } from "@/shared/types";
import { Card } from "@/shared/components/atoms/Card";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";
import { Chip } from "@/shared/components/atoms/Chip";
import { Stack } from "@/shared/components/molecules/Stack";
import { UpcomingAppointmentCard } from "@/features/dashboard/components/molecules/UpcomingAppointmentCard";
import {
  UPCOMING_APPOINTMENTS_TITLE,
  NO_UPCOMING_APPOINTMENTS,
  UPCOMING_APPOINTMENTS_COUNT_SUFFIX,
} from "@/features/dashboard/constants";

interface UpcomingAppointmentsSectionProps {
  appointments: AppointmentWithClient[];
}

export const UpcomingAppointmentsSection: React.FC<UpcomingAppointmentsSectionProps> = ({
  appointments,
}) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">{UPCOMING_APPOINTMENTS_TITLE}</Typography>
          <Chip
            icon={<TrendingUp />}
            label={`${appointments.length} ${UPCOMING_APPOINTMENTS_COUNT_SUFFIX}`}
            color="primary"
            variant="outlined"
          />
        </Box>

        {appointments.length === 0 ? (
          <Typography color="text.secondary">{NO_UPCOMING_APPOINTMENTS}</Typography>
        ) : (
          <Stack spacing={2}>
            {appointments.map((appointment) => (
              <UpcomingAppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
