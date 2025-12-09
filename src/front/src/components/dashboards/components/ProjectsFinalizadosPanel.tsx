import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, Button } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import contractService, { ContractResponse } from '../../../service/contractService';
import { getJobById } from '../../../service/jobService';
import { getUserById } from '../../../service/authService';
import FeedbackFormDialog from './FeedbackFormDialog';

const ProjectsFinalizadosPanel: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<(ContractResponse & { jobTitle?: string; companyName?: string; developerName?: string })[]>([]);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedTargetUserId, setSelectedTargetUserId] = useState<number | null>(null);
  const [selectedTargetRole, setSelectedTargetRole] = useState<'COMPANY' | 'DEVELOPER' | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const data = await contractService.listFinishedForUser(Number(user.id));
        const base = Array.isArray(data) ? data : [];
        const enriched = await Promise.all(base.map(async (c) => {
          let jobTitle: string | undefined;
          let companyName: string | undefined;
          let developerName: string | undefined;
          try { const job = await getJobById(Number(c.vagaId)); jobTitle = job?.title; } catch {}
          try { const comp = await getUserById(Number(c.companyId)); companyName = comp?.nome || `Empresa ${c.companyId}`; } catch {}
          try { const dev = await getUserById(Number(c.developerId)); developerName = dev?.nome || `Dev ${c.developerId}`; } catch {}
          return { ...c, jobTitle, companyName, developerName };
        }));
        setContracts(enriched);
      } catch (err) {
        console.error('Erro ao buscar contratos finalizados:', err);
        setContracts([]);
      }
    };
    load();
  }, [user]);

  const grouped = contracts.reduce<Record<number, (ContractResponse & { jobTitle?: string; companyName?: string; developerName?: string })[]>>((acc, c) => {
    const key = c.vagaId || 0;
    acc[key] = acc[key] || [];
    acc[key].push(c);
    return acc;
  }, {} as Record<number, ContractResponse[]>);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Projetos Finalizados
              </Typography>
              <Typography variant="body2" color="text.secondary">Projetos finalizados a partir de contratos concluídos. Após finalização, você pode avaliar a outra parte.</Typography>

              <Box sx={{ mt: 2 }}>
                <List>
                  {Object.keys(grouped).length === 0 ? (
                    <ListItem>
                      <ListItemText primary="Nenhum projeto finalizado encontrado." />
                    </ListItem>
                  ) : (
                    Object.entries(grouped).map(([projId, items]) => {
                      const any: (ContractResponse & { jobTitle?: string; companyName?: string; developerName?: string }) = items[0];
                      const targetRole = user?.type === 'developer' ? 'COMPANY' : 'DEVELOPER';
                      const targetId = user?.type === 'developer' ? any.companyId : any.developerId;
                      return (
                        <ListItem key={projId}
                          secondaryAction={
                            <Button variant="contained" size="small" onClick={() => {
                              setSelectedProjectId(Number(projId));
                              setSelectedTargetUserId(Number(targetId));
                              setSelectedTargetRole(targetRole as any);
                              setOpenFeedbackDialog(true);
                            }}>Avaliar</Button>
                          }
                        >
                          <ListItemText
                            primary={`Vaga - ${any.jobTitle || `#${projId}`}`}
                            secondary={`${any.companyName || `Empresa ${any.companyId}`} • ${any.developerName || `Dev ${any.developerId}`}`}
                          />
                        </ListItem>
                      );
                    })
                  )}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FeedbackFormDialog
        open={openFeedbackDialog}
        onClose={() => setOpenFeedbackDialog(false)}
        projectId={selectedProjectId ?? undefined}
        targetUserId={selectedTargetUserId ?? undefined}
        targetRole={selectedTargetRole ?? undefined}
        onSubmitted={() => setOpenFeedbackDialog(false)}
      />
    </Box>
  );
};

export default ProjectsFinalizadosPanel;
