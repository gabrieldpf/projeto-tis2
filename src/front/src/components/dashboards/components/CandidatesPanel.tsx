import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Email,
  LocationOn,
  Work,
  Code,
  Star,
} from '@mui/icons-material';
import { getCandidaturasByVaga, atualizarStatusCandidatura } from '../../../service/candidaturaService';
import { buscarPerfil } from '../../../service/perfilDevService';
import { getUserById } from '../../../service/authService';
import { getCompatibilidadeCandidato } from '../../../service/matchingService';
import { getApplicationStatusColor, getApplicationStatusLabel } from '../../../utils/statusUtils';
import { formatDate } from '../../../utils/formatUtils';
import TechnicalTestReviewDialog from './TechnicalTestReviewDialog';

interface Candidatura {
  id: number;
  vagaId: number;
  usuarioId: number;
  status: string;
  dataCandidatura: string;
  mensagem?: string;
}

interface CandidatoDetalhado extends Candidatura {
  usuario?: {
    nome: string; // Nome real da tabela usuarios
    email: string; // Email da tabela usuarios
  };
  perfil?: {
    titular?: string;
    resumo?: string;
    localizacao?: string;
    github?: string;
    linkedin?: string;
    faixaSalarial?: string;
    disponibilidade?: string;
  };
  compatibilidade?: number; // Score de matching (0-100)
}

interface CandidatesPanelProps {
  jobPostings: any[];
}

const CandidatesPanel: React.FC<CandidatesPanelProps> = ({ jobPostings }) => {
  const [selectedVaga, setSelectedVaga] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [candidaturas, setCandidaturas] = useState<CandidatoDetalhado[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidatoDetalhado | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [reviewOpenFor, setReviewOpenFor] = useState<{ vagaId: number; usuarioId: number } | null>(null);

  useEffect(() => {
    if (selectedVaga && selectedVaga !== 'todas') {
      fetchCandidaturas(Number(selectedVaga));
    } else if (selectedVaga === 'todas') {
      fetchAllCandidaturas();
    }
  }, [selectedVaga]);

  const fetchCandidaturas = async (vagaId: number) => {
    try {
      setLoading(true);
      const candidaturasData = await getCandidaturasByVaga(vagaId);
      
      // Buscar dados dos candidatos (usuário + perfil + compatibilidade)
      const candidatosDetalhados = await Promise.all(
        candidaturasData.map(async (cand: Candidatura) => {
          try {
            // Buscar dados do usuário (nome e email da tabela usuarios)
            const userData = await getUserById(cand.usuarioId);
            
            // Buscar perfil profissional
            const perfilData = await buscarPerfil(cand.usuarioId);
            
            // Buscar compatibilidade com a vaga
            const compatibilidade = await getCompatibilidadeCandidato(cand.usuarioId, vagaId);
            
            return {
              ...cand,
              usuario: {
                nome: userData.nome || `Candidato(a) #${cand.usuarioId}`,
                email: userData.email || '',
              },
              perfil: perfilData,
              compatibilidade: compatibilidade,
            };
          } catch (error) {
            console.error(`Erro ao buscar dados do usuário ${cand.usuarioId}:`, error);
            return {
              ...cand,
              usuario: {
                nome: `Candidato(a) #${cand.usuarioId}`,
                email: '',
              },
              compatibilidade: 0,
            };
          }
        })
      );
      
      setCandidaturas(candidatosDetalhados);
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
      setErrorMessage('Erro ao carregar candidaturas');
      setCandidaturas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCandidaturas = async () => {
    try {
      setLoading(true);
      const todasCandidaturas: CandidatoDetalhado[] = [];
      
      for (const vaga of jobPostings) {
        try {
          const candidaturasData = await getCandidaturasByVaga(Number(vaga.id));
          const candidatosDetalhados = await Promise.all(
            candidaturasData.map(async (cand: Candidatura) => {
              try {
                // Buscar dados do usuário (nome e email da tabela usuarios)
                const userData = await getUserById(cand.usuarioId);
                
                // Buscar perfil profissional
                const perfilData = await buscarPerfil(cand.usuarioId);
                
                // Buscar compatibilidade com a vaga
                const compatibilidade = await getCompatibilidadeCandidato(cand.usuarioId, Number(vaga.id));
                
                return {
                  ...cand,
                  usuario: {
                    nome: userData.nome || `Candidato(a) #${cand.usuarioId}`,
                    email: userData.email || '',
                  },
                  perfil: perfilData,
                  compatibilidade: compatibilidade,
                };
              } catch (error) {
                return {
                  ...cand,
                  usuario: {
                    nome: `Candidato(a) #${cand.usuarioId}`,
                    email: '',
                  },
                  compatibilidade: 0,
                };
              }
            })
          );
          todasCandidaturas.push(...candidatosDetalhados);
        } catch (error) {
          console.error(`Erro ao buscar candidaturas da vaga ${vaga.id}:`, error);
        }
      }
      
      setCandidaturas(todasCandidaturas);
    } catch (error) {
      console.error('Erro ao buscar todas candidaturas:', error);
      setErrorMessage('Erro ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidaturaId: number, novoStatus: string) => {
    try {
      setActionLoading(true);
      await atualizarStatusCandidatura(candidaturaId, novoStatus);
      
      // Atualizar lista local
      setCandidaturas(prev => prev.map(cand => 
        cand.id === candidaturaId ? { ...cand, status: novoStatus } : cand
      ));
      
      setSuccessMessage(`Candidatura ${novoStatus === 'aceito' ? 'aceita' : 'rejeitada'} com sucesso!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setErrorMessage('Erro ao atualizar status da candidatura');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewProfile = (candidato: CandidatoDetalhado) => {
    setSelectedCandidate(candidato);
    setProfileDialogOpen(true);
  };

  const candidaturasFiltradas = candidaturas.filter(cand => {
    if (selectedStatus === 'todos') return true;
    return cand.status.toLowerCase() === selectedStatus;
  });

  const getVagaTitulo = (vagaId: number) => {
    const vaga = jobPostings.find(v => Number(v.id) === vagaId);
    return vaga?.title || `Vaga #${vagaId}`;
  };

  const getMatchColor = (compatibilidade: number) => {
    if (compatibilidade >= 85) return 'success';
    if (compatibilidade >= 70) return 'primary';
    if (compatibilidade >= 60) return 'warning';
    return 'default';
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getMatchLabel = (compatibilidade: number) => {
    if (compatibilidade >= 85) return 'Excelente Match';
    if (compatibilidade >= 70) return 'Bom Match';
    if (compatibilidade >= 60) return 'Match Parcial';
    return 'Baixo Match';
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Carregando candidatos...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Alertas */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vaga</InputLabel>
                <Select
                  value={selectedVaga}
                  onChange={(e) => setSelectedVaga(e.target.value)}
                  label="Vaga"
                >
                  <MenuItem value="todas">Todas as vagas</MenuItem>
                  {jobPostings.map((vaga) => (
                    <MenuItem key={vaga.id} value={vaga.id}>
                      {vaga.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="todos">Todos os status</MenuItem>
                  <MenuItem value="pendente">Pendente</MenuItem>
                  <MenuItem value="em_analise">Em Análise</MenuItem>
                  <MenuItem value="aceito">Aceito</MenuItem>
                  <MenuItem value="rejeitado">Rejeitado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {candidaturas.filter(c => c.status === 'pendente').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pendentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {candidaturas.filter(c => c.status === 'em_analise').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Em Análise
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {candidaturas.filter(c => c.status === 'aceito').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Aceitos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {candidaturas.filter(c => c.status === 'rejeitado').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Rejeitados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Candidatos */}
      {candidaturasFiltradas.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma candidatura encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {selectedVaga === 'todas' 
              ? 'Nenhuma candidatura foi recebida ainda.'
              : 'Esta vaga ainda não recebeu candidaturas.'}
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {candidaturasFiltradas.map((candidato) => (
            <Grid item xs={12} key={candidato.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Avatar e Informações Básicas */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: 'primary.main',
                            fontSize: '1.5rem',
                          }}
                        >
                          {candidato.usuario?.nome?.charAt(0).toUpperCase() || '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {candidato.usuario?.nome}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {candidato.perfil?.titular || 'Sem título profissional'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                            <Chip
                              label={getVagaTitulo(candidato.vagaId)}
                              size="small"
                              variant="outlined"
                              color="primary"
                              icon={<Work />}
                            />
                            <Chip
                              label={getApplicationStatusLabel(candidato.status)}
                              color={getApplicationStatusColor(candidato.status)}
                              size="small"
                            />
                            {candidato.compatibilidade !== undefined && candidato.compatibilidade > 0 && (
                              <Chip
                                label={`${Math.round(candidato.compatibilidade)}% Match`}
                                color={getMatchColor(candidato.compatibilidade)}
                                size="small"
                                icon={<Star />}
                                sx={{ fontWeight: 'bold' }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Data da Candidatura */}
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Data da candidatura:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(candidato.dataCandidatura)}
                      </Typography>
                      {candidato.perfil?.localizacao && (
                        <>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            Localização:
                          </Typography>
                          <Typography variant="body2">
                             {candidato.perfil.localizacao}
                          </Typography>
                        </>
                      )}
                    </Grid>

                    {/* Ações */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewProfile(candidato)}
                        >
                          Ver Perfil
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => setReviewOpenFor({ vagaId: Number(candidato.vagaId), usuarioId: Number(candidato.usuarioId) })}
                        >
                          Ver Teste
                        </Button>
                        {candidato.status === 'pendente' && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleStatusChange(candidato.id, 'aceito')}
                              disabled={actionLoading}
                            >
                              Aceitar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => handleStatusChange(candidato.id, 'rejeitado')}
                              disabled={actionLoading}
                            >
                              Rejeitar
                            </Button>
                          </>
                        )}
                      </Box>
                    </Grid>

                    {/* Mensagem do Candidato */}
                    {candidato.mensagem && (
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" color="text.secondary">
                          Mensagem do candidato:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          "{candidato.mensagem}"
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Perfil do Candidato */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Perfil do Candidato
        </DialogTitle>
        <DialogContent>
          {selectedCandidate && (
            <Box>
              {/* Cabeçalho */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {selectedCandidate.usuario?.nome?.charAt(0).toUpperCase() || '?'}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedCandidate.usuario?.nome}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {selectedCandidate.perfil?.titular || 'Sem título profissional'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Vaga */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Vaga
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Work fontSize="small" color="action" />
                  <Typography variant="body2" fontWeight="medium">
                    {getVagaTitulo(selectedCandidate.vagaId)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={getApplicationStatusLabel(selectedCandidate.status)}
                    color={getApplicationStatusColor(selectedCandidate.status)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Candidatura em {formatDate(selectedCandidate.dataCandidatura)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Informações de Contato */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Contato
                </Typography>
                {selectedCandidate.usuario?.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">
                      {selectedCandidate.usuario.email}
                    </Typography>
                  </Box>
                )}
                {selectedCandidate.perfil?.localizacao && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">
                      {selectedCandidate.perfil.localizacao}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Sobre */}
              {selectedCandidate.perfil?.resumo && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Sobre
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedCandidate.perfil.resumo}
                  </Typography>
                </Box>
              )}

              {/* Preferências */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Preferências
                </Typography>
                <Grid container spacing={2}>
                  {selectedCandidate.perfil?.faixaSalarial && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">
                        Pretensão Salarial
                      </Typography>
                      <Typography variant="body2">
                        {selectedCandidate.perfil.faixaSalarial}
                      </Typography>
                    </Grid>
                  )}
                  {selectedCandidate.perfil?.disponibilidade && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">
                        Disponibilidade
                      </Typography>
                      <Typography variant="body2">
                        {selectedCandidate.perfil.disponibilidade}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Links */}
              {(selectedCandidate.perfil?.github || selectedCandidate.perfil?.linkedin) && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Links
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {selectedCandidate.perfil?.github && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Code />}
                        href={selectedCandidate.perfil.github}
                        target="_blank"
                      >
                        GitHub
                      </Button>
                    )}
                    {selectedCandidate.perfil?.linkedin && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Work />}
                        href={selectedCandidate.perfil.linkedin}
                        target="_blank"
                      >
                        LinkedIn
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>
            Fechar
          </Button>
          {selectedCandidate && selectedCandidate.status === 'pendente' && (
            <>
              <Button
                onClick={() => {
                  handleStatusChange(selectedCandidate.id, 'rejeitado');
                  setProfileDialogOpen(false);
                }}
                color="error"
                variant="outlined"
                disabled={actionLoading}
              >
                Rejeitar
              </Button>
              <Button
                onClick={() => {
                  handleStatusChange(selectedCandidate.id, 'aceito');
                  setProfileDialogOpen(false);
                }}
                color="success"
                variant="contained"
                disabled={actionLoading}
              >
                Aceitar Candidato
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {reviewOpenFor && (
        <TechnicalTestReviewDialog
          open={true}
          onClose={() => setReviewOpenFor(null)}
          vagaId={reviewOpenFor.vagaId}
          usuarioId={reviewOpenFor.usuarioId}
          onApproved={(vagaId, usuarioId) => {
            // Remove candidato aprovado da lista local
            setCandidaturas(prev => prev.filter(c => !(c.vagaId === vagaId && c.usuarioId === usuarioId)));
          }}
        />
      )}
    </Box>
  );
};

export default CandidatesPanel;

