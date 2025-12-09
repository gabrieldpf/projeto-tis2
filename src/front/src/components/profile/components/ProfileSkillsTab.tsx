import React from 'react';
import { Grid, Typography, Autocomplete, TextField, Chip, Box } from '@mui/material';

interface Skills {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  soft: string[];
}

interface SkillOptions {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  soft: string[];
}

interface ProfileSkillsTabProps {
  editMode: boolean;
  skills: Skills;
  skillOptions: SkillOptions;
  onSkillChange: (category: keyof Skills, value: string[]) => void;
}

const ProfileSkillsTab: React.FC<ProfileSkillsTabProps> = ({
  editMode,
  skills,
  skillOptions,
  onSkillChange,
}) => {
  const skillCategories = [
    { key: 'languages', label: 'Linguagens de Programação', color: 'primary' },
    { key: 'frameworks', label: 'Frameworks e Libraries', color: 'secondary' },
    { key: 'databases', label: 'Bancos de Dados', color: 'success' },
    { key: 'tools', label: 'Ferramentas e DevOps', color: 'warning' },
    { key: 'soft', label: 'Habilidades Soft', color: 'info' },
  ] as const;

  return (
    <Grid container spacing={3}>
      {skillCategories.map(({ key, label, color }) => (
        <Grid item xs={12} key={key}>
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {editMode ? (
            <Autocomplete
              multiple
              freeSolo
              options={skillOptions[key]}
              value={skills[key]}
              onChange={(_, value) => onSkillChange(key, value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} placeholder={`Adicione ${label.toLowerCase()}`} />
              )}
            />
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skills[key].length > 0 ? (
                skills[key].map((skill, idx) => (
                  <Chip key={idx} label={skill} color={color} variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma habilidade adicionada
                </Typography>
              )}
            </Box>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileSkillsTab;

