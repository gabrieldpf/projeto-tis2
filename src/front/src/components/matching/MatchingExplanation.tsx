import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  TipsAndUpdates,
  Info,
  Close,
  LocationOn,
  AttachMoney,
  Description,
  Star,
  Code,
} from '@mui/icons-material';
import { MatchingDetails } from '../../service/matchingService';

interface MatchingExplanationProps {
  open: boolean;
  onClose: () => void;
  compatibilidade: number;
  details?: MatchingDetails;
  jobTitle: string;
}

const MatchingExplanation: React.FC<MatchingExplanationProps> = ({
  open,
  onClose,
  compatibilidade,
  details,
  jobTitle,
}) => {
  // Debug: Log dos detalhes recebidos
  React.useEffect(() => {
    if (open && details) {
      console.log('Matching Details:', details);
      console.log('Score Skills:', details.scoreSkills);
      console.log('Score Salario:', details.scoreSalario);
      console.log('Score Localizacao:', details.scoreLocalizacao);
      console.log('Score Contrato:', details.scoreContrato);
      console.log('Score Preferencias:', details.scorePreferencias);
    }
  }, [open, details]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#4caf50';
    if (score >= 70) return '#8bc34a';
    if (score >= 50) return '#ffc107';
    return '#ff9800';
  };

  const criterios = [
    {
      nome: 'Habilidades Técnicas',
      score: details?.scoreSkills ?? 50,
      peso: '25%',
      icon: <Code />,
    },
    {
      nome: 'Faixa Salarial',
      score: details?.scoreSalario ?? 50,
      peso: '25%',
      icon: <AttachMoney />,
    },
    {
      nome: 'Localização/Modalidade',
      score: details?.scoreLocalizacao ?? 50,
      peso: '20%',
      icon: <LocationOn />,
    },
    {
      nome: 'Tipo de Contrato',
      score: details?.scoreContrato ?? 50,
      peso: '15%',
      icon: <Description />,
    },
    {
      nome: 'Preferências de Vaga',
      score: details?.scorePreferencias ?? 50,
      peso: '15%',
      icon: <Star />,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Explicação do Matching
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {jobTitle}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Score Geral */}
        <Paper elevation={0} sx={{ bgcolor: 'primary.50', p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {Math.round(compatibilidade)}%
            </Typography>
            <Typography variant="h6" gutterBottom>
              Compatibilidade Geral
            </Typography>
            <LinearProgress
              variant="determinate"
              value={compatibilidade}
              sx={{
                height: 12,
                borderRadius: 6,
                mt: 2,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getScoreColor(compatibilidade),
                  borderRadius: 6,
                },
              }}
            />
          </Box>
        </Paper>

        {/* Tooltip Explicativo */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'info.50', borderRadius: 2, borderLeft: 4, borderColor: 'info.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Info color="info" />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Como calculamos o matching?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analisamos 5 critérios principais e atribuímos pesos diferentes a cada um. 
                Quanto maior o percentual, mais a vaga se alinha com seu perfil e preferências.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Critérios Detalhados */}
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Análise por Critério
        </Typography>

        {criterios.map((criterio, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {criterio.icon}
                <Typography variant="subtitle1" fontWeight="medium">
                  {criterio.nome}
                </Typography>
                <Chip label={`Peso: ${criterio.peso}`} size="small" variant="outlined" />
              </Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: getScoreColor(criterio.score) }}
              >
                {Math.round(criterio.score)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={criterio.score}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getScoreColor(criterio.score),
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* Skills em Comum */}
        {details && details.skillsEmComum && details.skillsEmComum.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" />
              Habilidades em Comum
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {details.skillsEmComum.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="success"
                  variant="outlined"
                  icon={<CheckCircle />}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Skills Faltantes */}
        {details && details.skillsFaltantes && details.skillsFaltantes.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Habilidades Requeridas pela Vaga
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {details.skillsFaltantes.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Motivos Positivos */}
        {details && details.motivosPositivos && details.motivosPositivos.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" />
              Por que esta vaga combina com você
            </Typography>
            <List dense>
              {details.motivosPositivos.map((motivo, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={motivo} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Sugestões de Melhoria */}
        {details && details.sugestoesMelhoria && details.sugestoesMelhoria.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TipsAndUpdates color="warning" />
              Sugestões para Melhorar seu Perfil
            </Typography>
            <List dense>
              {details.sugestoesMelhoria.map((sugestao, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <TipsAndUpdates color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={sugestao} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchingExplanation;

