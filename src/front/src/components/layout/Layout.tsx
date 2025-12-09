import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../Header';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disablePadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  maxWidth = 'lg', 
  disablePadding = false 
}) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Box component="main" sx={{ pt: 8 }}>
        {maxWidth !== false ? (
          <Container 
            maxWidth={maxWidth} 
            sx={{ py: disablePadding ? 0 : 3 }}
          >
            {children}
          </Container>
        ) : (
          <Box sx={{ py: disablePadding ? 0 : 3 }}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Layout;