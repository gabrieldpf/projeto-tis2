import React from 'react';
import { Grid } from '@mui/material';
import FlashCard from './FlashCards'; // Adjust path if needed

interface StatsItem {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  avatarBgColor: string;
}

interface StatsGridProps {
  stats: StatsItem[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    {stats.map((stat, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <FlashCard {...stat} />
      </Grid>
    ))}
  </Grid>
);

export default StatsGrid;