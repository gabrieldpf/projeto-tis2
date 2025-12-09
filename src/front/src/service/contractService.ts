import httpClient from './httpClient';

export type ContractType = 'CLT' | 'PJ' | 'CONTRATO' | 'COOPERADO';

export interface ContractResponse {
  id: number;
  vagaId: number;
  companyId: number;
  developerId: number;
  contractType: ContractType;
  status: 'PENDING_TEST_APPROVAL' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';
  startedAt: string;
  endedAt?: string;
}

export const createContract = async (payload: { vagaId: number; developerId: number; contractType: ContractType }, actingUserId: number) => {
  const resp = await httpClient.post('/contracts', payload, { headers: { 'X-User-Id': String(actingUserId) } });
  return resp.data as ContractResponse;
};

export const approveSubmission = async (submissionId: number, contractType: ContractType, actingUserId: number) => {
  const resp = await httpClient.post(`/tests/submissions/${submissionId}/approve`, { contractType }, { headers: { 'X-User-Id': String(actingUserId) } });
  return resp.data as number; // contractId
};

export const listActiveForCompany = async (companyId: number) => {
  const resp = await httpClient.get(`/contracts/active/company/${companyId}`);
  return resp.data as ContractResponse[];
};

export const listActiveForDeveloper = async (developerId: number) => {
  const resp = await httpClient.get(`/contracts/active/developer/${developerId}`);
  return resp.data as ContractResponse[];
};

export const listFinishedForUser = async (userId: number) => {
  const resp = await httpClient.get(`/contracts/finished/${userId}`);
  return resp.data as ContractResponse[];
};

export const finishContract = async (contractId: number, actingUserId: number) => {
  const resp = await httpClient.post(`/contracts/${contractId}/finish`, {}, { headers: { 'X-User-Id': String(actingUserId) } });
  return resp.data as ContractResponse;
};

export default {
  createContract,
  approveSubmission,
  listActiveForCompany,
  listActiveForDeveloper,
  listFinishedForUser,
  finishContract,
};
