import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box, Typography, TextField } from '@mui/material';
import { submitTechnicalTest } from '../../../service/technicalTestService';

interface TechnicalTestRunnerProps {
  open: boolean;
  onClose: () => void;
  testSpec: { type: 'questions'; questions: Array<{ title: string; description: string; language: string; starterCode: string }>; };
  vagaId: number;
  usuarioId: number;
}

const TechnicalTestRunner: React.FC<TechnicalTestRunnerProps> = ({ open, onClose, testSpec, vagaId, usuarioId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => testSpec.questions.map(q => q.starterCode || ''));
  const [submitting, setSubmitting] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payloadObj = {
        type: 'code_answers',
        vagaId,
        usuarioId,
        answers: testSpec.questions.map((q, i) => ({
          title: q.title,
          language: q.language,
          code: answers[i] || '',
        })),
      };
      // Envia apenas o conteúdo base64 (sem prefixo data URL) para compatibilidade com o backend
      const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(payloadObj))));
      await submitTechnicalTest({
        vagaId,
        usuarioId,
        filename: 'respostas.json',
        fileBase64: base64,
      });
      alert('Teste enviado com sucesso!');
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Falha ao enviar teste');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Teste Técnico</DialogTitle>
      <DialogContent dividers>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
          {testSpec.questions.map((q, idx) => (
            <Tab key={idx} label={q.title || `Pergunta ${idx + 1}`} />
          ))}
        </Tabs>
        {testSpec.questions.map((q, idx) => (
          <Box key={idx} sx={{ display: activeTab === idx ? 'block' : 'none', mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>{q.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{q.description}</Typography>
            <Typography variant="caption" color="text.secondary">Linguagem: {q.language}</Typography>
            <TextField
              fullWidth
              multiline
              minRows={12}
              sx={{ mt: 1, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
              value={answers[idx]}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>Enviar Respostas</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TechnicalTestRunner;
