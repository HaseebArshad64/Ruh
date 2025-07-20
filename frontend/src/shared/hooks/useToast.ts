import { useCallback } from "react";
import { toast, ToastOptions } from "react-toastify";

// Default toast configuration
const defaultOptions: ToastOptions = {
  position: "bottom-left",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

// Success toast with custom styling
const successOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 3000,
};

// Error toast with custom styling
const errorOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 6000, // Longer duration for errors
};

// Warning toast with custom styling
const warningOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 5000,
};

// Info toast with custom styling
const infoOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 4000,
};

/**
 * Custom hook for toast notifications
 * Provides consistent toast styling and behavior across the app
 * All functions are memoized to prevent unnecessary re-renders
 */
export const useToast = () => {
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    toast.success(message, { ...successOptions, ...options });
  }, []);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    toast.error(message, { ...errorOptions, ...options });
  }, []);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    toast.warning(message, { ...warningOptions, ...options });
  }, []);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    toast.info(message, { ...infoOptions, ...options });
  }, []);

  const showLoading = useCallback((message: string = "Loading...") => {
    return toast.loading(message, defaultOptions);
  }, []);

  const updateToast = useCallback(
    (toastId: any, message: string, type: "success" | "error" | "info" | "warning") => {
      const updateOptions =
        type === "success"
          ? successOptions
          : type === "error"
            ? errorOptions
            : type === "warning"
              ? warningOptions
              : infoOptions;

      toast.update(toastId, {
        render: message,
        type,
        isLoading: false,
        ...updateOptions,
      });
    },
    [],
  );

  const dismiss = useCallback((toastId?: any) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateToast,
    dismiss,
  };
};
