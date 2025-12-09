export interface Milestone {
  id?: number;
  projetoId?: number;
  contractId?: number;
  titulo: string;
  descricao?: string;
  dueDate?: string; // ISO
  valorMilestone?: number;
  criteriosAceitacao?: string;
}

export interface Delivery {
  id?: number;
  milestoneId?: number;
  perfilDevId?: number;
  descricaoEntrega?: string;
  arquivosEntrega?: string; // JSON array de links/URLs
  horasTrabalhadas?: number;
  submittedAt?: string;
  reviewed?: boolean;
  approved?: boolean;
  comentarioRevisao?: string;
  dataRevisao?: string; // ISO
  // Campo legado para compatibilidade
  conteudo?: string;
}
