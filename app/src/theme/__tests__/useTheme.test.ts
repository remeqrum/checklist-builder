import { beforeEach, describe, expect, it } from 'vitest';
import { useTheme } from '../useTheme';

beforeEach(() => {
  localStorage.clear();
  useTheme.getState().setTheme('dark');
});

describe('useTheme', () => {
  it('adds the dark class to <html> for the dark theme', () => {
    useTheme.getState().setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes the dark class and persists when switching to light', () => {
    useTheme.getState().setTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('tcb-theme')).toBe('light');
  });

  it('toggles back and forth', () => {
    useTheme.getState().setTheme('dark');
    useTheme.getState().toggleTheme();
    expect(useTheme.getState().theme).toBe('light');
    useTheme.getState().toggleTheme();
    expect(useTheme.getState().theme).toBe('dark');
  });
});
