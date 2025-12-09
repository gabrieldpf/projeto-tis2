import httpClient from './httpClient';

export interface CandidaturaData {
  vagaId: number;
  usuarioId: number;
  mensagem?: string;
}

export interface Candidatura {
  id: number;
  vagaId: number;
  usuarioId: number;
  status: string;
  dataCandidatura: string;
  mensagem?: string;
  tituloVaga?: string;
  nomeUsuario?: string;
}

/**
 * Cria uma nova candidatura
 */
export const candidatar = async (data: CandidaturaData): Promise<Candidatura> => {
  try {
    const response = await httpClient.post(`/candidaturas`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating application:', error);
    throw new Error(error?.message || 'Erro ao se candidatar');
  }
};

/**
 * Busca candidaturas de um desenvolvedor
 */
export const getCandidaturasByUsuario = async (usuarioId: string): Promise<Candidatura[]> => {
  try {
    const response = await httpClient.get(`/candidaturas/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user applications:', error);
    throw error;
  }
};

/**
 * Busca candidaturas de uma vaga
 */
export const getCandidaturasByVaga = async (vagaId: number): Promise<Candidatura[]> => {
  try {
    const response = await httpClient.get(`/candidaturas/vaga/${vagaId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

/**
 * Verifica se o usuário já se candidatou para uma vaga
 */
export const verificarCandidatura = async (usuarioId: string, vagaId: number): Promise<boolean> => {
  try {
    const response = await httpClient.get(`/candidaturas/verificar/${usuarioId}/${vagaId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking application:', error);
    return false;
  }
};

/**
 * Atualiza o status de uma candidatura
 */
export const updateStatusCandidatura = async (id: number, status: string): Promise<Candidatura> => {
  try {
    const response = await httpClient.patch(`/candidaturas/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

/**
 * Alias em português para updateStatusCandidatura
 */
export const atualizarStatusCandidatura = updateStatusCandidatura;

