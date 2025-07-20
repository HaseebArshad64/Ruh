// User-friendly error messages for different scenarios
export const ERROR_MESSAGES = {
  // Network and connection errors
  NETWORK_ERROR:
    "🌐 Unable to connect to the server. Please check your internet connection and try again.",
  TIMEOUT_ERROR: "⏱️ Request timed out. Please try again in a moment.",
  SERVER_ERROR: "🚨 Server is experiencing issues. Please try again later.",

  // Authentication and authorization
  UNAUTHORIZED: "🔐 You are not authorized to perform this action. Please log in and try again.",
  FORBIDDEN: "⛔ You don't have permission to access this resource.",

  // Appointment related errors
  APPOINTMENT_PAST_DATE:
    "📅 Cannot schedule appointments in the past. Please select a future date and time.",
  APPOINTMENT_TIME_CONFLICT: "⚠️ This time slot is already booked. Please choose a different time.",
  APPOINTMENT_INVALID_TIME: "🕐 Please select a valid date and time for the appointment.",
  APPOINTMENT_MISSING_CLIENT: "👤 Please select a client before scheduling the appointment.",
  APPOINTMENT_NOT_FOUND:
    "❌ Appointment not found. It may have been deleted or modified by another user.",
  APPOINTMENT_ALREADY_COMPLETED: "✅ This appointment has already been marked as completed.",
  APPOINTMENT_ALREADY_CANCELLED: "❌ This appointment has already been cancelled.",

  // Client related errors
  CLIENT_EMAIL_EXISTS:
    "📧 A client with this email address already exists. Please use a different email.",
  CLIENT_PHONE_EXISTS:
    "📱 A client with this phone number already exists. Please use a different number.",
  CLIENT_NOT_FOUND: "👤 Client not found. They may have been deleted by another user.",
  CLIENT_NAME_REQUIRED: "✏️ Client name is required. Please enter a valid name.",
  CLIENT_EMAIL_REQUIRED: "📧 Client email is required. Please enter a valid email address.",
  CLIENT_INVALID_EMAIL: "📧 Please enter a valid email address (e.g., john@example.com).",
  CLIENT_INVALID_PHONE: "📱 Please enter a valid phone number.",
  CLIENT_HAS_APPOINTMENTS:
    "📅 Cannot delete client with existing appointments. Please cancel or delete their appointments first, then try again.",

  // Validation errors
  VALIDATION_ERROR: "📝 Please check your input and fix any errors before submitting.",
  REQUIRED_FIELD_MISSING: "⚠️ Please fill in all required fields.",
  INVALID_DATE_FORMAT: "📅 Please enter a valid date and time.",
  INVALID_EMAIL_FORMAT: "📧 Please enter a valid email address.",

  // Generic fallback errors
  CREATION_FAILED: "❌ Failed to create the record. Please check your information and try again.",
  UPDATE_FAILED: "❌ Failed to update the record. Please check your changes and try again.",
  DELETE_FAILED: "❌ Failed to delete the record. Please try again.",
  FETCH_FAILED: "📊 Unable to load data. Please refresh the page and try again.",

  // Default fallback
  UNKNOWN_ERROR:
    "😞 Something unexpected happened. Please try again or contact support if the problem persists.",
} as const;
