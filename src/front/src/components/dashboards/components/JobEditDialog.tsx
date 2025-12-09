import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button, Chip, FormControl, InputLabel, Select, MenuItem, Alert, RadioGroup, FormControlLabel, Radio, FormLabel, Input, Box, Switch, Typography, Divider } from '@mui/material';
import { JobPosting } from '../../../types/job';

interface JobEditDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (id: number, data: jobPayload) => Promise<void>;
  job: JobPosting | null;
}

interface jobPayload {
  title: string;
  skills: string[];
  experienceLevel: string;
  regime: string;
  modeloRemuneracao: string;
  valorReferencia: string;
  prazoEstimado: string;
  description: string;
  localModalidade: string;
  anexo?: string;
}

const JobEditDialog: React.FC<JobEditDialogProps> = (props) => {
  const [title, setTitle] = React.useState('');
  const [skills, setSkills] = React.useState<string[]>([]);
  const [newSkill, setNewSkill] = React.useState('');
  const [experienceLevel, setExperienceLevel] = React.useState('Junior');
  const [regime, setRegime] = React.useState('');
  const [modeloRemuneracao, setModeloRemuneracao] = React.useState('');
  const [valorReferencia, setValorReferencia] = React.useState('');
  const [prazoEstimado, setPrazoEstimado] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [localModalidade, setLocalModalidade] = React.useState('');
  const [anexo, setAnexo] = React.useState<string | undefined>(undefined);
  const [formError, setFormError] = React.useState(false);
  const [testType, setTestType] = React.useState<'none' | 'pdf' | 'questions'>('none');
  const [hasTechnicalTest, setHasTechnicalTest] = React.useState(false);
  const [questions, setQuestions] = React.useState<Array<{ title: string; description: string; language: string; starterCode: string }>>([]);

  const resetForm = () => {
    setTitle('');
    setSkills([]);
    setNewSkill('');
    setExperienceLevel('Junior');
    setRegime('');
    setModeloRemuneracao('');
    setValorReferencia('');
    setPrazoEstimado('');
    setDescription('');
    setLocalModalidade('');
    setAnexo(undefined);
    setFormError(false);
  };

  const populateForm = (job: JobPosting) => {
    setTitle(job.title || '');
    setExperienceLevel(job.experienceLevel || 'Junior');
    setRegime(job.regime || '');
    setModeloRemuneracao(job.modeloRemuneracao || '');
    setValorReferencia(job.valorReferencia || '');
    setPrazoEstimado(job.prazoEstimado || '');
    setDescription(job.description || '');
    setLocalModalidade(job.localModalidade || '');
    setAnexo(job.anexo);
    const isJsonSpec = typeof job.anexo === 'string' && job.anexo.startsWith('json:testSpec:');
    if (isJsonSpec) {
      setTestType('questions');
      try {
        const parsed = JSON.parse(job.anexo!.replace('json:testSpec:', ''));
        setQuestions(Array.isArray(parsed?.questions) ? parsed.questions : []);
      } catch {
        setQuestions([]);
      }
    } else if (job.anexo) {
      setTestType('pdf');
    } else {
      setTestType('none');
    }
    setHasTechnicalTest(!!job.anexo);
    
    // Converter skills para array de strings, com verificação de segurança
    if (job.skills && Array.isArray(job.skills)) {
      const skillsArray = job.skills.map(skill => 
        typeof skill === 'object' && skill !== null ? skill.skill : skill
      ).filter(Boolean); // Remove valores undefined/null
      setSkills(skillsArray);
    } else {
      setSkills([]);
    }
  };

  React.useEffect(() => {
    if (props.open && props.job) {
      populateForm(props.job);
    } else if (!props.open) {
      resetForm();
    }
  }, [props.open, props.job]);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  }

  function handleRemoveSkill(skill: string): void {
    setSkills(skills.filter((s) => s !== skill));
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!props.job) return;

    // Gera o valor de anexo a ser enviado, evitando depender de setState assíncrono
    let anexoToSend: string | undefined = anexo;
    if (!hasTechnicalTest || testType === 'none') {
      anexoToSend = undefined;
    } else if (testType === 'questions') {
      const spec = { type: 'questions', questions };
      anexoToSend = `json:testSpec:${JSON.stringify(spec)}`;
    }

    const data: jobPayload = {
      title,
      skills,
      experienceLevel,
      regime,
      modeloRemuneracao,
      valorReferencia,
      prazoEstimado,
      description,
      localModalidade,
      anexo: anexoToSend,
    };
    
    if (!title || skills.length === 0 || !experienceLevel || !regime || !modeloRemuneracao || !valorReferencia || !localModalidade) {
      setFormError(true);
      return;
    }
    
    setFormError(false);
    try {
      await props.onUpdate(props.job.id, data);
      props.onClose();
    } catch (error) {
      setFormError(true);
    }
  };

  const handleTechnicalTestToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setHasTechnicalTest(enabled);
    setTestType(enabled ? 'pdf' : 'none');
    if (!enabled) {
      setAnexo(undefined);
      setQuestions([]);
    }
  };

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      alert('Por favor, selecione um arquivo PDF.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : undefined;
      setAnexo(result);
    };
    reader.readAsDataURL(file);
  };

  const addQuestion = () => {
    setQuestions([...questions, { title: '', description: '', language: 'javascript', starterCode: '' }]);
  };

  const updateQuestion = (index: number, field: 'title' | 'description' | 'language' | 'starterCode', value: string) => {
    const next = [...questions];
    (next[index] as any)[field] = value;
    setQuestions(next);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Vaga</DialogTitle>
      <DialogContent>
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Por favor, preencha todos os campos obrigatórios.
          </Alert>
        )}
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título da Vaga"
                placeholder="Ex. Desenvolvedor Front-end React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  label="Stack Tecnológica"
                  placeholder="Adicionar tecnologia"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <Button variant="outlined" type="button" onClick={handleAddSkill}>
                  + Adicionar tecnologia
                </Button>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{ border: '1px solid', borderColor: 'primary.main' }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Nível de experiência</FormLabel>
                <RadioGroup
                  row
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <FormControlLabel value="Junior" control={<Radio />} label="Junior" />
                  <FormControlLabel value="Pleno" control={<Radio />} label="Pleno" />
                  <FormControlLabel value="Senior" control={<Radio />} label="Sênior" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Regime de contratação</InputLabel>
                <Select
                  label="Regime de contratação"
                  value={regime}
                  onChange={(e) => setRegime(e.target.value)}
                >
                  <MenuItem value="CLT">CLT</MenuItem>
                  <MenuItem value="PJ">PJ</MenuItem>
                  <MenuItem value="Cooperado">Cooperado</MenuItem>
                  <MenuItem value="Contrato">Contrato</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Modelo de remuneração</InputLabel>
                <Select
                  label="Modelo de remuneração"
                  value={modeloRemuneracao}
                  onChange={(e) => setModeloRemuneracao(e.target.value)}
                >
                  <MenuItem value="Fixo">Fixo</MenuItem>
                  <MenuItem value="Por hora">Por hora</MenuItem>
                  <MenuItem value="Por projeto">Por projeto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Valor de referência"
                placeholder="R$ 0.00"
                value={valorReferencia}
                onChange={(e) => setValorReferencia(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prazo estimado"
                placeholder="dd/MM/yyyy"
                value={prazoEstimado}
                onChange={(e) => setPrazoEstimado(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descrição"
                placeholder="Escreva detalhadamente a vaga, responsabilidade, requisitos..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Local / Modalidade</InputLabel>
                <Select
                  label="Local / Modalidade"
                  value={localModalidade}
                  onChange={(e) => setLocalModalidade(e.target.value)}
                >
                  <MenuItem value="Remoto">Remoto</MenuItem>
                  <MenuItem value="Presencial">Presencial</MenuItem>
                  <MenuItem value="Híbrido">Híbrido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Deseja incluir teste técnico?</Typography>
                <Switch
                  checked={hasTechnicalTest}
                  onChange={handleTechnicalTestToggle}
                  inputProps={{ 'aria-label': 'Switch teste técnico' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Teste Técnico</InputLabel>
                <Select
                  label="Tipo de Teste Técnico"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as any)}
                >
                  <MenuItem value="none">Nenhum</MenuItem>
                  <MenuItem value="pdf">Arquivo PDF</MenuItem>
                  <MenuItem value="questions">Perguntas / Código</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {testType === 'pdf' && (
              <Grid item xs={12}>
                <InputLabel htmlFor="teste-tecnico-upload">PDF do Teste Técnico</InputLabel>
                <Input id="teste-tecnico-upload" type="file" onChange={handlePdfSelect} fullWidth />
                {anexo && (
                  <Typography variant="caption" color="text.secondary">Arquivo selecionado. Será anexado à vaga.</Typography>
                )}
              </Grid>
            )}

            {testType === 'questions' && (
              <Grid item xs={12}>
                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">Perguntas do Teste</Typography>
                    <Button variant="outlined" onClick={addQuestion}>+ Adicionar Pergunta</Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {questions.length === 0 && (
                    <Typography variant="body2" color="text.secondary">Nenhuma pergunta adicionada.</Typography>
                  )}
                  {questions.map((q, idx) => (
                    <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField fullWidth label="Título" value={q.title} onChange={(e) => updateQuestion(idx, 'title', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Linguagem</InputLabel>
                            <Select label="Linguagem" value={q.language} onChange={(e) => updateQuestion(idx, 'language', e.target.value as string)}>
                              <MenuItem value="javascript">JavaScript</MenuItem>
                              <MenuItem value="typescript">TypeScript</MenuItem>
                              <MenuItem value="python">Python</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth multiline rows={3} label="Enunciado / Descrição" value={q.description} onChange={(e) => updateQuestion(idx, 'description', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth multiline rows={6} label="Código Inicial (opcional)" value={q.starterCode} onChange={(e) => updateQuestion(idx, 'starterCode', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" justifyContent="flex-end">
                            <Button color="error" onClick={() => removeQuestion(idx)}>Remover</Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>

          <DialogActions sx={{ px: 0, mt: 2 }}>
            <Button onClick={props.onClose}>Cancelar</Button>
            <Button
              variant="contained"
              type="submit"
            >
              Salvar Alterações
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobEditDialog;
