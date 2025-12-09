import httpClient from './httpClient';
import { Milestone, Delivery } from '../types/milestone';

const API = '';

export const createMilestone = async (data: Partial<Milestone>) => {
  const resp = await httpClient.post(`/milestones`, data);
  return resp.data as Milestone;
};

export const createMilestoneForJob = async (jobId: number, data: Partial<Milestone>) => {
  const resp = await httpClient.post(`/vagas/${jobId}/milestones`, data);
  return resp.data as Milestone;
};

export const getMilestonesByProject = async (projectId: number) => {
  const resp = await httpClient.get(`/projects/${projectId}/milestones`);
  return resp.data as Milestone[];
};

export const getMilestonesByContract = async (contractId: number) => {
  const resp = await httpClient.get(`/contracts/${contractId}/milestones`);
  return resp.data as Milestone[];
};

export const getMilestoneById = async (milestoneId: number) => {
  const resp = await httpClient.get(`/milestones/${milestoneId}`);
  return resp.data as Milestone;
};

export const createDelivery = async (milestoneId: number, payload: { 
  perfilDevId: number; 
  descricaoEntrega?: string;
  arquivosEntrega?: string;
  horasTrabalhadas?: number;
  conteudo?: string; // Campo legado
}) => {
  const resp = await httpClient.post(`/milestones/${milestoneId}/delivery`, payload);
  return resp.data as Delivery;
};

export const getDeliveriesByMilestone = async (milestoneId: number) => {
  const resp = await httpClient.get(`/milestones/${milestoneId}/deliveries`);
  return resp.data as Delivery[];
};

export const getDeliveryById = async (deliveryId: number) => {
  const resp = await httpClient.get(`/deliveries/${deliveryId}`);
  return resp.data as Delivery;
};

export const getDeliveriesByPerfilDev = async (perfilDevId: number) => {
  const resp = await httpClient.get(`/perfil-dev/${perfilDevId}/deliveries`);
  return resp.data as Delivery[];
};

export const updateDelivery = async (deliveryId: number, payload: Partial<Delivery>) => {
  const resp = await httpClient.put(`/delivery/${deliveryId}`, payload);
  return resp.data as Delivery;
};

export const reviewDelivery = async (deliveryId: number, approved: boolean, comentarioRevisao?: string) => {
  const resp = await httpClient.post(`/deliveries/${deliveryId}/review`, { 
    approved,
    comentarioRevisao 
  });
  return resp.data as Delivery;
};

export const updateMilestoneStatus = async (milestoneId: number, status: string) => {
  const resp = await httpClient.patch(`/milestones/${milestoneId}/status`, { status });
  return resp.data as Milestone;
};

export default {
  createMilestone,
  createMilestoneForJob,
  getMilestonesByProject,
  getMilestonesByContract,
  getMilestoneById,
  createDelivery,
  getDeliveriesByMilestone,
  getDeliveryById,
  getDeliveriesByPerfilDev,
  updateDelivery,
  reviewDelivery,
  updateMilestoneStatus,
};
