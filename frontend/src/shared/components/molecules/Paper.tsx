import React from 'react';
import { Paper as MuiPaper, PaperProps as MuiPaperProps } from '@mui/material';

export type PaperProps = MuiPaperProps;

/**
 * Reusable Paper component
 * Wraps MUI Paper with consistent styling
 */
export const Paper: React.FC<PaperProps> = (props) => {
  return <MuiPaper {...props} />;
};
