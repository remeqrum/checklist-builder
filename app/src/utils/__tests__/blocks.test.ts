import { describe, expect, it } from 'vitest';
import { blockToSection, getAvailableBlocks, getBlockNames } from '../blocks';

describe('getAvailableBlocks', () => {
  it('returns all five templates with 40 cases in total', () => {
    const blocks = getAvailableBlocks();
    expect(blocks).toHaveLength(5);
    const total = blocks.reduce((sum, b) => sum + b.caseCount, 0);
    expect(total).toBe(40);
  });
});

describe('blockToSection', () => {
  it('builds a full section from a template', () => {
    const section = blockToSection('Authentication');
    expect(section).not.toBeNull();
    expect(section!.name).toBe('Authentication');
    expect(section!.subsections.length).toBeGreaterThan(0);

    const firstCase = section!.subsections[0].testCases[0];
    expect(firstCase.id).toBeTruthy();
    expect(firstCase.title).toBeTruthy();
    expect(firstCase.steps.length).toBeGreaterThan(0);
    expect(firstCase.expectedResult).toBeTruthy();
  });

  it('generates fresh ids on each call', () => {
    const a = blockToSection('Authentication')!;
    const b = blockToSection('Authentication')!;
    expect(a.id).not.toBe(b.id);
    expect(a.subsections[0].id).not.toBe(b.subsections[0].id);
  });

  it('returns null for an unknown block', () => {
    expect(blockToSection('No Such Block')).toBeNull();
  });
});

describe('getBlockNames', () => {
  it('matches available blocks', () => {
    expect(getBlockNames()).toEqual(getAvailableBlocks().map((b) => b.name));
  });
});
