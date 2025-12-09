import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import * as perfilDevService from '../../service/perfilDevService';
import { PerfilDevData } from '../../service/perfilDevService';

const DeveloperProfileForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [perfilExiste, setPerfilExiste] = useState(false);
  
  const [formData, setFormData] = useState<Partial<PerfilDevData>>({
    titular: '',
    resumo: '',
    localizacao: '',
    github: '',
    linkedin: '',
    portfolio: '',
    faixaSalarial: '',
    tipoContrato: '',
    modoTrabalho: '',
    disponibilidade: '',
    preferenciasVaga: [],
    idiomas: [],
  });

  // Opções para os campos de seleção
  const faixasSalariais = [
    'R$ 1.000 - R$ 3.000',
    'R$ 3.000 - R$ 5.000',
    'R$ 5.000 - R$ 8.000',
    'R$ 8.000 - R$ 12.000',
    'R$ 12.000 - R$ 18.000',
    'Acima de R$ 18.000',
  ];

  const tiposContrato = ['CLT', 'PJ', 'Freelancer', 'Estágio', 'Qualquer'];
  const modosTrabalho = ['Presencial', 'Remoto', 'Híbrido', 'Qualquer'];
  const disponibilidades = ['Imediata', '15 dias', '30 dias', 'A combinar'];
  
  const preferenciasDisponiveis = [
    'Frontend',
    'Backend',
    'Full Stack',
    'Mobile',
    'DevOps',
    'Data Science',
    'Machine Learning',
    'QA/Testes',
    'UI/UX',
    'Arquitetura',
  ];

  const idiomasDisponiveis = [
    'Português',
    'Inglês - Básico',
    'Inglês - Intermediário',
    'Inglês - Avançado',
    'Inglês - Fluente',
    'Espanhol',
    'Francês',
    'Alemão',
  ];

  // Carrega o perfil existente ao montar o componente
  useEffect(() => {
    const carregarPerfil = async () => {
      if (!user?.id) return;
      
      try {
        setLoadingPerfil(true);
        const perfil = await perfilDevService.buscarPerfil(parseInt(user.id));
        setFormData(perfil);
        setPerfilExiste(true);
      } catch (error: any) {
        // Se não encontrar o perfil, não é erro - o usuário ainda não criou
        if (error.message.includes('não encontrado')) {
          setPerfilExiste(false);
        } else {
          console.error('Erro ao carregar perfil:', error);
        }
      } finally {
        setLoadingPerfil(false);
      }
    };

    carregarPerfil();
  }, [user]);

  const handleInputChange = (field: keyof PerfilDevData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = e.target ? e.target.value : e;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user?.id) {
      setError('Usuário não autenticado.');
      return;
    }

    if (!formData.titular || !formData.resumo || !formData.localizacao) {
      setError('Preencha os campos obrigatórios: Título Profissional, Resumo e Localização.');
      return;
    }

    try {
      setLoading(true);
      
      const perfilData: PerfilDevData = {
        ...formData,
        usuarioId: parseInt(user.id),
        titular: formData.titular!,
      };

      if (perfilExiste) {
        // Atualizar perfil existente
        await perfilDevService.atualizarPerfil(parseInt(user.id), perfilData);
        setSuccess('Perfil atualizado com sucesso!');
      } else {
        // Criar novo perfil
        await perfilDevService.criarPerfil(perfilData);
        setSuccess('Perfil criado com sucesso!');
        setPerfilExiste(true);
      }

      // Limpa a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.message || 'Ocorreu um erro ao salvar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPerfil) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {perfilExiste ? 'Editar Perfil Profissional' : 'Criar Perfil Profissional'}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        * Campos obrigatórios
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Informações Básicas */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informações Básicas
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Título Profissional *"
              placeholder="Ex: Desenvolvedor Full Stack Sênior"
              value={formData.titular || ''}
              onChange={handleInputChange('titular')}
              helperText="Como você gostaria de ser chamado profissionalmente?"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Resumo Profissional *"
              placeholder="Conte um pouco sobre sua experiência, habilidades e objetivos profissionais..."
              value={formData.resumo || ''}
              onChange={handleInputChange('resumo')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Localização *"
              placeholder="Ex: São Paulo - SP, Brasil"
              value={formData.localizacao || ''}
              onChange={handleInputChange('localizacao')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Disponibilidade</InputLabel>
              <Select
                value={formData.disponibilidade || ''}
                onChange={handleInputChange('disponibilidade')}
                label="Disponibilidade"
              >
                {disponibilidades.map(disp => (
                  <MenuItem key={disp} value={disp}>{disp}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Links Profissionais */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Links Profissionais
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="GitHub"
              placeholder="https://github.com/usuario"
              value={formData.github || ''}
              onChange={handleInputChange('github')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="LinkedIn"
              placeholder="https://linkedin.com/in/usuario"
              value={formData.linkedin || ''}
              onChange={handleInputChange('linkedin')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Portfólio"
              placeholder="https://meuportfolio.com"
              value={formData.portfolio || ''}
              onChange={handleInputChange('portfolio')}
            />
          </Grid>

          {/* Preferências de Trabalho */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Preferências de Trabalho
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Faixa Salarial Desejada</InputLabel>
              <Select
                value={formData.faixaSalarial || ''}
                onChange={handleInputChange('faixaSalarial')}
                label="Faixa Salarial Desejada"
              >
                {faixasSalariais.map(faixa => (
                  <MenuItem key={faixa} value={faixa}>{faixa}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Contrato</InputLabel>
              <Select
                value={formData.tipoContrato || ''}
                onChange={handleInputChange('tipoContrato')}
                label="Tipo de Contrato"
              >
                {tiposContrato.map(tipo => (
                  <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Modo de Trabalho</InputLabel>
              <Select
                value={formData.modoTrabalho || ''}
                onChange={handleInputChange('modoTrabalho')}
                label="Modo de Trabalho"
              >
                {modosTrabalho.map(modo => (
                  <MenuItem key={modo} value={modo}>{modo}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={preferenciasDisponiveis}
              value={formData.preferenciasVaga || []}
              onChange={(_, newValue) => {
                setFormData(prev => ({ ...prev, preferenciasVaga: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Áreas de Interesse"
                  placeholder="Selecione as áreas"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} key={option} />
                ))
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={idiomasDisponiveis}
              value={formData.idiomas || []}
              onChange={(_, newValue) => {
                setFormData(prev => ({ ...prev, idiomas: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Idiomas"
                  placeholder="Selecione os idiomas"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} key={option} />
                ))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={loading}
              >
                {loading ? 'Salvando...' : perfilExiste ? 'Atualizar Perfil' : 'Criar Perfil'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default DeveloperProfileForm;

