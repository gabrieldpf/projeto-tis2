import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDisputesPanel from '../components/dashboards/components/AdminDisputesPanel';

const DisputesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redireciona se não for admin
  React.useEffect(() => {
    if (user && user.type !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 10, pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Contestações em Análise
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie as contestações de feedback realizadas por desenvolvedores e empresas
          </Typography>
        </Box>
        <AdminDisputesPanel />
      </Container>
    </Box>
  );
};

export default DisputesPage;

