import React, { useEffect, useState } from 'react';
import { 
  Box, Card, CardContent, Typography, List, ListItem, ListItemText, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Chip 
} from '@mui/material';
import milestoneService from '../../../service/milestoneService';
import { Delivery } from '../../../types/milestone';

const CompanyDeliveriesPanel: React.FC<{ milestoneId?: number }> = ({ milestoneId }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [comentarioRevisao, setComentarioRevisao] = useState('');
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeliveries = async () => {
      if (milestoneId) {
        try {
          const data = await milestoneService.getDeliveriesByMilestone(milestoneId);
          setDeliveries(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Erro ao carregar entregas', err);
          setDeliveries([]);
        }
      }
    };
    loadDeliveries();
  }, [milestoneId]);

  const handleReviewClick = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setComentarioRevisao('');
    setError(null);
    setReviewDialogOpen(true);
  };

  const handleReview = async (approved: boolean) => {
    if (!selectedDelivery?.id) return;
    
    if (!approved && (!comentarioRevisao || comentarioRevisao.trim().length < 20)) {
      setError('Comentário de revisão é obrigatório e deve ter no mínimo 20 caracteres quando a entrega é rejeitada');
      return;
    }

    try {
      setApproving(true);
      setError(null);
      const updated = await milestoneService.reviewDelivery(
        selectedDelivery.id, 
        approved,
        comentarioRevisao || undefined
      );
      setDeliveries(prev => prev.map(d => d.id === updated.id ? updated : d));
      setReviewDialogOpen(false);
      setSelectedDelivery(null);
      setComentarioRevisao('');
    } catch (err: any) {
      console.error('Erro ao revisar entrega', err);
      setError(err.response?.data || 'Erro ao revisar entrega');
    } finally {
      setApproving(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Entregas Recebidas</Typography>
            <List sx={{ mt: 2 }}>
              {deliveries.length === 0 ? (
                <ListItem>
                  <ListItemText primary="Nenhuma entrega encontrada." />
                </ListItem>
              ) : (
                deliveries.map((d) => (
                  <ListItem 
                    key={d.id} 
                    divider 
                    secondaryAction={
                      !d.reviewed ? (
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleReviewClick(d)}
                        >
                          Revisar
                        </Button>
                      ) : (
                        <Chip 
                          label={d.approved ? 'Aprovada' : 'Rejeitada'} 
                          color={d.approved ? 'success' : 'error'}
                          size="small"
                        />
                      )
                    }
                  >
                    <ListItemText 
                      primary={d.descricaoEntrega || d.conteudo || 'Sem descrição'} 
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Enviado: {formatDate(d.submittedAt)}
                          </Typography>
                          {d.horasTrabalhadas && (
                            <Typography variant="body2" color="text.secondary">
                              Horas trabalhadas: {d.horasTrabalhadas}h
                            </Typography>
                          )}
                          {d.arquivosEntrega && (
                            <Typography variant="body2" color="text.secondary">
                              Arquivos: {d.arquivosEntrega}
                            </Typography>
                          )}
                          {d.reviewed && d.comentarioRevisao && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              <strong>Comentário:</strong> {d.comentarioRevisao}
                            </Typography>
                          )}
                        </Box>
                      } 
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Revisar Entrega</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="body2" color="text.secondary">
              {selectedDelivery?.descricaoEntrega || selectedDelivery?.conteudo}
            </Typography>
            <TextField
              label="Comentário de Revisão"
              value={comentarioRevisao}
              onChange={(e) => setComentarioRevisao(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              helperText="Obrigatório ao rejeitar (mínimo 20 caracteres)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)} disabled={approving}>
            Cancelar
          </Button>
          <Button 
            color="error" 
            onClick={() => handleReview(false)} 
            disabled={approving || !comentarioRevisao || comentarioRevisao.trim().length < 20}
          >
            Rejeitar
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => handleReview(true)} 
            disabled={approving}
          >
            Aprovar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CompanyDeliveriesPanel;
