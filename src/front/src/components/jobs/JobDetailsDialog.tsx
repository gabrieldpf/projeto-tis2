import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Close,
  Work,
  LocationOn,
  AccessTime,
  AttachMoney,
  Schedule,
  Payment,
  Description,
  CheckCircle,
} from '@mui/icons-material';
import { JobPosting } from '../../types/job';
import { getJobById } from '../../service/jobService';

interface JobDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  jobId: number | null;
  isApplied?: boolean;
  applicationDate?: string;
  applicationStatus?: string;
}

const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ 
  open, 
  onClose, 
  jobId, 
  isApplied = false,
  applicationDate,
  applicationStatus = 'pendente'
}) => {
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && jobId) {
      fetchJobDetails();
    }
  }, [open, jobId]);

  const fetchJobDetails = async () => {
    if (!jobId) return;
    
    try {
      setLoading(true);
      const jobData = await getJobById(jobId);
      setJob(jobData);
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSkills = (skills: (string | { id?: number; skill: string })[]): string[] => {
    if (!skills || !Array.isArray(skills)) return [];
    return skills.map(skill => typeof skill === 'string' ? skill : skill.skill);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Data não disponível';
    try {
      // Se já estiver no formato brasileiro "dd/MM/yyyy HH:mm", precisa parsear e ajustar
      if (dateString.includes('/')) {
        // Parse do formato brasileiro "dd/MM/yyyy HH:mm"
        const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
        if (parts) {
          const [, day, month, year, hour, minute] = parts;
          // Cria a data (mês é 0-indexed no JS)
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
          
          // Subtrai 3 horas (ajuste de timezone)
          date.setHours(date.getHours() - 3);
          
          // Formata de volta para o padrão brasileiro
          const adjustedDay = String(date.getDate()).padStart(2, '0');
          const adjustedMonth = String(date.getMonth() + 1).padStart(2, '0');
          const adjustedYear = date.getFullYear();
          const adjustedHour = String(date.getHours()).padStart(2, '0');
          const adjustedMinute = String(date.getMinutes()).padStart(2, '0');
          
          return `${adjustedDay}/${adjustedMonth}/${adjustedYear} ${adjustedHour}:${adjustedMinute}`;
        }
      }
      
      // Caso contrário, tenta parsear como ISO
      const date = new Date(dateString);
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data não disponível';
      }
      
      // Subtrai 3 horas
      date.setHours(date.getHours() - 3);
      
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data não disponível';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'warning';
      case 'em_analise':
        return 'info';
      case 'aceito':
        return 'success';
      case 'rejeitado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'Pendente';
      case 'em_analise':
        return 'Em Análise';
      case 'aceito':
        return 'Aceito';
      case 'rejeitado':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Work color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Detalhes da Vaga
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : job ? (
          <Box>
            {/* Status da Candidatura */}
            {isApplied && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle sx={{ color: 'success.main' }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Você está candidatado a esta vaga
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Data da candidatura: {formatDate(applicationDate || '')}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={`Status: ${getStatusLabel(applicationStatus)}`}
                    color={getStatusColor(applicationStatus)}
                    size="small"
                  />
                </Box>
              </Box>
            )}

            {/* Nome da Empresa */}
            {job.nomeEmpresa && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary" fontWeight="medium">
                  {job.nomeEmpresa}
                </Typography>
              </Box>
            )}

            {/* Título e Nível */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {job.title}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Chip 
                label={job.experienceLevel} 
                color="primary"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Descrição */}
            {job.description && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Description color="action" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Descrição
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {job.description}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Informações Principais */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Informações da Vaga
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Localização/Modalidade
                    </Typography>
                    <Typography variant="body2">
                      {job.localModalidade || 'Não especificado'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Regime de Trabalho
                    </Typography>
                    <Typography variant="body2">
                      {job.regime || 'Não especificado'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Payment color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Modelo de Remuneração
                    </Typography>
                    <Typography variant="body2">
                      {job.modeloRemuneracao || 'Não especificado'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Valor de Referência
                    </Typography>
                    <Typography variant="body2">
                      {job.valorReferencia || 'A combinar'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Prazo Estimado
                    </Typography>
                    <Typography variant="body2">
                      {job.prazoEstimado || 'Não especificado'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Work color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Data de Publicação
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(job.postedDate)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Habilidades Requeridas */}
            {job.skills && job.skills.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Habilidades Requeridas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formatSkills(job.skills).map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Estatísticas */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Candidaturas
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {job.applications || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Matches
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {job.matches || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary" align="center">
            Não foi possível carregar os detalhes da vaga
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobDetailsDialog;

