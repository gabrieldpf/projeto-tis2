import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Box,
  Typography,
} from '@mui/material';

interface Preferences {
  salaryRange: string;
  contractType: string;
  workMode: string;
  availability: string;
  jobPreferences: string[];
  languages: string[];
}

interface ProfilePreferencesTabProps {
  editMode: boolean;
  preferences: Preferences;
  onPreferenceChange: (field: keyof Preferences, value: any) => void;
}

const ProfilePreferencesTab: React.FC<ProfilePreferencesTabProps> = ({
  editMode,
  preferences,
  onPreferenceChange,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        {editMode ? (
          <TextField
            fullWidth
            label="Pretensão Salarial (Faixa)"
            value={preferences.salaryRange}
            onChange={(e) => onPreferenceChange('salaryRange', e.target.value)}
            placeholder="ex: R$ 5.000 - R$ 8.000/mês"
          />
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Pretensão Salarial
            </Typography>
            <Typography variant="body1">
              {preferences.salaryRange || 'Não informado'}
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        {editMode ? (
          <FormControl fullWidth>
            <InputLabel>Tipo de Contrato</InputLabel>
            <Select
              value={preferences.contractType}
              onChange={(e) => onPreferenceChange('contractType', e.target.value)}
            >
              <MenuItem value="CLT">CLT</MenuItem>
              <MenuItem value="PJ">PJ</MenuItem>
              <MenuItem value="Freelance">Freelance</MenuItem>
              <MenuItem value="Estágio">Estágio</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Tipo de Contrato
            </Typography>
            <Typography variant="body1">
              {preferences.contractType || 'Não informado'}
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        {editMode ? (
          <FormControl fullWidth>
            <InputLabel>Modalidade de Trabalho</InputLabel>
            <Select
              value={preferences.workMode}
              onChange={(e) => onPreferenceChange('workMode', e.target.value)}
            >
              <MenuItem value="Remoto">Remoto</MenuItem>
              <MenuItem value="Híbrido">Híbrido</MenuItem>
              <MenuItem value="Presencial">Presencial</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Modalidade de Trabalho
            </Typography>
            <Typography variant="body1">
              {preferences.workMode || 'Não informado'}
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        {editMode ? (
          <TextField
            fullWidth
            label="Disponibilidade"
            value={preferences.availability}
            onChange={(e) => onPreferenceChange('availability', e.target.value)}
            placeholder="ex: Imediata ou Aviso de 2 semanas"
          />
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Disponibilidade
            </Typography>
            <Typography variant="body1">
              {preferences.availability || 'Não informado'}
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Preferências de Vaga
        </Typography>
        {editMode ? (
          <Autocomplete
            multiple
            freeSolo
            options={['Frontend', 'Backend', 'Full-Stack', 'DevOps', 'Mobile', 'Data Science']}
            value={preferences.jobPreferences}
            onChange={(_, value) => onPreferenceChange('jobPreferences', value)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Adicione preferências" />
            )}
          />
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {preferences.jobPreferences.length > 0 ? (
              preferences.jobPreferences.map((pref, idx) => (
                <Chip key={idx} label={pref} color="primary" />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma preferência adicionada
              </Typography>
            )}
          </Box>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Idiomas
        </Typography>
        {editMode ? (
          <Autocomplete
            multiple
            freeSolo
            options={['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão']}
            value={preferences.languages}
            onChange={(_, value) => onPreferenceChange('languages', value)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Adicione idiomas" />
            )}
          />
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {preferences.languages.length > 0 ? (
              preferences.languages.map((lang, idx) => (
                <Chip key={idx} label={lang} color="secondary" />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum idioma adicionado
              </Typography>
            )}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ProfilePreferencesTab;

