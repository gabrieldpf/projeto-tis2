

// dashboards/components/CandidatesGrid.tsx
import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Chip, Button, Avatar } from '@mui/material';
import { Star, LocationOn, Schedule, Code } from '@mui/icons-material';
import { Candidate } from '../CompanyDashboard'; // Assume types

interface CandidatesGridProps {
  candidates: Candidate[];
}

const CandidatesGrid: React.FC<CandidatesGridProps> = ({ candidates }) => (
  <Grid container spacing={3}>
    {candidates.map((candidate) => (
      <Grid item xs={12} md={6} key={candidate.id}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h6">{candidate.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {candidate.role} • {candidate.experience}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Star sx={{ color: 'warning.main', fontSize: 20 }} />
                <Typography variant="h6" color="warning.main">
                  {candidate.matchScore}%
                </Typography>
              </Box>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
              {candidate.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<Code />}
                />
              ))}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">{candidate.location}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Schedule fontSize="small" />
                <Typography variant="body2">Disponível: {candidate.availability}</Typography>
              </Box>
            </Box>

            <Box display="flex" gap={1}>
              <Button variant="contained" size="small" fullWidth>
                Contatar
              </Button>
              <Button variant="outlined" size="small" fullWidth>
                Salvar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default CandidatesGrid;