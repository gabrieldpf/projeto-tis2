import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close, Code, Business, AdminPanelSettings } from '@mui/icons-material';
import { useAuth, UserType } from '../../contexts/AuthContext';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
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

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose }) => {
  const { login, register, isLoading } = useAuth();
  const [tab, setTab] = useState(0);
  const [userType, setUserType] = useState<UserType>('developer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação de senha mínima
    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (tab === 1 && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      if (tab === 0) {
        await login(formData.email, formData.password, userType);
      } else {
        await register(formData.email, formData.password, formData.name, userType);
      }
      
      // Se chegou aqui, o login/registro foi bem-sucedido
      onClose();
      setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      setError('');
    } catch (err: any) {
      // Captura a mensagem de erro específica do backend
      const errorMessage = err?.message || 'Ocorreu um erro. Tente novamente.';
      setError(errorMessage);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.5,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)',
          backdropFilter: 'blur(10px)',
        }
      }}
    >
    <Box sx={{ position: 'relative', p: 3,}}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton> 

        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 3, }}>
          Bem-vindo(a) ao DevMatch
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
            <Tab label="Entrar" />
            <Tab label="Cadastrar" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TabPanel value={tab} index={0}>
            <Box sx={{ margin: 0, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
                Eu sou:
              </Typography>
              <ToggleButtonGroup
                value={userType}
                exclusive
                onChange={(_, value) => value && setUserType(value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="developer" sx={{ py: 1.5 }}>
                  <Code sx={{ mr: 1 }} />
                  Desenvolvedor
                </ToggleButton>
                <ToggleButton value="company" sx={{ py: 1.5 }}>
                  <Business sx={{ mr: 1 }} />
                  Empresa
                </ToggleButton>
                <ToggleButton value="admin" sx={{ py: 1.5 }}>
                  <AdminPanelSettings sx={{ mr: 1 }} />
                  Administrador
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <DialogContent sx={{ px: 0 }}>
              <Typography sx={{ mb: 2, mt: -2 }} variant="body1" color="text.primary" gutterBottom textAlign="start">
                Entre com seu e-mail e senha:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                />
                <TextField
                  fullWidth
                  label="Senha"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  inputProps={{ minLength: 6 }}
                  helperText="Mínimo de 6 caracteres"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 2, py: 1.5 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Entrar'}
                </Button>
              </Box>
            </DialogContent>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Box sx={{ margin: 0}}>
              <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
                Eu sou:
              </Typography>
              <ToggleButtonGroup
                value={userType}
                exclusive
                onChange={(_, value) => value && setUserType(value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="developer" sx={{ py: 1.5 }}>
                  <Code sx={{ mr: 1 }} />
                  Desenvolvedor
                </ToggleButton>
                <ToggleButton value="company" sx={{ py: 1.5 }}>
                  <Business sx={{ mr: 1 }} />
                  Empresa
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            <DialogContent sx={{ px: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label={userType === 'developer' ? 'Nome Completo' : 'Nome da Empresa'}
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                />
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                />
                <TextField
                  fullWidth
                  label="Senha"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  inputProps={{ minLength: 6 }}
                  helperText="Mínimo de 6 caracteres"
                />
                <TextField
                  fullWidth
                  label="Confirmar Senha"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  required
                  inputProps={{ minLength: 6 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 2, py: 1.5 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Criar Conta'}
                </Button>
              </Box>
            </DialogContent>
          </TabPanel>
        </form>
      </Box>
    </Dialog>
  );
};

export default AuthDialog;