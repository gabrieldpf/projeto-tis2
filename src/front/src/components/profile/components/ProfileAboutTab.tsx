import React from 'react';
import { Grid, TextField, Box, Typography, Divider } from '@mui/material';

interface Links {
  github: string;
  linkedin: string;
  portfolio: string;
}

interface ProfileAboutTabProps {
  editMode: boolean;
  headline: string;
  summary: string;
  location: string;
  links: Links;
  onHeadlineChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onLinkChange: (field: keyof Links, value: string) => void;
}

const ProfileAboutTab: React.FC<ProfileAboutTabProps> = ({
  editMode,
  headline,
  summary,
  location,
  links,
  onHeadlineChange,
  onSummaryChange,
  onLocationChange,
  onLinkChange,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {editMode ? (
          <TextField
            fullWidth
            label="Título Profissional *"
            value={headline}
            onChange={(e) => onHeadlineChange(e.target.value)}
            placeholder="ex: Desenvolvedor Full-Stack | React & Node.js | 5+ anos"
          />
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Título Profissional
            </Typography>
            <Typography variant="body1">
              {headline || 'Não informado'}
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
            label="Sobre Mim *"
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Conte um pouco sobre você, sua experiência e objetivos profissionais"
          />
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Sobre Mim
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {summary || 'Não informado'}
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12}>
        {editMode ? (
          <TextField
            fullWidth
            label="Localização *"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="ex: São Paulo, SP ou Remoto"
          />
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Localização
            </Typography>
            <Typography variant="body1">
              {location || 'Não informado'}
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Links e Redes Sociais
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        {editMode ? (
          <TextField
            fullWidth
            label="GitHub"
            value={links.github}
            onChange={(e) => onLinkChange('github', e.target.value)}
            placeholder="https://github.com/seu-usuario"
          />
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              GitHub
            </Typography>
            <Typography variant="body2">
              {links.github || 'Não informado'}
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} md={4}>
        {editMode ? (
          <TextField
            fullWidth
            label="LinkedIn"
            value={links.linkedin}
            onChange={(e) => onLinkChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/seu-perfil"
          />
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              LinkedIn
            </Typography>
            <Typography variant="body2">
              {links.linkedin || 'Não informado'}
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} md={4}>
        {editMode ? (
          <TextField
            fullWidth
            label="Portfólio"
            value={links.portfolio}
            onChange={(e) => onLinkChange('portfolio', e.target.value)}
            placeholder="https://seu-portfolio.com"
          />
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Portfólio
            </Typography>
            <Typography variant="body2">
              {links.portfolio || 'Não informado'}
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ProfileAboutTab;

