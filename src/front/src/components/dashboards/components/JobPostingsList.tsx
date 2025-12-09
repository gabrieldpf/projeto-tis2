import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Divider, Chip, Avatar, Select, MenuItem, Button, IconButton } from '@mui/material';
import { Work, AttachMoney, LocationOn, Schedule, Edit, Delete } from '@mui/icons-material';
import { JobPosting } from '../../../types/job';

interface JobPostingsListProps {
  jobPostings: JobPosting[];
  getStatusColor: (status: string) => "success" | "warning" | "error";
  handleStatusChange: (jobId: number, newStatus: 'ativa' | 'pausada' | 'fechada') => void;
  onEditJob?: (job: JobPosting) => void;
  onDeleteJob?: (jobId: number) => void;
  onViewDetails?: (jobId: number) => void;
}

const JobPostingsList: React.FC<JobPostingsListProps> = ({ jobPostings, getStatusColor, handleStatusChange, onEditJob, onDeleteJob, onViewDetails }) => {
  const [openSelectId, setOpenSelectId] = React.useState<number | null>(null);

  const handleStatusChangeAndClose = async (jobId: number, newStatus: 'ativa' | 'pausada' | 'fechada') => {
    setOpenSelectId(null); // Fecha o select imediatamente
    await handleStatusChange(jobId, newStatus);
  };

  return (
    <List>
      {jobPostings.map((job, index) => (
        <React.Fragment key={job.id}>
        <ListItem>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Work />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" component="div">
              <Typography variant="h6" component="div">{job.title}</Typography>
              <Chip
                label={
                  job.status?.toLowerCase() === 'ativa' ? 'Ativa' :
                  job.status?.toLowerCase() === 'pausada' ? 'Pausada' :
                  job.status?.toLowerCase() === 'fechada' ? 'Fechada' : 
                  (job.status || 'Desconhecido')
                }
                color={getStatusColor(job.status || 'ativa')}
                size="small"
              />
            </Box>
            <Box component="div" sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" component="div">
                {job.experienceLevel} • Publicada em {job.postedDate}
              </Typography>
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 0.5, mb: 1 }} component="div">
                <Box display="flex" alignItems="center" gap={0.5} component="span">
                  <AttachMoney fontSize="small" />
                  <Typography variant="body2" component="span">{job.valorReferencia}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5} component="span">
                  <LocationOn fontSize="small" />
                  <Typography variant="body2" component="span">{job.localModalidade}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5} component="span">
                  <Schedule fontSize="small" />
                  <Typography variant="body2" component="span">Prazo: {job.prazoEstimado}</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 1 }} component="div">
                <Typography variant="body2" component="span">Regime: {job.regime || 'Não especificado'}</Typography>
                <Typography variant="body2" component="span">Modelo: {job.modeloRemuneracao || 'Não especificado'}</Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ mb: 1 }} component="div">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill, index) => {
                    // Handle both string and object formats from backend
                    const skillName = typeof skill === 'object' && skill !== null ? skill.skill : skill;
                    return (
                      <Chip
                        key={index}
                        label={skillName || 'Skill'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma habilidade especificada
                  </Typography>
                )}
              </Box>
              <Box display="flex" gap={3} component="div">
                <Typography variant="body2" component="span">
                  <strong>{Number(job.applications) || 0}</strong> candidaturas 
                </Typography>
                <Typography variant="body2" component="span">
                  <strong>{Number(job.matches) || 0}</strong> matches 
                </Typography>
              </Box>
            </Box>
          </ListItemText>
          <ListItemSecondaryAction>
            <Box display="flex" gap={1} alignItems="center">
              <Select
                value={job.status?.toLowerCase() || 'ativa'}
                onChange={(e) => handleStatusChangeAndClose(job.id, e.target.value as 'ativa' | 'pausada' | 'fechada')}
                open={openSelectId === job.id}
                onOpen={() => setOpenSelectId(job.id)}
                onClose={() => setOpenSelectId(null)}
                size="small"
                variant="outlined"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="ativa">Ativa</MenuItem>
                <MenuItem value="pausada">Pausada</MenuItem>
                <MenuItem value="fechada">Fechada</MenuItem>
              </Select>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => onViewDetails?.(job.id)}
              >
                Ver Detalhes
              </Button>
              {onEditJob && (
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => onEditJob(job)}
                  title="Editar vaga"
                >
                  <Edit />
                </IconButton>
              )}
              {onDeleteJob && (
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => onDeleteJob(job.id)}
                  title="Excluir vaga"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          </ListItemSecondaryAction>
        </ListItem>
        {index < jobPostings.length - 1 && <Divider />}
      </React.Fragment>
    ))}
  </List>
  );
};

export default JobPostingsList;