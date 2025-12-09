import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, Typography } from '@mui/material';
import feedbackService from '../../../service/feedbackService';
import { useAuth } from '../../../contexts/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  feedbackId: number;
  onSubmitted?: () => void;
}

const DisputeDialog: React.FC<Props> = ({ open, onClose, feedbackId, onSubmitted }) => {
  const [justificativa, setJustificativa] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const validate = () => {
    if (!justificativa || justificativa.trim().length === 0) {
      setError('Justificativa é obrigatória para abrir uma disputa.');
      return false;
    }
    if (justificativa.trim().length < 20) {
      setError(`Justificativa deve ter pelo menos 20 caracteres. Você digitou ${justificativa.trim().length} caracteres.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { feedbackId: feedbackId, justificativaDisputa: justificativa };
  await feedbackService.abrirDisputa(payload, user?.id ? Number(user.id) : undefined);
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err: any) {
      console.error('Erro ao abrir disputa:', err);
      // Extrai a mensagem do backend se disponível
      let serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      if (typeof serverMsg === 'string') {
        // Extrai mensagem entre aspas se presente
        const m = serverMsg.match(/"([^"]+)"/);
        if (m && m[1]) serverMsg = m[1];
      }
      setError(serverMsg ? String(serverMsg) : 'Falha ao abrir disputa. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Abrir Disputa</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            label="Justificativa (mínimo 20 caracteres)"
            multiline
            rows={4}
            fullWidth
            value={justificativa}
            onChange={e => setJustificativa(e.target.value)}
            helperText={
              justificativa.trim().length > 0 && justificativa.trim().length < 20
                ? `Faltam ${20 - justificativa.trim().length} caracteres`
                : `${justificativa.trim().length} caracteres`
            }
            error={justificativa.trim().length > 0 && justificativa.trim().length < 20}
          />
          {/* File upload removed: backend DisputeCreateRequest accepts JSON only */}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={handleSubmit} disabled={submitting}>Enviar Disputa</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisputeDialog;
