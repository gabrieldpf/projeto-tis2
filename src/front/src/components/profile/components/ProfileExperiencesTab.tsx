import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  IconButton,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  currentlyWorking: boolean;
}

interface ProfileExperiencesTabProps {
  editMode: boolean;
  experiences: Experience[];
  onExperienceChange: (index: number, field: keyof Experience, value: any) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
}

const ProfileExperiencesTab: React.FC<ProfileExperiencesTabProps> = ({
  editMode,
  experiences,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience,
}) => {
  if (experiences.length === 0 && !editMode) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
        Nenhuma experiência adicionada
      </Typography>
    );
  }

  return (
    <>
      {experiences.map((exp: Experience, index: number) => (
        <Card key={index} sx={{ mb: 2, bgcolor: 'background.default' }}>
          <CardContent>
            {editMode ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cargo"
                    value={exp.title}
                    onChange={(e) => onExperienceChange(index, 'title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Empresa"
                    value={exp.company}
                    onChange={(e) => onExperienceChange(index, 'company', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Data Início"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => onExperienceChange(index, 'startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      label="Data Fim"
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => onExperienceChange(index, 'endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      disabled={exp.currentlyWorking}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={exp.currentlyWorking}
                          onChange={(e) => onExperienceChange(index, 'currentlyWorking', e.target.checked)}
                        />
                      }
                      label="Atual"
                      sx={{ ml: 1, minWidth: 80 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descrição"
                    value={exp.description}
                    onChange={(e) => onExperienceChange(index, 'description', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <IconButton color="error" onClick={() => onRemoveExperience(index)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ) : (
              <>
                <Typography variant="h6" fontWeight="bold">
                  {exp.title}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {exp.company}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {exp.startDate} - {exp.currentlyWorking ? 'Atual' : exp.endDate}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                  {exp.description}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      ))}
      {editMode && (
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={onAddExperience}
          fullWidth
          sx={{ mt: 2 }}
        >
          Adicionar Experiência
        </Button>
      )}
    </>
  );
};

export default ProfileExperiencesTab;

