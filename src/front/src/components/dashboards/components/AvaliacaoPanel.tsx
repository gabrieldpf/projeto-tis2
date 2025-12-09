import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import feedbackService from '../../../service/feedbackService';
import { FeedbackSummaryResponse } from '../../../types/feedback';

const AvaliacaoPanel: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FeedbackSummaryResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const data = await feedbackService.getSummary(Number(user.id));
        setSummary(data || null);
      } catch (err) {
        console.error('Erro ao buscar resumo de avaliações:', err);
        setSummary(null);
      }
    };
    load();
  }, [user]);

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Avaliação Consolidada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Relatório resumido das suas avaliações e feedbacks no sistema.
          </Typography>

          <Typography><strong>Projetos finalizados:</strong> {summary ? summary.projetosFinalizados : '-'}</Typography>
          <Typography><strong>Feedbacks recebidos:</strong> {summary ? summary.feedbacksRecebidos : '-'}</Typography>
          <Typography><strong>Avaliações realizadas:</strong> {summary ? summary.avaliacoesRealizadas : '-'}</Typography>
          <Typography><strong>Contestações abertas:</strong> {summary ? summary.contestacoesAbertas : '-'}</Typography>

          <Box sx={{ mt: 2 }}>
            {/* <Button variant="contained" color="warning">Gerar Relatório</Button> */}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AvaliacaoPanel;
