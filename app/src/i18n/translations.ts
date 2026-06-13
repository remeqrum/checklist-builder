export type Locale = 'en' | 'ru' | 'sk';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  ru: 'RU',
  sk: 'SK',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  sk: 'Slovenčina',
};

const translations = {
  // ── Header / App ──
  appTitle: {
    en: 'TestChecklist Builder',
    ru: 'TestChecklist Builder',
    sk: 'TestChecklist Builder',
  },

  // ── Dashboard ──
  myChecklists: {
    en: 'My Checklists',
    ru: 'Мои чек-листы',
    sk: 'Moje checklisty',
  },
  createNew: {
    en: 'Create New',
    ru: 'Создать',
    sk: 'Vytvoriť',
  },
  noChecklistsYet: {
    en: 'No checklists yet',
    ru: 'Пока нет чек-листов',
    sk: 'Zatiaľ žiadne checklisty',
  },
  createFirstChecklist: {
    en: 'Create your first checklist to get started',
    ru: 'Создайте первый чек-лист, чтобы начать',
    sk: 'Vytvorte si prvý checklist a začnite',
  },
  checklistNamePrompt: {
    en: 'Checklist name:',
    ru: 'Название чек-листа:',
    sk: 'Názov checklistu:',
  },
  section: {
    en: 'section',
    ru: 'секция',
    sk: 'sekcia',
  },
  sections: {
    en: 'sections',
    ru: 'секций',
    sk: 'sekcií',
  },
  testCases: {
    en: 'test cases',
    ru: 'тест-кейсов',
    sk: 'testovacích prípadov',
  },
  updated: {
    en: 'Updated',
    ru: 'Обновлён',
    sk: 'Aktualizovaný',
  },
  duplicate: {
    en: 'Duplicate',
    ru: 'Дублировать',
    sk: 'Duplikovať',
  },
  delete: {
    en: 'Delete',
    ru: 'Удалить',
    sk: 'Vymazať',
  },
  open: {
    en: 'Open',
    ru: 'Открыть',
    sk: 'Otvoriť',
  },
  deleteConfirm: {
    en: 'Delete',
    ru: 'Удалить',
    sk: 'Vymazať',
  },

  // ── Builder toolbar ──
  backToDashboard: {
    en: 'Back to Dashboard',
    ru: 'Назад к списку',
    sk: 'Späť na zoznam',
  },
  exportXlsx: {
    en: 'Export .xlsx',
    ru: 'Экспорт .xlsx',
    sk: 'Export .xlsx',
  },
  exportToExcel: {
    en: 'Export to Excel',
    ru: 'Экспорт в Excel',
    sk: 'Export do Excelu',
  },
  autoSaved: {
    en: 'Auto-saved',
    ru: 'Сохранено',
    sk: 'Uložené',
  },

  // ── Sidebar ──
  actions: {
    en: 'Actions',
    ru: 'Действия',
    sk: 'Akcie',
  },
  addSection: {
    en: 'Add Section',
    ru: 'Добавить секцию',
    sk: 'Pridať sekciu',
  },
  sectionNamePrompt: {
    en: 'Section name:',
    ru: 'Название секции:',
    sk: 'Názov sekcie:',
  },
  blocksLibrary: {
    en: 'Blocks Library',
    ru: 'Библиотека блоков',
    sk: 'Knižnica blokov',
  },
  addBlockHint: {
    en: 'Click a block to add it as a section',
    ru: 'Нажмите на блок, чтобы добавить его как секцию',
    sk: 'Kliknite na blok pre pridanie ako sekciu',
  },
  addBlockTooltip: {
    en: 'Add {name} block ({count} cases)',
    ru: 'Добавить блок {name} ({count} кейсов)',
    sk: 'Pridať blok {name} ({count} prípadov)',
  },

  // ── Center panel ──
  noSectionsYet: {
    en: 'No sections yet',
    ru: 'Пока нет секций',
    sk: 'Zatiaľ žiadne sekcie',
  },
  useSidebarHint: {
    en: 'Use the sidebar to add a section',
    ru: 'Используйте панель слева, чтобы добавить секцию',
    sk: 'Použite bočný panel na pridanie sekcie',
  },
  subsectionNamePrompt: {
    en: 'Subsection name:',
    ru: 'Название подсекции:',
    sk: 'Názov podsekcie:',
  },
  addSubsection: {
    en: 'Add subsection',
    ru: 'Добавить подсекцию',
    sk: 'Pridať podsekciu',
  },
  deleteSection: {
    en: 'Delete section',
    ru: 'Удалить секцию',
    sk: 'Vymazať sekciu',
  },
  deleteSectionConfirm: {
    en: 'Delete section "{name}"?',
    ru: 'Удалить секцию "{name}"?',
    sk: 'Vymazať sekciu "{name}"?',
  },
  noSubsections: {
    en: 'No subsections',
    ru: 'Нет подсекций',
    sk: 'Žiadne podsekcie',
  },
  case: {
    en: 'case',
    ru: 'кейс',
    sk: 'prípad',
  },
  cases: {
    en: 'cases',
    ru: 'кейсов',
    sk: 'prípadov',
  },
  addTestCase: {
    en: 'Add test case',
    ru: 'Добавить тест-кейс',
    sk: 'Pridať testovací prípad',
  },
  newTestCase: {
    en: 'New test case',
    ru: 'Новый тест-кейс',
    sk: 'Nový testovací prípad',
  },
  deleteSubsection: {
    en: 'Delete subsection',
    ru: 'Удалить подсекцию',
    sk: 'Vymazať podsekciu',
  },
  deleteSubsectionConfirm: {
    en: 'Delete subsection "{name}"?',
    ru: 'Удалить подсекцию "{name}"?',
    sk: 'Vymazať podsekciu "{name}"?',
  },
  untitled: {
    en: 'Untitled',
    ru: 'Без названия',
    sk: 'Bez názvu',
  },
  deleteTestCase: {
    en: 'Delete test case',
    ru: 'Удалить тест-кейс',
    sk: 'Vymazať testovací prípad',
  },
  deleteTestCaseConfirm: {
    en: 'Delete test case "{name}"?',
    ru: 'Удалить тест-кейс "{name}"?',
    sk: 'Vymazať testovací prípad "{name}"?',
  },
  clickToRename: {
    en: 'Click to rename',
    ru: 'Нажмите, чтобы переименовать',
    sk: 'Kliknite pre premenovanie',
  },
  dblClickToRename: {
    en: 'Double-click to rename',
    ru: 'Двойной клик — переименовать',
    sk: 'Dvojklik pre premenovanie',
  },

  // ── Properties panel ──
  properties: {
    en: 'Properties',
    ru: 'Свойства',
    sk: 'Vlastnosti',
  },
  selectTestCase: {
    en: 'Select a test case to edit its properties',
    ru: 'Выберите тест-кейс для редактирования',
    sk: 'Vyberte testovací prípad na úpravu',
  },
  title: {
    en: 'Title',
    ru: 'Название',
    sk: 'Názov',
  },
  titlePlaceholder: {
    en: 'Test case title',
    ru: 'Название тест-кейса',
    sk: 'Názov testovacieho prípadu',
  },
  description: {
    en: 'Description',
    ru: 'Описание',
    sk: 'Popis',
  },
  descriptionPlaceholder: {
    en: 'Optional description',
    ru: 'Описание (необязательно)',
    sk: 'Voliteľný popis',
  },
  preconditions: {
    en: 'Preconditions',
    ru: 'Предусловия',
    sk: 'Predpoklady',
  },
  preconditionsPlaceholder: {
    en: 'What should be done before',
    ru: 'Что нужно сделать заранее',
    sk: 'Čo treba urobiť pred testom',
  },
  steps: {
    en: 'Steps',
    ru: 'Шаги',
    sk: 'Kroky',
  },
  addStep: {
    en: '+ Add step',
    ru: '+ Добавить шаг',
    sk: '+ Pridať krok',
  },
  expectedResult: {
    en: 'Expected Result',
    ru: 'Ожидаемый результат',
    sk: 'Očakávaný výsledok',
  },
  expectedResultPlaceholder: {
    en: 'What should happen',
    ru: 'Что должно произойти',
    sk: 'Čo by sa malo stať',
  },
  priority: {
    en: 'Priority',
    ru: 'Приоритет',
    sk: 'Priorita',
  },
  severity: {
    en: 'Severity',
    ru: 'Серьёзность',
    sk: 'Závažnosť',
  },
  status: {
    en: 'Status',
    ru: 'Статус',
    sk: 'Stav',
  },
  testType: {
    en: 'Test Type',
    ru: 'Тип теста',
    sk: 'Typ testu',
  },
  bugLink: {
    en: 'Bug Link',
    ru: 'Ссылка на баг',
    sk: 'Odkaz na bug',
  },
  bugLinkPlaceholder: {
    en: 'https://jira.example.com/...',
    ru: 'https://jira.example.com/...',
    sk: 'https://jira.example.com/...',
  },
  comments: {
    en: 'Comments',
    ru: 'Комментарии',
    sk: 'Komentáre',
  },
  commentsPlaceholder: {
    en: 'Notes',
    ru: 'Заметки',
    sk: 'Poznámky',
  },
  notSet: {
    en: 'Not set',
    ru: 'Не указано',
    sk: 'Nenastavené',
  },

  // ── Default entity names (stored at creation time) ──
  newSection: {
    en: 'New Section',
    ru: 'Новая секция',
    sk: 'Nová sekcia',
  },
  newSubsection: {
    en: 'New Subsection',
    ru: 'Новая подсекция',
    sk: 'Nová podsekcia',
  },
  defaultSubsection: {
    en: 'Default',
    ru: 'Основная',
    sk: 'Základná',
  },
  untitledChecklist: {
    en: 'Untitled Checklist',
    ru: 'Чек-лист без названия',
    sk: 'Checklist bez názvu',
  },
  copySuffix: {
    en: '(copy)',
    ru: '(копия)',
    sk: '(kópia)',
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale, params?: Record<string, string | number>): string {
  const value = translations[key]?.[locale] ?? translations[key]?.en ?? key;
  if (!params) return value;
  return Object.entries(params).reduce<string>(
    (str, [k, v]) => str.replace(`{${k}}`, String(v)),
    value
  );
}
