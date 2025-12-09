import axios from 'axios';

// Garante que a URL seja absoluta (com protocolo)
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return 'http://localhost:8080/api';
  }
  // Se já começa com http:// ou https://, usa como está
  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    return envUrl;
  }
  // Se não tem protocolo, adiciona https://
  return `https://${envUrl}`;
};

const baseURL = getBaseURL();

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar X-User-Id automaticamente
httpClient.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem('devmatch_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user?.id) {
          // Garantir que o ID seja enviado como número (string será convertida no backend)
          config.headers['X-User-Id'] = String(user.id);
        }
      } catch (error) {
        // Ignora erro de parsing
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extrai mensagens de validação do backend (Spring Validation) quando disponível
    if (error.response) {
      const data = error.response.data;
      if (typeof data === 'string') {
        return Promise.reject(new Error(data));
      }
      if (data?.error) {
        return Promise.reject(new Error(data.error));
      }
      if (data?.message) {
        return Promise.reject(new Error(data.message));
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
