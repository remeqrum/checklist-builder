import { describe, expect, it } from 'vitest';
import { sanitizeFileName } from '../excelExport';

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
