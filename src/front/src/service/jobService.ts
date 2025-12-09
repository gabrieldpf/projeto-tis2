import httpClient from './httpClient';

export const createJob = async (jobData: any) => {  
  try {
    // Validação básica no cliente para feedback rápido
    const required = ['title', 'experienceLevel', 'valorReferencia'];
    const missing = required.filter((k) => !jobData?.[k] || String(jobData?.[k]).trim() === '');
    if (missing.length) {
      throw new Error(`Campos obrigatórios faltando: ${missing.join(', ')}`);
    }
    const response = await httpClient.post(`/jobs`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const getJobs = async () => {
  try {
    const response = await httpClient.get(`/jobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getJobsByUsuario = async (usuarioId: string | number) => {
  try {
    const response = await httpClient.get(`/jobs/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs by usuario:', error);
    throw error;
  }
};

export const getJobById = async (id: number) => {
  try {
    const response = await httpClient.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job by id:', error);
    throw error;
  }
};

export const updateJob = async (id: number, jobData: any) => {
  try {
    const response = await httpClient.put(`/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (id: number) => {
  try {
    await httpClient.delete(`/jobs/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

export const updateJobStatus = async (id: number, status: 'ativa' | 'pausada' | 'fechada') => {
  try {
    const response = await httpClient.patch(`/jobs/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};
