import React from 'react';
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material';

export interface TypographyProps extends MuiTypographyProps {
  children: React.ReactNode;
}

/**
 * Reusable Typography component
 * Wraps MUI Typography with consistent styling
 */
export const Typography: React.FC<TypographyProps> = ({ children, ...props }) => {
  return <MuiTypography {...props}>{children}</MuiTypography>;
};
