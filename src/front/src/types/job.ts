export interface JobPosting {
  id: number;
  title: string;
  experienceLevel: string;
  regime: string;
  modeloRemuneracao: string;
  valorReferencia: string;
  prazoEstimado: string;
  description?: string;
  localModalidade: string;
  anexo?: string;
  applications: number;
  matches: number;
  status?: 'ativa' | 'pausada' | 'fechada'; 
  postedDate: string;
  skills: (string | { id?: number; skill: string })[];
  usuarioId?: number;
  nomeEmpresa?: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  skills: string[];
  matchScore: number;
  location: string;
  availability: string;
  jobId: string;
}
