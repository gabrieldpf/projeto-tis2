import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Box, Card, Tabs, Tab, Badge, Typography, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider, Grid
} from '@mui/material';
import { 
  WorkOutline, Favorite, Visibility, TrendingUp, Schedule, CheckCircle, ArrowForward,
  AttachMoney, LocationOn, Business, AccessTime, Work, AttachFile
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TabPanel from './components/TabPanel';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import { useAuth } from '../../contexts/AuthContext';
import { getCandidaturasByUsuario } from '../../service/candidaturaService';
import { getJobs } from '../../service/jobService';
import { getVagasCompativeis, JobMatch } from '../../service/matchingService';

export interface Application {
  id: string;
  company: string;
  position: string;
  status: 'pendente' | 'em_analise' | 'aceito' | 'rejeitado';
  appliedDate: string;
  salary: string;
  location: string;
  vagaId?: number;
  anexo?: string;
}

export interface Match {
  id: string;
  company: string;
  position: string;
  matchScore: number;
  requirements: string[];
  salary: string;
  location: string;
  type: string;
}

const ApplicationsList = lazy(() => import('./components/ApplicationsList'));
const MatchesGrid = lazy(() => import('./components/MatchesGrid'));
const OngoingContractsPanel = lazy(() => import('./components/OngoingContractsPanel'));
const ProjectsFinalizadosPanel = lazy(() => import('./components/ProjectsFinalizadosPanel'));
const FeedbacksReceivedPanel = lazy(() => import('./components/FeedbacksReceivedPanel'));
const AvaliacaoPanel = lazy(() => import('./components/AvaliacaoPanel'));
const ContestacoesPanel = lazy(() => import('./components/ContestacoesPanel'));

const DeveloperDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [feedbackTab, setFeedbackTab] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
      fetchVagasCompativeis();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user?.id) return;
    
    try {
      const candidaturas = await getCandidaturasByUsuario(user.id);
      const jobs = await getJobs();
      setAllJobs(jobs); // Armazena todas as vagas no estado
      
      // Mapeia candidaturas para o formato de Application
      const apps: Application[] = candidaturas.map(cand => {
        const vaga = jobs.find((j: any) => Number(j.id) === Number(cand.vagaId));
        return {
          id: cand.id.toString(),
          company: vaga?.companyName || 'Empresa', // Nome da empresa da vaga
          position: vaga?.title || `Vaga #${cand.vagaId}`,
          status: cand.status as 'pendente' | 'em_analise' | 'aceito' | 'rejeitado',
          appliedDate: cand.dataCandidatura,
          salary: vaga?.valorReferencia || 'A combinar',
          location: vaga?.localModalidade || 'Não especificado',
          vagaId: cand.vagaId,
          anexo: vaga?.anexo,
        };
      });
      
      setApplications(apps);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
    }
  };

  const fetchVagasCompativeis = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingMatches(true);
      const vagasCompativeis = await getVagasCompativeis(user.id);
      setMatches(vagasCompativeis);
    } catch (error) {
      console.error('Failed to fetch compatible jobs:', error);
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: 'warning',
      em_analise: 'info',
      aceito: 'success',
      rejeitado: 'error',
    } as const;
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pendente: <Schedule />,
      em_analise: <Visibility />,
      aceito: <CheckCircle />,
      rejeitado: <div>❌</div>,
    };
    return icons[status as keyof typeof icons] || <Schedule />;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      em_analise: 'Em Análise',
      aceito: 'Aceito',
      rejeitado: 'Rejeitado',
    };
    return labels[status] || status;
  };

  const handleViewJobDetails = (vagaId: number) => {
    setSelectedJobId(vagaId);
    setJobDetailsOpen(true);
  };

  const handleCloseJobDetails = () => {
    setJobDetailsOpen(false);
    setSelectedJobId(null);
  };

  const selectedJob = selectedJobId ? allJobs.find((j: any) => Number(j.id) === selectedJobId) : null;

  const stats = [
    {
      title: "Candidaturas Ativas",
      value: applications.length,
      icon: <WorkOutline />,
      avatarBgColor: "primary.main",
    },
    {
      title: "Matches Aprovados",
      value: applications.filter(app => app.status === 'aceito').length,
      icon: <Favorite />,
      avatarBgColor: "secondary.main",
    },
    {
      title: "Vagas Compatíveis",
      value: matches.length,
      icon: <TrendingUp />,
      avatarBgColor: "success.main",
    },
    {
      title: "Em Análise",
      value: applications.filter(app => app.status === 'em_analise').length,
      icon: <Visibility />,
      avatarBgColor: "warning.main",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Header title="Painel do Desenvolvedor" subtitle="Acompanhe suas candidaturas, descubra novos matches e faça sua carreira crescer." />

      <StatsGrid stats={stats} />
      
      <Card sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', ":hover": "none" }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Meus Matches" />
            <Tab
              label={
                <Badge badgeContent={matches.length} color="secondary">
                  <Box sx={{ ml: 1 }}>Vagas Compatíveis</Box>
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={applications.length} color="primary">
                  <Box sx={{ ml: 1 }}>Minhas Candidaturas</Box>
                </Badge>
              }
            />
          </Tabs>
        </Box>

        <Suspense fallback={<div>Carregando...</div>}>
          <TabPanel value={activeTab} index={0}>
            <ApplicationsList 
              applications={applications.filter(app => app.status === 'aceito')} 
              getStatusColor={getStatusColor} 
              getStatusIcon={getStatusIcon}
              getStatusLabel={getStatusLabel}
              onViewDetails={handleViewJobDetails}
              userId={user?.id as any}
              emptyMessage="Você ainda não tem matches aprovados pelas empresas"
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {loadingMatches ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <MatchesGrid 
                matches={matches} 
                userId={user?.id}
                onCandidaturaSuccess={fetchApplications}
              />
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <WorkOutline sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Suas Candidaturas
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                Você se candidatou a {applications.length} {applications.length === 1 ? 'vaga' : 'vagas'}. 
                Clique no botão abaixo para ver todos os detalhes e acompanhar o status de cada candidatura.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/minhas-candidaturas')}
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Ver Todas as Candidaturas
              </Button>
            </Box>
          </TabPanel>
        </Suspense>
      </Card>

      {/* Feedbacks - mesmas abas do painel da empresa, adaptadas para o dev */}
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

      {/* Modal de Detalhes da Vaga */}
      <Dialog
        open={jobDetailsOpen}
        onClose={handleCloseJobDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Work color="primary" />
              <Typography variant="h5" fontWeight="bold">
                {selectedJob?.title || 'Detalhes da Vaga'}
              </Typography>
            </Box>
            {selectedJob?.status && (
              <Chip 
                label={selectedJob.status.toUpperCase()} 
                color={selectedJob.status === 'ativa' ? 'success' : selectedJob.status === 'pausada' ? 'warning' : 'default'}
                size="small"
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedJob ? (
            <Box>
              {/* Informações da Empresa */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Business color="action" />
                  <Typography variant="h6" fontWeight="bold">
                    {selectedJob.companyName || 'Empresa'}
                  </Typography>
                </Box>
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
                        {selectedJob.valorReferencia || 'A combinar'}
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
                        {selectedJob.localModalidade || 'Não especificado'}
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
                        {selectedJob.experienceLevel || 'Não especificado'}
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
                        {selectedJob.prazoEstimado || 'Não especificado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {selectedJob.regime && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Work color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Regime de Trabalho
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedJob.regime}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {selectedJob.modeloRemuneracao && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Modelo de Remuneração
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedJob.modeloRemuneracao}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {selectedJob.tipoContrato && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Work color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tipo de Contrato
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedJob.tipoContrato}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {selectedJob.regimeTrabalho && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Regime
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedJob.regimeTrabalho}
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
                  {selectedJob.description || selectedJob.descricao || 'Sem descrição disponível.'}
                </Typography>
              </Box>

              {/* Habilidades Requeridas */}
              {((selectedJob.habilidadesRequeridas && selectedJob.habilidadesRequeridas.length > 0) || 
                (selectedJob.skills && selectedJob.skills.length > 0)) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Habilidades Requeridas
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(selectedJob.habilidadesRequeridas || selectedJob.skills || []).map((skill: any, index: number) => {
                      const skillName = typeof skill === 'object' && skill !== null ? skill.skill : skill;
                      return (
                        <Chip key={index} label={skillName} color="primary" variant="outlined" />
                      );
                    })}
                  </Box>
                </Box>
              )}

              {/* Benefícios */}
              {selectedJob.beneficios && selectedJob.beneficios.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Benefícios
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedJob.beneficios.map((benefit: string, index: number) => (
                      <Chip key={index} label={benefit} color="success" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Anexo */}
              {selectedJob.anexo && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Documento Anexado
                  </Typography>
                  <Button
                    variant="outlined"
                    href={selectedJob.anexo}
                    target="_blank"
                    startIcon={<AttachFile />}
                    sx={{ borderRadius: 2 }}
                  >
                    Visualizar Anexo
                  </Button>
                </Box>
              )}

              {/* Informações Adicionais */}
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Informações Adicionais
                </Typography>
                <Grid container spacing={2}>
                  {selectedJob.id && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        ID da Vaga
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        #{selectedJob.id}
                      </Typography>
                    </Grid>
                  )}
                  {selectedJob.postedDate && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Data de Publicação
                      </Typography>
                      <Typography variant="body2">
                        {selectedJob.postedDate}
                      </Typography>
                    </Grid>
                  )}
                  {(selectedJob.applications !== undefined || selectedJob.matches !== undefined) && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Estatísticas
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {selectedJob.applications !== undefined && (
                          <Typography variant="body2">
                            <strong>{selectedJob.applications}</strong> candidaturas
                          </Typography>
                        )}
                        {selectedJob.matches !== undefined && (
                          <Typography variant="body2">
                            <strong>{selectedJob.matches}</strong> matches
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  )}
                  {selectedJob.status && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status da Vaga
                      </Typography>
                      <Chip 
                        label={selectedJob.status.toUpperCase()} 
                        color={selectedJob.status === 'ativa' ? 'success' : selectedJob.status === 'pausada' ? 'warning' : 'default'}
                        size="small"
                      />
                    </Grid>
                  )}
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
    </Box>
  );
};

export default DeveloperDashboard;