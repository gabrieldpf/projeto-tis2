import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface CompanyProfileData {
  usuarioId?: number;
  nomeEmpresa: string;
  descricao: string;
  setor?: string;
  tamanho?: string;
  localizacao?: string;
  anoFundacao?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  cultura?: string;
  beneficios?: string[];
  missao?: string;
  visao?: string;
  valores?: string;
  logoUrl?: string;
}

export interface CompanyProfile extends CompanyProfileData {
  id: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

/**
 * Busca o perfil da empresa por ID do usuário
 */
export const buscarPerfilEmpresa = async (usuarioId: number): Promise<CompanyProfile> => {
  try {
    const response = await axios.get(`${API_URL}/perfil-empresa/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company profile:', error);
    throw error;
  }
};

/**
 * Cria ou atualiza o perfil da empresa
 */
export const atualizarPerfilEmpresa = async (
  usuarioId: number,
  data: CompanyProfileData
): Promise<CompanyProfile> => {
  try {
    const response = await axios.put(`${API_URL}/perfil-empresa/${usuarioId}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating company profile:', error);
    throw error;
  }
};

/**
 * Verifica se a empresa já tem perfil criado
 */
export const verificarPerfilEmpresaExiste = async (usuarioId: number): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/perfil-empresa/${usuarioId}/existe`);
    return response.data;
  } catch (error) {
    console.error('Error checking company profile:', error);
    return false;
  }
};

