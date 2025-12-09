export interface FeedbackItemResponse {
  id: number;
  projectId: number | null;
  raterId: number | null;
  ratedId: number | null;
  ratedRole?: string | null;
  // Note: backend currently returns an aggregated 'estrelas' (double) in FeedbackItemResponse
  estrelas?: number | null;
  qualidadeTecnica?: number | null;
  cumprimentoPrazos?: number | null;
  comunicacao?: number | null;
  colaboracao?: number | null;
  comentario?: string | null;
  dataAvaliacao?: string | null; // ISO datetime
}

export interface FeedbackSummaryResponse {
  projetosFinalizados: number;
  feedbacksRecebidos: number;
  avaliacoesRealizadas: number;
  contestacoesAbertas: number;
}

export interface Disputa {
  id: number;
  feedbackId: number;
  justificativaDisputa: string;
  evidenciasPath?: string | null;
  status?: 'OPEN' | 'CLOSED' | 'aberta' | 'fechada';
  decisaoMediacao?: 'MANTIDA' | 'AJUSTADA' | 'mantida' | 'ajustada';
  createdAt?: string;
}
