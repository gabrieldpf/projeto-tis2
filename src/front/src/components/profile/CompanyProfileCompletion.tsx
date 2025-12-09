import React, { useState } from 'react';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Business,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Delete,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as companyProfileService from '../../service/companyProfileService';

interface CompanyFormData {
  nomeEmpresa: string;
  descricao: string;
  setor: string;
  tamanho: string;
  localizacao: string;
  anoFundacao: string;
  website: string;
  linkedin: string;
  cultura: string;
  beneficios: string[];
}

const steps = [
  'Informações Básicas',
  'Sobre a Empresa',
  'Cultura e Benefícios',
];

const CompanyProfileCompletion: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CompanyFormData>({
    nomeEmpresa: user?.name || '',
    descricao: '',
    setor: '',
    tamanho: '',
    localizacao: '',
    anoFundacao: '',
    website: '',
    linkedin: '',
    cultura: '',
    beneficios: [],
  });

  const handleChange = (field: keyof CompanyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.nomeEmpresa.trim()) {
          setError('Nome da empresa é obrigatório');
          return false;
        }
        if (!formData.setor) {
          setError('Selecione o setor da empresa');
          return false;
        }
        if (!formData.tamanho) {
          setError('Selecione o tamanho da empresa');
          return false;
        }
        if (!formData.localizacao.trim()) {
          setError('Localização é obrigatória');
          return false;
        }
        return true;
      
      case 1:
        if (!formData.descricao.trim() || formData.descricao.length < 50) {
          setError('Descrição deve ter no mínimo 50 caracteres');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.cultura.trim()) {
          setError('Descreva a cultura da sua empresa');
          return false;
        }
        if (formData.beneficios.filter(b => b.trim()).length < 2) {
          setError('Adicione pelo menos 2 benefícios');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleFinish = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const perfilData: companyProfileService.CompanyProfileData = {
        nomeEmpresa: formData.nomeEmpresa,
        descricao: formData.descricao,
        setor: formData.setor,
        tamanho: formData.tamanho,
        localizacao: formData.localizacao,
        anoFundacao: formData.anoFundacao || undefined,
        website: formData.website || undefined,
        linkedin: formData.linkedin || undefined,
        cultura: formData.cultura,
        beneficios: formData.beneficios.filter(b => b.trim()),
      };

      await companyProfileService.atualizarPerfilEmpresa(parseInt(user.id), perfilData);

      // Atualizar contexto do usuário para indicar perfil completo
      if (updateUser) {
        updateUser({ ...user, profileComplete: true });
      }

      // Redirecionar para dashboard
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
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

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 10, pb: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Business sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Complete o Perfil da sua Empresa
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Estas informações ajudarão os desenvolvedores a conhecer melhor sua empresa
          </Typography>
        </Box>

        {/* Stepper */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form Steps */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* Step 0: Informações Básicas */}
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Informações Básicas
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Nome da Empresa"
                    value={formData.nomeEmpresa}
                    onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
                    placeholder="ex: Tech Solutions Ltda"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Localização"
                    value={formData.localizacao}
                    onChange={(e) => handleChange('localizacao', e.target.value)}
                    placeholder="ex: São Paulo, SP"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ano de Fundação"
                    value={formData.anoFundacao}
                    onChange={(e) => handleChange('anoFundacao', e.target.value)}
                    placeholder="ex: 2010"
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://www.suaempresa.com"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn"
                    value={formData.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/suaempresa"
                  />
                </Grid>
              </Grid>
            )}

            {/* Step 1: Sobre a Empresa */}
            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Sobre a Empresa
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Conte aos desenvolvedores sobre sua empresa, o que ela faz e o que a torna única
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={10}
                    label="Descrição da Empresa"
                    value={formData.descricao}
                    onChange={(e) => handleChange('descricao', e.target.value)}
                    placeholder="Descreva sua empresa, sua história, missão e o que ela oferece..."
                    helperText={`${formData.descricao.length} caracteres (mínimo 50)`}
                  />
                </Grid>
              </Grid>
            )}

            {/* Step 2: Cultura e Benefícios */}
            {activeStep === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Cultura e Benefícios
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Mostre aos desenvolvedores como é trabalhar na sua empresa
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={6}
                    label="Cultura da Empresa"
                    value={formData.cultura}
                    onChange={(e) => handleChange('cultura', e.target.value)}
                    placeholder="Descreva a cultura e o ambiente de trabalho da sua empresa..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Benefícios Oferecidos *
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddBenefit}
                    >
                      Adicionar Benefício
                    </Button>
                  </Box>

                  {formData.beneficios.length === 0 ? (
                    <Alert severity="info">
                      Adicione pelo menos 2 benefícios que sua empresa oferece
                    </Alert>
                  ) : (
                    <Grid container spacing={2}>
                      {formData.beneficios.map((beneficio, index) => (
                        <Grid item xs={12} key={index}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              fullWidth
                              label={`Benefício ${index + 1}`}
                              value={beneficio}
                              onChange={(e) => handleBenefitChange(index, e.target.value)}
                              placeholder="ex: Vale refeição, Plano de saúde, Home office"
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
                    </Grid>
                  )}
                </Grid>

                {formData.beneficios.filter(b => b.trim()).length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Preview:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.beneficios
                        .filter(b => b.trim())
                        .map((beneficio, index) => (
                          <Chip key={index} label={beneficio} color="primary" />
                        ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBack />}
              >
                Voltar
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleFinish}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                  size="large"
                >
                  {loading ? 'Salvando...' : 'Finalizar'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  size="large"
                >
                  Próximo
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CompanyProfileCompletion;

