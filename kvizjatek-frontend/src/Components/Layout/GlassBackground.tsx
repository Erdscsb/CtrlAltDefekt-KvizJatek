import React from 'react';
import Box from '@mui/material/Box';

const GlassBackground: React.FC<{ children: React.ReactNode; className?: string }> =
  ({ children, className }) => {
    return (
      <Box className={`glass neon-border ${className || ''}`} component="section">
        {children}
      </Box>
    );
  };

export default GlassBackground;