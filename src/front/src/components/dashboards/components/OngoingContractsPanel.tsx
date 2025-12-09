import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, Button, Chip } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import contractService, { ContractResponse } from '../../../service/contractService';
import { getJobById } from '../../../service/jobService';
import { getUserById } from '../../../service/authService';

const OngoingContractsPanel: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<(ContractResponse & { jobTitle?: string; companyName?: string; developerName?: string })[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = user.type === 'company'
        ? await contractService.listActiveForCompany(Number(user.id))
        : await contractService.listActiveForDeveloper(Number(user.id));
      const base = Array.isArray(data) ? data : [];
      // enriquecer com título da vaga e nomes de empresa/dev
      const enriched = await Promise.all(base.map(async (c) => {
        let jobTitle: string | undefined;
        let companyName: string | undefined;
        let developerName: string | undefined;
        try {
          const job = await getJobById(Number(c.vagaId));
          jobTitle = job?.title;
        } catch {}
        try {
          const comp = await getUserById(Number(c.companyId));
          companyName = comp?.nome || `Empresa ${c.companyId}`;
        } catch {}
        try {
          const dev = await getUserById(Number(c.developerId));
          developerName = dev?.nome || `Dev ${c.developerId}`;
        } catch {}
        return { ...c, jobTitle, companyName, developerName };
      }));
      setItems(enriched);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user?.id, user?.type]);

  const handleFinish = async (contractId: number) => {
    if (!user?.id) return;
    if (!confirm('Deseja realmente finalizar este contrato?')) return;
    try {
      await contractService.finishContract(contractId, Number(user.id));
      await load();
    } catch (e) {
      alert('Falha ao finalizar contrato. Apenas a empresa dona do contrato pode finalizar.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Contratos em Andamento</Typography>
          {loading ? (
            <Typography>Carregando...</Typography>
          ) : items.length === 0 ? (
            <Typography variant="body2">Nenhum contrato ativo no momento.</Typography>
          ) : (
            <List>
              {items.map(c => (
                <ListItem key={c.id}
                  secondaryAction={
                    user?.type === 'company' ? (
                      <Button variant="contained" color="primary" size="small" onClick={() => handleFinish(c.id)}>Finalizar contrato</Button>
                    ) : (
                      <Chip label="Aguardando finalização pela empresa" size="small" />
                    )
                  }
                >
                  <ListItemText
                    primary={`Vaga - ${c.jobTitle || `#${c.vagaId}`}`}
                    secondary={`${c.companyName || `Empresa ${c.companyId}`} • ${c.developerName || `Dev ${c.developerId}`}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OngoingContractsPanel;
