import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Alert } from '@mui/material';
import milestoneService from '../../../service/milestoneService';
import { Milestone } from '../../../types/milestone';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (m?: Milestone) => void;
  projetoId?: number;
  contractId?: number;
}

const CreateMilestoneDialog: React.FC<Props> = ({ open, onClose, onCreated, projetoId, contractId }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [valorMilestone, setValorMilestone] = useState('');
  const [criteriosAceitacao, setCriteriosAceitacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      setError('Título é obrigatório');
      return;
    }
    if (!valorMilestone || parseFloat(valorMilestone) <= 0) {
      setError('Valor do milestone deve ser maior que zero');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const created = await milestoneService.createMilestone({ 
        projetoId, 
        contractId,
        titulo, 
        descricao: descricao || undefined, 
        dueDate: dueDate || undefined,
        valorMilestone: parseFloat(valorMilestone),
        criteriosAceitacao: criteriosAceitacao || undefined
      });
      onCreated?.(created);
      // Reset form
      setTitulo('');
      setDescricao('');
      setDueDate('');
      setValorMilestone('');
      setCriteriosAceitacao('');
      onClose();
    } catch (err: any) {
      console.error('Erro ao criar milestone', err);
      setError(err.response?.data || 'Erro ao criar milestone');
      onCreated?.(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Criar Marco de Entrega</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField 
            label="Título *" 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
            fullWidth 
            required
          />
          <TextField 
            label="Descrição" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
            fullWidth 
            multiline 
            minRows={3} 
          />
          <TextField 
            label="Valor do Milestone (R$) *" 
            type="number"
            value={valorMilestone} 
            onChange={(e) => setValorMilestone(e.target.value)} 
            fullWidth 
            required
            inputProps={{ min: 0, step: 0.01 }}
            helperText="Valor a ser pago quando este milestone for aprovado"
          />
          <TextField 
            label="Prazo de Entrega" 
            type="datetime-local"
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            fullWidth 
            InputLabelProps={{ shrink: true }}
          />
          <TextField 
            label="Critérios de Aceitação" 
            value={criteriosAceitacao} 
            onChange={(e) => setCriteriosAceitacao(e.target.value)} 
            fullWidth 
            multiline 
            minRows={2}
            helperText="Descreva os critérios que devem ser atendidos para aprovação"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !titulo || !valorMilestone}>
          Criar Marco
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMilestoneDialog;
