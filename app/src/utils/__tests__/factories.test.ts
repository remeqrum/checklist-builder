import { afterEach, describe, expect, it } from 'vitest';
import {
  createChecklist,
  createSection,
  createSubsection,
  createTestCase,
  generateId,
} from '../factories';
import { useI18n } from '../../i18n';

afterEach(() => {
  useI18n.getState().setLocale('en');
});

describe('generateId', () => {
  it('returns unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('createTestCase', () => {
  it('fills defaults', () => {
    const tc = createTestCase();
    expect(tc.id).toBeTruthy();
    expect(tc.title).toBe('');
    expect(tc.steps).toEqual([]);
    expect(tc.priority).toBe('Medium');
    expect(tc.type).toBe('Functional');
    expect(tc.status).toBe('Not Run');
  });

  it('applies overrides', () => {
    const tc = createTestCase({ title: 'Login', priority: 'Critical', steps: ['a', 'b'] });
    expect(tc.title).toBe('Login');
    expect(tc.priority).toBe('Critical');
    expect(tc.steps).toEqual(['a', 'b']);
  });
});

describe('createSection', () => {
  it('creates one default subsection', () => {
    const section = createSection();
    expect(section.subsections).toHaveLength(1);
    expect(section.subsections[0].testCases).toEqual([]);
  });

  it('respects explicit subsections', () => {
    const section = createSection({ subsections: [] });
    expect(section.subsections).toEqual([]);
  });
});

describe('localized default names', () => {
  it('uses English names by default', () => {
    expect(createSection().name).toBe('New Section');
    expect(createSubsection().name).toBe('New Subsection');
    expect(createChecklist().name).toBe('Untitled Checklist');
  });

  it('uses the active locale at creation time', () => {
    useI18n.getState().setLocale('ru');
    expect(createSection().name).toBe('Новая секция');
    expect(createSubsection().name).toBe('Новая подсекция');
    expect(createChecklist().name).toBe('Чек-лист без названия');
    expect(createSection().subsections[0].name).toBe('Основная');
  });
});

describe('createChecklist', () => {
  it('fills defaults and settings', () => {
    const cl = createChecklist({ name: 'My list' });
    expect(cl.name).toBe('My list');
    expect(cl.version).toBe(1);
    expect(cl.sections).toEqual([]);
    expect(cl.settings.defaultPriority).toBe('Medium');
    expect(cl.settings.exportFormat).toBe('xlsx');
    expect(Date.parse(cl.createdAt)).not.toBeNaN();
  });
});
