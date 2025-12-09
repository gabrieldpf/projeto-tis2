import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Tab,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  ExitToApp,
  Code,
  Business,
  Insights,
  Gavel,
  Flag,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import AuthDialog from './auth/AuthDialog';
import ProfileDialog from './profile/ProfileDialog';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/'); // Redireciona para home após logout
  };

  const handleProfile = () => {
    if (user?.type === 'company') {
      navigate('/company-profile');
    } else {
      navigate('/profile');
    }
    handleMenuClose();
  };

  const handleAdminIndicators = () => {
    if (user?.type !== 'company') {
      return;
    }
    navigate('/admin/indicadores');
    handleMenuClose();
  };

  const handleDashboard = () => {
    navigate('/');
    handleMenuClose();
  };

  const handleDisputes = () => {
    navigate('/disputas');
    handleMenuClose();
  };

  function handleConfig(): void {
    // TODO: Implementar configurações
    handleMenuClose();
  }

  const handleAllJobs = () => {
    navigate('/vagas');
  };

  const handleMilestones = () => {
    if (user?.type !== 'company') {
      return;
    }
    navigate('/preview/company-milestones');
    handleMenuClose();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Code sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DevMatch
            </Typography>
          </Box>

          {user ? (
            <Box display="flex" alignItems="center" gap={2}>
              {user.type === 'developer' ? (
                <Tab 
                  sx={{color:"primary.main", borderRadius:0.5, cursor: 'pointer'}} 
                  label="TODAS AS VAGAS"
                  onClick={handleAllJobs}
                />
              ) : null}
              <Chip 
                sx={{ padding: 1.5 }}
                icon={user.type === 'developer' ? <Code /> : user.type === 'admin' ? <Insights /> : <Business />}
                label={user.type === 'developer' ? 'Desenvolvedor' : user.type === 'admin' ? 'Administrador' : 'Empresa'}
                color={user.type === 'developer' ? 'primary' : user.type === 'admin' ? 'success' : 'secondary'}
                variant="outlined"
                size="small"
              />
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleDashboard}>
                  <Dashboard sx={{ mr: 1 }} />
                  Painel
                </MenuItem>
                <MenuItem onClick={handleProfile}>
                  {user.type === 'company' ? <Business sx={{ mr: 1 }} /> : <AccountCircle sx={{ mr: 1 }} />}
                  {user.type === 'company' ? 'Perfil da Empresa' : 'Perfil'}
                </MenuItem>
                {user.type === 'admin' && (
                  <MenuItem onClick={handleDisputes}>
                    <Gavel sx={{ mr: 1 }} />
                    Contestações
                  </MenuItem>
                )}
                {user.type === 'company' && (
                  <MenuItem onClick={handleMilestones}>
                    <Flag sx={{ mr: 1 }} />
                    Marcos do Projeto
                  </MenuItem>
                )}
                {user.type === 'company' && (
                  <MenuItem onClick={handleAdminIndicators}>
                    <Insights sx={{ mr: 1 }} />
                    Painel ADM
                  </MenuItem>
                )}
                {user.type === 'developer' && (
                  <MenuItem onClick={handleConfig}>
                    <SettingsIcon sx={{ mr: 1 }} />
                    Configurações
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Sair
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={() => setAuthOpen(true)}
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              Entrar / Cadastrar
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default Header;