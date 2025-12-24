export function limparCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

export function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = limparCNPJ(cnpj);
  return cnpjLimpo.length === 14 && /^\d+$/.test(cnpjLimpo);
}

export function formatarCNPJ(cnpj: string): string {
  const cnpjLimpo = limparCNPJ(cnpj);
  if (cnpjLimpo.length !== 14) return cnpj;

  return cnpjLimpo.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

export function parseListaCNPJs(texto: string): string[] {
  return texto
    .split(/[\n,]+/)
    .map(cnpj => cnpj.trim())
    .filter(cnpj => cnpj.length > 0);
}
