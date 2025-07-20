import React from "react";
import { Button } from "@/shared/components/atoms/Button";

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  variant?: "contained" | "outlined";
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  icon,
  onClick,
  variant = "contained",
}) => {
  return (
    <Button variant={variant} startIcon={icon} onClick={onClick}>
      {label}
    </Button>
  );
};
