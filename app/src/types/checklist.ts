export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Severity = 'Blocker' | 'Critical' | 'Major' | 'Minor' | 'Trivial';
export type TestType = 'Functional' | 'UI' | 'API' | 'Integration' | 'Smoke' | 'Regression';
export type TestStatus = 'Not Run' | 'Pass' | 'Fail' | 'Blocked' | 'Skipped';
// only xlsx is implemented; JSON is covered by the dashboard backup feature
export type ExportFormat = 'xlsx';

export interface TestCase {
  id: string;
  title: string;
  description?: string;
  preconditions?: string;
  steps: string[];
  expectedResult: string;
  actualResult?: string;
  priority: Priority;
  severity?: Severity;
  type: TestType;
  platforms: string[];
  browsers: string[];
  status: TestStatus;
  tags: string[];
  bugLink?: string;
  estimatedTime?: number;
  comments?: string;
}

export interface Subsection {
  id: string;
  name: string;
  order: number;
  testCases: TestCase[];
}

export interface Section {
  id: string;
  name: string;
  order: number;
  subsections: Subsection[];
}

export interface ChecklistSettings {
  visibleFields: (keyof TestCase)[];
  defaultPriority: Priority;
  defaultStatus: TestStatus;
  exportFormat: ExportFormat;
}

export interface Checklist {
  id: string;
  name: string;
  description?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  sections: Section[];
  settings: ChecklistSettings;
  tags: string[];
}
