import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Chip, 
  Button, 
  LinearProgress,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import { 
  Star, 
  AttachMoney, 
  LocationOn, 
  WorkOutline, 
  Info, 
  CheckCircle,
  Psychology,
} from '@mui/icons-material';
import { JobMatch } from '../../../service/matchingService';
import { candidatar, verificarCandidatura } from '../../../service/candidaturaService';
import JobDetailsDialog from '../../jobs/JobDetailsDialog';
import MatchingExplanation from '../../matching/MatchingExplanation';

interface MatchesGridProps {
  matches: JobMatch[];
  userId?: string;
  onCandidaturaSuccess?: () => void;
}

const MatchesGrid: React.FC<MatchesGridProps> = ({ matches, userId, onCandidaturaSuccess }) => {
  const [candidaturas, setCandidaturas] = useState<Set<number>>(new Set());
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [error, setError] = useState('');
  const [matchingExplanationOpen, setMatchingExplanationOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);

  React.useEffect(() => {
    checkCandidaturas();
  }, [matches, userId]);

  const checkCandidaturas = async () => {
    if (!userId) return;
    
    const candidaturasSet = new Set<number>();
    for (const match of matches) {
      try {
        const jaCandidatou = await verificarCandidatura(userId, match.vagaId);
        if (jaCandidatou) {
          candidaturasSet.add(match.vagaId);
        }
      } catch (err) {
        console.error('Erro ao verificar candidatura:', err);
      }
    }
    setCandidaturas(candidaturasSet);
  };

  const handleCandidatar = async (vagaId: number) => {
    if (!userId) {
      setError('Você precisa estar logado para se candidatar');
      return;
    }

    try {
      await candidatar({
        vagaId,
        usuarioId: Number(userId),
      });
      
      setCandidaturas(prev => new Set(prev).add(vagaId));
      setError('');
      
      if (onCandidaturaSuccess) {
        onCandidaturaSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao se candidatar');
    }
  };

  const handleViewDetails = (vagaId: number) => {
    setSelectedJobId(vagaId);
    setDetailsOpen(true);
  };

  const handleOpenMatchingExplanation = (match: JobMatch) => {
    setSelectedMatch(match);
    setMatchingExplanationOpen(true);
  };

  const handleCloseMatchingExplanation = () => {
    setMatchingExplanationOpen(false);
    setSelectedMatch(null);
  };

  const getCompatibilidadeColor = (compatibilidade: number) => {
    if (compatibilidade >= 85) return '#4caf50'; // Verde
    if (compatibilidade >= 70) return '#8bc34a'; // Verde claro
    return '#ffc107'; // Amarelo
  };

  if (matches.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Nenhuma vaga compatível encontrada
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete seu perfil para encontrar vagas que combinem com você
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {matches.map((match) => (
          <Grid item xs={12} md={6} key={match.vagaId}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <CardContent>
                {/* Nome da Empresa */}
                {match.nomeEmpresa && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      {match.nomeEmpresa}
                    </Typography>
                  </Box>
                )}
                
                {/* Header com título e compatibilidade */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {match.titulo}
                    </Typography>
                    <Chip 
                      label={match.experienceLevel} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      gap={0.5}
                      sx={{ 
                        bgcolor: `${getCompatibilidadeColor(match.compatibilidade)}22`,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                      }}
                    >
                      <Star sx={{ color: getCompatibilidadeColor(match.compatibilidade), fontSize: 20 }} />
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ color: getCompatibilidadeColor(match.compatibilidade) }}
                      >
                        {Math.round(match.compatibilidade)}%
                      </Typography>
                    </Box>
                    <Tooltip title="Ver explicação do matching">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenMatchingExplanation(match)}
                        sx={{ ml: 0.5 }}
                      >
                        <Psychology fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Barra de compatibilidade */}
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Compatibilidade
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {Math.round(match.compatibilidade)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={match.compatibilidade}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getCompatibilidadeColor(match.compatibilidade),
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>

                {/* Skills */}
                {match.skills && match.skills.length > 0 && (
                  <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
                    {match.skills.slice(0, 5).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {match.skills.length > 5 && (
                      <Chip
                        label={`+${match.skills.length - 5}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}

                {/* Informações da vaga */}
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
                    <AttachMoney fontSize="small" color="action" />
                    <Typography variant="body2">{match.valorReferencia || 'A combinar'}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{match.localModalidade}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <WorkOutline fontSize="small" color="action" />
                    <Typography variant="body2">{match.regime}</Typography>
                  </Box>
                </Box>

                {/* Botões de ação */}
                <Box display="flex" gap={1}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ flex: 1 }}
                    startIcon={<Info />}
                    onClick={() => handleViewDetails(match.vagaId)}
                  >
                    Detalhes
                  </Button>
                  {candidaturas.has(match.vagaId) ? (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ flex: 1 }}
                      disabled
                      startIcon={<CheckCircle />}
                    >
                      Candidatado
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ flex: 1 }}
                      onClick={() => handleCandidatar(match.vagaId)}
                    >
                      Candidatar
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog de detalhes */}
      <JobDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        jobId={selectedJobId}
        isApplied={candidaturas.has(selectedJobId || 0)}
      />

      {/* Dialog de explicação do matching */}
      {selectedMatch && (
        <MatchingExplanation
          open={matchingExplanationOpen}
          onClose={handleCloseMatchingExplanation}
          compatibilidade={selectedMatch.compatibilidade}
          details={selectedMatch.matchingDetails}
          jobTitle={selectedMatch.titulo}
        />
      )}
    </>
  );
};

export default MatchesGrid;