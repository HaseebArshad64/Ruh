// Specific error patterns to match against backend responses
export const ERROR_PATTERNS = {
  // Past date errors
  PAST_DATE: [
    "past",
    "cannot schedule in the past",
    "date must be in the future",
    "appointment time has passed",
    "cannot schedule appointments in the past",
    "select a future date and time",
  ],

  // Time conflict errors
  TIME_CONFLICT: [
    "conflict",
    "already booked",
    "time slot unavailable",
    "appointment exists at this time",
    "time slot is already booked",
    "choose a different time",
  ],

  // Email validation errors
  EMAIL_EXISTS: [
    "email already exists",
    "email is taken",
    "duplicate email",
    "email already in use",
    "client with this email address already exists",
    "use a different email",
  ],

  // Phone validation errors
  PHONE_EXISTS: [
    "phone already exists",
    "phone is taken",
    "duplicate phone",
    "phone already in use",
    "client with this phone number already exists",
    "use a different number",
  ],

  // Required field errors
  NAME_REQUIRED: [
    "name is required",
    "name cannot be empty",
    "missing name",
    "client name is required",
    "enter a valid name",
  ],

  EMAIL_REQUIRED: [
    "email is required",
    "email cannot be empty",
    "missing email",
    "client email is required",
    "enter a valid email address",
  ],

  // Email format errors
  INVALID_EMAIL: [
    "invalid email",
    "email format",
    "malformed email",
    "not a valid email",
    "enter a valid email address",
    "john@example.com",
  ],

  // Phone format errors
  INVALID_PHONE: ["invalid phone", "phone format", "malformed phone", "enter a valid phone number"],

  // Date format errors
  INVALID_DATE: ["invalid date", "date format", "malformed date", "invalid datetime"],

  // Not found errors
  NOT_FOUND: ["not found", "does not exist", "record not found", "resource not found"],

  // Already completed/cancelled
  ALREADY_COMPLETED: [
    "already completed",
    "appointment completed",
    "already finished",
    "already been marked as completed",
    "already been completed",
  ],

  ALREADY_CANCELLED: [
    "already cancelled",
    "appointment cancelled",
    "already canceled",
    "already been cancelled",
    "already been canceled",
  ],

  // Client deletion constraints
  CANNOT_DELETE_CLIENT: [
    "cannot delete client",
    "client has appointments",
    "has existing appointments",
    "delete appointments first",
    "cannot delete client with existing appointments",
    "cancel or delete their appointments first",
  ],
} as const;

/**
 * Check if error message matches any pattern
 */
export function matchesPattern(message: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => message.includes(pattern.toLowerCase()));
}
