import { beforeEach, describe, expect, it } from 'vitest';
import { importBackup, loadChecklists, saveChecklists } from '../storage';
import { createChecklist } from '../factories';

beforeEach(() => {
  localStorage.clear();
});

describe('save/load roundtrip', () => {
  it('persists and restores checklists', () => {
    const cl = createChecklist({ name: 'Roundtrip' });
    saveChecklists([cl]);
    const loaded = loadChecklists();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]).toEqual(cl);
  });

  it('returns empty array when storage is empty', () => {
    expect(loadChecklists()).toEqual([]);
  });

  it('returns empty array for corrupt JSON', () => {
    localStorage.setItem('tcb_checklists', '{not valid json');
    expect(loadChecklists()).toEqual([]);
  });
});

describe('importBackup', () => {
  const fileOf = (content: string) =>
    new File([content], 'backup.json', { type: 'application/json' });

  it('resolves for a valid backup', async () => {
    const cl = createChecklist({ name: 'From backup' });
    const imported = await importBackup(fileOf(JSON.stringify([cl])));
    expect(imported).toHaveLength(1);
    expect(imported[0].name).toBe('From backup');
  });

  it('rejects when the payload is not an array', async () => {
    await expect(importBackup(fileOf('{"name":"x"}'))).rejects.toThrow();
  });

  it('rejects when items are missing required fields', async () => {
    await expect(importBackup(fileOf('[{"name":"no id"}]'))).rejects.toThrow();
  });

  it('rejects on broken JSON', async () => {
    await expect(importBackup(fileOf('not json at all'))).rejects.toThrow();
  });
});
