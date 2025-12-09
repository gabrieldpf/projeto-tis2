import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Tabs, Tab, Typography, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { listTechnicalTestSubmissions, getTechnicalTestSubmissionDetail, TechnicalTestSubmissionDetail } from '../../../service/technicalTestService';
import { approveSubmission, ContractType } from '../../../service/contractService';
import { getJobById } from '../../../service/jobService';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TechnicalTestReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onApproved?: (vagaId: number, usuarioId: number) => void;
  vagaId: number;
  usuarioId: number;
}

const TechnicalTestReviewDialog: React.FC<TechnicalTestReviewDialogProps> = ({ open, onClose, onApproved, vagaId, usuarioId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = React.useState<{ id: number; submittedAt: string }[]>([]);
  const [detail, setDetail] = React.useState<TechnicalTestSubmissionDetail | null>(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const [contractType, setContractType] = React.useState<ContractType>('PJ');
  const [loadingApprove, setLoadingApprove] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [successMsg, setSuccessMsg] = React.useState<string>('');

  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      // Pré-carrega tipo de contrato a partir da vaga
      try {
        const job = await getJobById(vagaId);
        const regime: string = String(job?.regime || '').toUpperCase();
        let mapped: ContractType = 'PJ';
        if (regime.includes('CLT')) mapped = 'CLT';
        else if (regime.includes('PJ')) mapped = 'PJ';
        else if (regime.includes('COOPER') || regime.includes('COOP')) mapped = 'COOPERADO';
        else if (regime.includes('CONTR')) mapped = 'CONTRATO';
        setContractType(mapped);
      } catch {
        // mantém padrão se falhar
      }

      const list = await listTechnicalTestSubmissions(vagaId, usuarioId);
      setSubmissions(list.map(s => ({ id: s.id, submittedAt: s.submittedAt })));
      if (list.length > 0) {
        const d = await getTechnicalTestSubmissionDetail(list[0].id);
        setDetail(d);
      } else {
        setDetail(null);
      }
    } catch {
      setDetail(null);
    }
  };

  const handleApproveAndCreateContract = async () => {
    if (!user || user.type !== 'company') {
      setErrorMsg('Somente empresas podem aprovar testes e criar contratos.');
      return;
    }
    if (submissions.length === 0) {
      setErrorMsg('Nenhuma submissão de teste encontrada para aprovar.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setLoadingApprove(true);
    try {
      // Usa a primeira submissão (mais recente) para aprovar
      const submissionId = submissions[0].id;
      await approveSubmission(submissionId, contractType, Number(user.id));
      setSuccessMsg('Contrato criado com sucesso! Redirecionando...');
      if (onApproved) {
        onApproved(vagaId, usuarioId);
      }
      // Redireciona para a aba de contratos ativos (feedbackTab=contratos)
      setTimeout(() => {
        navigate('/?feedbackTab=contratos');
        onClose();
      }, 1200);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Falha ao aprovar teste e criar contrato');
    } finally {
      setLoadingApprove(false);
    }
  };

  const getPdfHref = (): string | null => {
    try {
      if (!detail?.rawPayload) return null;
      const obj = JSON.parse(detail.rawPayload);
      if (obj && obj.type === 'file') {
        const base64: string = obj.base64 || '';
        if (!base64) return null;
        if (base64.startsWith('data:')) return base64; // já é data URL
        return `data:application/pdf;base64,${base64}`;
      }
    } catch { /* ignore */ }
    return null;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Avaliar Teste Técnico</DialogTitle>
      <DialogContent dividers>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
        {detail ? (
          <Box>
            {detail.answers && detail.answers.length > 0 ? (
              <>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
                  {detail.answers.map((a, idx) => (
                    <Tab key={idx} label={a.title || `Resposta ${idx + 1}`} />
                  ))}
                </Tabs>
                {detail.answers.map((a, idx) => (
                  <Box key={idx} sx={{ display: activeTab === idx ? 'block' : 'none', mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>{a.title}</Typography>
                    <Typography variant="caption" color="text.secondary">Linguagem: {a.language}</Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={12}
                      value={a.code || ''}
                      sx={{ mt: 1, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                ))}
              </>
            ) : (
              (() => {
                const pdfHref = getPdfHref();
                if (pdfHref) {
                  return (
                    <Box>
                      <Typography sx={{ mb: 1 }}>Teste enviado em PDF.</Typography>
                      <Button variant="contained" href={pdfHref} target="_blank">Abrir PDF do Teste</Button>
                    </Box>
                  );
                }
                return (
                  <Typography>Teste sem respostas estruturadas.</Typography>
                );
              })()
            )}
          </Box>
        ) : (
          <Typography color="text.secondary">Nenhum teste encontrado para este candidato.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 2 }}>
        {user?.type === 'company' && submissions.length > 0 && (
          <>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Contrato</InputLabel>
              <Select
                label="Contrato"
                value={contractType}
                onChange={(e) => setContractType(e.target.value as ContractType)}
                disabled
              >
                <MenuItem value="PJ">PJ</MenuItem>
                <MenuItem value="CLT">CLT</MenuItem>
                <MenuItem value="CONTRATO">Contrato</MenuItem>
                <MenuItem value="COOPERADO">Cooperado</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="success"
              disabled={loadingApprove}
              onClick={handleApproveAndCreateContract}
            >
              {loadingApprove ? <CircularProgress size={20} /> : 'Aprovar Teste e Criar Contrato'}
            </Button>
          </>
        )}
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TechnicalTestReviewDialog;


