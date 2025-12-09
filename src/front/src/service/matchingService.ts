import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface MatchingDetails {
  scoreLocalizacao: number;
  scoreSalario: number;
  scoreContrato: number;
  scorePreferencias: number;
  scoreSkills: number;
  skillsEmComum: string[];
  skillsFaltantes: string[];
  motivosPositivos: string[];
  sugestoesMelhoria: string[];
}

export interface JobMatch {
  vagaId: number;
  titulo: string;
  descricao: string;
  experienceLevel: string;
  localModalidade: string;
  valorReferencia: string;
  regime: string;
  compatibilidade: number; // 0-100
  skills: string[];
  nomeEmpresa?: string;
  matchingDetails?: MatchingDetails;
}

/**
 * Busca vagas compatíveis para um desenvolvedor
 * @param usuarioId ID do desenvolvedor
 * @returns Lista de vagas com percentual de compatibilidade (>= 60%)
 */
export const getVagasCompativeis = async (usuarioId: string): Promise<JobMatch[]> => {
  try {
    const response = await axios.get(`${API_URL}/matching/vagas-compativeis/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching compatible jobs:', error);
    throw error;
  }
};

/**
 * Calcula compatibilidade de um candidato específico com uma vaga específica
 * @param desenvolvedorId ID do desenvolvedor/candidato
 * @param vagaId ID da vaga
 * @returns Percentual de compatibilidade (0-100)
 */
export const getCompatibilidadeCandidato = async (desenvolvedorId: number, vagaId: number): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/matching/compatibilidade/${desenvolvedorId}/${vagaId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate compatibility:', error);
    return 0; // Retorna 0 em caso de erro
  }
};

