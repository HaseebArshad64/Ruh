import React from "react";
import { Sync, CheckCircle } from "@mui/icons-material";
import { Box } from "@/shared/components/atoms/Box";
import { Typography } from "@/shared/components/atoms/Typography";
import { Button } from "@/shared/components/atoms/Button";
import { CircularProgress } from "@/shared/components/atoms/CircularProgress";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { StatisticsGrid } from "@/features/dashboard/components/molecules/StatisticsGrid";
import { QuickActionsSection } from "@/features/dashboard/components/molecules/QuickActionsSection";
import { UpcomingAppointmentsSection } from "@/features/dashboard/components/molecules/UpcomingAppointmentsSection";
import { SYSTEM_STATUS_ONLINE } from "@/features/dashboard/constants";

/**
 * Pure Dashboard UI component
 * All business logic is handled by useDashboard hook
 */
const Dashboard: React.FC = () => {
  const {
    clients,
    upcomingAppointments,
    loading,
    syncing,
    lastSync,
    totalAppointments,
    scheduledAppointments,
    handleSync,
    navigateToClients,
    navigateToAppointments,
    navigateToNewAppointment,
  } = useDashboard();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Sync />}
          onClick={handleSync}
          disabled={syncing}
          loading={syncing}
          loadingText="Syncing..."
        >
          Sync Data
        </Button>
      </Box>

      {/* Statistics Cards */}
      <StatisticsGrid
        clientsCount={clients.length}
        totalAppointments={totalAppointments}
        scheduledAppointments={scheduledAppointments}
      />

      {/* Quick Actions */}
      <QuickActionsSection
        onViewClients={navigateToClients}
        onViewAppointments={navigateToAppointments}
        onNewAppointment={navigateToNewAppointment}
      />

      {/* Upcoming Appointments */}
      <UpcomingAppointmentsSection appointments={upcomingAppointments} />

      {/* System Status */}
      <Box display="flex" alignItems="center" justifyContent="center" mt={3}>
        <CheckCircle sx={{ mr: 1, color: "success.main" }} />
        <Typography variant="body2" color="text.secondary">
          {SYSTEM_STATUS_ONLINE} | Last sync: {lastSync}
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
