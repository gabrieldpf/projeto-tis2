import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const DevApprovalStatusPanel: React.FC = () => {
  // This panel will show status of approvals for dev's deliveries
  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Status das Aprovações</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Em desenvolvimento: lista de entregas com status aprovado/rejeitado.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DevApprovalStatusPanel;
