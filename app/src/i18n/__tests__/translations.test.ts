import { describe, expect, it } from 'vitest';
import { t, translations } from '../translations';
import type { TranslationKey } from '../translations';

const LOCALES = ['en', 'ru', 'sk'] as const;

describe('translations completeness', () => {
  it('every key has a non-empty value for every locale', () => {
    for (const [key, value] of Object.entries(translations)) {
      for (const locale of LOCALES) {
        expect(value[locale], `${key}.${locale} is missing`).toBeTruthy();
      }
    }
  });
});

describe('t()', () => {
  it('returns the value for the requested locale', () => {
    expect(t('myChecklists', 'ru')).toBe('Мои чек-листы');
    expect(t('myChecklists', 'sk')).toBe('Moje checklisty');
  });

  it('falls back to the key for unknown keys', () => {
    expect(t('definitely-not-a-key' as TranslationKey, 'en')).toBe('definitely-not-a-key');
  });

  it('interpolates params', () => {
    expect(t('deleteSectionConfirm', 'en', { name: 'Auth' })).toBe('Delete section "Auth"?');
    expect(t('addBlockTooltip', 'ru', { name: 'API', count: 8 })).toBe(
      'Добавить блок API (8 кейсов)'
    );
  });
});
