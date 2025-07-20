import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';

export interface CardProps extends MuiCardProps {
  children: React.ReactNode;
}

/**
 * Reusable Card component
 * Wraps MUI Card with consistent styling
 */
export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <MuiCard {...props}>{children}</MuiCard>;
};
