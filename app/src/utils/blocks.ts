import type { Section } from '../types/checklist';
import { createSection, createSubsection, createTestCase } from './factories';

import authBlock from '../data/blocks/authentication.json';
import formsBlock from '../data/blocks/forms.json';
import apiBlock from '../data/blocks/api.json';
import securityBlock from '../data/blocks/security.json';
import searchBlock from '../data/blocks/search.json';

interface BlockTemplate {
  name: string;
  subsections: {
    name: string;
    testCases: {
      title: string;
      steps: string[];
      expectedResult: string;
      priority: string;
      type: string;
    }[];
  }[];
}

const blocks: BlockTemplate[] = [
  authBlock,
  formsBlock,
  apiBlock,
  securityBlock,
  searchBlock,
];

export function getAvailableBlocks(): { name: string; caseCount: number }[] {
  return blocks.map((b) => ({
    name: b.name,
    caseCount: b.subsections.reduce((sum, sub) => sum + sub.testCases.length, 0),
  }));
}

export function blockToSection(blockName: string): Section | null {
  const block = blocks.find((b) => b.name === blockName);
  if (!block) return null;

  return createSection({
    name: block.name,
    subsections: block.subsections.map((sub, i) =>
      createSubsection({
        name: sub.name,
        order: i,
        testCases: sub.testCases.map((tc) =>
          createTestCase({
            title: tc.title,
            steps: tc.steps,
            expectedResult: tc.expectedResult,
            priority: tc.priority as 'Critical' | 'High' | 'Medium' | 'Low',
            type: tc.type as 'Functional' | 'UI' | 'API' | 'Integration' | 'Smoke' | 'Regression',
          })
        ),
      })
    ),
  });
}

export function getBlockNames(): string[] {
  return blocks.map((b) => b.name);
}
