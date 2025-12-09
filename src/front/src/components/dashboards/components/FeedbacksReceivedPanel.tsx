import React, { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Rating, Alert } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import feedbackService from '../../../service/feedbackService';
import { FeedbackItemResponse } from '../../../types/feedback';
import FeedbackFormDialog from './FeedbackFormDialog';
import DisputeDialog from './DisputeDialog';

const FeedbacksReceivedPanel: React.FC = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedTargetUserId, setSelectedTargetUserId] = useState<number | null>(null);
  const [selectedTargetRole, setSelectedTargetRole] = useState<'COMPANY' | 'DEVELOPER' | null>(null);
  const [givenProjectIds, setGivenProjectIds] = useState<Set<number>>(new Set());
  const [openDisputeDialog, setOpenDisputeDialog] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const data = await feedbackService.getReceived(Number(user.id));
        // garantir array
        setFeedbacks(Array.isArray(data) ? data : []);
        // também carregar feedbacks dados para saber onde já avaliou
  const dados = await feedbackService.getGiven(Number(user.id));
  const setIds = new Set<number>();
  (Array.isArray(dados) ? dados : []).forEach((f: FeedbackItemResponse) => { if (f.projectId) setIds.add(Number(f.projectId)); });
        setGivenProjectIds(setIds);
      } catch (err) {
        console.error('Erro ao buscar feedbacks:', err);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // util: calcular média (se necessário)

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Feedbacks Recebidos
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              {/* Média computada a partir do campo `estrelas` retornado pelo backend */}
              <Typography variant="subtitle2">
                Média de feedbacks: {' '}
                {(() => {
                  const numeric = feedbacks.filter(f => typeof f.estrelas === 'number').map(f => Number(f.estrelas));
                  if (numeric.length === 0) return '—';
                  const avg = numeric.reduce((s, v) => s + v, 0) / numeric.length;
                  const rounded = Math.round(avg * 10) / 10;
                  return `${rounded} / 5`;
                })()}
              </Typography>
              {/** mostrar visual com estrelas quando houver dados */}
              {useMemo(() => {
                const numeric = feedbacks.filter(f => typeof f.estrelas === 'number').map(f => Number(f.estrelas));
                if (numeric.length === 0) return null;
                const avg = numeric.reduce((s, v) => s + v, 0) / numeric.length;
                const rounded = Math.round(avg * 10) / 10;
                return <Rating value={rounded} readOnly size="small" />;
              }, [feedbacks])}
            </Box>
              {/* <Typography variant="caption" color="text.secondary">Para avaliar alguém, clique em "Avaliar" ao lado de um feedback recebido ou use o botão abaixo.</Typography> */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                // abrir diálogo sem contexto: usuário escolhe vaga e alvo
                setSelectedProjectId(null);
                setSelectedTargetUserId(null);
                setSelectedTargetRole(user?.type === 'developer' ? 'COMPANY' : null);
                setOpenFeedbackDialog(true);
              }}
            >Nova Avaliação</Button>
          </Box>

          {loading ? (
            <Typography>Carregando feedbacks...</Typography>
          ) : feedbacks.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Você ainda não recebeu feedbacks. Use "Nova Avaliação" para avaliar a outra parte de um projeto já finalizado.
            </Alert>
          ) : (
            <List>
              {feedbacks.map(f => (
                <React.Fragment key={f.id}>
                    <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{String((f.projectId ?? 0)).slice(-2)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={f.comentario ? f.comentario.slice(0,100) : `Feedback #${f.id} (Projeto ${f.projectId ?? '—'})`}
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                            <Typography variant="caption">Avaliação:</Typography>
                            <Rating value={typeof f.estrelas === 'number' ? f.estrelas : 0} readOnly size="small" />
                            {f.dataAvaliacao && (
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                {new Date(f.dataAvaliacao).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                      <Button variant="outlined" color="error" onClick={() => { setSelectedFeedbackId(f.id); setOpenDisputeDialog(true); }}>Contestar</Button>
                      {!givenProjectIds.has(Number(f.projectId)) && (
                        <Button variant="contained" size="small" onClick={() => {
                          setSelectedProjectId(Number(f.projectId));
                          // alvo é quem avaliou este usuário (raterId)
                          setSelectedTargetUserId(Number(f.raterId));
                          // se usuário atual é developer, alvo é COMPANY senão DEVELOPER
                          const role = user?.type === 'developer' ? 'COMPANY' : 'DEVELOPER';
                          setSelectedTargetRole(role);
                          setOpenFeedbackDialog(true);
                        }}>Avaliar</Button>
                      )}
                    </Box>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}

          {/* Dialogs */}
          <FeedbackFormDialog
            open={openFeedbackDialog}
            onClose={() => setOpenFeedbackDialog(false)}
            projectId={selectedProjectId ?? undefined}
            targetUserId={selectedTargetUserId ?? undefined}
            targetRole={selectedTargetRole ?? undefined}
            onSubmitted={() => {
              // após enviar, recarregar listas
              setOpenFeedbackDialog(false);
              setLoading(true);
              Promise.all([
                feedbackService.getReceived(Number(user?.id)),
                feedbackService.getGiven(Number(user?.id)),
              ]).then(([rec, giv]) => {
                setFeedbacks(Array.isArray(rec) ? rec : []);
                const ids = new Set<number>();
                (Array.isArray(giv) ? giv : []).forEach((g: FeedbackItemResponse) => { if (g.projectId) ids.add(Number(g.projectId)); });
                setGivenProjectIds(ids);
              }).catch(() => {/* ignore */}).finally(() => setLoading(false));
            }}
          />

          <DisputeDialog
            open={openDisputeDialog}
            onClose={() => setOpenDisputeDialog(false)}
            feedbackId={selectedFeedbackId || 0}
            onSubmitted={() => { /* refresh list */ }}
          />

        </CardContent>
      </Card>
    </Box>
  );
};

export default FeedbacksReceivedPanel;
