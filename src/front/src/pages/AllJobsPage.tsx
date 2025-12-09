import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Container,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Work, 
  LocationOn, 
  AccessTime, 
  AttachMoney,
  CheckCircle,
  Info,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../service/jobService';
import { JobPosting } from '../types/job';
import { useAuth } from '../contexts/AuthContext';
import { candidatar, verificarCandidatura } from '../service/candidaturaService';
import JobDetailsDialog from '../components/jobs/JobDetailsDialog';

const AllJobsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidaturas, setCandidaturas] = useState<Set<number>>(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchAllJobs();
  }, []);

  useEffect(() => {
    if (user?.id) {
      checkCandidaturas();
    }
  }, [jobs, user]);

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const allJobs = await getJobs();
      // Filtrar apenas vagas ativas
      const activeJobs = Array.isArray(allJobs) 
        ? allJobs.filter(job => job.status?.toLowerCase() === 'ativa')
        : [];
      setJobs(activeJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const checkCandidaturas = async () => {
    if (!user?.id) return;
    
    const candidaturasSet = new Set<number>();
    for (const job of jobs) {
      const jaCandidatou = await verificarCandidatura(user.id, job.id);
      if (jaCandidatou) {
        candidaturasSet.add(job.id);
      }
    }
    setCandidaturas(candidaturasSet);
  };

  const handleCandidatar = async (vagaId: number) => {
    if (!user?.id) {
      setSnackbar({ open: true, message: 'Você precisa estar logado para se candidatar', severity: 'error' });
      return;
    }

    try {
      await candidatar({
        vagaId,
        usuarioId: Number(user.id),
      });
      
      setCandidaturas(prev => new Set(prev).add(vagaId));
      setSnackbar({ open: true, message: 'Candidatura enviada com sucesso!', severity: 'success' });
      
      // Atualiza a lista de vagas para refletir o novo contador
      fetchAllJobs();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Erro ao se candidatar', severity: 'error' });
    }
  };

  const formatSkills = (skills: (string | { id?: number; skill: string })[]): string[] => {
    if (!skills || !Array.isArray(skills)) return [];
    return skills.map(skill => typeof skill === 'string' ? skill : skill.skill);
  };

  const handleViewDetails = (jobId: number) => {
    setSelectedJobId(jobId);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedJobId(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            Voltar para o Painel
          </Button>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Todas as Vagas Ativas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore {jobs.length} {jobs.length === 1 ? 'vaga ativa' : 'vagas ativas'} disponíveis no sistema
          </Typography>
        </Box>

        {jobs.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Nenhuma vaga ativa no momento
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} md={6} key={job.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Nome da Empresa */}
                    {job.nomeEmpresa && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="primary" fontWeight="medium">
                          {job.nomeEmpresa}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Título da vaga */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Work sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight="bold">
                        {job.title}
                      </Typography>
                    </Box>

                    {/* Descrição */}
                    {job.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2 }}
                        noWrap
                      >
                        {job.description}
                      </Typography>
                    )}

                    {/* Informações principais */}
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {job.localModalidade || 'Não especificado'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AttachMoney fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {job.valorReferencia || 'A combinar'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {job.regime || 'Não especificado'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Nível de experiência */}
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={job.experienceLevel} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    </Box>

                    {/* Habilidades */}
                    {job.skills && job.skills.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {formatSkills(job.skills).slice(0, 5).map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                        {formatSkills(job.skills).length > 5 && (
                          <Chip 
                            label={`+${formatSkills(job.skills).length - 5}`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2, display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      sx={{ borderRadius: 2, flex: 1 }}
                      onClick={() => handleViewDetails(Number(job.id))}
                      startIcon={<Info />}
                    >
                      Detalhes
                    </Button>
                    {candidaturas.has(Number(job.id)) ? (
                      <Button 
                        variant="outlined" 
                        disabled
                        startIcon={<CheckCircle />}
                        sx={{ borderRadius: 2, flex: 1 }}
                      >
                        Candidatado
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        sx={{ borderRadius: 2, flex: 1 }}
                        onClick={() => handleCandidatar(job.id)}
                      >
                        Candidatar
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialog de Detalhes */}
      <JobDetailsDialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        jobId={selectedJobId}
        isApplied={candidaturas.has(selectedJobId || 0)}
      />
    </Box>
  );
};

export default AllJobsPage;

