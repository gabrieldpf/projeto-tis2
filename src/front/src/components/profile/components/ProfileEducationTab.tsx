import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
  expiry: string;
}

interface ProfileEducationTabProps {
  editMode: boolean;
  education: Education[];
  certifications: Certification[];
  onEducationChange: (index: number, field: keyof Education, value: string) => void;
  onCertificationChange: (index: number, field: keyof Certification, value: string) => void;
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
  onAddCertification: () => void;
  onRemoveCertification: (index: number) => void;
}

const ProfileEducationTab: React.FC<ProfileEducationTabProps> = ({
  editMode,
  education,
  certifications,
  onEducationChange,
  onCertificationChange,
  onAddEducation,
  onRemoveEducation,
  onAddCertification,
  onRemoveCertification,
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Educação
      </Typography>
      {education.length === 0 && !editMode ? (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          Nenhuma formação adicionada
        </Typography>
      ) : (
        education.map((edu: Education, index: number) => (
          <Card key={index} sx={{ mb: 2, bgcolor: 'background.default' }}>
            <CardContent>
              {editMode ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Grau/Formação"
                      value={edu.degree}
                      onChange={(e) => onEducationChange(index, 'degree', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Instituição"
                      value={edu.institution}
                      onChange={(e) => onEducationChange(index, 'institution', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ano de Conclusão"
                      value={edu.year}
                      onChange={(e) => onEducationChange(index, 'year', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <IconButton color="error" onClick={() => onRemoveEducation(index)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Typography variant="h6" fontWeight="bold">
                    {edu.degree}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {edu.institution}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {edu.year}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
      {editMode && (
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={onAddEducation}
          fullWidth
          sx={{ mt: 2 }}
        >
          Adicionar Formação
        </Button>
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Certificações
      </Typography>
      {certifications.length === 0 && !editMode ? (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          Nenhuma certificação adicionada
        </Typography>
      ) : (
        certifications.map((cert: Certification, index: number) => (
          <Card key={index} sx={{ mb: 2, bgcolor: 'background.default' }}>
            <CardContent>
              {editMode ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Certificação"
                      value={cert.name}
                      onChange={(e) => onCertificationChange(index, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Instituição/Plataforma"
                      value={cert.issuer}
                      onChange={(e) => onCertificationChange(index, 'issuer', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Data de Validade"
                      type="date"
                      value={cert.expiry}
                      onChange={(e) => onCertificationChange(index, 'expiry', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <IconButton color="error" onClick={() => onRemoveCertification(index)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Typography variant="h6" fontWeight="bold">
                    {cert.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {cert.issuer}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Válido até: {cert.expiry}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
      {editMode && (
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={onAddCertification}
          fullWidth
          sx={{ mt: 2 }}
        >
          Adicionar Certificação
        </Button>
      )}
    </>
  );
};

export default ProfileEducationTab;

