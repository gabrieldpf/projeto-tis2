import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
} from '@mui/material';
import {
  Gavel,
  Refresh,
  Visibility,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { Disputa, FeedbackItemResponse } from '../../../types/feedback';
import * as feedbackService from '../../../service/feedbackService';
import { getUserById, AuthResponse } from '../../../service/authService';

const ContestacoesPanel: React.FC = () => {
  const { user } = useAuth();
  const [disputas, setDisputas] = useState<Disputa[]>([]);
  const [participantsByDispute, setParticipantsByDispute] = useState<Record<number, { raterName?: string; ratedName?: string }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDisputa, setSelectedDisputa] = useState<Disputa | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [feedbackDetails, setFeedbackDetails] = useState<FeedbackItemResponse | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadDisputas();
    }
  }, [user]);

  const loadDisputas = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.getDisputesMine(Number(user.id));
      const lista: Disputa[] = Array.isArray(data) ? data : [];
      setDisputas(lista);

      // Buscar detalhes do feedback para cada disputa
      const userNameCache = new Map<number, string>();
      const participantsMap: Record<number, { raterName?: string; ratedName?: string }> = {};

      await Promise.all(lista.map(async (d) => {
        try {
          // Buscar feedback pelo ID
          const feedback = await feedbackService.getFeedbackById(d.feedbackId);
          
          if (feedback) {
            const raterId = feedback.raterId ?? null;
            const ratedId = feedback.ratedId ?? null;

            const ensureName = async (id: number | null) => {
              if (id == null) return undefined;
              if (userNameCache.has(id)) return userNameCache.get(id);
              try {
                const u: AuthResponse = await getUserById(Number(id));
                const name = u?.nome ?? String(id);
                userNameCache.set(id, name);
                return name;
              } catch {
                userNameCache.set(id, `Usuário #${id}`);
                return `Usuário #${id}`;
              }
            };

            const [raterName, ratedName] = await Promise.all([
              ensureName(raterId),
              ensureName(ratedId)
            ]);
            participantsMap[d.id] = {
              raterName: raterName ?? undefined,
              ratedName: ratedName ?? undefined
            };
          }
        } catch (err) {
          console.error(`Erro ao buscar detalhes da disputa ${d.id}:`, err);
        }
      }));

      setParticipantsByDispute(participantsMap);
    } catch (err: any) {
      console.error('Erro ao buscar disputas:', err);
      setError(err?.message || 'Erro ao carregar contestações');
      setDisputas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (disputa: Disputa) => {
    setSelectedDisputa(disputa);
    setDetailsOpen(true);
    
    try {
      const feedback = await feedbackService.getFeedbackById(disputa.feedbackId);
      if (feedback) {
        setFeedbackDetails(feedback);
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedDisputa(null);
    setFeedbackDetails(null);
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

  const getStatusChip = (disputa: Disputa) => {
    const status = disputa.status?.toUpperCase();
    if (status === 'OPEN' || status === 'ABERTA') {
      return <Chip label="Em Análise" size="small" color="warning" variant="outlined" />;
    } else if (status === 'CLOSED' || status === 'FECHADA') {
      const decisao = disputa.decisaoMediacao?.toUpperCase();
      if (decisao === 'MANTIDA') {
        return <Chip label="Mantida" size="small" color="success" variant="outlined" />;
      } else if (decisao === 'AJUSTADA') {
        return <Chip label="Ajustada" size="small" color="error" variant="outlined" />;
      }
      return <Chip label="Fechada" size="small" color="default" variant="outlined" />;
    }
    return <Chip label="Em Análise" size="small" color="primary" variant="outlined" />;
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Gavel color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Minhas Contestações
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={loadDisputas} disabled={loading} size="small">
                <Refresh />
              </IconButton>
              {disputas.length > 0 && (
                <Chip
                  label={`${disputas.length} ${disputas.length === 1 ? 'contestação' : 'contestações'}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : disputas.length === 0 ? (
            <Alert severity="info">
              Você não possui contestações no momento.
            </Alert>
          ) : (
            <List>
              {disputas.map((d, index) => (
                <React.Fragment key={d.id}>
                  <ListItem
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    secondaryAction={
                      <Stack direction="row" spacing={1} alignItems="center">
                        {getStatusChip(d)}
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(d)}
                        >
                          Ver Detalhes
                        </Button>
                      </Stack>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Contestação #{d.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Feedback #{d.feedbackId}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                            {participantsByDispute[d.id]
                              ? `${participantsByDispute[d.id].ratedName ?? '—'} contestou avaliação de ${participantsByDispute[d.id].raterName ?? '—'}`
                              : 'Carregando informações...'}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mt: 0.5,
                            }}
                          >
                            {d.justificativaDisputa}
                          </Typography>
                          {d.createdAt && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              Aberta em: {formatDate(d.createdAt)}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < disputas.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
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
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Avaliação Média
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {feedbackDetails.estrelas?.toFixed(1) || 'N/A'} estrelas
                        </Typography>
                      </Box>
                      {feedbackDetails.comentario && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Comentário
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                            {feedbackDetails.comentario}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Box>
              )}

              {/* Justificativa da Contestação */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Sua Justificativa
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedDisputa.justificativaDisputa}
                  </Typography>
                </Paper>
              </Box>

              {/* Status */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status: {getStatusChip(selectedDisputa)}
                </Typography>
                {selectedDisputa.createdAt && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Data de Abertura: {formatDate(selectedDisputa.createdAt)}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDetails} variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContestacoesPanel;

