import { v4 as uuidv4 } from 'uuid';
import type {
  Checklist,
  ChecklistSettings,
  Section,
  Subsection,
  TestCase,
} from '../types/checklist';

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
    name: 'New Subsection',
    order: 0,
    testCases: [],
    ...overrides,
  };
}

export function createSection(overrides?: Partial<Section>): Section {
  return {
    id: generateId(),
    name: 'New Section',
    order: 0,
    subsections: [createSubsection({ name: 'Default' })],
    ...overrides,
  };
}

export function createChecklist(overrides?: Partial<Checklist>): Checklist {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: 'Untitled Checklist',
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
