import React from 'react';
import { Box as MuiBox, BoxProps as MuiBoxProps } from '@mui/material';

export interface BoxProps extends MuiBoxProps {
  children?: React.ReactNode;
}

/**
 * Reusable Box component
 * Wraps MUI Box with consistent styling
 */
export const Box: React.FC<BoxProps> = ({ children, ...props }) => {
  return <MuiBox {...props}>{children}</MuiBox>;
};
