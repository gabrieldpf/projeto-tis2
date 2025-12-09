// src/components/profile/Profile.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

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

interface ProfileData {
  headline: string;
  summary: string;
  location: string;
  links: { github: string; linkedin: string; portfolio: string };
  experiences: { title: string; company: string; startDate: string; endDate: string; description: string; currentlyWorking: boolean }[];
  education: { degree: string; institution: string; year: string }[];
  certifications: { name: string; issuer: string; expiry: string }[];
  skills: { languages: string[]; frameworks: string[]; databases: string[]; tools: string[]; soft: string[] };
  projects: { name: string; description: string; technologies: string; link: string }[];
  preferences: { salaryRange: string; contractType: string; workMode: string; availability: string; jobPreferences: string[]; languages: string[] };
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (user) {
      const savedUser = localStorage.getItem('devmatch_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as any;
        setProfileData({
          headline: parsedUser.headline || '',
          summary: parsedUser.summary || '',
          location: parsedUser.location || '',
          links: {
            github: parsedUser.links?.github || '',
            linkedin: parsedUser.links?.linkedin || '',
            portfolio: parsedUser.links?.portfolio || '',
          },
          experiences: parsedUser.experiences || [],
          education: parsedUser.education || [],
          certifications: parsedUser.certifications || [],
          skills: {
            languages: parsedUser.skills?.languages || [],
            frameworks: parsedUser.skills?.frameworks || [],
            databases: parsedUser.skills?.databases || [],
            tools: parsedUser.skills?.tools || [],
            soft: parsedUser.skills?.soft || [],
          },
          projects: parsedUser.projects || [],
          preferences: {
            salaryRange: parsedUser.preferences?.salaryRange || '',
            contractType: parsedUser.preferences?.contractType || '',
            workMode: parsedUser.preferences?.workMode || '',
            availability: parsedUser.preferences?.availability || '',
            jobPreferences: parsedUser.preferences?.jobPreferences || [],
            languages: parsedUser.preferences?.languages || [],
          },
        });
      }
    }
  }, [user]);

  const handleEdit = () => {
    // Redireciona para a tela de completude de perfil
    window.location.href = '/profile-completion'; // Ajuste a rota conforme necessário
  };

  if (!profileData) {
    return <Typography>Carregando perfil...</Typography>;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 'md', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Meu Perfil</Typography>
        <Button variant="contained" startIcon={<Edit />} onClick={handleEdit}>
          Editar Perfil
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {profileData.headline || 'Adicione um título profissional'}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {profileData.summary || 'Adicione um resumo sobre sua experiência e objetivos.'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Localização: {profileData.location || 'Não especificada'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              {profileData.links.github && (
                <Typography variant="body2">
                  GitHub: <a href={profileData.links.github} target="_blank" rel="noopener noreferrer">{profileData.links.github}</a>
                </Typography>
              )}
              {profileData.links.linkedin && (
                <Typography variant="body2">
                  LinkedIn: <a href={profileData.links.linkedin} target="_blank" rel="noopener noreferrer">{profileData.links.linkedin}</a>
                </Typography>
              )}
              {profileData.links.portfolio && (
                <Typography variant="body2">
                  Portfólio: <a href={profileData.links.portfolio} target="_blank" rel="noopener noreferrer">{profileData.links.portfolio}</a>
                </Typography>
              )}
            </Box>
          </Box>

          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="fullWidth">
            <Tab label="Pessoais" />
            <Tab label="Experiência" />
            <Tab label="Formação" />
            <Tab label="Habilidades" />
            <Tab label="Projetos" />
            <Tab label="Preferências" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Typography variant="body1">Dados pessoais já exibidos acima.</Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {profileData.experiences.length > 0 ? (
              profileData.experiences.map((exp, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="h6">{exp.title} - {exp.company}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.startDate} a {exp.currentlyWorking ? 'Atual' : exp.endDate}
                  </Typography>
                  <Typography paragraph>{exp.description}</Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">Nenhuma experiência adicionada.</Typography>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {profileData.education.length > 0 ? (
              profileData.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="h6">{edu.degree} - {edu.institution}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.year}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">Nenhuma formação adicionada.</Typography>
            )}
            {profileData.certifications.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Certificações</Typography>
                {profileData.certifications.map((cert, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1">{cert.name} - {cert.issuer}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Válido até: {cert.expiry}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Linguagens</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {profileData.skills.languages.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Frameworks</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {profileData.skills.frameworks.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Bancos de Dados</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {profileData.skills.databases.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Ferramentas</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {profileData.skills.tools.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Habilidades Soft</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {profileData.skills.soft.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            {profileData.projects.length > 0 ? (
              profileData.projects.map((proj, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="h6">{proj.name}</Typography>
                  <Typography paragraph>{proj.description}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tecnologias: {proj.technologies}
                  </Typography>
                  {proj.link && (
                    <Typography variant="body2">
                      Link: <a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a>
                    </Typography>
                  )}
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">Nenhum projeto adicionado.</Typography>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={5}>
            <Typography variant="h6">Pretensão Salarial</Typography>
            <Typography>{profileData.preferences.salaryRange || 'Não especificada'}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Tipo de Contrato</Typography>
            <Typography>{profileData.preferences.contractType || 'Não especificado'}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Modalidade de Trabalho</Typography>
            <Typography>{profileData.preferences.workMode || 'Não especificada'}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Disponibilidade</Typography>
            <Typography>{profileData.preferences.availability || 'Não especificada'}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Preferências de Vaga</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {profileData.preferences.jobPreferences.map((pref, index) => (
                <Chip key={index} label={pref} variant="outlined" />
              ))}
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>Idiomas</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {profileData.preferences.languages.map((lang, index) => (
                <Chip key={index} label={lang} variant="outlined" />
              ))}
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;