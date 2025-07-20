import React from 'react';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';

export type AvatarProps = MuiAvatarProps;

/**
 * Reusable Avatar component
 * Wraps MUI Avatar with consistent styling
 */
export const Avatar: React.FC<AvatarProps> = (props) => {
  return <MuiAvatar {...props} />;
};
