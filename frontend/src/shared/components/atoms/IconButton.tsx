import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';

interface IconButtonProps extends Omit<MuiIconButtonProps, 'children'> {
  children: React.ReactNode;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
  return <MuiIconButton {...props}>{children}</MuiIconButton>;
};
