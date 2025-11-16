import React from 'react';
import { Button } from '@mui/material';

type Props = {
  icon?: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const MenuButton: React.FC<Props> = ({
  icon,
  label,
  variant = 'primary',
  onClick,
}) => {
  const styles =
    variant === 'primary'
      ? { variant: 'contained' as const, color: 'primary' as const }
      : { variant: 'outlined' as const, color: 'secondary' as const };

  return (
    <Button
      fullWidth
      size="large"
      {...styles}
      sx={{ py: 1.5, borderWidth: 1.5 }}
      onClick={onClick}
      startIcon={icon}
    >
      {label}
    </Button>
  );
};

export default MenuButton;
