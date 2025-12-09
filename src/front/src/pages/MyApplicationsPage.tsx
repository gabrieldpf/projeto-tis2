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
} from '@mui/material';
import { 
  Work, 
  LocationOn, 
  AccessTime, 
  AttachMoney,
  Info,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCandidaturasByUsuario, Candidatura } from '../service/candidaturaService';
import { getJobById } from '../service/jobService';
import { JobPosting } from '../types/job';
import JobDetailsDialog from '../components/jobs/JobDetailsDialog';

interface ApplicationWithJob extends Candidatura {
  job?: JobPosting;
}

const MyApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Candidatura | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const candidaturas = await getCandidaturasByUsuario(user.id);
      
      // Buscar detalhes de cada vaga
      const applicationsWithJobs = await Promise.all(
        candidaturas.map(async (candidatura) => {
          try {
            const job = await getJobById(candidatura.vagaId);
            return { ...candidatura, job };
          } catch (error) {
            console.error(`Failed to fetch job ${candidatura.vagaId}:`, error);
            return candidatura;
          }
        })
      );
      
      setApplications(applicationsWithJobs);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application: ApplicationWithJob) => {
    setSelectedJobId(application.vagaId);
    setSelectedApplication(application);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedJobId(null);
    setSelectedApplication(null);
  };

  const formatSkills = (skills: (string | { id?: number; skill: string })[]): string[] => {
    if (!skills || !Array.isArray(skills)) return [];
    return skills.map(skill => typeof skill === 'string' ? skill : skill.skill);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível';
    try {
      // Se já estiver no formato brasileiro "dd/MM/yyyy HH:mm" ou "dd/MM/yyyy"
      if (dateString.includes('/')) {
        // Parse do formato brasileiro
        const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}))?/);
        if (parts) {
          const [, day, month, year, hour, minute] = parts;
          // Cria a data (mês é 0-indexed no JS)
          const date = new Date(
            parseInt(year), 
            parseInt(month) - 1, 
            parseInt(day), 
            hour ? parseInt(hour) : 0, 
            minute ? parseInt(minute) : 0
          );
          
          // Subtrai 3 horas (ajuste de timezone)
          date.setHours(date.getHours() - 3);
          
          // Formata de volta para o padrão brasileiro
          const adjustedDay = String(date.getDate()).padStart(2, '0');
          const adjustedMonth = String(date.getMonth() + 1).padStart(2, '0');
          const adjustedYear = date.getFullYear();
          
          if (hour && minute) {
            // Com hora
            const adjustedHour = String(date.getHours()).padStart(2, '0');
            const adjustedMinute = String(date.getMinutes()).padStart(2, '0');
            return `${adjustedDay}/${adjustedMonth}/${adjustedYear} ${adjustedHour}:${adjustedMinute}`;
          } else {
            // Sem hora
            return `${adjustedDay}/${adjustedMonth}/${adjustedYear}`;
          }
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
        year: 'numeric' 
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

  if (!user || user.type !== 'developer') {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 10 }}>
        <Container maxWidth="lg">
          <Alert severity="warning">
            Apenas desenvolvedores podem acessar esta página.
          </Alert>
        </Container>
      </Box>
    );
  }

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
        {/* Botão Voltar */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Voltar ao Painel
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Minhas Candidaturas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Você se candidatou a {applications.length} {applications.length === 1 ? 'vaga' : 'vagas'}
          </Typography>
        </Box>

        {applications.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Você ainda não se candidatou a nenhuma vaga
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explore as vagas disponíveis e candidate-se às que mais combinam com você!
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {applications.map((application) => (
              <Grid item xs={12} md={6} key={application.id}>
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
                    {/* Status da Candidatura */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={getStatusLabel(application.status)}
                        color={getStatusColor(application.status)}
                        size="small"
                        icon={<CheckCircle />}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(application.dataCandidatura)}
                      </Typography>
                    </Box>

                    {/* Título da vaga */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Work sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight="bold">
                        {application.job?.title || 'Vaga não disponível'}
                      </Typography>
                    </Box>

                    {application.job ? (
                      <>
                        {/* Descrição */}
                        {application.job.description && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ mb: 2 }}
                            noWrap
                          >
                            {application.job.description}
                          </Typography>
                        )}

                        {/* Informações principais */}
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationOn fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {application.job.localModalidade || 'Não especificado'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AttachMoney fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {application.job.valorReferencia || 'A combinar'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {application.job.regime || 'Não especificado'}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Nível de experiência */}
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={application.job.experienceLevel} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                        </Box>

                        {/* Habilidades */}
                        {application.job.skills && application.job.skills.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {formatSkills(application.job.skills).slice(0, 3).map((skill, index) => (
                              <Chip 
                                key={index} 
                                label={skill} 
                                size="small" 
                                variant="outlined"
                              />
                            ))}
                            {formatSkills(application.job.skills).length > 3 && (
                              <Chip 
                                label={`+${formatSkills(application.job.skills).length - 3}`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        )}
                      </>
                    ) : (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        Detalhes da vaga não disponíveis
                      </Alert>
                    )}

                    {/* Mensagem da candidatura */}
                    {application.mensagem && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Sua mensagem:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {application.mensagem}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      sx={{ borderRadius: 2 }}
                      onClick={() => handleViewDetails(application)}
                      startIcon={<Info />}
                      disabled={!application.job}
                    >
                      Ver Detalhes
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Dialog de Detalhes */}
      <JobDetailsDialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        jobId={selectedJobId}
        isApplied={true}
        applicationDate={selectedApplication?.dataCandidatura}
        applicationStatus={selectedApplication?.status}
      />
    </Box>
  );
};

export default MyApplicationsPage;

