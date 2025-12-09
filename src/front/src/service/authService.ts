import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth`;

// Tipos para as requisições e respostas
export interface LoginRequest {
  email: string;
  senha: string;
  tipo: string; // 'dev' ou 'empresa'
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  tipo: string; // 'dev' ou 'empresa'
}

export interface AuthResponse {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  perfilCompleto: boolean;
}

/**
 * Realiza o login do usuário
 * @param email Email do usuário
 * @param password Senha do usuário
 * @param type Tipo de usuário ('developer', 'company' ou 'admin')
 * @returns Dados do usuário autenticado
 */
export const login = async (email: string, password: string, type: 'developer' | 'company' | 'admin'): Promise<AuthResponse> => {
  try {
    // Converte o tipo do frontend para o formato do backend
    const tipo = type === 'developer' ? 'dev' : (type === 'company' ? 'empresa' : 'admin');
    
    const loginData: LoginRequest = {
      email,
      senha: password,
      tipo,
    };
    
    const response = await axios.post(`${API_URL}/login`, loginData, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error logging in:', error);
    
    // Lança o erro com a mensagem do backend se disponível
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Erro ao fazer login. Tente novamente.');
  }
};

/**
 * Registra um novo usuário
 * @param email Email do usuário
 * @param password Senha do usuário
 * @param name Nome do usuário ou empresa
 * @param type Tipo de usuário ('developer' ou 'company')
 * @returns Dados do novo usuário criado
 */
export const register = async (
  email: string, 
  password: string, 
  name: string, 
  type: 'developer' | 'company'
): Promise<AuthResponse> => {
  try {
    // Converte o tipo do frontend para o formato do backend
    const tipo = type === 'developer' ? 'dev' : 'empresa';
    
    const registerData: RegisterRequest = {
      nome: name,
      email,
      senha: password,
      tipo,
    };
    
    const response = await axios.post(`${API_URL}/register`, registerData, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error registering:', error);
    
    // Lança o erro com a mensagem do backend se disponível
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    // Trata erros de validação (400 Bad Request)
    if (error.response?.status === 400) {
      throw new Error('Verifique os dados informados. Senha deve ter no mínimo 6 caracteres.');
    }
    
    throw new Error('Erro ao criar conta. Tente novamente.');
  }
};

/**
 * Busca dados do usuário pelo ID
 * @param id ID do usuário
 * @returns Dados do usuário
 */
export const getUserById = async (id: number): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${API_URL}/user/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Erro ao buscar usuário.');
  }
};

/**
 * Verifica se o servidor de autenticação está funcionando
 * @returns Status do servidor
 */
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw new Error('Servidor de autenticação não está respondendo.');
  }
};

