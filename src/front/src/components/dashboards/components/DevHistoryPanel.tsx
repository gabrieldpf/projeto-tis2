import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const DevHistoryPanel: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Histórico de Entregas</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Lista com todas as entregas e decisões (aprovado/rejeitado).</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DevHistoryPanel;
