// Appointment status constants
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Client mode constants
export const CLIENT_MODE = {
  EXISTING: 'existing',
  NEW: 'new',
} as const;

// Form validation constants
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Navigation delay for success messages
export const SUCCESS_NAVIGATION_DELAY = 2000;

export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];
export type ClientMode = (typeof CLIENT_MODE)[keyof typeof CLIENT_MODE];
