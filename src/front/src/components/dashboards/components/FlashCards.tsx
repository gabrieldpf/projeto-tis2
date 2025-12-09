import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface FlashCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  avatarBgColor: string;
}

const FlashCard: React.FC<FlashCardProps> = ({ title, value, icon, avatarBgColor }) => (
  <Card>
    <CardContent>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderRadius="12px"
        padding="20px"
      >
        <Box>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h4">{String(value)}</Typography>
        </Box>
        <Avatar sx={{ bgcolor: avatarBgColor }}>{icon}</Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default FlashCard;