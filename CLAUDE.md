# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TestChecklist Builder — a client-only web tool for QA engineers to create test checklists and export them to Excel. React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Zustand. No backend; all data lives in localStorage. Deployed on Vercel.

## Commands

All commands run from the `app/` directory (the repo root has no package.json):

```bash
cd app
npm install
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # tsc -b && vite build — type errors fail the build
npm run lint     # ESLint (flat config: typescript-eslint + react-hooks + react-refresh)
npm run preview  # preview the production build
```

There is no test framework installed and no tests.

## Architecture

### Navigation is state-based, not URL-based

There is no router in use (`react-router-dom` is in package.json but unused). `App.tsx` renders `Builder` when `activeChecklistId` is set in the store, otherwise `Dashboard`. "Navigation" means calling `setActiveChecklist(id | null)`.

### Data model: fixed 3-level hierarchy

`Checklist → Section[] → Subsection[] → TestCase[]` — defined in `app/src/types/checklist.ts`. Because the nesting is fixed, every store mutation takes the full ID path (e.g. `updateTestCase(checklistId, sectionId, subsectionId, testCaseId, updates)`).

New entities must be created via the factories in `app/src/utils/factories.ts` (uuid + defaults), not object literals. Note `createSection()` automatically includes one "Default" subsection.

### Single Zustand store with write-through persistence

`app/src/store/checklistStore.ts` holds all checklists plus UI state (`activeChecklistId`, `selectedItemId`). Every mutation goes through the `updateAndSave()` helper, which immutably maps the checklist tree, bumps `updatedAt`, and synchronously persists the entire array to localStorage (`tcb_checklists` key, via `utils/storage.ts`). There is no explicit save action — any new mutation must follow the same pattern or data will be lost on reload.

Selection (`selectedItemId`) is a bare test-case ID with no path; `PropertiesPanel` resolves it by searching the whole tree.

### Block templates are a static registry

Templates live as JSON in `app/src/data/blocks/*.json` and are statically imported into the `blocks` array in `app/src/utils/blocks.ts`. Adding a template requires: new JSON file (shape: `{ name, subsections: [{ name, testCases: [{ title, steps, expectedResult, priority, type }] }] }`) + import + array entry. `blockToSection()` converts a template into real entities through the factories.

### i18n is hand-rolled — every UI string needs EN, RU, and SK

No i18n library. `app/src/i18n/translations.ts` is a flat object where each key maps to `{ en, ru, sk }` strings; `t(key, locale, params?)` supports `{param}` interpolation and falls back to English, then to the key itself. The current locale lives in a separate Zustand store (`useI18n`), persisted under the `tcb-locale` localStorage key, auto-detected from the browser language (Czech maps to Slovak). Components use `const { locale } = useI18n()` and `t('key', locale)`. When adding UI text, add all three translations.

### Excel export

`app/src/utils/excelExport.ts` (ExcelJS + file-saver) builds a workbook with a Summary sheet plus one sheet per section, with color-coded priority/status cells, frozen headers, autofilters, and dropdown data validation. Column set is defined in `TEST_COLUMNS`.

### Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js` and none should be added; `src/index.css` is just `@import "tailwindcss"`. The app uses a dark slate theme with inline utility classes throughout.
