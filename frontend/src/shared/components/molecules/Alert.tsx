import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps } from '@mui/material';

export type AlertProps = MuiAlertProps;

/**
 * Reusable Alert component
 * Wraps MUI Alert with consistent styling
 */
export const Alert: React.FC<AlertProps> = (props) => {
  return <MuiAlert {...props} />;
};
