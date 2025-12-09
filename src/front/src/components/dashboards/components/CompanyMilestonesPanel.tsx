import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, Button, Chip, Stack } from '@mui/material';
import milestoneService from '../../../service/milestoneService';
import { Milestone } from '../../../types/milestone';
import CreateMilestoneDialog from './CreateMilestoneDialog';
import { useAuth } from '../../../contexts/AuthContext';

const CompanyMilestonesPanel: React.FC = () => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [jobId, setJobId] = useState<number | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!user?.id) return;

        const paramId = new URLSearchParams(window.location.search).get('jobId');
        const resolvedId = paramId ? Number(paramId) : null;
        const finalJobId = resolvedId !== null && Number.isFinite(resolvedId) ? resolvedId : 1; // fallback temporário
        setJobId(finalJobId);

        const data = await milestoneService.getMilestonesByJob(finalJobId);
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
                    <ListItemText primary={m.titulo} secondary={m.descricao} />
                    {m.status && <Chip size="small" label={m.status} />}
                  </Stack>
                  {m.dueDate && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      Prazo: {m.dueDate}
                    </Typography>
                  )}
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
        jobId={jobId ?? 1}
      />
    </Box>
  );
};

export default CompanyMilestonesPanel;
