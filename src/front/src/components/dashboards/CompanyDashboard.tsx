import React, { useState, useEffect, Suspense } from 'react';
import { 
  Box, Card, Tabs, Tab, Badge, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Divider, Grid
} from '@mui/material';
import { 
  Add, Work, People, Star, TrendingUp, AttachMoney, LocationOn, Business, AccessTime
} from '@mui/icons-material';
import TabPanel from './components/TabPanel';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import { createJob, getJobsByUsuario, updateJob, deleteJob, updateJobStatus } from '../../service/jobService';
import { JobPosting } from '../../types/job';
import { useAuth } from '../../contexts/AuthContext';

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [feedbackTab, setFeedbackTab] = useState(0);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobPosting | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user]);

  // Seleciona a aba de feedback via query param (ex: /?feedbackTab=contratos)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ft = params.get('feedbackTab');
    if (ft === 'contratos') {
      setFeedbackTab(0);
    } else if (ft === 'finalizados') {
      setFeedbackTab(1);
    } else if (ft === 'recebidos') {
      setFeedbackTab(2);
    }
  }, []);

  const fetchJobs = async () => {
    try {
      if (!user?.id) return;
      // Busca apenas as vagas da empresa logada
      const jobs = await getJobsByUsuario(user.id);
      // Garantir que jobs seja sempre um array
      setJobPostings(Array.isArray(jobs) ? jobs : []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      // Em caso de erro, setar como array vazio
      setJobPostings([]);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    const colors = {
      ativa: 'success',
      pausada: 'warning',
      fechada: 'error',
    } as const;
    return colors[statusLower as keyof typeof colors] || 'default';
  };

  const handlePublishJob = async (jobData: Omit<JobPosting, 'id' | 'applications' | 'matches' | 'status' | 'postedDate'>) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      // Adiciona o usuarioId aos dados da vaga
      const jobDataWithUser = {
        ...jobData,
        usuarioId: Number(user.id)
      };
  await createJob(jobDataWithUser);
  // Refetch para garantir consistência (contadores, formatação de data, skills com IDs)
      await fetchJobs();
    } catch (error) {
      console.error('Failed to publish job:', error);
      throw error; // Rethrow to let the dialog handle the error
    }
  };

  const handleStatusChange = async (jobId: number, newStatus: 'ativa' | 'pausada' | 'fechada') => {
    try {
      // Atualizar no backend
      await updateJobStatus(jobId, newStatus);
      
      // Atualizar no estado local
      const updatedJobPostings = jobPostings.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
      );
      setJobPostings(updatedJobPostings);
    } catch (error) {
      console.error('Failed to update job status:', error);
      // Opcional: mostrar mensagem de erro ao usuário
      alert('Erro ao atualizar status da vaga. Por favor, tente novamente.');
    }
  };

  const handleEditJob = (job: JobPosting) => {
    setSelectedJob(job);
    setEditDialogOpen(true);
  };

  const handleDeleteJob = (jobId: number) => {
    const job = jobPostings.find(j => j.id === jobId);
    setSelectedJob(job || null);
    setDeleteDialogOpen(true);
  };

  const handleUpdateJob = async (id: number, jobData: Omit<JobPosting, 'id' | 'applications' | 'matches' | 'status' | 'postedDate'>) => {
    try {
      const updatedJob = await updateJob(Number(id), jobData);
      const updatedJobPostings = jobPostings.map(job =>
        job.id === id ? { ...updatedJob, applications: job.applications, matches: job.matches } : job
      );
      setJobPostings(updatedJobPostings);
      setEditDialogOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedJob) return;
    
    try {
      await deleteJob(Number(selectedJob.id));
      const updatedJobPostings = jobPostings.filter(job => job.id !== selectedJob.id);
      setJobPostings(updatedJobPostings);
      setDeleteDialogOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const handleViewJobDetails = (jobId: number) => {
    const job = jobPostings.find(j => j.id === jobId);
    if (job) {
      setSelectedJobForDetails(job);
      setDetailsDialogOpen(true);
    }
  };

  const handleCloseJobDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedJobForDetails(null);
  };

  const stats = [
    {
      title: "Vagas Ativas",
      value: Array.isArray(jobPostings) ? jobPostings.filter(job => 
        job.status?.toLowerCase() === 'ativa'
      ).length : 0,
      icon: <Work />,
      avatarBgColor: "primary.main",
    },
    {
      title: "Total de Candidaturas",
      value: Array.isArray(jobPostings) ? jobPostings.reduce((sum, job) => sum + (job.applications || 0), 0) : 0,
      icon: <People />,
      avatarBgColor: "secondary.main",
    },
    {
      title: "Novos Matches",
      value: Array.isArray(jobPostings) ? jobPostings.reduce((sum, job) => sum + (job.matches || 0), 0) : 0,
      icon: <Star />,
      avatarBgColor: "success.main",
    },
    {
      title: "Taxa de Contratação",
      value: "23%",
      icon: <TrendingUp />,
      avatarBgColor: "warning.main",
    },
  ];

  const JobPostingsList = React.lazy(() => import('./components/JobPostingsList'));
  const CandidatesPanel = React.lazy(() => import('./components/CandidatesPanel'));
  const JobFormDialog = React.lazy(() => import('./components/JobFormDialog'));
  const JobEditDialog = React.lazy(() => import('./components/JobEditDialog'));
  const OngoingContractsPanel = React.lazy(() => import('./components/OngoingContractsPanel'));
  const ProjectsFinalizadosPanel = React.lazy(() => import('./components/ProjectsFinalizadosPanel'));
  const FeedbacksReceivedPanel = React.lazy(() => import('./components/FeedbacksReceivedPanel'));
  const AvaliacaoPanel = React.lazy(() => import('./components/AvaliacaoPanel'));
  const ContestacoesPanel = React.lazy(() => import('./components/ContestacoesPanel'));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Header title="Painel da Empresa" subtitle="Gerencie suas vagas, avalie candidatos e encontre o talento perfeito." />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setJobDialogOpen(true)}
          sx={{ px: 3 }}
        >
          Publicar Nova Vaga
        </Button>
      </Box>

      <StatsGrid stats={stats} />
      <Card sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={
                <Badge badgeContent={jobPostings.length} color="primary">
                  <Box sx={{ ml: 1 }}>Vagas Publicadas</Box>
                </Badge>
              }
            />
            <Tab label="Candidatos" />
          </Tabs>
        </Box>

        <Suspense fallback={<div>Carregando...</div>}>
          <TabPanel value={activeTab} index={0}>
            <JobPostingsList 
              jobPostings={jobPostings}
              getStatusColor={getStatusColor}
              handleStatusChange={handleStatusChange}
              onEditJob={handleEditJob}
              onDeleteJob={handleDeleteJob}
              onViewDetails={handleViewJobDetails}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <CandidatesPanel jobPostings={jobPostings} />
          </TabPanel>
        </Suspense>
      </Card>

      {/* Feedbacks - novas abas adicionadas para o backend de Feedback */}
      <Card sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={feedbackTab}
            onChange={(_, newValue) => setFeedbackTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Contratos Ativos" />
            <Tab label="Projetos Finalizados" />
            <Tab label="Feedbacks Recebidos" />
            <Tab label="Avaliação" />
            <Tab label="Contestações" />
          </Tabs>
        </Box>

        <Suspense fallback={<div>Carregando feedbacks...</div>}>
          <TabPanel value={feedbackTab} index={0}>
            <OngoingContractsPanel />
          </TabPanel>
          <TabPanel value={feedbackTab} index={1}>
            <ProjectsFinalizadosPanel />
          </TabPanel>
          <TabPanel value={feedbackTab} index={2}>
            <FeedbacksReceivedPanel />
          </TabPanel>
          <TabPanel value={feedbackTab} index={3}>
            <AvaliacaoPanel />
          </TabPanel>
          <TabPanel value={feedbackTab} index={4}>
            <ContestacoesPanel />
          </TabPanel>
        </Suspense>
      </Card>

      <Suspense fallback={<div>Carregando diálogo...</div>}>
        <JobFormDialog
          open={jobDialogOpen}
          onClose={() => setJobDialogOpen(false)}
          onPublish={handlePublishJob}
        />
        <JobEditDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedJob(null);
          }}
          onUpdate={handleUpdateJob}
          job={selectedJob}
        />
      </Suspense>

      {/* Modal de Detalhes da Vaga */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseJobDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Work color="primary" />
            <Typography variant="h5" fontWeight="bold">
              {selectedJobForDetails?.title || 'Detalhes da Vaga'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedJobForDetails ? (
            <Box>
              {/* Informações da Empresa */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Business color="action" />
                  <Typography variant="h6" fontWeight="bold">
                    {(selectedJobForDetails as any).companyName || user?.name || 'Sua Empresa'}
                  </Typography>
                </Box>
                {selectedJobForDetails.status && (
                  <Chip
                    label={
                      selectedJobForDetails.status?.toLowerCase() === 'ativa' ? 'Ativa' :
                      selectedJobForDetails.status?.toLowerCase() === 'pausada' ? 'Pausada' :
                      selectedJobForDetails.status?.toLowerCase() === 'fechada' ? 'Fechada' : 
                      selectedJobForDetails.status
                    }
                    color={getStatusColor(selectedJobForDetails.status)}
                    size="small"
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Informações Principais */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Salário
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedJobForDetails.valorReferencia || 'A combinar'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Localização / Modalidade
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedJobForDetails.localModalidade || 'Não especificado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Work color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Nível de Experiência
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedJobForDetails.experienceLevel || 'Não especificado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Prazo Estimado
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedJobForDetails.prazoEstimado || 'Não especificado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {selectedJobForDetails.regime && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Work color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Regime de Trabalho
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedJobForDetails.regime}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {selectedJobForDetails.modeloRemuneracao && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Modelo de Remuneração
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedJobForDetails.modeloRemuneracao}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Descrição */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Descrição da Vaga
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedJobForDetails.description || 'Sem descrição disponível.'}
                </Typography>
              </Box>

              {/* Habilidades Requeridas */}
              {selectedJobForDetails.skills && selectedJobForDetails.skills.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Habilidades Requeridas
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedJobForDetails.skills.map((skill: any, index: number) => {
                      const skillName = typeof skill === 'object' && skill !== null ? skill.skill : skill;
                      return (
                        <Chip key={index} label={skillName} color="primary" variant="outlined" />
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Estatísticas */}
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Estatísticas
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {selectedJobForDetails.applications || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Candidaturas
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary">
                        {selectedJobForDetails.matches || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Matches
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : (
            <Typography>Vaga não encontrada.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJobDetails}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedJob(null);
        }}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a vaga "{selectedJob?.title}"? 
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedJob(null);
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyDashboard;