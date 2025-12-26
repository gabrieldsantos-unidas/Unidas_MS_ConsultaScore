import type { ScoreRequest, ScoreResponse, ConsultaResult } from '../types/api';

const API_URL = 'https://vega.hml.unidas.com.br/contractlivre/v1/ContractsSalesForce/cancel';

export type Ambiente = 'HML' | 'PRD';

function criarPayload(cnpj: string, payloadToken: string): ScoreRequest {
  return {
    cnpj,
    score: 'Sim',
    bearerToken: payloadToken
  };
}

function extrairScore(response: ScoreResponse): string {
  try {
    if (typeof response === 'object' && response !== null) {
      const scoreValue = (response as Record<string, unknown>).score;
      if (typeof scoreValue === 'string' || typeof scoreValue === 'number') {
        return String(scoreValue);
      }
    }
    return 'Sem score';
  } catch {
    return 'Sem score';
  }
}

export async function consultarScore(
  cnpj: string,
  authToken: string,
  payloadToken: string,
  ambiente: Ambiente = 'HML'
): Promise<ConsultaResult> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'ambiente': ambiente
      },
      body: JSON.stringify(criarPayload(cnpj, payloadToken))
    });

    if (response.status === 401 || response.status === 403) {
      return {
        cnpj,
        score: '-',
        status: 'ERRO',
        mensagem: 'Token inválido ou expirado'
      };
    }

    if (!response.ok) {
      return {
        cnpj,
        score: '-',
        status: 'ERRO',
        mensagem: `Erro HTTP ${response.status}`
      };
    }

    const data: ScoreResponse = await response.json();
    const score = extrairScore(data);

    return {
      cnpj,
      score,
      status: 'OK',
      mensagem: undefined
    };
  } catch (error) {
    return {
      cnpj,
      score: '-',
      status: 'ERRO',
      mensagem: error instanceof Error ? error.message : 'Erro inesperado'
    };
  }
}
