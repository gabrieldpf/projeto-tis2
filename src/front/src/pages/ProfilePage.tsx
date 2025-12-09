import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as perfilDevService from '../service/perfilDevService';
import ProfileHeader from '../components/profile/components/ProfileHeader';
import ProfileAboutTab from '../components/profile/components/ProfileAboutTab';
import ProfileExperiencesTab from '../components/profile/components/ProfileExperiencesTab';
import ProfileEducationTab from '../components/profile/components/ProfileEducationTab';
import ProfileSkillsTab from '../components/profile/components/ProfileSkillsTab';
import ProfileProjectsTab from '../components/profile/components/ProfileProjectsTab';
import ProfilePreferencesTab from '../components/profile/components/ProfilePreferencesTab';

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

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Tenta buscar do backend primeiro
      try {
        const perfilBackend = await perfilDevService.buscarPerfil(parseInt(user.id));
        
        // Processar habilidades do backend
        const processarHabilidades = (habilidades?: Array<{categoria: string, habilidade: string}>) => {
          const skills = {
            languages: [] as string[],
            frameworks: [] as string[],
            databases: [] as string[],
            tools: [] as string[],
            soft: [] as string[],
          };
          
          if (habilidades && habilidades.length > 0) {
            habilidades.forEach(hab => {
              const categoria = hab.categoria.toLowerCase();
              const habilidade = hab.habilidade;
              
              // Mapear categorias do backend para frontend
              if (categoria === 'linguagens' || categoria === 'languages') {
                skills.languages.push(habilidade);
              } else if (categoria === 'frameworks') {
                skills.frameworks.push(habilidade);
              } else if (categoria === 'bancos_dados' || categoria === 'databases') {
                skills.databases.push(habilidade);
              } else if (categoria === 'ferramentas' || categoria === 'tools') {
                skills.tools.push(habilidade);
              } else if (categoria === 'soft') {
                skills.soft.push(habilidade);
              }
            });
          }
          
          return skills;
        };
        
        const skillsProcessadas = processarHabilidades(perfilBackend.habilidades);
        
        // DEBUG: Log para verificar se as habilidades foram processadas
        console.log('🔍 Habilidades do backend:', perfilBackend.habilidades);
        console.log('✅ Skills processadas:', skillsProcessadas);
        
        setFormData(prev => ({
          ...prev,
          headline: perfilBackend.titular || '',
          summary: perfilBackend.resumo || '',
          location: perfilBackend.localizacao || '',
          links: {
            github: perfilBackend.github || '',
            linkedin: perfilBackend.linkedin || '',
            portfolio: perfilBackend.portfolio || '',
          },
          skills: skillsProcessadas,
          preferences: {
            ...prev.preferences,
            salaryRange: perfilBackend.faixaSalarial || '',
            contractType: perfilBackend.tipoContrato || '',
            workMode: perfilBackend.modoTrabalho || '',
            availability: perfilBackend.disponibilidade || '',
            jobPreferences: perfilBackend.preferenciasVaga || [],
            languages: perfilBackend.idiomas || [],
          },
        }));
      } catch (err) {
        console.log('Perfil não encontrado no backend, carregando do localStorage');
      }

      // Complementa com dados do localStorage (experiências, projetos, etc.)
      const savedUser = localStorage.getItem('devmatch_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as any;
        setFormData(prev => {
          // Verifica se já tem skills do backend (não sobrescrever!)
          const hasBackendSkills = 
            prev.skills.languages.length > 0 || 
            prev.skills.frameworks.length > 0 || 
            prev.skills.databases.length > 0 || 
            prev.skills.tools.length > 0 || 
            prev.skills.soft.length > 0;
          
          console.log('📦 Tem skills do backend?', hasBackendSkills, prev.skills);
          
          return {
            ...prev,
            headline: prev.headline || parsedUser.headline || '',
            summary: prev.summary || parsedUser.summary || '',
            location: prev.location || parsedUser.location || '',
            links: {
              github: prev.links.github || parsedUser.links?.github || '',
              linkedin: prev.links.linkedin || parsedUser.links?.linkedin || '',
              portfolio: prev.links.portfolio || parsedUser.links?.portfolio || '',
            },
            experiences: parsedUser.experiences || [],
            education: parsedUser.education || [],
            certifications: parsedUser.certifications || [],
            // IMPORTANTE: Mantém skills do backend se já foram carregadas!
            skills: hasBackendSkills ? prev.skills : {
              languages: parsedUser.skills?.languages || [],
              frameworks: parsedUser.skills?.frameworks || [],
              databases: parsedUser.skills?.databases || [],
              tools: parsedUser.skills?.tools || [],
              soft: parsedUser.skills?.soft || [],
            },
            projects: parsedUser.projects || [],
            preferences: {
              salaryRange: prev.preferences.salaryRange || parsedUser.preferences?.salaryRange || '',
              contractType: prev.preferences.contractType || parsedUser.preferences?.contractType || '',
              workMode: prev.preferences.workMode || parsedUser.preferences?.workMode || '',
              availability: prev.preferences.availability || parsedUser.preferences?.availability || '',
              jobPreferences: prev.preferences.jobPreferences.length > 0 ? prev.preferences.jobPreferences : (parsedUser.preferences?.jobPreferences || []),
              languages: prev.preferences.languages.length > 0 ? prev.preferences.languages : (parsedUser.preferences?.languages || []),
            },
          };
        });
      }
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      setError('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section: keyof FormData, field: string, value: any) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [section]: {
        ...(typeof prev[section] === 'object' && !Array.isArray(prev[section]) ? prev[section] : {}),
        [field]: value,
      },
    }));
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
      return prev;
    });
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
      return prev;
    });
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    const newExp = [...formData.experiences];
    newExp[index] = { ...newExp[index], [field]: value };
    handleChange('experiences', newExp);
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEdu = [...formData.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    handleChange('education', newEdu);
  };

  const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
    const newCert = [...formData.certifications];
    newCert[index] = { ...newCert[index], [field]: value };
    handleChange('certifications', newCert);
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    const newProj = [...formData.projects];
    newProj[index] = { ...newProj[index], [field]: value };
    handleChange('projects', newProj);
  };

  const handleSave = async () => {
    if (!user) return;

    if (!formData.headline || !formData.summary || !formData.location) {
      setError('Preencha os campos obrigatórios: Título, Resumo e Localização');
      return;
    }

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Salva no backend
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
      };

      await perfilDevService.atualizarPerfil(parseInt(user.id), perfilData);

      // Atualiza localStorage com todos os dados
      const updatedUser = {
        ...user,
        headline: formData.headline,
        summary: formData.summary,
        location: formData.location,
        links: formData.links,
        experiences: formData.experiences,
        education: formData.education,
        certifications: formData.certifications,
        skills: formData.skills,
        projects: formData.projects,
        preferences: formData.preferences,
        profileComplete: true,
      };
      localStorage.setItem('devmatch_user', JSON.stringify(updatedUser));

      setSuccess('Perfil atualizado com sucesso!');
      setEditMode(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    loadProfile();
  };

  const skillOptions: SkillOptions = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Ruby', 'C#', 'PHP', 'C++', 'Kotlin', 'Swift'],
    frameworks: ['React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Spring Boot', 'Laravel', 'Next.js', 'NestJS'],
    databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Oracle', 'Cassandra', 'DynamoDB'],
    tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Terraform', 'Postman', 'Jira', 'GitHub Actions'],
    soft: ['Trabalho em Equipe', 'Resolução de Problemas', 'Comunicação', 'Liderança', 'Adaptabilidade', 'Criatividade'],
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 10, pb: 4 }}>
      <Container maxWidth="lg">
        <ProfileHeader
          user={user}
          headline={formData.headline}
          location={formData.location}
          links={formData.links}
          editMode={editMode}
          saving={saving}
          onEdit={() => setEditMode(true)}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          onBack={() => navigate('/')}
        />

        {/* Alertas */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Tabs de conteúdo */}
        <Paper sx={{ borderRadius: 2 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto">
            <Tab label="Sobre" />
            <Tab label="Experiências" />
            <Tab label="Formação" />
            <Tab label="Habilidades" />
            <Tab label="Projetos" />
            <Tab label="Preferências" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Aba Sobre */}
            <TabPanel value={activeTab} index={0}>
              <ProfileAboutTab
                editMode={editMode}
                headline={formData.headline}
                summary={formData.summary}
                location={formData.location}
                links={formData.links}
                onHeadlineChange={(value) => handleChange('headline', value)}
                onSummaryChange={(value) => handleChange('summary', value)}
                onLocationChange={(value) => handleChange('location', value)}
                onLinkChange={(field, value) => handleNestedChange('links', field, value)}
              />
            </TabPanel>

            {/* Aba Experiências */}
            <TabPanel value={activeTab} index={1}>
              <ProfileExperiencesTab
                editMode={editMode}
                experiences={formData.experiences}
                onExperienceChange={handleExperienceChange}
                onAddExperience={() => addItem('experiences', {
                  title: '',
                  company: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  currentlyWorking: false
                })}
                onRemoveExperience={(index) => removeItem('experiences', index)}
              />
            </TabPanel>

            {/* Aba Formação */}
            <TabPanel value={activeTab} index={2}>
              <ProfileEducationTab
                editMode={editMode}
                education={formData.education}
                certifications={formData.certifications}
                onEducationChange={handleEducationChange}
                onCertificationChange={handleCertificationChange}
                onAddEducation={() => addItem('education', { degree: '', institution: '', year: '' })}
                onRemoveEducation={(index) => removeItem('education', index)}
                onAddCertification={() => addItem('certifications', { name: '', issuer: '', expiry: '' })}
                onRemoveCertification={(index) => removeItem('certifications', index)}
              />
            </TabPanel>

            {/* Aba Habilidades */}
            <TabPanel value={activeTab} index={3}>
              <ProfileSkillsTab
                editMode={editMode}
                skills={formData.skills}
                skillOptions={skillOptions}
                onSkillChange={(category, value) => handleNestedChange('skills', category, value)}
              />
            </TabPanel>

            {/* Aba Projetos */}
            <TabPanel value={activeTab} index={4}>
              <ProfileProjectsTab
                editMode={editMode}
                projects={formData.projects}
                onProjectChange={handleProjectChange}
                onAddProject={() => addItem('projects', {
                  name: '',
                  description: '',
                  technologies: '',
                  link: ''
                })}
                onRemoveProject={(index) => removeItem('projects', index)}
              />
            </TabPanel>

            {/* Aba Preferências */}
            <TabPanel value={activeTab} index={5}>
              <ProfilePreferencesTab
                editMode={editMode}
                preferences={formData.preferences}
                onPreferenceChange={(field, value) => handleNestedChange('preferences', field, value)}
              />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;

