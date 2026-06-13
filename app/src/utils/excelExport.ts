import type ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { Checklist, TestCase } from '../types/checklist';

const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'FFE74C3C',
  High: 'FFF39C12',
  Medium: 'FFF1C40F',
  Low: 'FF95A5A6',
};

const STATUS_COLORS: Record<string, string> = {
  Pass: 'FF27AE60',
  Fail: 'FFE74C3C',
  Blocked: 'FFF39C12',
  Skipped: 'FF95A5A6',
  'Not Run': 'FFBDC3C7',
};

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF2C3E50' },
};

const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: 'FFFFFFFF' },
  size: 11,
};

const BORDER_THIN: Partial<ExcelJS.Border> = {
  style: 'thin',
  color: { argb: 'FFD5D8DC' },
};

const BORDERS: Partial<ExcelJS.Borders> = {
  top: BORDER_THIN,
  left: BORDER_THIN,
  bottom: BORDER_THIN,
  right: BORDER_THIN,
};

// columns that go into each section sheet
const TEST_COLUMNS: { header: string; key: keyof TestCase | 'index'; width: number }[] = [
  { header: 'ID', key: 'index', width: 10 },
  { header: 'Title', key: 'title', width: 35 },
  { header: 'Description', key: 'description', width: 30 },
  { header: 'Preconditions', key: 'preconditions', width: 25 },
  { header: 'Steps', key: 'steps', width: 35 },
  { header: 'Expected Result', key: 'expectedResult', width: 30 },
  { header: 'Actual Result', key: 'actualResult', width: 30 },
  { header: 'Priority', key: 'priority', width: 12 },
  { header: 'Severity', key: 'severity', width: 12 },
  { header: 'Type', key: 'type', width: 14 },
  { header: 'Status', key: 'status', width: 12 },
  { header: 'Platforms', key: 'platforms', width: 18 },
  { header: 'Browsers', key: 'browsers', width: 18 },
  { header: 'Tags', key: 'tags', width: 18 },
  { header: 'Bug Link', key: 'bugLink', width: 25 },
  { header: 'Est. Time (min)', key: 'estimatedTime', width: 14 },
  { header: 'Comments', key: 'comments', width: 25 },
];

// keep letters in any script (Cyrillic, Slovak diacritics, …), drop only unsafe chars
export function sanitizeFileName(name: string): string {
  return name.replace(/[^\p{L}\p{N}\-_ ]/gu, '').trim() || 'checklist';
}

// Prevent spreadsheet formula injection: Excel/LibreOffice interpret a cell
// whose text starts with = + - @ (or a control char) as a formula. Prefix such
// values with a quote so they are always rendered as literal text.
export function safeCell(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function addSummarySheet(wb: ExcelJS.Workbook, checklist: Checklist) {
  const ws = wb.addWorksheet('Summary');

  const totalCases = checklist.sections.reduce(
    (sum, s) => sum + s.subsections.reduce((ss, sub) => ss + sub.testCases.length, 0),
    0
  );

  const allCases = checklist.sections.flatMap((s) =>
    s.subsections.flatMap((sub) => sub.testCases)
  );

  const statusCounts = allCases.reduce(
    (acc, tc) => {
      acc[tc.status] = (acc[tc.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const rows = [
    ['Project', safeCell(checklist.name)],
    ['Description', safeCell(checklist.description || '')],
    ['Author', safeCell(checklist.author)],
    ['Created', checklist.createdAt],
    ['Updated', checklist.updatedAt],
    ['Version', checklist.version],
    [''],
    ['Statistics'],
    ['Total Sections', checklist.sections.length],
    ['Total Test Cases', totalCases],
    [''],
    ['Status Breakdown'],
    ...Object.entries(statusCounts).map(([status, count]) => [status, count]),
  ];

  rows.forEach((row) => ws.addRow(row));

  // style the labels
  ws.getColumn(1).width = 20;
  ws.getColumn(2).width = 40;
  ws.getColumn(1).font = { bold: true };
}

function addSectionSheet(
  wb: ExcelJS.Workbook,
  sectionName: string,
  testCases: { tc: TestCase; subsectionName: string; idx: number }[]
) {
  // excel sheet names max 31 chars, no special chars
  const safeName = sectionName.replace(/[\\/*?[\]:]/g, '').slice(0, 31);
  const ws = wb.addWorksheet(safeName);

  // set columns
  ws.columns = TEST_COLUMNS.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width,
  }));

  // style header row
  const headerRow = ws.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.border = BORDERS;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // freeze header row
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  // add data rows
  testCases.forEach(({ tc, idx }) => {
    const row = ws.addRow({
      index: `TC-${String(idx).padStart(3, '0')}`,
      title: safeCell(tc.title),
      description: safeCell(tc.description || ''),
      preconditions: safeCell(tc.preconditions || ''),
      steps: safeCell(tc.steps.join('\n')),
      expectedResult: safeCell(tc.expectedResult),
      actualResult: safeCell(tc.actualResult || ''),
      priority: tc.priority,
      severity: tc.severity || '',
      type: tc.type,
      status: tc.status,
      platforms: safeCell(tc.platforms.join(', ')),
      browsers: safeCell(tc.browsers.join(', ')),
      tags: safeCell(tc.tags.join(', ')),
      bugLink: safeCell(tc.bugLink || ''),
      estimatedTime: tc.estimatedTime || '',
      comments: safeCell(tc.comments || ''),
    });

    row.eachCell((cell) => {
      cell.border = BORDERS;
      cell.alignment = { vertical: 'top', wrapText: true };
    });

    // priority color
    const priorityCell = row.getCell('priority');
    const pColor = PRIORITY_COLORS[tc.priority];
    if (pColor) {
      priorityCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: pColor },
      };
      priorityCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    }

    // status color
    const statusCell = row.getCell('status');
    const sColor = STATUS_COLORS[tc.status];
    if (sColor) {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: sColor },
      };
      statusCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    }
  });

  // autofilter on header row
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: TEST_COLUMNS.length },
  };

  // data validation for priority and status dropdowns
  const dataRowCount = testCases.length;
  if (dataRowCount > 0) {
    const priorityCol = TEST_COLUMNS.findIndex((c) => c.key === 'priority') + 1;
    const statusCol = TEST_COLUMNS.findIndex((c) => c.key === 'status') + 1;

    for (let r = 2; r <= dataRowCount + 1; r++) {
      ws.getCell(r, priorityCol).dataValidation = {
        type: 'list',
        formulae: ['"Critical,High,Medium,Low"'],
      };
      ws.getCell(r, statusCol).dataValidation = {
        type: 'list',
        formulae: ['"Not Run,Pass,Fail,Blocked,Skipped"'],
      };
    }
  }
}

export async function exportToExcel(checklist: Checklist) {
  // load the heavy ExcelJS bundle only when the user actually exports
  const { default: ExcelJSRuntime } = await import('exceljs');
  const wb = new ExcelJSRuntime.Workbook();
  wb.creator = checklist.author || 'TestChecklist Builder';
  wb.created = new Date();

  // summary sheet
  addSummarySheet(wb, checklist);

  // one sheet per section
  let globalIdx = 1;
  for (const section of checklist.sections) {
    const cases: { tc: TestCase; subsectionName: string; idx: number }[] = [];
    for (const sub of section.subsections) {
      for (const tc of sub.testCases) {
        cases.push({ tc, subsectionName: sub.name, idx: globalIdx++ });
      }
    }
    if (cases.length > 0) {
      addSectionSheet(wb, section.name, cases);
    }
  }

  // if no sections with cases, add an empty "Tests" sheet
  if (checklist.sections.every((s) => s.subsections.every((sub) => sub.testCases.length === 0))) {
    const ws = wb.addWorksheet('Tests');
    ws.addRow(['No test cases in this checklist']);
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const fileName = `${sanitizeFileName(checklist.name)}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(blob, fileName);
}
