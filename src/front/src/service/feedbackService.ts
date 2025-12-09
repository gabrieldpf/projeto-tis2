import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const notificarEmpresa = async (projectId: number) => {
  // NOTE: backend currently doesn't expose a specific 'notificar' endpoint. Keep as placeholder.
  return axios.post(`${API_URL}/feedback/notificar/empresa`, { projectId });
};

export const notificarDev = async (projectId: number) => {
  // Placeholder
  return axios.post(`${API_URL}/feedback/notificar/dev`, { projectId });
};

/**
 * Create feedback.
 * Backend expects header 'X-User-Id' with rater id and a JSON body matching FeedbackCreateRequest.
 */
export const registrarFeedback = async (payload: any, userId?: number) => {
  const headers: any = {};
  if (userId) headers['X-User-Id'] = String(userId);
  // prefer JSON body (backend FeedbackController.create expects @RequestBody FeedbackCreateRequest)
  if (payload instanceof FormData) {
    // convert FormData to JSON where possible. We'll attempt to read known fields.
    const json: any = {};
    payload.forEach((v, k) => {
      if (k === 'evidencias') return; // skip files
      json[k] = v;
    });
    return axios.post(`${API_URL}/feedback`, json, { headers: { ...headers, 'Content-Type': 'application/json' } });
  }
  return axios.post(`${API_URL}/feedback`, payload, { headers: { ...headers, 'Content-Type': 'application/json' } });
};

export const abrirDisputa = async (payload: any, userId?: number) => {
  const headers: any = { 'Content-Type': 'application/json' };
  if (userId) headers['X-User-Id'] = String(userId);
  // backend endpoint: POST /api/feedback/disputes
  return axios.post(`${API_URL}/feedback/disputes`, payload, { headers });
};

export const enviarEvidencias = async (disputaId: number, formData: FormData) => {
  // Backend currently stores evidence path on entities; dedicated upload endpoint not defined.
  // Keep placeholder in case server implements file upload at /api/feedback/disputes/{id}/evidences
  return axios.post(`${API_URL}/feedback/disputes/${disputaId}/evidences`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getReceived = async (userId?: number) => {
  const headers: any = {};
  if (userId) headers['X-User-Id'] = String(userId);
  const response = await axios.get(`${API_URL}/feedback/received`, { headers });
  return response.data;
};

export const getGiven = async (userId?: number) => {
  const headers: any = {};
  if (userId) headers['X-User-Id'] = String(userId);
  const response = await axios.get(`${API_URL}/feedback/given`, { headers });
  return response.data;
};

export const getSummary = async (userId?: number) => {
  const headers: any = {};
  if (userId) headers['X-User-Id'] = String(userId);
  const response = await axios.get(`${API_URL}/feedback/summary`, { headers });
  return response.data;
};

export const getDisputesMine = async (userId?: number) => {
  const headers: any = {};
  if (userId) headers['X-User-Id'] = String(userId);
  const response = await axios.get(`${API_URL}/feedback/disputes/mine`, { headers });
  return response.data;
};

/**
 * Busca todas as disputas abertas (para administradores)
 * @returns Lista de disputas com status OPEN
 */
export const getAllOpenDisputes = async () => {
  const response = await axios.get(`${API_URL}/feedback/disputes/open`);
  return response.data;
};

/**
 * Busca um feedback específico pelo ID
 * @param feedbackId ID do feedback
 * @returns Dados do feedback
 */
export const getFeedbackById = async (feedbackId: number): Promise<FeedbackItemResponse> => {
  const response = await axios.get(`${API_URL}/feedback/${feedbackId}`);
  return response.data;
};

/**
 * Decide sobre uma disputa (para administradores)
 * @param disputeId ID da disputa
 * @param decisao Decisão: 'MANTIDA' ou 'AJUSTADA'
 */
export const decideDispute = async (disputeId: number, decisao: 'MANTIDA' | 'AJUSTADA') => {
  const response = await axios.post(
    `${API_URL}/feedback/disputes/${disputeId}/decision`,
    { decisao },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export default {
  notificarEmpresa,
  notificarDev,
  registrarFeedback,
  abrirDisputa,
  enviarEvidencias,
  getReceived,
  getGiven,
  getSummary,
  getDisputesMine,
  getAllOpenDisputes,
  getFeedbackById,
  decideDispute,
};
