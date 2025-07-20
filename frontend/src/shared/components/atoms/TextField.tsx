import React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

export type TextFieldProps = MuiTextFieldProps;

/**
 * Reusable TextField component
 * Wraps MUI TextField with consistent styling
 */
export const TextField: React.FC<TextFieldProps> = (props) => {
  return <MuiTextField {...props} />;
};
