import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../service/authService';

export type UserType = 'developer' | 'company' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  profileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: UserType) => Promise<boolean>;
  register: (email: string, password: string, name: string, type: UserType) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão existente
    const savedUser = localStorage.getItem('devmatch_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('devmatch_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, type: UserType): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Chama a API real de login
      const response = await authService.login(email, password, type);
      
      // Valida se a resposta tem os dados necessários
      if (!response || !response.id) {
        throw new Error('Resposta inválida do servidor. Tente novamente.');
      }
      
      // Converte a resposta do backend para o formato do frontend
      const userData: User = {
        id: String(response.id),
        email: response.email || '',
        name: response.nome || '',
        type: response.tipo === 'dev' ? 'developer' : (response.tipo === 'empresa' ? 'company' : 'admin'),
        profileComplete: response.perfilCompleto || false,
      };
      
      setUser(userData);
      localStorage.setItem('devmatch_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      // Propaga o erro para que o componente possa exibir a mensagem específica
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, type: UserType): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Chama a API real de registro
      const response = await authService.register(email, password, name, type);
      
      // Valida se a resposta tem os dados necessários
      if (!response || !response.id) {
        throw new Error('Resposta inválida do servidor. Tente novamente.');
      }
      
      // Converte a resposta do backend para o formato do frontend
      const userData: User = {
        id: String(response.id),
        email: response.email || '',
        name: response.nome || '',
        type: response.tipo === 'dev' ? 'developer' : (response.tipo === 'empresa' ? 'company' : 'admin'),
        profileComplete: response.perfilCompleto || false,
      };
      
      setUser(userData);
      localStorage.setItem('devmatch_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      // Propaga o erro para que o componente possa exibir a mensagem específica
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('devmatch_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};