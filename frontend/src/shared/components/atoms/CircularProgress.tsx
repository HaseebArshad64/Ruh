import React from 'react';
import {
  CircularProgress as MuiCircularProgress,
  CircularProgressProps as MuiCircularProgressProps,
} from '@mui/material';

export type CircularProgressProps = MuiCircularProgressProps;

/**
 * Reusable CircularProgress component
 * Wraps MUI CircularProgress with consistent styling
 */
export const CircularProgress: React.FC<CircularProgressProps> = (props) => {
  return <MuiCircularProgress {...props} />;
};
