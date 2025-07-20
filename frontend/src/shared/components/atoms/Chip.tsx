import React from 'react';
import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material';

export type ChipProps = MuiChipProps;

/**
 * Reusable Chip component
 * Wraps MUI Chip with consistent styling
 */
export const Chip: React.FC<ChipProps> = (props) => {
  return <MuiChip {...props} />;
};
