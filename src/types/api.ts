export interface ScoreRequest {
  cnpj: string;
  score: string;
  bearerToken: string;
}

export interface ScoreResponse {
  [key: string]: unknown;
}

export interface ConsultaResult {
  cnpj: string;
  score: string;
  status: 'OK' | 'ERRO';
  mensagem?: string;
}
