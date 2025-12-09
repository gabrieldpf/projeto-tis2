import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/perfis-dev`;

// Interface para habilidades
export interface HabilidadeData {
  id?: number;
  categoria: string; // linguagens, frameworks, bancos_dados, ferramentas, soft
  habilidade: string;
}

// Tipos para as requisições e respostas
export interface PerfilDevData {
  id?: number;
  usuarioId: number;
  titular: string;
  resumo?: string;
  localizacao?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  faixaSalarial?: string;
  tipoContrato?: string;
  modoTrabalho?: string;
  disponibilidade?: string;
  preferenciasVaga?: string[];
  idiomas?: string[];
  habilidades?: HabilidadeData[];
  perfilCompleto?: boolean;
  dataAtualizacao?: string;
}

/**
 * Cria um novo perfil de desenvolvedor
 * @param perfilData Dados do perfil a ser criado
 * @returns Dados do perfil criado
 */
export const criarPerfil = async (perfilData: PerfilDevData): Promise<PerfilDevData> => {
  try {
    const response = await axios.post(API_URL, perfilData, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error creating profile:', error);
    
    // Lança o erro com a mensagem do backend se disponível
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Erro ao criar perfil. Tente novamente.');
  }
};

/**
 * Atualiza um perfil de desenvolvedor existente
 * @param usuarioId ID do usuário dono do perfil
 * @param perfilData Dados atualizados do perfil
 * @returns Dados do perfil atualizado
 */
export const atualizarPerfil = async (usuarioId: number, perfilData: Partial<PerfilDevData>): Promise<PerfilDevData> => {
  try {
    const response = await axios.put(`${API_URL}/${usuarioId}`, perfilData, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    // Lança o erro com a mensagem do backend se disponível
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Erro ao atualizar perfil. Tente novamente.');
  }
};

/**
 * Busca o perfil de um desenvolvedor pelo ID do usuário
 * @param usuarioId ID do usuário
 * @returns Dados do perfil
 */
export const buscarPerfil = async (usuarioId: number): Promise<PerfilDevData> => {
  try {
    const response = await axios.get(`${API_URL}/${usuarioId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Erro ao buscar perfil.');
  }
};

/**
 * Verifica se o servidor de perfis está funcionando
 * @returns Status do servidor
 */
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw new Error('Servidor de perfis não está respondendo.');
  }
};

