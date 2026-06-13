# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TestChecklist Builder — a client-only web tool for QA engineers to create test checklists and export them to Excel. React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Zustand. No backend; all data lives in localStorage. Deployed on Vercel.

## Commands

All commands run from the `app/` directory (the repo root has no package.json):

```bash
cd app
npm install
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # tsc -b && vite build — type errors fail the build
npm run lint       # ESLint (flat config: typescript-eslint + react-hooks + react-refresh)
npm run preview    # preview the production build
npm test           # Vitest unit tests (src/**/*.test.ts, jsdom environment)
npm run test:watch # Vitest in watch mode
npm run test:e2e   # Playwright smoke tests in e2e/ (starts the dev server itself)
```

Run a single unit test file with `npx vitest run src/utils/__tests__/storage.test.ts`, a single e2e test with `npx playwright test -g "test name"`.

Unit-test gotcha: Node ≥ 22 ships an experimental global `localStorage` stub that shadows jsdom's implementation, so `src/test/setup.ts` replaces it with an in-memory `Storage` — don't remove that setup file. CI (`.github/workflows/ci.yml` at the repo root) runs lint, build, unit and e2e on every push.

## Architecture

### Routing

Two routes via react-router: `/` (Dashboard) and `/checklist/:id` (Builder); unknown paths and unknown checklist ids redirect to `/`. The store loads checklists from localStorage synchronously at creation time, so route components can rely on data being present on the first render — don't reintroduce async loading there. `app/vercel.json` contains the SPA rewrite that keeps deep links working in production.

### Data model: fixed 3-level hierarchy

`Checklist → Section[] → Subsection[] → TestCase[]` — defined in `app/src/types/checklist.ts`. Because the nesting is fixed, every store mutation takes the full ID path (e.g. `updateTestCase(checklistId, sectionId, subsectionId, testCaseId, updates)`).

New entities must be created via the factories in `app/src/utils/factories.ts` (uuid + defaults), not object literals. Note `createSection()` automatically includes one "Default" subsection.

### Single Zustand store with write-through persistence

`app/src/store/checklistStore.ts` holds all checklists plus UI selection state (`selectedItemId`). Every mutation goes through the `updateAndSave()` helper, which immutably maps the checklist tree, bumps `updatedAt`, and synchronously persists the entire array to localStorage (`tcb_checklists` key, via `utils/storage.ts`). There is no explicit save action — any new mutation must follow the same pattern or data will be lost on reload.

Selection (`selectedItemId`) is a bare test-case ID with no path; `PropertiesPanel` resolves it by searching the whole tree.

### Block templates are a static registry

Templates live as JSON in `app/src/data/blocks/*.json` and are statically imported into the `blocks` array in `app/src/utils/blocks.ts`. Adding a template requires: new JSON file (shape: `{ name, subsections: [{ name, testCases: [{ title, steps, expectedResult, priority, type }] }] }`) + import + array entry. `blockToSection()` converts a template into real entities through the factories.

### i18n is hand-rolled — every UI string needs EN, RU, and SK

No i18n library. `app/src/i18n/translations.ts` is a flat object where each key maps to `{ en, ru, sk }` strings; `t(key, locale, params?)` supports `{param}` interpolation and falls back to English, then to the key itself. The current locale lives in a separate Zustand store (`useI18n`), persisted under the `tcb-locale` localStorage key, auto-detected from the browser language (Czech maps to Slovak). Components use `const { locale } = useI18n()` and `t('key', locale)`. When adding UI text, add all three translations.

### Excel export

`app/src/utils/excelExport.ts` (ExcelJS + file-saver) builds a workbook with a Summary sheet plus one sheet per section, with color-coded priority/status cells, frozen headers, autofilters, and dropdown data validation. Column set is defined in `TEST_COLUMNS`.

### Styling and theming

Tailwind CSS v4 via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js` and none should be added. `src/index.css` holds the `@import "tailwindcss"` plus a class-based dark variant (`@custom-variant dark (&:where(.dark, .dark *))`), keyframes/`anim-*` animation utilities, and the theme-aware `.glass`/`.app-shell` surface helpers.

Light is the base; dark is layered with `dark:` and gated by a `.dark` class on `<html>`. Components are written `light-value dark:dark-value` (e.g. `text-slate-800 dark:text-slate-200`); the page/panel backgrounds come from `.glass`/`.app-shell` so most surfaces need no per-element theme classes. The current theme lives in a small Zustand store (`src/theme/useTheme.ts`, persisted under `tcb-theme`, default dark) which toggles the `.dark` class; `ThemeToggle` flips it. When adding UI, pair every hardcoded slate/white color with its `dark:` counterpart, and keep animations behind the `prefers-reduced-motion` block in `index.css`.
