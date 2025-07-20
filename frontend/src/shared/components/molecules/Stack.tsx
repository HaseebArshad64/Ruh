import React from 'react';
import { Stack as MuiStack, StackProps as MuiStackProps } from '@mui/material';

export type StackProps = MuiStackProps;

/**
 * Reusable Stack component
 * Wraps MUI Stack with consistent styling
 */
export const Stack: React.FC<StackProps> = (props) => {
  return <MuiStack {...props} />;
};
