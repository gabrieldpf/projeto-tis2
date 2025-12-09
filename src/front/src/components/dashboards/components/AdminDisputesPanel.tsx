import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  CircularProgress,
  Divider,
  Stack,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  Gavel,
  CheckCircle,
  Cancel,
  Close,
  Refresh,
  Visibility,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import * as feedbackService from '../../../service/feedbackService';
import { Disputa } from '../../../types/feedback';
import { FeedbackItemResponse } from '../../../types/feedback';
import { getUserById } from '../../../service/authService';
import { AuthResponse } from '../../../service/authService';

interface AdminDisputesPanelProps {
  onRefresh?: () => void;
}

const AdminDisputesPanel: React.FC<AdminDisputesPanel> = ({ onRefresh }) => {
  const { user } = useAuth();
  const [disputas, setDisputas] = useState<Disputa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDisputa, setSelectedDisputa] = useState<Disputa | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [feedbackDetails, setFeedbackDetails] = useState<FeedbackItemResponse | null>(null);
  const [raterName, setRaterName] = useState<string>('');
  const [ratedName, setRatedName] = useState<string>('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.type === 'admin') {
      loadDisputas();
    }
  }, [user]);

  const loadDisputas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedbackService.getAllOpenDisputes();
      setDisputas(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Erro ao carregar disputas:', err);
      setError(err?.message || 'Erro ao carregar disputas em análise');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (disputa: Disputa) => {
    setSelectedDisputa(disputa);
    setDetailsOpen(true);
    
    try {
      // Buscar detalhes do feedback pelo ID
      const feedback = await feedbackService.getFeedbackById(disputa.feedbackId);
      
      if (feedback) {
        setFeedbackDetails(feedback);
        
        // Buscar nomes dos usuários
        if (feedback.raterId) {
          try {
            const rater: AuthResponse = await getUserById(feedback.raterId);
            setRaterName(rater.nome || `Usuário #${feedback.raterId}`);
          } catch {
            setRaterName(`Usuário #${feedback.raterId}`);
          }
        }
        
        if (feedback.ratedId) {
          try {
            const rated: AuthResponse = await getUserById(feedback.ratedId);
            setRatedName(rated.nome || `Usuário #${feedback.ratedId}`);
          } catch {
            setRatedName(`Usuário #${feedback.ratedId}`);
          }
        }
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
      setError('Erro ao carregar detalhes do feedback');
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedDisputa(null);
    setFeedbackDetails(null);
    setRaterName('');
    setRatedName('');
  };

  const handleDecide = async (disputaId: number, decisao: 'MANTIDA' | 'AJUSTADA') => {
    try {
      setProcessingId(disputaId);
      setError(null);
      await feedbackService.decideDispute(disputaId, decisao);
      await loadDisputas();
      handleCloseDetails();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      console.error('Erro ao decidir disputa:', err);
      setError(err?.response?.data?.message || err?.message || 'Erro ao processar decisão');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <>
      <Card elevation={4} sx={{ mt: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Gavel color="primary" />
              <Typography variant="h5" fontWeight="bold">
                Contestações em Análise
              </Typography>
            </Box>
          }
          subheader={`${disputas.length} ${disputas.length === 1 ? 'contestação aguardando análise' : 'contestações aguardando análise'}`}
          action={
            <IconButton onClick={loadDisputas} disabled={loading}>
              <Refresh />
            </IconButton>
          }
        />
        {loading && <LinearProgress />}
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {disputas.length === 0 ? (
            <Alert severity="info">
              Não há contestações em análise no momento.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Feedback ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Justificativa</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Data de Abertura</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {disputas.map((disputa) => (
                    <TableRow key={disputa.id} hover>
                      <TableCell>{disputa.id}</TableCell>
                      <TableCell>#{disputa.feedbackId}</TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                          {disputa.justificativaDisputa}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(disputa.createdAt)}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(disputa)}
                          >
                            Ver Detalhes
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes e Decisão */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Gavel color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Detalhes da Contestação #{selectedDisputa?.id}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDetails} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDisputa && (
            <Box>
              {/* Informações do Feedback Contestado */}
              {feedbackDetails && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Feedback Contestado
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Avaliador
                      </Typography>
                      <Typography variant="body2">{raterName || 'Carregando...'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Avaliado
                      </Typography>
                      <Typography variant="body2">{ratedName || 'Carregando...'}</Typography>
                    </Grid>
                    {feedbackDetails.estrelas && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Avaliação Média
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {feedbackDetails.estrelas.toFixed(1)} estrelas
                        </Typography>
                      </Grid>
                    )}
                    {(feedbackDetails.qualidadeTecnica !== undefined || 
                      feedbackDetails.cumprimentoPrazos !== undefined ||
                      feedbackDetails.comunicacao !== undefined ||
                      feedbackDetails.colaboracao !== undefined) && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          Critérios de Avaliação:
                        </Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          {feedbackDetails.qualidadeTecnica !== undefined && (
                            <Typography variant="body2">
                              Qualidade Técnica: {feedbackDetails.qualidadeTecnica}/5
                            </Typography>
                          )}
                          {feedbackDetails.cumprimentoPrazos !== undefined && (
                            <Typography variant="body2">
                              Prazos: {feedbackDetails.cumprimentoPrazos}/5
                            </Typography>
                          )}
                          {feedbackDetails.comunicacao !== undefined && (
                            <Typography variant="body2">
                              Comunicação: {feedbackDetails.comunicacao}/5
                            </Typography>
                          )}
                          {feedbackDetails.colaboracao !== undefined && (
                            <Typography variant="body2">
                              Colaboração: {feedbackDetails.colaboracao}/5
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                    )}
                    {feedbackDetails.comentario && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Comentário
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {feedbackDetails.comentario}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Justificativa da Contestação */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Justificativa da Contestação
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedDisputa.justificativaDisputa}
                  </Typography>
                </Paper>
              </Box>

              {/* Informações Adicionais */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Data de Abertura: {formatDate(selectedDisputa.createdAt)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDetails} variant="outlined">
            Cancelar
          </Button>
          {selectedDisputa && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleDecide(selectedDisputa.id, 'MANTIDA')}
                disabled={processingId === selectedDisputa.id}
              >
                {processingId === selectedDisputa.id ? (
                  <CircularProgress size={20} />
                ) : (
                  'Manter Feedback'
                )}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleDecide(selectedDisputa.id, 'AJUSTADA')}
                disabled={processingId === selectedDisputa.id}
              >
                {processingId === selectedDisputa.id ? (
                  <CircularProgress size={20} />
                ) : (
                  'Ajustar Feedback'
                )}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDisputesPanel;

