import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface Project {
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface ProfileProjectsTabProps {
  editMode: boolean;
  projects: Project[];
  onProjectChange: (index: number, field: keyof Project, value: string) => void;
  onAddProject: () => void;
  onRemoveProject: (index: number) => void;
}

const ProfileProjectsTab: React.FC<ProfileProjectsTabProps> = ({
  editMode,
  projects,
  onProjectChange,
  onAddProject,
  onRemoveProject,
}) => {
  if (projects.length === 0 && !editMode) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
        Nenhum projeto adicionado
      </Typography>
    );
  }

  return (
    <>
      {projects.map((proj: Project, index: number) => (
        <Card key={index} sx={{ mb: 2, bgcolor: 'background.default' }}>
          <CardContent>
            {editMode ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome do Projeto"
                    value={proj.name}
                    onChange={(e) => onProjectChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descrição"
                    value={proj.description}
                    onChange={(e) => onProjectChange(index, 'description', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tecnologias Usadas"
                    value={proj.technologies}
                    onChange={(e) => onProjectChange(index, 'technologies', e.target.value)}
                    placeholder="ex: React, Node.js, MongoDB"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Link (GitHub/Demo)"
                    value={proj.link}
                    onChange={(e) => onProjectChange(index, 'link', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <IconButton color="error" onClick={() => onRemoveProject(index)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ) : (
              <>
                <Typography variant="h6" fontWeight="bold">
                  {proj.name}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', my: 1 }}>
                  {proj.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Tecnologias: {proj.technologies}
                </Typography>
                {proj.link && (
                  <Button
                    size="small"
                    variant="outlined"
                    href={proj.link}
                    target="_blank"
                    sx={{ mt: 1 }}
                  >
                    Ver Projeto
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
      {editMode && (
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={onAddProject}
          fullWidth
          sx={{ mt: 2 }}
        >
          Adicionar Projeto
        </Button>
      )}
    </>
  );
};

export default ProfileProjectsTab;

