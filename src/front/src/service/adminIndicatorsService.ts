import httpClient from './httpClient';

export interface PerformanceIndicator {
  id: string;
  indicador: string;
  objetivo: string;
  descricao: string;
  fonteDados: string[];
  formula: string;
  valor: number;
  unidade: string;
  meta?: number;
  metaDescricao?: string;
  detalhes?: Record<string, unknown>;
  observacoes?: string;
}

export interface AdminIndicatorsResponse {
  periodDays: number;
  generatedAt: string;
  indicators: PerformanceIndicator[];
}

export const getAdminIndicators = async (periodDays: number): Promise<AdminIndicatorsResponse> => {
  const { data } = await httpClient.get('/admin/indicators', { params: { periodDays } });
  return data as AdminIndicatorsResponse;
};

export const saveIndicatorTarget = async (indicatorId: string, targetValue: number): Promise<void> => {
  await httpClient.post('/admin/indicators/targets', {
    indicatorId,
    targetValue,
  });
};

export const getIndicatorTargets = async (): Promise<Record<string, number>> => {
  const { data } = await httpClient.get('/admin/indicators/targets');
  return data as Record<string, number>;
};


