# TestChecklist Builder

[![CI](https://github.com/remeqrum/checklist-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/remeqrum/checklist-builder/actions/workflows/ci.yml)

> 🤖 **AI-Assisted Development** — This project was built using **vibe coding** methodology with AI pair-programming (Claude Code). The architecture, specifications, code generation and debugging were done collaboratively with AI tools, demonstrating the ability to effectively use AI as a development partner.

🌐 **[Live Demo](https://app-three-rosy-32.vercel.app)**

A web tool for QA engineers to create, manage, and export test checklists to Excel. Features a three-panel builder interface, block templates library, and multi-language support (EN/RU/SK).

## ✨ Features

- **Dashboard** — create, duplicate, delete checklists
- **Three-Panel Builder** — sidebar, hierarchical tree, properties editor
- **Test Case Fields** — title, description, steps, expected result, priority, severity, status, type, bug link, comments
- **Excel Export** — formatted `.xlsx` with color-coded priorities, frozen headers, autofilters, data validation
- **Block Templates** — 5 ready-made templates (Authentication, Forms, API, Security, Search) with 40 test cases
- **Multi-language UI** — English, Russian, Slovak with auto-detection
- **Auto-save** — all data persisted in localStorage
- **Backup** — export/import all checklists as JSON
- **Tested** — Vitest unit suite + Playwright e2e smoke, running in GitHub Actions CI

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Routing | React Router |
| Export | ExcelJS + FileSaver |
| Icons | Lucide React |
| Tests | Vitest + Playwright |
| CI | GitHub Actions |
| Deploy | Vercel |

## 🚀 Quick Start

```bash
git clone https://github.com/remeqrum/checklist-builder.git
cd checklist-builder/app
npm install
npm run dev
```

Dev server will start at http://localhost:5173

```bash
npm test          # unit tests (Vitest)
npm run test:e2e  # e2e smoke tests (Playwright)
```

## 📁 Project Structure

```
app/src/
├── components/
│   ├── builder/      # Builder UI (Sidebar, CenterPanel, PropertiesPanel)
│   ├── dashboard/    # Dashboard (checklist list)
│   └── shared/       # LangSwitcher
├── data/blocks/      # Block templates (JSON)
├── i18n/             # Translations (EN/RU/SK)
├── store/            # Zustand store
├── types/            # TypeScript interfaces
└── utils/            # Export, storage, factories
```

---

# TestChecklist Builder (RU)

> 🤖 **AI-Assisted Development** — Проект создан с использованием методологии **vibe coding** с AI парным программированием (Claude Code). Архитектура, спецификации, генерация кода и отладка выполнялись совместно с AI-инструментами, демонстрируя навык эффективной работы с AI как партнёром в разработке.

🌐 **[Демо](https://app-three-rosy-32.vercel.app)**

Веб-инструмент для QA-инженеров: создание, управление и экспорт тестовых чек-листов в Excel. Трёхпанельный билдер, библиотека готовых шаблонов, поддержка трёх языков (EN/RU/SK).

## ✨ Возможности

- **Дашборд** — создание, дублирование, удаление чек-листов
- **Трёхпанельный билдер** — сайдбар, иерархическое дерево, редактор свойств
- **Поля тест-кейса** — название, описание, шаги, ожидаемый результат, приоритет, серьёзность, статус, тип, ссылка на баг, комментарии
- **Excel-экспорт** — форматированный `.xlsx` с цветовой кодировкой, замороженными заголовками, автофильтрами
- **Библиотека блоков** — 5 шаблонов (Аутентификация, Формы, API, Безопасность, Поиск) с 40 тест-кейсами
- **Мультиязычность** — английский, русский, словацкий с автоопределением
- **Автосохранение** — все данные в localStorage
- **Бэкап** — экспорт/импорт всех чек-листов в JSON
- **Тесты** — юнит-тесты Vitest + e2e-смоук Playwright в GitHub Actions CI

## 🚀 Быстрый старт

```bash
git clone https://github.com/remeqrum/checklist-builder.git
cd checklist-builder/app
npm install
npm run dev
```

Дев-сервер запустится на http://localhost:5173

---

# TestChecklist Builder (SK)

> 🤖 **AI-Assisted Development** — Projekt bol vytvorený pomocou metodológie **vibe coding** s AI párovým programovaním (Claude Code). Architektúra, špecifikácie, generovanie kódu a ladenie boli realizované v spolupráci s AI nástrojmi, čo demonštruje schopnosť efektívne využívať AI ako vývojového partnera.

🌐 **[Demo](https://app-three-rosy-32.vercel.app)**

Webový nástroj pre QA inžinierov na vytváranie, správu a export testovacích checklistov do Excelu. Trojpanelový builder, knižnica šablón a viacjazyčná podpora (EN/RU/SK).

## ✨ Funkcie

- **Dashboard** — vytváranie, duplikovanie, mazanie checklistov
- **Trojpanelový builder** — bočný panel, hierarchický strom, editor vlastností
- **Polia testovacieho prípadu** — názov, popis, kroky, očakávaný výsledok, priorita, závažnosť, stav, typ, odkaz na bug, komentáre
- **Excel export** — formátovaný `.xlsx` s farebnými prioritami, zamrznutými hlavičkami, autofiltrami
- **Knižnica blokov** — 5 šablón (Autentifikácia, Formuláre, API, Bezpečnosť, Vyhľadávanie) so 40 testovacími prípadmi
- **Viacjazyčné UI** — angličtina, ruština, slovenčina s automatickou detekciou
- **Automatické ukladanie** — všetky dáta v localStorage
- **Záloha** — export/import všetkých checklistov do JSON
- **Testy** — unit testy Vitest + e2e smoke Playwright v GitHub Actions CI

## 🚀 Rýchly štart

```bash
git clone https://github.com/remeqrum/checklist-builder.git
cd checklist-builder/app
npm install
npm run dev
```

Dev server sa spustí na http://localhost:5173

---

## 📝 License

MIT
