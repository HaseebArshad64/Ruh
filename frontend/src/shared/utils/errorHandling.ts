import { AxiosError } from "axios";
import { ERROR_MESSAGES } from "@/shared/utils/errorMessages";
import { ERROR_PATTERNS, matchesPattern } from "@/shared/utils/errorPatterns";

/**
 * Parse backend error response and extract meaningful error message
 */
function parseBackendError(error: AxiosError): string {
  const responseData = error.response?.data as any;
  let errorMessage = "";

  console.log("🔍 parseBackendError - Full error object:", error);
  console.log("🔍 parseBackendError - Response data:", responseData);
  console.log("🔍 parseBackendError - Response data type:", typeof responseData);

  if (typeof responseData === "string") {
    errorMessage = responseData;
    console.log("🔍 parseBackendError - Using string responseData:", errorMessage);
  } else if (responseData?.error) {
    errorMessage = responseData.error;
    console.log("🔍 parseBackendError - Using responseData.error:", errorMessage);
  } else if (responseData?.message) {
    errorMessage = responseData.message;
    console.log("🔍 parseBackendError - Using responseData.message:", errorMessage);
  } else if (responseData?.details) {
    errorMessage = responseData.details;
    console.log("🔍 parseBackendError - Using responseData.details:", errorMessage);
  } else if (error.message) {
    errorMessage = error.message;
    console.log("🔍 parseBackendError - Using error.message:", errorMessage);
  }

  const lowercaseMessage = errorMessage.toLowerCase();
  console.log("🔍 parseBackendError - Final lowercase message:", lowercaseMessage);
  return lowercaseMessage;
}

/**
 * Handle HTTP status code errors
 */
function handleStatusCodeError(status: number, context?: string): string | null {
  switch (status) {
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      if (context === "appointment") return ERROR_MESSAGES.APPOINTMENT_NOT_FOUND;
      if (context === "client") return ERROR_MESSAGES.CLIENT_NOT_FOUND;
      return ERROR_MESSAGES.FETCH_FAILED;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return null;
  }
}

/**
 * Handle pattern-based errors
 */
function handlePatternError(errorMessage: string): string | null {
  console.log("🔍 Testing patterns for:", errorMessage);

  // Test CANNOT_DELETE_CLIENT first (most specific for current issue)
  if (matchesPattern(errorMessage, ERROR_PATTERNS.CANNOT_DELETE_CLIENT)) {
    console.log("🎯 CANNOT_DELETE_CLIENT matched!");
    return ERROR_MESSAGES.CLIENT_HAS_APPOINTMENTS;
  }

  // Test other patterns
  const patterns = [
    [ERROR_PATTERNS.PAST_DATE, ERROR_MESSAGES.APPOINTMENT_PAST_DATE],
    [ERROR_PATTERNS.TIME_CONFLICT, ERROR_MESSAGES.APPOINTMENT_TIME_CONFLICT],
    [ERROR_PATTERNS.EMAIL_EXISTS, ERROR_MESSAGES.CLIENT_EMAIL_EXISTS],
    [ERROR_PATTERNS.PHONE_EXISTS, ERROR_MESSAGES.CLIENT_PHONE_EXISTS],
    [ERROR_PATTERNS.NAME_REQUIRED, ERROR_MESSAGES.CLIENT_NAME_REQUIRED],
    [ERROR_PATTERNS.EMAIL_REQUIRED, ERROR_MESSAGES.CLIENT_EMAIL_REQUIRED],
    [ERROR_PATTERNS.INVALID_EMAIL, ERROR_MESSAGES.CLIENT_INVALID_EMAIL],
    [ERROR_PATTERNS.INVALID_PHONE, ERROR_MESSAGES.CLIENT_INVALID_PHONE],
    [ERROR_PATTERNS.INVALID_DATE, ERROR_MESSAGES.INVALID_DATE_FORMAT],
    [ERROR_PATTERNS.ALREADY_COMPLETED, ERROR_MESSAGES.APPOINTMENT_ALREADY_COMPLETED],
    [ERROR_PATTERNS.ALREADY_CANCELLED, ERROR_MESSAGES.APPOINTMENT_ALREADY_CANCELLED],
  ] as const;

  for (const [pattern, message] of patterns) {
    if (matchesPattern(errorMessage, pattern)) {
      console.log("🎯 Pattern matched:", message);
      return message;
    }
  }

  console.log("🔍 No patterns matched");
  return null;
}

/**
 * Get context-specific fallback message
 */
function getContextFallback(status: number, context?: string): string {
  if (status === 400) {
    if (context === "appointment") return ERROR_MESSAGES.APPOINTMENT_INVALID_TIME;
    if (context === "client") return ERROR_MESSAGES.VALIDATION_ERROR;
    return ERROR_MESSAGES.VALIDATION_ERROR;
  }

  if (context === "create") return ERROR_MESSAGES.CREATION_FAILED;
  if (context === "update") return ERROR_MESSAGES.UPDATE_FAILED;
  if (context === "delete") return ERROR_MESSAGES.DELETE_FAILED;
  if (context === "fetch") return ERROR_MESSAGES.FETCH_FAILED;

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Get user-friendly error message based on the error type and content
 */
function getUserFriendlyMessage(error: AxiosError, context?: string): string {
  const status = error.response?.status;
  const errorMessage = parseBackendError(error);

  // Debug logging
  console.log("🐛 getUserFriendlyMessage:", {
    status,
    errorMessage,
    context,
    responseData: error.response?.data,
  });

  // Try status code first
  if (status) {
    const statusError = handleStatusCodeError(status, context);
    console.log("🐛 Status error result:", statusError);
    if (statusError) return statusError;
  }

  // Try pattern matching
  const patternError = handlePatternError(errorMessage);
  console.log("🐛 Pattern error result:", patternError);
  if (patternError) return patternError;

  // Return context-specific fallback
  const fallback = getContextFallback(status || 0, context);
  console.log("🐛 Fallback result:", fallback);
  return fallback;
}

/**
 * Handle wrapped errors from cached code
 */
function handleWrappedError(error: Error, context?: string): string | null {
  if (!error.message.includes("Request failed with status code")) return null;

  const statusMatch = error.message.match(/status code (\d+)/);
  if (statusMatch && statusMatch[1]) {
    const status = parseInt(statusMatch[1], 10);
    if (status === 409 && context === "delete") {
      return ERROR_MESSAGES.CLIENT_HAS_APPOINTMENTS;
    }
    return handleStatusCodeError(status, context);
  }
  return null;
}

/**
 * Handle different types of errors and return user-friendly messages
 */
export function handleApiError(error: unknown, context?: string): string {
  console.log("🐛 handleApiError:", { context, errorType: typeof error });

  if (error instanceof Error && error.message === "Network Error") {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (error instanceof Error && error.message.includes("timeout")) {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  if (error instanceof Error && "isAxiosError" in error) {
    const result = getUserFriendlyMessage(error as AxiosError, context);
    console.log("🐛 Axios result:", result);
    return result;
  }

  if (error instanceof Error) {
    const wrappedResult = handleWrappedError(error, context);
    if (wrappedResult) return wrappedResult;

    if (error.message.match(/[📅🕐👤📧📱✏️⚠️❌✅🌐⏱️🚨🔐⛔😞📊📝]/)) {
      return error.message;
    }
    return getUserFriendlyMessage(error as any, context);
  }

  return typeof error === "string" ? error : ERROR_MESSAGES.UNKNOWN_ERROR;
}
