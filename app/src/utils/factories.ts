import { v4 as uuidv4 } from 'uuid';
import type {
  Checklist,
  ChecklistSettings,
  Section,
  Subsection,
  TestCase,
} from '../types/checklist';
import { t, useI18n } from '../i18n';
import type { TranslationKey } from '../i18n';

// default names are stored in user data, so resolve them in the current locale
const tr = (key: TranslationKey) => t(key, useI18n.getState().locale);

export function generateId(): string {
  return uuidv4();
}

export function createDefaultSettings(): ChecklistSettings {
  return {
    visibleFields: ['title', 'priority', 'status', 'type'],
    defaultPriority: 'Medium',
    defaultStatus: 'Not Run',
    exportFormat: 'xlsx',
  };
}

export function createTestCase(overrides?: Partial<TestCase>): TestCase {
  return {
    id: generateId(),
    title: '',
    steps: [],
    expectedResult: '',
    priority: 'Medium',
    type: 'Functional',
    platforms: [],
    browsers: [],
    status: 'Not Run',
    tags: [],
    ...overrides,
  };
}

export function createSubsection(overrides?: Partial<Subsection>): Subsection {
  return {
    id: generateId(),
    name: tr('newSubsection'),
    order: 0,
    testCases: [],
    ...overrides,
  };
}

export function createSection(overrides?: Partial<Section>): Section {
  return {
    id: generateId(),
    name: tr('newSection'),
    order: 0,
    subsections: [createSubsection({ name: tr('defaultSubsection') })],
    ...overrides,
  };
}

export function createChecklist(overrides?: Partial<Checklist>): Checklist {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: tr('untitledChecklist'),
    author: '',
    createdAt: now,
    updatedAt: now,
    version: 1,
    sections: [],
    settings: createDefaultSettings(),
    tags: [],
    ...overrides,
  };
}
