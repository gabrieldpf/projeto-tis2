import React, { useEffect, useState } from 'react';
import { 
  Box, Card, CardContent, Typography, List, ListItem, ListItemText, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Chip
} from '@mui/material';
import milestoneService from '../../../service/milestoneService';
import { Milestone, Delivery } from '../../../types/milestone';
import { useAuth } from '../../../contexts/AuthContext';
import * as perfilDevService from '../../../service/perfilDevService';

interface DevPendingMilestonesPanelProps {
  contractId?: number;
  projetoId?: number;
}

const DevPendingMilestonesPanel: React.FC<DevPendingMilestonesPanelProps> = ({ contractId, projetoId }) => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [perfilDevId, setPerfilDevId] = useState<number | null>(null);
  
  const [descricaoEntrega, setDescricaoEntrega] = useState('');
  const [arquivosEntrega, setArquivosEntrega] = useState('');
  const [horasTrabalhadas, setHorasTrabalhadas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerfil = async () => {
      if (!user?.id) return;
      try {
        const perfil = await perfilDevService.buscarPerfil(parseInt(user.id));
        setPerfilDevId(perfil.id || null);
      } catch (err) {
        console.error('Erro ao buscar perfil do desenvolvedor', err);
      }
    };
    loadPerfil();
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        if (contractId) {
          const data = await milestoneService.getMilestonesByContract(contractId);
          setMilestones(Array.isArray(data) ? data : []);
        } else if (projetoId) {
          const data = await milestoneService.getMilestonesByProject(projetoId);
          setMilestones(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Erro ao carregar milestones pendentes', err);
        setMilestones([]);
      }
    };
    load();
  }, [contractId, projetoId]);

  useEffect(() => {
    const loadDeliveries = async () => {
      if (milestones.length === 0) return;
      try {
        const allDeliveries: Delivery[] = [];
        for (const milestone of milestones) {
          if (milestone.id) {
            const milestoneDeliveries = await milestoneService.getDeliveriesByMilestone(milestone.id);
            allDeliveries.push(...milestoneDeliveries);
          }
        }
        setDeliveries(allDeliveries);
      } catch (err) {
        console.error('Erro ao carregar entregas', err);
      }
    };
    loadDeliveries();
  }, [milestones]);

  const handleSubmitClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setDescricaoEntrega('');
    setArquivosEntrega('');
    setHorasTrabalhadas('');
    setError(null);
    setSubmitDialogOpen(true);
  };

  const handleSubmitDelivery = async () => {
    if (!selectedMilestone?.id || !perfilDevId) {
      setError('Dados incompletos');
      return;
    }

    if (!descricaoEntrega || descricaoEntrega.trim().length < 50) {
      setError('Descrição da entrega é obrigatória e deve ter no mínimo 50 caracteres');
      return;
    }

    if (!arquivosEntrega || arquivosEntrega.trim().length === 0) {
      setError('Arquivos ou links de entrega são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const delivery = await milestoneService.createDelivery(selectedMilestone.id, {
        perfilDevId,
        descricaoEntrega,
        arquivosEntrega,
        horasTrabalhadas: horasTrabalhadas ? parseFloat(horasTrabalhadas) : undefined
      });
      setDeliveries(prev => [...prev, delivery]);
      setSubmitDialogOpen(false);
      setSelectedMilestone(null);
      setDescricaoEntrega('');
      setArquivosEntrega('');
      setHorasTrabalhadas('');
    } catch (err: any) {
      console.error('Erro ao submeter entrega', err);
      setError(err.response?.data || 'Erro ao submeter entrega');
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryStatus = (milestoneId?: number) => {
    const delivery = deliveries.find(d => d.milestoneId === milestoneId);
    if (!delivery) return null;
    if (!delivery.reviewed) return { status: 'pending', label: 'Aguardando Revisão' };
    if (delivery.approved) return { status: 'approved', label: 'Aprovada' };
    return { status: 'rejected', label: 'Rejeitada' };
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const handleAccept = async (id: number) => {
    try {
      const updated = await milestoneService.updateMilestoneStatus(id, 'ACEITO_DEV');
      setMilestones(prev => prev.map(m => (m.id === id ? updated : m)));
    } catch (err) {
      console.error('Erro ao aceitar marco', err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const updated = await milestoneService.updateMilestoneStatus(id, 'REJEITADO_DEV');
      setMilestones(prev => prev.map(m => (m.id === id ? updated : m)));
    } catch (err) {
      console.error('Erro ao rejeitar marco', err);
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Milestones Pendentes</Typography>
            <List sx={{ mt: 2 }}>
              {milestones.length === 0 ? (
                <ListItem>
                  <ListItemText primary="Nenhum milestone pendente." />
                </ListItem>
              ) : (
                milestones.map(m => {
                  const deliveryStatus = getDeliveryStatus(m.id);
                  return (
                    <ListItem key={m.id} divider>
                      <ListItemText 
                        primary={m.titulo} 
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {m.descricao}
                            </Typography>
                            {m.dueDate && (
                              <Typography variant="body2" color="text.secondary">
                                Prazo: {formatDate(m.dueDate)}
                              </Typography>
                            )}
                            {m.valorMilestone && (
                              <Typography variant="body2" color="text.secondary">
                                Valor: R$ {m.valorMilestone.toFixed(2)}
                              </Typography>
                            )}
                            {deliveryStatus && (
                              <Chip 
                                label={deliveryStatus.label}
                                color={
                                  deliveryStatus.status === 'approved' ? 'success' :
                                  deliveryStatus.status === 'rejected' ? 'error' : 'warning'
                                }
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            )}
                          </Box>
                        }
                      />
                      {!deliveryStatus && (
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => handleSubmitClick(m)}
                          disabled={!perfilDevId}
                        >
                          Enviar Entrega
                        </Button>
                      )}
                    </ListItem>
                  );
                })
              )}
            </List>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Submeter Entrega</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {selectedMilestone && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedMilestone.titulo}
                </Typography>
                {selectedMilestone.descricao && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedMilestone.descricao}
                  </Typography>
                )}
                {selectedMilestone.criteriosAceitacao && (
                  <Box sx={{ mt: 1, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">Critérios de Aceitação:</Typography>
                    <Typography variant="body2">{selectedMilestone.criteriosAceitacao}</Typography>
                  </Box>
                )}
              </Box>
            )}
            <TextField
              label="Descrição da Entrega *"
              value={descricaoEntrega}
              onChange={(e) => setDescricaoEntrega(e.target.value)}
              fullWidth
              multiline
              minRows={4}
              required
              helperText="Mínimo de 50 caracteres"
            />
            <TextField
              label="Arquivos/Links de Entrega *"
              value={arquivosEntrega}
              onChange={(e) => setArquivosEntrega(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              required
              helperText="Cole os links ou caminhos dos arquivos (um por linha ou separados por vírgula)"
              placeholder="https://github.com/usuario/repo&#10;https://drive.google.com/..."
            />
            <TextField
              label="Horas Trabalhadas"
              type="number"
              value={horasTrabalhadas}
              onChange={(e) => setHorasTrabalhadas(e.target.value)}
              fullWidth
              inputProps={{ min: 0, step: 0.5 }}
              helperText="Opcional: informe quantas horas foram trabalhadas neste milestone"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitDelivery} 
            disabled={loading || !descricaoEntrega || descricaoEntrega.trim().length < 50 || !arquivosEntrega}
          >
            Enviar Entrega
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DevPendingMilestonesPanel;
