import React from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  GitHub,
  LinkedIn,
  Language,
} from '@mui/icons-material';
import { User } from '../../../contexts/AuthContext';

interface Links {
  github: string;
  linkedin: string;
  portfolio: string;
}

interface ProfileHeaderProps {
  user: User | null;
  headline: string;
  location: string;
  links: Links;
  editMode: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onBack: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  headline,
  location,
  links,
  editMode,
  saving,
  onEdit,
  onSave,
  onCancel,
  onBack,
}) => {
  return (
    <>
      {/* Botão Voltar */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ borderRadius: 2 }}
        >
          Voltar
        </Button>
      </Box>

      {/* Card de cabeçalho do perfil */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {user?.name}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {headline || 'Adicione um título profissional'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                   {location || 'Localização não informada'}
                </Typography>
                
                {/* Links sociais */}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  {links.github && (
                    <IconButton
                      size="small"
                      component="a"
                      href={links.github}
                      target="_blank"
                      sx={{ bgcolor: 'action.hover' }}
                    >
                      <GitHub />
                    </IconButton>
                  )}
                  {links.linkedin && (
                    <IconButton
                      size="small"
                      component="a"
                      href={links.linkedin}
                      target="_blank"
                      sx={{ bgcolor: 'action.hover' }}
                    >
                      <LinkedIn />
                    </IconButton>
                  )}
                  {links.portfolio && (
                    <IconButton
                      size="small"
                      component="a"
                      href={links.portfolio}
                      target="_blank"
                      sx={{ bgcolor: 'action.hover' }}
                    >
                      <Language />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Botões de ação */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {editMode ? (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={onCancel}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    onClick={onSave}
                    disabled={saving}
                  >
                    Salvar
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={onEdit}
                >
                  Editar Perfil
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileHeader;

