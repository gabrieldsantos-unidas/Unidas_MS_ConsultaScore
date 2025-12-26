import { useState } from 'react';
import { Search, Loader2, Trash2 } from 'lucide-react';
import { ResultsTable } from './components/ResultsTable';
import { parseListaCNPJs, validarCNPJ, limparCNPJ, formatarCNPJ } from './utils/cnpj';
import { consultarScore, type Ambiente } from './utils/api';
import type { ConsultaResult } from './types/api';

function App() {
  const [authToken, setAuthToken] = useState('');
  const [payloadToken, setPayloadToken] = useState('');
  const [cnpjsTexto, setCnpjsTexto] = useState('');
  const [ambiente, setAmbiente] = useState<Ambiente>('HML');
  const [resultados, setResultados] = useState<ConsultaResult[]>([]);
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState({ atual: 0, total: 0 });
  const [erro, setErro] = useState('');

  const handleConsultar = async () => {
    setErro('');

    if (!authToken.trim()) {
      setErro('Token de Autenticação é obrigatório');
      return;
    }

    if (!payloadToken.trim()) {
      setErro('Token do Payload é obrigatório');
      return;
    }

    const cnpjs = parseListaCNPJs(cnpjsTexto);
    if (cnpjs.length === 0) {
      setErro('Informe ao menos um CNPJ');
      return;
    }

    const cnpjsInvalidos = cnpjs.filter(cnpj => !validarCNPJ(cnpj));
    if (cnpjsInvalidos.length > 0) {
      setErro(`CNPJs inválidos encontrados: ${cnpjsInvalidos.join(', ')}`);
      return;
    }

    setProcessando(true);
    setResultados([]);
    setProgresso({ atual: 0, total: cnpjs.length });

    const resultadosTemp: ConsultaResult[] = [];

    for (let i = 0; i < cnpjs.length; i++) {
      const cnpjLimpo = limparCNPJ(cnpjs[i]);
      const resultado = await consultarScore(cnpjLimpo, authToken, payloadToken, ambiente);
      resultadosTemp.push(resultado);
      setResultados([...resultadosTemp]);
      setProgresso({ atual: i + 1, total: cnpjs.length });
    }

    setProcessando(false);
  };

  const handleCopiar = () => {
    const texto = resultados
      .map(r => `${formatarCNPJ(r.cnpj)}\t${r.score}\t${r.status}\t${r.mensagem || ''}`)
      .join('\n');

    navigator.clipboard.writeText(texto);
  };

  const handleLimpar = () => {
    setAuthToken('');
    setPayloadToken('');
    setCnpjsTexto('');
    setAmbiente('HML');
    setResultados([]);
    setErro('');
    setProgresso({ atual: 0, total: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Unidas Locadora
              </h1>
              <p className="text-gray-600">Consulta Score Serasa - POC</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ambiente <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="HML"
                    checked={ambiente === 'HML'}
                    onChange={(e) => setAmbiente(e.target.value as Ambiente)}
                    disabled={processando}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Homologação</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="PRD"
                    checked={ambiente === 'PRD'}
                    onChange={(e) => setAmbiente(e.target.value as Ambiente)}
                    disabled={processando}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Produção</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Token de Autenticação (Header) <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Token usado no header Authorization"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                disabled={processando}
              />
              <p className="mt-1 text-xs text-gray-500">
                Token enviado no header Authorization Bearer
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Token do Payload (Body) <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                value={payloadToken}
                onChange={(e) => setPayloadToken(e.target.value)}
                placeholder="Token usado no corpo da requisição"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                disabled={processando}
              />
              <p className="mt-1 text-xs text-gray-500">
                Token enviado no campo bearerToken do payload
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CNPJs <span className="text-red-600">*</span>
              </label>
              <textarea
                value={cnpjsTexto}
                onChange={(e) => setCnpjsTexto(e.target.value)}
                placeholder="Digite os CNPJs (um por linha ou separados por vírgula)&#10;Exemplo:&#10;12.345.678/0001-90&#10;98.765.432/0001-10"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-mono text-sm resize-none"
                disabled={processando}
              />
              <p className="mt-1 text-xs text-gray-500">
                Cada CNPJ gerará uma chamada individual à API
              </p>
            </div>

            {erro && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{erro}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleConsultar}
                disabled={processando}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {processando ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Consultando ({progresso.atual}/{progresso.total})
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Buscar Scores
                  </>
                )}
              </button>
              <button
                onClick={handleLimpar}
                disabled={processando}
                className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                <Trash2 className="w-5 h-5" />
                Limpar
              </button>
            </div>
          </div>
        </div>

        {processando && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progresso</span>
                <span className="font-semibold">
                  {progresso.atual} de {progresso.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-orange-600 h-3 transition-all duration-300 ease-out"
                  style={{
                    width: `${(progresso.atual / progresso.total) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <ResultsTable resultados={resultados} onCopiar={handleCopiar} />
      </div>
    </div>
  );
}

export default App;
