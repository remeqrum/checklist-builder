import { create } from 'zustand';
import type {
  Checklist,
  Section,
  Subsection,
  TestCase,
} from '../types/checklist';
import { loadChecklists, saveChecklists } from '../utils/storage';
import {
  createChecklist,
  createSection,
  createSubsection,
  createTestCase,
} from '../utils/factories';
import { blockToSection } from '../utils/blocks';
import { t, useI18n } from '../i18n';
import type { TranslationKey } from '../i18n';

// names below end up in stored data, so resolve them in the current locale
const tr = (key: TranslationKey) => t(key, useI18n.getState().locale);

interface ChecklistStore {
  checklists: Checklist[];
  activeChecklistId: string | null;
  selectedItemId: string | null;

  // computed
  activeChecklist: () => Checklist | undefined;

  // checklist CRUD
  loadFromStorage: () => void;
  addChecklist: (name: string) => void;
  duplicateChecklist: (id: string) => void;
  deleteChecklist: (id: string) => void;
  updateChecklist: (id: string, updates: Partial<Checklist>) => void;
  setActiveChecklist: (id: string | null) => void;

  // section operations
  addSection: (checklistId: string, name?: string) => void;
  addSectionFromBlock: (checklistId: string, blockName: string) => void;
  updateSection: (checklistId: string, sectionId: string, updates: Partial<Section>) => void;
  deleteSection: (checklistId: string, sectionId: string) => void;

  // subsection operations
  addSubsection: (checklistId: string, sectionId: string, name?: string) => void;
  updateSubsection: (
    checklistId: string,
    sectionId: string,
    subsectionId: string,
    updates: Partial<Subsection>
  ) => void;
  deleteSubsection: (checklistId: string, sectionId: string, subsectionId: string) => void;

  // test case operations
  addTestCase: (
    checklistId: string,
    sectionId: string,
    subsectionId: string,
    overrides?: Partial<TestCase>
  ) => void;
  updateTestCase: (
    checklistId: string,
    sectionId: string,
    subsectionId: string,
    testCaseId: string,
    updates: Partial<TestCase>
  ) => void;
  deleteTestCase: (
    checklistId: string,
    sectionId: string,
    subsectionId: string,
    testCaseId: string
  ) => void;

  // selection
  setSelectedItem: (id: string | null) => void;
}

// helper to update a specific checklist and persist
function updateAndSave(
  checklists: Checklist[],
  checklistId: string,
  updater: (cl: Checklist) => Checklist
): Checklist[] {
  const updated = checklists.map((cl) => {
    if (cl.id !== checklistId) return cl;
    return { ...updater(cl), updatedAt: new Date().toISOString() };
  });
  saveChecklists(updated);
  return updated;
}

export const useChecklistStore = create<ChecklistStore>((set, get) => ({
  checklists: [],
  activeChecklistId: null,
  selectedItemId: null,

  activeChecklist: () => {
    const { checklists, activeChecklistId } = get();
    return checklists.find((cl) => cl.id === activeChecklistId);
  },

  loadFromStorage: () => {
    const checklists = loadChecklists();
    set({ checklists });
  },

  addChecklist: (name: string) => {
    const newChecklist = createChecklist({ name });
    const updated = [...get().checklists, newChecklist];
    saveChecklists(updated);
    set({ checklists: updated, activeChecklistId: newChecklist.id });
  },

  duplicateChecklist: (id: string) => {
    const original = get().checklists.find((cl) => cl.id === id);
    if (!original) return;
    const copy = createChecklist({
      ...original,
      id: undefined,
      name: `${original.name} ${tr('copySuffix')}`,
      createdAt: undefined,
      updatedAt: undefined,
    });
    const updated = [...get().checklists, copy];
    saveChecklists(updated);
    set({ checklists: updated });
  },

  deleteChecklist: (id: string) => {
    const updated = get().checklists.filter((cl) => cl.id !== id);
    saveChecklists(updated);
    set({
      checklists: updated,
      activeChecklistId: get().activeChecklistId === id ? null : get().activeChecklistId,
    });
  },

  updateChecklist: (id: string, updates: Partial<Checklist>) => {
    const updated = updateAndSave(get().checklists, id, (cl) => ({ ...cl, ...updates }));
    set({ checklists: updated });
  },

  setActiveChecklist: (id: string | null) => {
    set({ activeChecklistId: id, selectedItemId: null });
  },

  // sections
  addSection: (checklistId: string, name?: string) => {
    const updated = updateAndSave(get().checklists, checklistId, (cl) => {
      const order = cl.sections.length;
      const section = createSection({ name: name || tr('newSection'), order });
      return { ...cl, sections: [...cl.sections, section] };
    });
    set({ checklists: updated });
  },

  addSectionFromBlock: (checklistId: string, blockName: string) => {
    const section = blockToSection(blockName);
    if (!section) return;
    const updated = updateAndSave(get().checklists, checklistId, (cl) => ({
      ...cl,
      sections: [...cl.sections, { ...section, order: cl.sections.length }],
    }));
    set({ checklists: updated });
  },

  updateSection: (checklistId, sectionId, updates) => {
    const updated = updateAndSave(get().checklists, checklistId, (cl) => ({
      ...cl,
      sections: cl.sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
    }));
    set({ checklists: updated });
  },

  deleteSection: (checklistId, sectionId) => {
    const updated = updateAndSave(get().checklists, checklistId, (cl) => ({
      ...cl,
      sections: cl.sections.filter((s) => s.id !== sectionId),
    }));
    set({ checklists: updated });
  },

  // subsections
  addSubsection: (checklistId, sectionId, name?) => {
    const updated = updateAndSave(get().checklists, checklistId, (cl) => ({
      ...cl,
      sections: cl.sections.map((s) => {
        if (s.id !== sectionId) return s;
        const order = s.subsections.length;
        return {
          ...s,
          subsections: [
            ...s.subsections,
            createSubsection({ name: name || tr('newSubsection'), order }),
          ],
        };
      }),
    }));
    set({ checklists: updated });
  },

  updateSubsection: (checklistId, sectionId, subsectionId, updates) => {
    const updated = updateAndSave(get().checklists, checklistId, (cl) => ({
      ...cl,
      sections: cl.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          subsections: s.subsections.map((ss) =>
            ss.id === subsectionId ? { ...ss, ...updates } : ss
          ),
        };
      }),
    }));
    set({ checklists: updated });
  },

  deleteSubsection: (checklistId, sectionId, subsectionId) => {
    const updated = updateAndSave(get().checklists, checklistId, (cl) => ({
      ...cl,
      sections: cl.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          subsections: s.subsections.filter((ss) => ss.id !== subsectionId),
        };
      }),
    }));
    set({ checklists: updated });
  },

  // test cases
  addTestCase: (checklistId, sectionId, subsectionId, overrides?) => {
    const updated = updateAndSave(get().checklists, checklistId, (cl) => ({
      ...cl,
      sections: cl.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          subsections: s.subsections.map((ss) => {
            if (ss.id !== subsectionId) return ss;
            return {
              ...ss,
              testCases: [...ss.testCases, createTestCase(overrides)],
            };
          }),
        };
      }),
    }));
    set({ checklists: updated });
  },

  updateTestCase: (checklistId, sectionId, subsectionId, testCaseId, updates) => {
    const updated = updateAndSave(get().checklists, checklistId, (cl) => ({
      ...cl,
      sections: cl.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          subsections: s.subsections.map((ss) => {
            if (ss.id !== subsectionId) return ss;
            return {
              ...ss,
              testCases: ss.testCases.map((tc) =>
                tc.id === testCaseId ? { ...tc, ...updates } : tc
              ),
            };
          }),
        };
      }),
    }));
    set({ checklists: updated });
  },

  deleteTestCase: (checklistId, sectionId, subsectionId, testCaseId) => {
    const updated = updateAndSave(get().checklists, checklistId, (cl) => ({
      ...cl,
      sections: cl.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          subsections: s.subsections.map((ss) => {
            if (ss.id !== subsectionId) return ss;
            return {
              ...ss,
              testCases: ss.testCases.filter((tc) => tc.id !== testCaseId),
            };
          }),
        };
      }),
    }));
    set({ checklists: updated });
  },

  setSelectedItem: (id: string | null) => {
    set({ selectedItemId: id });
  },
}));
