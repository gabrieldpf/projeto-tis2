
import React from 'react';
import { Box, Typography } from '@mui/material';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {subtitle}
    </Typography>
  </Box>
);

export default Header;