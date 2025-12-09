import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, Rating, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import feedbackService from '../../../service/feedbackService';
import { useAuth } from '../../../contexts/AuthContext';
// candidaturas não são mais usadas aqui; avaliação é liberada apenas por contratos finalizados
import contractService from '../../../service/contractService';
import { getJobById } from '../../../service/jobService';
import { getUserById } from '../../../service/authService';

interface Props {
  open: boolean;
  onClose: () => void;
  projectId?: number | string; // projeto alvo da avaliação
  targetUserId?: number;        // usuário que será avaliado
  targetRole?: 'COMPANY' | 'DEVELOPER'; // papel do avaliado
  onSubmitted?: () => void;
}

const FeedbackFormDialog: React.FC<Props> = ({ open, onClose, projectId, targetUserId, targetRole, onSubmitted }) => {
  const [qualidade, setQualidade] = useState<number | null>(5);
  const [prazos, setPrazos] = useState<number | null>(5);
  const [comunicacao, setComunicacao] = useState<number | null>(5);
  const [colaboracao, setColaboracao] = useState<number | null>(5);
  const [comentario, setComentario] = useState('');
  // files upload removed (backend controller accepts JSON payload currently)
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  // seleção de vaga e alvo
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>(projectId ? Number(projectId) : '');
  const [selectedTargetUserId, setSelectedTargetUserId] = useState<number | ''>(targetUserId ?? '');
  const [selectedTargetRole, setSelectedTargetRole] = useState<'COMPANY' | 'DEVELOPER' | ''>(targetRole ?? '');
  const [projectOptions, setProjectOptions] = useState<Array<{ id: number; label: string; companyId?: number }>>([]);
  const [targetUserOptions, setTargetUserOptions] = useState<Array<{ id: number; label: string }>>([]);
  // caches to reduce repeated requests during component lifecycle
  const jobTitleCache = React.useRef<Record<number, string>>({});
  const userNameCache = React.useRef<Record<number, string>>({});

  // Carrega opções de projetos conforme perfil
  useEffect(() => {
    const loadOptions = async () => {
      if (!open || !user?.id) return;
      try {
        if (user.type === 'developer') {
          // Permitir avaliação apenas de contratos finalizados
          const contracts = await contractService.listFinishedForUser(Number(user.id));
          // Melhorar labels: buscar título da vaga e nome da empresa
          const options = await Promise.all((contracts || []).map(async (c: { vagaId?: number; companyId?: number }) => {
            const vagaId = Number(c.vagaId);
            const companyId = Number(c.companyId);
            let title = jobTitleCache.current[vagaId];
            if (!title) {
              try {
                const job = await getJobById(vagaId);
                title = job?.title || `Vaga #${vagaId}`;
              } catch {
                title = `Vaga #${vagaId}`;
              }
              jobTitleCache.current[vagaId] = title;
            }
            let companyName = userNameCache.current[companyId];
            if (!companyName) {
              try {
                const comp = await getUserById(companyId);
                companyName = comp?.nome || `Empresa #${companyId}`;
              } catch {
                companyName = `Empresa #${companyId}`;
              }
              userNameCache.current[companyId] = companyName;
            }
            return { id: vagaId, label: `${title} — ${companyName}`, companyId };
          }));
          setProjectOptions(options);
          if (!projectId && options.length > 0) {
            setSelectedProjectId(options[0].id);
            setSelectedTargetUserId(options[0].companyId!);
            setSelectedTargetRole('COMPANY');
          }
          if (projectId) {
            const pj = options.find(o => o.id === Number(projectId));
            if (pj?.companyId) { setSelectedTargetUserId(pj.companyId); setSelectedTargetRole('COMPANY'); }
          }
          setTargetUserOptions([]);
        } else {
          // COMPANY: contratos finalizados da empresa para avaliar o dev
          const contracts = await contractService.listFinishedForUser(Number(user.id));
          // Melhorar labels: buscar título da vaga e nome do desenvolvedor
          const options = await Promise.all((contracts || []).map(async (c: { vagaId?: number; developerId?: number }) => {
            const vagaId = Number(c.vagaId);
            const devId = Number(c.developerId);
            let title = jobTitleCache.current[vagaId];
            if (!title) {
              try {
                const job = await getJobById(vagaId);
                title = job?.title || `Vaga #${vagaId}`;
              } catch {
                title = `Vaga #${vagaId}`;
              }
              jobTitleCache.current[vagaId] = title;
            }
            let devName = userNameCache.current[devId];
            if (!devName) {
              try {
                const dev = await getUserById(devId);
                devName = dev?.nome || `Dev #${devId}`;
              } catch {
                devName = `Dev #${devId}`;
              }
              userNameCache.current[devId] = devName;
            }
            return { id: vagaId, label: `${title} — ${devName}`, developerId: devId };
          }));
          setProjectOptions(options);
          if (!projectId && options.length > 0) { setSelectedProjectId(options[0].id); }
        }
      } catch (e) {
        console.error('Erro ao carregar opções de projetos:', e);
        // Silencia falhas e deixa lista vazia
        setProjectOptions([]);
      }
    };
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id, user?.type]);

  // Ao selecionar vaga, se empresa: buscar candidatos para escolher DEV alvo
  useEffect(() => {
    const loadTargetsForCompany = async () => {
      if (!open || user?.type !== 'company') return;
      if (!selectedProjectId) { setTargetUserOptions([]); return; }
      try {
        // alvo deve ser o dev do contrato finalizado
        const contracts = await contractService.listFinishedForUser(Number(user.id));
        const filtered = (contracts || []).filter((c: { vagaId?: number }) => Number(c.vagaId) === Number(selectedProjectId));
        const opts = await Promise.all(filtered.map(async (c: { developerId?: number }) => {
          const devId = Number(c.developerId);
          let devLabel = userNameCache.current[devId];
          if (!devLabel) {
            try {
              const dev = await getUserById(devId);
              devLabel = dev?.nome || `Dev #${devId}`;
            } catch {
              devLabel = `Dev #${devId}`;
            }
            userNameCache.current[devId] = devLabel;
          }
          return { id: devId, label: devLabel };
        }));
        setTargetUserOptions(opts);
        if (!targetUserId && opts.length > 0) { setSelectedTargetUserId(opts[0].id); setSelectedTargetRole('DEVELOPER'); }
      } catch (e) {
        console.error('Erro ao carregar usuários alvo para avaliação:', e);
        setTargetUserOptions([]);
      }
    };
    loadTargetsForCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.type, selectedProjectId]);

  const validate = () => {
    if (comentario && comentario.length > 0 && comentario.length < 20) {
      setError('Comentário deve ter ao menos 20 caracteres quando preenchido.');
      return false;
    }
    if (!selectedProjectId) {
      setError('Selecione a vaga/projeto para associar a avaliação.');
      return false;
    }
    if (!selectedTargetUserId || !selectedTargetRole) {
      setError('Selecione o usuário alvo da avaliação.');
      return false;
    }
    return true;
  };


  const handleSubmit = async () => {
    setError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const inferredRole = selectedTargetRole || (user?.type === 'developer' ? 'COMPANY' : 'DEVELOPER');

      const payload = {
        projectId: Number(selectedProjectId),
        ratedId: Number(selectedTargetUserId),
        ratedRole: inferredRole ? String(inferredRole).toUpperCase() : undefined,
        qualidadeTecnica: Number(qualidade ?? 0),
        cumprimentoPrazos: Number(prazos ?? 0),
        comunicacao: Number(comunicacao ?? 0),
        colaboracao: Number(colaboracao ?? 0),
        comentario: comentario || undefined,
      } as Record<string, unknown>;

      const sanitized: Record<string, unknown> = {};
      Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') sanitized[k] = v; });

      if (!sanitized.projectId || !sanitized.ratedId || !sanitized.ratedRole) {
        setError('Dados obrigatórios ausentes (vaga, usuário alvo ou papel).');
        setSubmitting(false);
        return;
      }

      const roleVal = String(sanitized.ratedRole).toUpperCase();
      if (!['COMPANY', 'DEVELOPER'].includes(roleVal)) {
        setError('Papel do avaliado inválido. Selecione Empresa ou Desenvolvedor.');
        setSubmitting(false);
        return;
      }
      sanitized.ratedRole = roleVal;

      console.debug('Feedback payload (sanitized) =>', sanitized, 'actingUserId=', user.id);
      try { console.debug('Request JSON:', JSON.stringify(sanitized)); } catch { /* ignore */ }

      await feedbackService.registrarFeedback(sanitized, Number(user.id));

      setComentario('');
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err) {
      console.error('Erro ao enviar feedback:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr: any = err;
      console.error('Response data:', anyErr?.response?.data);
        let serverMsg = anyErr?.response?.data?.message || anyErr?.response?.data?.error || anyErr?.message;
        if (typeof serverMsg === 'string') {
          // extract quoted substring if present: e.g. 400 BAD_REQUEST "Você já avaliou este projeto."
          const m = serverMsg.match(/"([^"]+)"/);
          if (m && m[1]) serverMsg = m[1];
        }
        // show only the server message (user-friendly)
        setError(serverMsg ? String(serverMsg) : 'Falha ao enviar feedback. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(targetUserOptions)
    console.log(projectOptions)
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
  <DialogTitle>Enviar Feedback para {targetRole === 'COMPANY' ? 'Empresa' : targetRole === 'DEVELOPER' ? 'Desenvolvedor' : 'Usuário'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {/* Seleção de Vaga/Projeto */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-projeto-label">Vaga / Projeto</InputLabel>
                <Select
                  labelId="select-projeto-label"
                  label="Vaga / Projeto"
                  value={selectedProjectId}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => setSelectedProjectId(e.target.value as any)}
                >
                  {projectOptions.map(opt => (
                    <MenuItem key={opt.id} value={opt.id}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Seleção do Alvo (usuário avaliado) */}
            {user?.type === 'company' ? (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="select-target-label">Usuário alvo</InputLabel>
                  <Select
                    labelId="select-target-label"
                    label="Usuário alvo"
                    value={selectedTargetUserId}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e) => { setSelectedTargetUserId(e.target.value as any); setSelectedTargetRole('DEVELOPER'); }}
                  >
                    {targetUserOptions.map(opt => (
                      <MenuItem key={opt.id} value={opt.id}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}

            <Grid item xs={12} md={6}>
              <Typography variant="caption">Qualidade técnica</Typography>
              <Rating value={qualidade} onChange={(_, v) => setQualidade(v)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption">Cumprimento de prazos</Typography>
              <Rating value={prazos} onChange={(_, v) => setPrazos(v)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption">Comunicação</Typography>
              <Rating value={comunicacao} onChange={(_, v) => setComunicacao(v)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption">Colaboração</Typography>
              <Rating value={colaboracao} onChange={(_, v) => setColaboracao(v)} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comentário (opcional, mínimo 20 caracteres se preenchido)"
                multiline
                rows={4}
                fullWidth
                value={comentario}
                onChange={e => setComentario(e.target.value)}
              />
            </Grid>
            {/* File upload removed: backend FeedbackController expects JSON body (no file multipart). */}
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>Enviar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackFormDialog;
