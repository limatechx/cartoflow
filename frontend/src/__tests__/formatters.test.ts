import { formatCPF, formatDate, formatDateTime } from '../utils/formatters';

describe('formatCPF', () => {
  it('formata corretamente um CPF com 11 dígitos', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01');
  });

  it('retorna o valor original se o CPF tiver menos de 11 dígitos', () => {
    expect(formatCPF('123')).toBe('123');
  });

  it('formata CPF mesmo que venha com pontuação (remove e reformata)', () => {
    expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
  });
});

describe('formatDate', () => {
  it('retorna "-" quando a string é vazia', () => {
    expect(formatDate('')).toBe('-');
  });

  it('formata uma data no padrão brasileiro (dd/mm/aaaa)', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBe('15/01/2024');
  });
});

describe('formatDateTime', () => {
  it('retorna "-" quando a string é vazia', () => {
    expect(formatDateTime('')).toBe('-');
  });
});

