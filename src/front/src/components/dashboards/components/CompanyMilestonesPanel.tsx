import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, Button, Chip, Stack } from '@mui/material';
import milestoneService from '../../../service/milestoneService';
import { Milestone } from '../../../types/milestone';
import CreateMilestoneDialog from './CreateMilestoneDialog';
import { useAuth } from '../../../contexts/AuthContext';

const CompanyMilestonesPanel: React.FC = () => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [contractId, setContractId] = useState<number | null>(null);
  const [projetoId, setProjetoId] = useState<number | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!user?.id) return;

        const params = new URLSearchParams(window.location.search);
        const contractParam = params.get('contractId');
        const projetoParam = params.get('projetoId');
        
        if (contractParam) {
          const id = Number(contractParam);
          if (Number.isFinite(id) && id > 0) {
            setContractId(id);
            const data = await milestoneService.getMilestonesByContract(id);
            setMilestones(Array.isArray(data) ? data : []);
            return;
          }
        }
        
        if (projetoParam) {
          const id = Number(projetoParam);
          if (Number.isFinite(id) && id > 0) {
            setProjetoId(id);
            const data = await milestoneService.getMilestonesByProject(id);
            setMilestones(Array.isArray(data) ? data : []);
            return;
          }
        }
        
        // Fallback: tentar carregar do projeto 1 se não houver parâmetros
        setProjetoId(1);
        const data = await milestoneService.getMilestonesByProject(1);
        setMilestones(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar milestones:', err);
        setMilestones([]);
      }
    };
    load();
  }, [user]);

  const handleCreated = (m?: Milestone) => {
    setOpenCreate(false);
    if (m) setMilestones(prev => [m, ...prev]);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (value?: number) => {
    if (value == null || isNaN(value)) return '—';
    return `R$ ${Number(value).toFixed(2)}`;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Marcos do Projeto</Typography>
            <Button variant="contained" onClick={() => setOpenCreate(true)}>Criar marco</Button>
          </Box>

          <List sx={{ mt: 2 }}>
            {milestones.length === 0 ? (
              <ListItem>
                <ListItemText primary="Nenhum marco encontrado." />
              </ListItem>
            ) : (
              milestones.map((m) => (
                <ListItem key={m.id} divider sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                    <ListItemText 
                      primary={m.titulo || 'Sem título'} 
                      secondary={
                        <Box>
                          {m.descricao && (
                            <Typography variant="body2" color="text.secondary">
                              {m.descricao}
                            </Typography>
                          )}
                          {m.dueDate && (
                            <Typography variant="body2" color="text.secondary">
                              Prazo: {formatDate(m.dueDate)}
                            </Typography>
                          )}
                          {m.valorMilestone != null && (
                            <Typography variant="body2" color="text.secondary">
                              Valor: {formatCurrency(m.valorMilestone)}
                            </Typography>
                          )}
                        </Box>
                      } 
                    />
                  </Stack>
                </ListItem>
              ))
            )}
          </List>
        </CardContent>
      </Card>

      <CreateMilestoneDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={handleCreated}
        contractId={contractId ?? undefined}
        projetoId={projetoId ?? undefined}
      />
    </Box>
  );
};

export default CompanyMilestonesPanel;
