import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Avatar,
  Paper,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  ArrowBack,
  Business,
  Language,
  LinkedIn,
  Instagram,
  Facebook,
  Upload,
  Delete,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as companyProfileService from '../service/companyProfileService';

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

interface CompanyLinks {
  website: string;
  linkedin: string;
  instagram: string;
  facebook: string;
}

interface CompanyFormData {
  nomeEmpresa: string;
  descricao: string;
  setor: string;
  tamanho: string;
  localizacao: string;
  anoFundacao: string;
  links: CompanyLinks;
  cultura: string;
  beneficios: string[];
  missao: string;
  visao: string;
  valores: string;
  logoUrl: string;
}

const CompanyProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState<CompanyFormData>({
    nomeEmpresa: '',
    descricao: '',
    setor: '',
    tamanho: '',
    localizacao: '',
    anoFundacao: '',
    links: {
      website: '',
      linkedin: '',
      instagram: '',
      facebook: '',
    },
    cultura: '',
    beneficios: [],
    missao: '',
    visao: '',
    valores: '',
    logoUrl: '',
  });

  useEffect(() => {
    loadCompanyProfile();
  }, [user]);

  const loadCompanyProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Tentar buscar do backend
      try {
        const perfilBackend = await companyProfileService.buscarPerfilEmpresa(parseInt(user.id));
        
        setFormData({
          nomeEmpresa: perfilBackend.nomeEmpresa || user.name || '',
          descricao: perfilBackend.descricao || '',
          setor: perfilBackend.setor || '',
          tamanho: perfilBackend.tamanho || '',
          localizacao: perfilBackend.localizacao || '',
          anoFundacao: perfilBackend.anoFundacao || '',
          links: {
            website: perfilBackend.website || '',
            linkedin: perfilBackend.linkedin || '',
            instagram: perfilBackend.instagram || '',
            facebook: perfilBackend.facebook || '',
          },
          cultura: perfilBackend.cultura || '',
          beneficios: perfilBackend.beneficios || [],
          missao: perfilBackend.missao || '',
          visao: perfilBackend.visao || '',
          valores: perfilBackend.valores || '',
          logoUrl: perfilBackend.logoUrl || '',
        });
      } catch (err) {
        console.log('Perfil não encontrado no backend, carregando do localStorage');
        
        // Fallback para localStorage
        const savedProfile = localStorage.getItem(`company_profile_${user.id}`);
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setFormData(parsedProfile);
        } else {
          // Inicializar com nome da empresa do usuário
          setFormData(prev => ({
            ...prev,
            nomeEmpresa: user.name || '',
          }));
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      setError('Erro ao carregar perfil da empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CompanyFormData, value: any) => {
    setFormData((prev: CompanyFormData) => ({ ...prev, [field]: value }));
  };

  const handleLinkChange = (field: keyof CompanyLinks, value: string) => {
    setFormData((prev: CompanyFormData) => ({
      ...prev,
      links: {
        ...prev.links,
        [field]: value,
      },
    }));
  };

  const handleAddBenefit = () => {
    setFormData(prev => ({
      ...prev,
      beneficios: [...prev.beneficios, ''],
    }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBeneficios = [...formData.beneficios];
    newBeneficios[index] = value;
    setFormData(prev => ({
      ...prev,
      beneficios: newBeneficios,
    }));
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      beneficios: prev.beneficios.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    if (!formData.nomeEmpresa || !formData.descricao) {
      setError('Preencha os campos obrigatórios: Nome da Empresa e Descrição');
      return;
    }

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Preparar dados para o backend
      const perfilData: companyProfileService.CompanyProfileData = {
        nomeEmpresa: formData.nomeEmpresa,
        descricao: formData.descricao,
        setor: formData.setor || undefined,
        tamanho: formData.tamanho || undefined,
        localizacao: formData.localizacao || undefined,
        anoFundacao: formData.anoFundacao || undefined,
        website: formData.links.website || undefined,
        linkedin: formData.links.linkedin || undefined,
        instagram: formData.links.instagram || undefined,
        facebook: formData.links.facebook || undefined,
        cultura: formData.cultura || undefined,
        beneficios: formData.beneficios.length > 0 ? formData.beneficios : undefined,
        missao: formData.missao || undefined,
        visao: formData.visao || undefined,
        valores: formData.valores || undefined,
        logoUrl: formData.logoUrl || undefined,
      };

      await companyProfileService.atualizarPerfilEmpresa(parseInt(user.id), perfilData);
      
      // Também salvar no localStorage como backup
      localStorage.setItem(`company_profile_${user.id}`, JSON.stringify(formData));
      
      setSuccess('Perfil da empresa atualizado com sucesso!');
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
    loadCompanyProfile();
  };

  const setoresOptions = [
    'Tecnologia',
    'Saúde',
    'Educação',
    'Financeiro',
    'Varejo',
    'Indústria',
    'Serviços',
    'Agronegócio',
    'Construção',
    'Outro',
  ];

  const tamanhoOptions = [
    '1-10 funcionários',
    '11-50 funcionários',
    '51-200 funcionários',
    '201-500 funcionários',
    '501-1000 funcionários',
    '1000+ funcionários',
  ];

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
        {/* Botão Voltar */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ borderRadius: 2 }}
          >
            Voltar
          </Button>
        </Box>

        {/* Card de cabeçalho do perfil */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', width: '100%' }}>
                {/* Logo/Avatar da Empresa */}
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={formData.logoUrl}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'primary.main',
                      fontSize: '3rem',
                    }}
                  >
                    {formData.logoUrl ? null : <Business sx={{ fontSize: '3rem' }} />}
                  </Avatar>
                  {editMode && (
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                    >
                      <Upload fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {formData.nomeEmpresa || 'Nome da Empresa'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {formData.setor || 'Setor não informado'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {formData.localizacao && (
                      <Chip label={formData.localizacao} size="small" variant="outlined" />
                    )}
                    {formData.tamanho && (
                      <Chip label={formData.tamanho} size="small" variant="outlined" />
                    )}
                    {formData.anoFundacao && (
                      <Chip label={`Fundada em ${formData.anoFundacao}`} size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>

                {/* Botões de ação */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {editMode ? (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                        onClick={handleSave}
                        disabled={saving}
                      >
                        Salvar
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => setEditMode(true)}
                    >
                      Editar Perfil
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Alertas */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Tabs de conteúdo */}
        <Paper sx={{ borderRadius: 2 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto">
            <Tab label="Informações Gerais" />
            <Tab label="Sobre a Empresa" />
            <Tab label="Cultura e Benefícios" />
            <Tab label="Links e Redes" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Aba Informações Gerais */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Nome da Empresa *"
                      value={formData.nomeEmpresa}
                      onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Nome da Empresa
                      </Typography>
                      <Typography variant="body1">
                        {formData.nomeEmpresa || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Descrição da Empresa *"
                      value={formData.descricao}
                      onChange={(e) => handleChange('descricao', e.target.value)}
                      placeholder="Conte sobre sua empresa, o que ela faz e o que a torna única"
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Descrição
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {formData.descricao || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      select
                      label="Setor"
                      value={formData.setor}
                      onChange={(e) => handleChange('setor', e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value="">Selecione...</option>
                      {setoresOptions.map((setor) => (
                        <option key={setor} value={setor}>
                          {setor}
                        </option>
                      ))}
                    </TextField>
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Setor
                      </Typography>
                      <Typography variant="body1">
                        {formData.setor || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      select
                      label="Tamanho da Empresa"
                      value={formData.tamanho}
                      onChange={(e) => handleChange('tamanho', e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value="">Selecione...</option>
                      {tamanhoOptions.map((tam) => (
                        <option key={tam} value={tam}>
                          {tam}
                        </option>
                      ))}
                    </TextField>
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Tamanho
                      </Typography>
                      <Typography variant="body1">
                        {formData.tamanho || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Localização"
                      value={formData.localizacao}
                      onChange={(e) => handleChange('localizacao', e.target.value)}
                      placeholder="ex: São Paulo, SP"
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Localização
                      </Typography>
                      <Typography variant="body1">
                        {formData.localizacao || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Ano de Fundação"
                      value={formData.anoFundacao}
                      onChange={(e) => handleChange('anoFundacao', e.target.value)}
                      placeholder="ex: 2010"
                      type="number"
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Ano de Fundação
                      </Typography>
                      <Typography variant="body1">
                        {formData.anoFundacao || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Aba Sobre a Empresa */}
            <TabPanel value={activeTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Missão, Visão e Valores
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Missão"
                      value={formData.missao}
                      onChange={(e) => handleChange('missao', e.target.value)}
                      placeholder="Qual é a missão da sua empresa?"
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Missão
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {formData.missao || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Visão"
                      value={formData.visao}
                      onChange={(e) => handleChange('visao', e.target.value)}
                      placeholder="Qual é a visão da sua empresa?"
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Visão
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {formData.visao || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Valores"
                      value={formData.valores}
                      onChange={(e) => handleChange('valores', e.target.value)}
                      placeholder="Quais são os valores da sua empresa?"
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Valores
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {formData.valores || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Aba Cultura e Benefícios */}
            <TabPanel value={activeTab} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label="Cultura da Empresa"
                      value={formData.cultura}
                      onChange={(e) => handleChange('cultura', e.target.value)}
                      placeholder="Descreva a cultura e o ambiente de trabalho da sua empresa"
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Cultura da Empresa
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {formData.cultura || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Benefícios
                    </Typography>
                    {editMode && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAddBenefit}
                      >
                        Adicionar Benefício
                      </Button>
                    )}
                  </Box>

                  {editMode ? (
                    <Grid container spacing={2}>
                      {formData.beneficios.map((beneficio, index) => (
                        <Grid item xs={12} key={index}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              fullWidth
                              label={`Benefício ${index + 1}`}
                              value={beneficio}
                              onChange={(e) => handleBenefitChange(index, e.target.value)}
                              placeholder="ex: Vale refeição, Plano de saúde"
                            />
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveBenefit(index)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                      {formData.beneficios.length === 0 && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            Nenhum benefício adicionado
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.beneficios.length > 0 ? (
                        formData.beneficios.map((beneficio, index) => (
                          <Chip key={index} label={beneficio} color="primary" />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Nenhum benefício informado
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Aba Links e Redes */}
            <TabPanel value={activeTab} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Website"
                      value={formData.links.website}
                      onChange={(e) => handleLinkChange('website', e.target.value)}
                      placeholder="https://www.suaempresa.com"
                      InputProps={{
                        startAdornment: <Language sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Website
                      </Typography>
                      <Typography variant="body2">
                        {formData.links.website || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="LinkedIn"
                      value={formData.links.linkedin}
                      onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/suaempresa"
                      InputProps={{
                        startAdornment: <LinkedIn sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        LinkedIn
                      </Typography>
                      <Typography variant="body2">
                        {formData.links.linkedin || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Instagram"
                      value={formData.links.instagram}
                      onChange={(e) => handleLinkChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/suaempresa"
                      InputProps={{
                        startAdornment: <Instagram sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Instagram
                      </Typography>
                      <Typography variant="body2">
                        {formData.links.instagram || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Facebook"
                      value={formData.links.facebook}
                      onChange={(e) => handleLinkChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/suaempresa"
                      InputProps={{
                        startAdornment: <Facebook sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Facebook
                      </Typography>
                      <Typography variant="body2">
                        {formData.links.facebook || 'Não informado'}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CompanyProfilePage;

