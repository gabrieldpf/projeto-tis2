// src/components/profile/ProfileCompletion.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Grid,
  LinearProgress,
  Alert,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useAuth, User } from '../../contexts/AuthContext';
import * as perfilDevService from '../../service/perfilDevService';

interface SkillOptions {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  soft: string[];
}

interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  currentlyWorking: boolean;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
  expiry: string;
}

interface Links {
  github: string;
  linkedin: string;
  portfolio: string;
}

interface Preferences {
  salaryRange: string;
  contractType: string;
  workMode: string;
  availability: string;
  jobPreferences: string[];
  languages: string[];
}

interface Skills {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  soft: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface StoredUser extends User {
  headline?: string;
  summary?: string;
  location?: string;
  links?: Links;
  experiences?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  skills?: Skills;
  projects?: Project[];
  preferences?: Preferences;
  profileComplete?: boolean;
}

interface FormData {
  headline: string;
  summary: string;
  location: string;
  links: Links;
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: Skills;
  projects: Project[];
  preferences: Preferences;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const ProfileCompletion: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    headline: '',
    summary: '',
    location: '',
    links: { github: '', linkedin: '', portfolio: '' },
    experiences: [],
    education: [],
    certifications: [],
    skills: {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      soft: [],
    },
    projects: [],
    preferences: {
      salaryRange: '',
      contractType: '',
      workMode: '',
      availability: '',
      jobPreferences: [],
      languages: [],
    },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load initial data from localStorage if available
  useEffect(() => {
    if (user) {
      const savedUser = localStorage.getItem('devmatch_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as StoredUser;
        setFormData((prev: FormData) => ({
          ...prev,
          headline: parsedUser.headline || '',
          summary: parsedUser.summary || '',
          location: parsedUser.location || '',
          links: { ...prev.links, ...parsedUser.links },
          experiences: parsedUser.experiences || [],
          education: parsedUser.education || [],
          certifications: parsedUser.certifications || [],
          skills: { ...prev.skills, ...parsedUser.skills },
          projects: parsedUser.projects || [],
          preferences: { ...prev.preferences, ...parsedUser.preferences },
          profileComplete: parsedUser.profileComplete || false,
        }));
        updateProgress();
      }
    }
  }, [user]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    updateProgress();
  };

  const handleNestedChange = (section: keyof FormData, field: string, value: any) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [section]: {
        ...(typeof prev[section] === 'object' && !Array.isArray(prev[section]) ? prev[section] : {}),
        [field]: value,
      },
    }));
    updateProgress();
  };

  const addItem = (section: keyof FormData, newItem: any) => {
    setFormData((prev: FormData) => {
      const currentSection = prev[section];
      if (Array.isArray(currentSection)) {
        return {
          ...prev,
          [section]: [...currentSection, newItem],
        };
      }
      // If not array, just return prev (should not happen)
      return prev;
    });
    updateProgress();
  };

  const removeItem = (section: keyof FormData, index: number) => {
    setFormData((prev: FormData) => {
      const currentSection = prev[section];
      if (Array.isArray(currentSection)) {
        return {
          ...prev,
          [section]: currentSection.filter((_: any, i: number) => i !== index),
        };
      }
      // If not array, just return prev (should not happen)
      return prev;
    });
    updateProgress();
  };

  const updateProgress = () => {
    const totalFields = 20; // Ajustar conforme número de campos
    const filled = Object.values(formData).filter((v) => !!v && (Array.isArray(v) ? v.length > 0 : true)).length;
    setProgress((filled / totalFields) * 100);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const hasText = (value?: string) => Boolean(value && value.trim().length > 0);

    // Validação dos campos obrigatórios
    if (!formData.headline || !formData.summary || !formData.location) {
      setError('Preencha os campos obrigatórios: Título, Resumo e Localização');
      return;
    }

    const experienciasPreenchidas = formData.experiences.filter((exp: Experience) =>
      hasText(exp.title) ||
      hasText(exp.company) ||
      hasText(exp.description) ||
      !!exp.startDate ||
      !!exp.endDate ||
      exp.currentlyWorking
    );

    const experienciasIncompletas = experienciasPreenchidas.filter(
      (exp: Experience) => !hasText(exp.title) || !hasText(exp.company)
    );

    if (experienciasIncompletas.length > 0) {
      setError('Preencha cargo e empresa em todas as experiências adicionadas ou remova as incompletas.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Processa habilidades para o formato do backend
      const habilidadesArray: any[] = [];
      
      // Adiciona linguagens
      formData.skills.languages.forEach((hab: string) => {
        habilidadesArray.push({ categoria: 'linguagens', habilidade: hab });
      });
      
      // Adiciona frameworks
      formData.skills.frameworks.forEach((hab: string) => {
        habilidadesArray.push({ categoria: 'frameworks', habilidade: hab });
      });
      
      // Adiciona bancos de dados
      formData.skills.databases.forEach((hab: string) => {
        habilidadesArray.push({ categoria: 'bancos_dados', habilidade: hab });
      });
      
      // Adiciona ferramentas
      formData.skills.tools.forEach((hab: string) => {
        habilidadesArray.push({ categoria: 'ferramentas', habilidade: hab });
      });
      
      // Adiciona soft skills
      formData.skills.soft.forEach((hab: string) => {
        habilidadesArray.push({ categoria: 'soft', habilidade: hab });
      });
      
      // Processa experiências para o formato do backend
      const experienciasArray = experienciasPreenchidas.map((exp: Experience) => ({
        cargo: exp.title.trim(),
        empresa: exp.company.trim(),
        dataInicio: exp.startDate ? exp.startDate : null,
        dataFim: exp.currentlyWorking ? null : (exp.endDate ? exp.endDate : null),
        descricao: exp.description,
        trabalhandoAtualmente: exp.currentlyWorking
      }));
      
      // Processa formações para o formato do backend
      const formacoesArray = formData.education.map((edu: Education) => ({
        grau: edu.degree,
        instituicao: edu.institution,
        ano: edu.year
      }));
      
      // Processa certificações para o formato do backend
      const certificacoesArray = formData.certifications.map((cert: Certification) => ({
        nome: cert.name,
        emissor: cert.issuer,
        dataValidade: cert.expiry ? cert.expiry : null
      }));
      
      // Processa projetos para o formato do backend
      const projetosArray = formData.projects.map((proj: Project) => ({
        nome: proj.name,
        descricao: proj.description,
        tecnologias: proj.technologies,
        link: proj.link
      }));
      
      // Monta os dados para enviar ao backend
      const perfilData = {
        usuarioId: parseInt(user.id),
        titular: formData.headline,
        resumo: formData.summary,
        localizacao: formData.location,
        github: formData.links.github || undefined,
        linkedin: formData.links.linkedin || undefined,
        portfolio: formData.links.portfolio || undefined,
        faixaSalarial: formData.preferences.salaryRange || undefined,
        tipoContrato: formData.preferences.contractType || undefined,
        modoTrabalho: formData.preferences.workMode || undefined,
        disponibilidade: formData.preferences.availability || undefined,
        preferenciasVaga: formData.preferences.jobPreferences.length > 0 ? formData.preferences.jobPreferences : undefined,
        idiomas: formData.preferences.languages.length > 0 ? formData.preferences.languages : undefined,
        habilidades: habilidadesArray.length > 0 ? habilidadesArray : undefined,
        experiencias: experienciasArray.length > 0 ? experienciasArray : undefined,
        formacoes: formacoesArray.length > 0 ? formacoesArray : undefined,
        certificacoes: certificacoesArray.length > 0 ? certificacoesArray : undefined,
        projetos: projetosArray.length > 0 ? projetosArray : undefined,
      };

      // Cria o perfil no backend
      await perfilDevService.criarPerfil(perfilData);

      // Atualiza o usuário no localStorage com profileComplete = true
      const updatedUser = {
        ...user,
        profileComplete: true,
      };
      localStorage.setItem('devmatch_user', JSON.stringify(updatedUser));

      setSuccess('Perfil criado com sucesso! Redirecionando para o dashboard...');
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    const newExp = [...formData.experiences];
    newExp[index] = { ...newExp[index], [field]: value };
    handleChange('experiences', newExp);
  };

  const skillOptions: SkillOptions = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Ruby', 'C#', 'PHP'],
    frameworks: ['React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Spring Boot', 'Laravel'],
    databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Oracle'],
    tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Terraform', 'Postman'],
    soft: ['Trabalho em Equipe', 'Resolução de Problemas', 'Comunicação', 'Liderança', 'Adaptabilidade'],
  };

  return (
    <Box sx={{ p: 3, maxWidth: 'md', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Complete Seu Perfil
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Preencha os detalhes abaixo para melhorar suas chances de matching com vagas ideais.
      </Typography>

      <LinearProgress variant="determinate" value={progress} sx={{ mb: 4 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="fullWidth">
        <Tab label="Pessoais" />
        <Tab label="Experiência" />
        <Tab label="Formação" />
        <Tab label="Habilidades" />
        <Tab label="Projetos" />
        <Tab label="Preferências" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Headline/Título"
              value={formData.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="ex: Desenvolvedor Full-Stack | React & Node.js | 5+ anos"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Resumo/About"
              value={formData.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              placeholder="Breve bio sobre você e sua carreira"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Localização"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="ex: São Paulo, SP ou Remoto"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="GitHub"
              value={formData.links.github}
              onChange={(e) => handleNestedChange('links', 'github', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="LinkedIn"
              value={formData.links.linkedin}
              onChange={(e) => handleNestedChange('links', 'linkedin', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Portfólio/Site Pessoal"
              value={formData.links.portfolio}
              onChange={(e) => handleNestedChange('links', 'portfolio', e.target.value)}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {formData.experiences.map((exp: Experience, index: number) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cargo"
                  value={exp.title}
                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Empresa"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Data Início"
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label="Data Fim"
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={exp.currentlyWorking}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exp.currentlyWorking}
                        onChange={(e) =>
                          handleExperienceChange(index, 'currentlyWorking', e.target.checked)
                        }
                        name="currentlyWorking"
                      />
                    }
                    label="Trabalho atual"
                    sx={{ ml: 1 }}
                    />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descrição"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={() => removeItem('experiences', index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => addItem('experiences', { title: '', company: '', startDate: '', endDate: '', description: '', currentlyWorking: false })}
        >
          Adicionar Experiência
        </Button>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {formData.education.map((edu: Education, index: number) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Grau/Formação"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[index].degree = e.target.value;
                    handleChange('education', newEdu);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instituição"
                  value={edu.institution}
                  onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[index].institution = e.target.value;
                    handleChange('education', newEdu);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ano de Conclusão"
                  value={edu.year}
                  onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[index].year = e.target.value;
                    handleChange('education', newEdu);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={() => removeItem('education', index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => addItem('education', { degree: '', institution: '', year: '' })}
        >
          Adicionar Formação
        </Button>

        <Box sx={{ mt: 4 }}>
          {formData.certifications.map((cert: Certification, index: number) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Certificação"
                    value={cert.name}
                    onChange={(e) => {
                      const newCert = [...formData.certifications];
                      newCert[index].name = e.target.value;
                      handleChange('certifications', newCert);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Instituição/Plataforma"
                    value={cert.issuer}
                    onChange={(e) => {
                      const newCert = [...formData.certifications];
                      newCert[index].issuer = e.target.value;
                      handleChange('certifications', newCert);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Validade"
                    type="date"
                    value={cert.expiry}
                    onChange={(e) => {
                      const newCert = [...formData.certifications];
                      newCert[index].expiry = e.target.value;
                      handleChange('certifications', newCert);
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <IconButton onClick={() => removeItem('certifications', index)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => addItem('certifications', { name: '', issuer: '', expiry: '' })}
          >
            Adicionar Certificação
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={skillOptions.languages}
              value={formData.skills.languages}
              onChange={(_, value) => handleNestedChange('skills', 'languages', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Linguagens de Programação" placeholder="Adicione linguagens" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={skillOptions.frameworks}
              value={formData.skills.frameworks}
              onChange={(_, value) => handleNestedChange('skills', 'frameworks', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Frameworks/Libraries" placeholder="Adicione frameworks" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={skillOptions.databases}
              value={formData.skills.databases}
              onChange={(_, value) => handleNestedChange('skills', 'databases', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Bancos de Dados" placeholder="Adicione bancos de dados" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={skillOptions.tools}
              value={formData.skills.tools}
              onChange={(_, value) => handleNestedChange('skills', 'tools', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Ferramentas/DevOps" placeholder="Adicione ferramentas" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={skillOptions.soft}
              value={formData.skills.soft}
              onChange={(_, value) => handleNestedChange('skills', 'soft', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Habilidades Soft" placeholder="Adicione habilidades soft" />
              )}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        {formData.projects.map((proj: Project, index: number) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Projeto"
                  value={proj.name}
                  onChange={(e) => {
                    const newProj = [...formData.projects];
                    newProj[index].name = e.target.value;
                    handleChange('projects', newProj);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descrição"
                  value={proj.description}
                  onChange={(e) => {
                    const newProj = [...formData.projects];
                    newProj[index].description = e.target.value;
                    handleChange('projects', newProj);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tecnologias Usadas"
                  value={proj.technologies}
                  onChange={(e) => {
                    const newProj = [...formData.projects];
                    newProj[index].technologies = e.target.value;
                    handleChange('projects', newProj);
                  }}
                  placeholder="ex: React, Node.js, MongoDB"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Link (GitHub/Demo)"
                  value={proj.link}
                  onChange={(e) => {
                    const newProj = [...formData.projects];
                    newProj[index].link = e.target.value;
                    handleChange('projects', newProj);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={() => removeItem('projects', index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => addItem('projects', { name: '', description: '', technologies: '', link: '' })}
        >
          Adicionar Projeto
        </Button>
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pretensão Salarial (Faixa)"
              value={formData.preferences.salaryRange}
              onChange={(e) => handleNestedChange('preferences', 'salaryRange', e.target.value)}
              placeholder="ex: R$ 5.000 - R$ 8.000/mês"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Contrato</InputLabel>
              <Select
                value={formData.preferences.contractType}
                onChange={(e) => handleNestedChange('preferences', 'contractType', e.target.value)}
              >
                <MenuItem value="CLT">CLT</MenuItem>
                <MenuItem value="PJ">PJ</MenuItem>
                <MenuItem value="Freelance">Freelance</MenuItem>
                <MenuItem value="Estágio">Estágio</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Modalidade de Trabalho</InputLabel>
              <Select
                value={formData.preferences.workMode}
                onChange={(e) => handleNestedChange('preferences', 'workMode', e.target.value)}
              >
                <MenuItem value="Remoto">Remoto</MenuItem>
                <MenuItem value="Híbrido">Híbrido</MenuItem>
                <MenuItem value="Presencial">Presencial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Disponibilidade"
              value={formData.preferences.availability}
              onChange={(e) => handleNestedChange('preferences', 'availability', e.target.value)}
              placeholder="ex: Imediata ou Aviso de 2 semanas"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={['Frontend', 'Backend', 'Full-Stack', 'DevOps', 'Mobile', 'Data Science']}
              value={formData.preferences.jobPreferences}
              onChange={(_, value) => handleNestedChange('preferences', 'jobPreferences', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Preferências de Vaga" placeholder="Adicione preferências" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={['Português', 'Inglês', 'Espanhol', 'Francês']}
              value={formData.preferences.languages}
              onChange={(_, value) => handleNestedChange('preferences', 'languages', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Idiomas" placeholder="Adicione idiomas e níveis" />
              )}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
          disabled={activeTab === 0 || loading}
        >
          Anterior
        </Button>
        {activeTab === 5 ? (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Salvando...' : 'Finalizar Perfil'}
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={() => setActiveTab((prev) => prev + 1)}
            disabled={loading}
          >
            Próximo
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProfileCompletion;