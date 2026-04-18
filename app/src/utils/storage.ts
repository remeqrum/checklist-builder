import type { Checklist } from '../types/checklist';

const STORAGE_KEY = 'tcb_checklists';

export function loadChecklists(): Checklist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Checklist[];
  } catch (err) {
    console.error('Failed to load checklists from localStorage', err);
    return [];
  }
}

export function saveChecklists(checklists: Checklist[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checklists));
  } catch (err) {
    console.error('Failed to save checklists to localStorage', err);
  }
}

export function exportBackup(checklists: Checklist[]): void {
  const blob = new Blob([JSON.stringify(checklists, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tcb-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(file: File): Promise<Checklist[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (Array.isArray(data)) {
          resolve(data as Checklist[]);
        } else {
          reject(new Error('Invalid backup format'));
        }
      } catch {
        reject(new Error('Failed to parse backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
