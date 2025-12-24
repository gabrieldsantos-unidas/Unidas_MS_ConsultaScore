import { Copy, CheckCircle2, XCircle, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { ConsultaResult } from '../types/api';
import { formatarCNPJ } from '../utils/cnpj';

interface ResultsTableProps {
  resultados: ConsultaResult[];
  onCopiar: () => void;
}

function exportarParaExcel(resultados: ConsultaResult[]) {
  const dados = resultados.map(r => ({
    'CNPJ': formatarCNPJ(r.cnpj),
    'Score': r.score,
    'Status': r.status,
    'Mensagem': r.mensagem || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Scores');

  const dataHora = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const nomeArquivo = `scores_serasa_${dataHora}.xlsx`;

  XLSX.writeFile(workbook, nomeArquivo);
}

export function ResultsTable({ resultados, onCopiar }: ResultsTableProps) {
  if (resultados.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Resultados ({resultados.length})
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onCopiar}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Copy className="w-4 h-4" />
            Copiar
          </button>
          <button
            onClick={() => exportarParaExcel(resultados)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Mensagem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resultados.map((resultado, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatarCNPJ(resultado.cnpj)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`font-semibold ${
                        resultado.score !== '-' && resultado.score !== 'Sem score'
                          ? 'text-orange-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {resultado.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {resultado.status === 'OK' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-medium">OK</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-red-600 font-medium">ERRO</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {resultado.mensagem || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
