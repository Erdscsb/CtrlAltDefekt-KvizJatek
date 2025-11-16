import React from 'react';
import { Button } from '@mui/material';

type Props = {
  icon?: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary';
};

const MenuButton: React.FC<Props> = ({ icon, label, variant = 'primary' }) => {
  const styles =
    variant === 'primary'
      ? { className: 'button-primary' }
      : { variant: 'outlined' as const, color: 'secondary' as const };

  return (
    <Button fullWidth size="large" {...styles} sx={{ py: 1.5, borderWidth: 1.5 }}>
      {icon} &nbsp; {label}
    </Button>
  );
};

export default MenuButton;