/* // src/services/applicationService.ts (Novo arquivo para DeveloperDashboard)
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getApplications = async () => {
  try {
    const response = await axios.get(`${API_URL}/applications`); // Assumindo endpoint /api/applications
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const getMatches = async () => {
  try {
    const response = await axios.get(`${API_URL}/matches`); // Assumindo endpoint /api/matches
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Os outros componentes (FlashCards, Header, etc.) permanecem inalterados, pois não precisam de integração com API. */