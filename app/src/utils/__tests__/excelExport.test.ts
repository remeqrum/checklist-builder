import { describe, expect, it } from 'vitest';
import { safeCell, sanitizeFileName } from '../excelExport';

describe('sanitizeFileName', () => {
  it('keeps Latin letters, digits, dashes and spaces', () => {
    expect(sanitizeFileName('Auth flow v2')).toBe('Auth flow v2');
  });

  it('keeps Cyrillic names', () => {
    expect(sanitizeFileName('Мой чек-лист')).toBe('Мой чек-лист');
  });

  it('keeps Slovak diacritics', () => {
    expect(sanitizeFileName('Vyhľadávanie šťastné')).toBe('Vyhľadávanie šťastné');
  });

  it('strips unsafe characters', () => {
    expect(sanitizeFileName('release: 2/0 * final?')).toBe('release 20  final');
  });

  it('falls back when nothing survives', () => {
    expect(sanitizeFileName('🔥🔥🔥')).toBe('checklist');
    expect(sanitizeFileName('   ')).toBe('checklist');
  });
});

describe('safeCell (formula-injection guard)', () => {
  it('prefixes values starting with a formula trigger', () => {
    expect(safeCell('=1+1')).toBe("'=1+1");
    expect(safeCell('+cmd')).toBe("'+cmd");
    expect(safeCell('-2')).toBe("'-2");
    expect(safeCell('@SUM(A1)')).toBe("'@SUM(A1)");
  });

  it('leaves ordinary text untouched', () => {
    expect(safeCell('Login with valid credentials')).toBe('Login with valid credentials');
    expect(safeCell('Мой тест')).toBe('Мой тест');
    expect(safeCell('')).toBe('');
  });
});
