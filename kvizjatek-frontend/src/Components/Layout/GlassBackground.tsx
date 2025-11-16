import React from 'react';
import Paper from '@mui/material/Paper';

const GlassBackground: React.FC<{ children: React.ReactNode; className?: string }> =
  ({ children, className }) => {
    return (
      <Paper className={`neon-border ${className || ''}`} component="section" elevation={0}>
        {children}
      </Paper>
    );
  };

export default GlassBackground;
