import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Divider, Chip, Avatar, Button } from '@mui/material';
import { AttachMoney, LocationOn } from '@mui/icons-material';
import { Application } from '../DeveloperDashboard';
import { submitTechnicalTest, listTechnicalTestSubmissions } from '../../../service/technicalTestService';
import TechnicalTestRunner from './TechnicalTestRunner';

interface ApplicationsListProps {
  applications: Application[];
  getStatusColor: (status: string) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  getStatusIcon: (status: string) => React.ReactElement | undefined;
  getStatusLabel?: (status: string) => string;
  onViewDetails?: (vagaId: number) => void;
  emptyMessage?: string;
  userId?: number;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ applications, getStatusColor, getStatusIcon, getStatusLabel, onViewDetails, emptyMessage, userId }) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [runnerOpenForAppId, setRunnerOpenForAppId] = useState<string | null>(null);
  const [submittedVagas, setSubmittedVagas] = useState<Set<number>>(new Set());

  const handleChooseFile = (appId: string) => {
    const input = fileInputRefs.current[appId];
    input?.click();
  };

  const isJsonSpec = (anexo?: string) => typeof anexo === 'string' && anexo.startsWith('json:testSpec:');
  const parseSpec = (anexo?: string) => {
    try {
      if (!anexo) return null;
      if (!isJsonSpec(anexo)) return null;
      return JSON.parse(anexo.replace('json:testSpec:', ''));
    } catch { return null; }
  };

  // Verifica submissões existentes para esconder botões de novo envio
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        if (!userId) return;
        const vagasUnicas = Array.from(new Set(applications
          .filter(a => a.vagaId && a.anexo)
          .map(a => Number(a.vagaId))));
        const submitted = new Set<number>();
        for (const vaga of vagasUnicas) {
          try {
            const list = await listTechnicalTestSubmissions(Number(vaga), Number(userId));
            if (Array.isArray(list) && list.length > 0) submitted.add(Number(vaga));
          } catch {}
        }
        setSubmittedVagas(submitted);
      } catch {}
    };
    fetchSubmissions();
  }, [applications, userId]);

  const handleFileChange = async (app: Application, e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !app.vagaId || !userId) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = typeof reader.result === 'string' ? reader.result : '';
        await submitTechnicalTest({
          vagaId: Number(app.vagaId),
          usuarioId: Number(userId),
          filename: file.name,
          fileBase64: base64,
        });
        alert('Teste enviado com sucesso!');
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(err?.message || 'Falha ao enviar teste');
    }
  };

  return (
    <List>
      {applications.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {emptyMessage || 'Você ainda não se candidatou a nenhuma vaga'}
          </Typography>
        </Box>
      ) : (
        applications.map((app, index) => (
          <React.Fragment key={app.id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {app.company.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="h6">{app.position}</Typography>
                    <Chip
                      label={getStatusLabel ? getStatusLabel(app.status) : app.status}
                      color={getStatusColor(app.status)}
                      size="small"
                      icon={getStatusIcon(app.status) ?? undefined}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {app.company} • Candidatou-se em {app.appliedDate}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} sx={{ mt: 0.5 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AttachMoney fontSize="small" />
                        <Typography variant="body2">{app.salary}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2">{app.location}</Typography>
                      </Box>
                    </Box>
                  </Box>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
              <ListItemSecondaryAction>
                <Box display="flex" gap={1}>
                {app.status === 'aceito' && app.anexo && (
                  (() => {
                    const alreadySubmitted = submittedVagas.has(Number(app.vagaId));
                    if (alreadySubmitted) {
                      return (
                        <Chip label="Teste enviado" size="small" color="success" />
                      );
                    }
                    return isJsonSpec(app.anexo) ? (
                      <Button 
                        variant="contained" 
                        size="small"
                        color="primary"
                        onClick={() => setRunnerOpenForAppId(app.id)}
                      >
                        Iniciar Teste
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="contained" 
                          size="small"
                          color="primary"
                          href={app.anexo}
                          target="_blank"
                        >
                          Realizar Teste Técnico
                        </Button>
                        <input
                          type="file"
                          accept="application/pdf"
                          ref={(el) => (fileInputRefs.current[app.id] = el)}
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileChange(app, e)}
                        />
                      <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => handleChooseFile(app.id)}
                        >
                          Enviar Teste
                        </Button>
                      </>
                    );
                  })()
                )}
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => app.vagaId && onViewDetails?.(app.vagaId)}
                  >
                    Ver Detalhes
                  </Button>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          {runnerOpenForAppId === app.id && isJsonSpec(app.anexo) && (
            <TechnicalTestRunner
              open={true}
              onClose={() => setRunnerOpenForAppId(null)}
              testSpec={parseSpec(app.anexo)!}
              vagaId={Number(app.vagaId)}
              usuarioId={Number(userId)}
            />
          )}
            {index < applications.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default ApplicationsList;