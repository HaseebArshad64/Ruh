import type { AppointmentWithClient } from "@/shared/types";
import { APPOINTMENT_STATUS } from "@/features/appointments/constants";

// Helper function to filter upcoming appointments
export const filterUpcomingAppointments = (
  appointments: AppointmentWithClient[],
): AppointmentWithClient[] => {
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  return appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_time);
      return (
        appointment.status === APPOINTMENT_STATUS.SCHEDULED &&
        appointmentDate >= new Date() &&
        appointmentDate <= oneWeekFromNow
      );
    })
    .sort(
      (a, b) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime(),
    );
};

// Helper function to count scheduled appointments
export const countScheduledAppointments = (appointments: AppointmentWithClient[]): number => {
  return appointments.filter((appointment) => appointment.status === APPOINTMENT_STATUS.SCHEDULED)
    .length;
};
