import React from 'react';
import { Schedule, Visibility, CheckCircle } from '@mui/icons-material';

export type ApplicationStatus = 'pendente' | 'em_analise' | 'aceito' | 'rejeitado';
export type JobStatus = 'ativa' | 'pausada' | 'fechada';

/**
 * Retorna a cor apropriada para o status da candidatura
 */
export const getApplicationStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  const statusLower = status?.toLowerCase();
  const colors = {
    pendente: 'warning',
    em_analise: 'info',
    aceito: 'success',
    rejeitado: 'error',
  } as const;
  return colors[statusLower as keyof typeof colors] || 'default';
};

/**
 * Retorna o ícone apropriado para o status da candidatura
 */
export const getApplicationStatusIcon = (status: string): React.ReactElement => {
  const statusLower = status?.toLowerCase();
  const icons = {
    pendente: <Schedule />,
    em_analise: <Visibility />,
    aceito: <CheckCircle />,
    rejeitado: <div>❌</div>,
  };
  return icons[statusLower as keyof typeof icons] || <Schedule />;
};

/**
 * Retorna o label traduzido para o status da candidatura
 */
export const getApplicationStatusLabel = (status: string): string => {
  const statusLower = status?.toLowerCase();
  const labels: Record<string, string> = {
    pendente: 'Pendente',
    em_analise: 'Em Análise',
    aceito: 'Aceito',
    rejeitado: 'Rejeitado',
  };
  return labels[statusLower] || status;
};

/**
 * Retorna a cor apropriada para o status da vaga
 */
export const getJobStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  const statusLower = status?.toLowerCase();
  const colors = {
    ativa: 'success',
    pausada: 'warning',
    fechada: 'error',
  } as const;
  return colors[statusLower as keyof typeof colors] || 'default';
};

/**
 * Retorna o label traduzido para o status da vaga
 */
export const getJobStatusLabel = (status: string): string => {
  const statusLower = status?.toLowerCase();
  const labels: Record<string, string> = {
    ativa: 'Ativa',
    pausada: 'Pausada',
    fechada: 'Fechada',
  };
  return labels[statusLower] || status;
};

