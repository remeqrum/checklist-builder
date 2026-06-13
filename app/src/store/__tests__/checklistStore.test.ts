import { beforeEach, describe, expect, it } from 'vitest';
import { useChecklistStore } from '../checklistStore';
import { useI18n } from '../../i18n';

const store = () => useChecklistStore.getState();
const persisted = () => JSON.parse(localStorage.getItem('tcb_checklists') ?? '[]');

beforeEach(() => {
  localStorage.clear();
  useChecklistStore.setState({ checklists: [], selectedItemId: null });
  useI18n.getState().setLocale('en');
});

describe('checklist CRUD', () => {
  it('addChecklist returns the new id and persists', () => {
    const id = store().addChecklist('My list');
    const cl = store().checklists.find((c) => c.id === id);
    expect(cl?.name).toBe('My list');
    expect(persisted()).toHaveLength(1);
  });

  it('duplicateChecklist appends a localized copy suffix', () => {
    const id = store().addChecklist('Original');
    store().duplicateChecklist(id);
    expect(store().checklists[1].name).toBe('Original (copy)');
    expect(store().checklists[1].id).not.toBe(id);

    useI18n.getState().setLocale('ru');
    store().duplicateChecklist(id);
    expect(store().checklists[2].name).toBe('Original (копия)');
  });

  it('updateChecklist renames and bumps updatedAt', () => {
    const id = store().addChecklist('Before');
    const before = store().checklists[0].updatedAt;
    store().updateChecklist(id, { name: 'After' });
    const cl = store().checklists[0];
    expect(cl.name).toBe('After');
    expect(Date.parse(cl.updatedAt)).toBeGreaterThanOrEqual(Date.parse(before));
    expect(persisted()[0].name).toBe('After');
  });

  it('deleteChecklist removes and persists', () => {
    const id = store().addChecklist('Doomed');
    store().deleteChecklist(id);
    expect(store().checklists).toEqual([]);
    expect(persisted()).toEqual([]);
  });
});

describe('nested tree operations', () => {
  let id: string;

  beforeEach(() => {
    id = store().addChecklist('Tree');
    store().addSection(id, 'S1');
  });

  const checklist = () => store().checklists.find((c) => c.id === id)!;

  it('addSection creates a section with a default subsection', () => {
    const section = checklist().sections[0];
    expect(section.name).toBe('S1');
    expect(section.subsections).toHaveLength(1);
  });

  it('add/update/delete test case in the right subsection', () => {
    const section = checklist().sections[0];
    const sub = section.subsections[0];

    store().addTestCase(id, section.id, sub.id, { title: 'TC' });
    let cases = checklist().sections[0].subsections[0].testCases;
    expect(cases).toHaveLength(1);

    store().updateTestCase(id, section.id, sub.id, cases[0].id, { status: 'Pass' });
    cases = checklist().sections[0].subsections[0].testCases;
    expect(cases[0].status).toBe('Pass');

    store().deleteTestCase(id, section.id, sub.id, cases[0].id);
    expect(checklist().sections[0].subsections[0].testCases).toEqual([]);
  });

  it('update/delete subsection', () => {
    const section = checklist().sections[0];
    const sub = section.subsections[0];

    store().updateSubsection(id, section.id, sub.id, { name: 'Renamed sub' });
    expect(checklist().sections[0].subsections[0].name).toBe('Renamed sub');

    store().deleteSubsection(id, section.id, sub.id);
    expect(checklist().sections[0].subsections).toEqual([]);
  });

  it('update/delete section', () => {
    const section = checklist().sections[0];

    store().updateSection(id, section.id, { name: 'Renamed section' });
    expect(checklist().sections[0].name).toBe('Renamed section');

    store().deleteSection(id, section.id);
    expect(checklist().sections).toEqual([]);
  });

  it('addSectionFromBlock appends a template section', () => {
    store().addSectionFromBlock(id, 'Authentication');
    const sections = checklist().sections;
    expect(sections).toHaveLength(2);
    expect(sections[1].name).toBe('Authentication');
    expect(sections[1].order).toBe(1);
    const cases = sections[1].subsections.flatMap((s) => s.testCases);
    expect(cases.length).toBeGreaterThan(0);
  });

  it('mutations of one checklist do not touch others', () => {
    const otherId = store().addChecklist('Other');
    store().addSection(otherId, 'Other section');
    store().deleteSection(id, checklist().sections[0].id);
    const other = store().checklists.find((c) => c.id === otherId)!;
    expect(other.sections).toHaveLength(1);
  });
});

describe('importChecklists', () => {
  it('replaces state and persists', () => {
    store().addChecklist('Old');
    const imported = [
      {
        ...store().checklists[0],
        id: 'imported-1',
        name: 'Imported',
      },
    ];
    store().importChecklists(imported);
    expect(store().checklists).toHaveLength(1);
    expect(store().checklists[0].name).toBe('Imported');
    expect(persisted()[0].id).toBe('imported-1');
  });
});
