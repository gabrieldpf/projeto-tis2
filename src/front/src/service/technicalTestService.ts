import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface TechnicalTestSubmission {
  vagaId: number;
  usuarioId: number;
  filename: string;
  fileBase64: string; 
}

export interface TechnicalTestQuestion {
  questionOrder?: number;
  title: string;
  description?: string;
  language?: string;
  starterCode?: string;
}

export interface TechnicalTestResponse {
  id: number;
  vagaId: number;
  type: 'pdf' | 'questions' | string;
  urlPdf?: string;
  questions?: TechnicalTestQuestion[];
}

export const submitTechnicalTest = async (payload: TechnicalTestSubmission) => {
  try {
    const response = await axios.post(`${API_URL}/tests/submissions`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao enviar submissão do teste técnico:', error);
    throw new Error(error?.response?.data || 'Falha ao enviar submissão do teste');
  }
};

export const getTechnicalTestByVaga = async (vagaId: number): Promise<TechnicalTestResponse | null> => {
  try {
    const response = await axios.get(`${API_URL}/tests/${vagaId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    console.error('Erro ao buscar teste técnico:', error);
    throw new Error(error?.response?.data || 'Falha ao buscar teste técnico');
  }
};

export interface TechnicalTestSubmissionSummary {
  id: number;
  vagaId: number;
  usuarioId: number;
  submittedAt: string;
  status?: string;
  score?: number;
}

export interface TechnicalTestSubmissionDetail extends TechnicalTestSubmissionSummary {
  rawPayload?: string;
  answers?: Array<{ id?: number; title?: string; language?: string; code?: string; result?: string }>;
}

export const listTechnicalTestSubmissions = async (vagaId: number, usuarioId: number): Promise<TechnicalTestSubmissionSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/tests/submissions/by-user/${vagaId}/${usuarioId}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao listar submissões:', error);
    throw new Error(error?.response?.data || 'Falha ao listar submissões');
  }
};

export const getTechnicalTestSubmissionDetail = async (submissionId: number): Promise<TechnicalTestSubmissionDetail> => {
  try {
    const response = await axios.get(`${API_URL}/tests/submissions/detail/${submissionId}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar detalhe da submissão:', error);
    throw new Error(error?.response?.data || 'Falha ao buscar detalhe da submissão');
  }
};
