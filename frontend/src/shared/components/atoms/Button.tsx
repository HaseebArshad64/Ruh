import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'children'> {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

/**
 * Reusable Button component
 * Wraps MUI Button with consistent styling and loading state
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  loadingText,
  disabled,
  startIcon,
  ...props
}) => {
  return (
    <MuiButton
      {...props}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : startIcon}
    >
      {loading && loadingText ? loadingText : children}
    </MuiButton>
  );
};
