import type { Checklist, Priority, Severity, TestStatus, TestType } from '../../types/checklist';
import { useChecklistStore } from '../../store/checklistStore';
import { useI18n, t } from '../../i18n';

interface PropertiesPanelProps {
  checklist: Checklist;
}

export function PropertiesPanel({ checklist }: PropertiesPanelProps) {
  const { selectedItemId, updateTestCase } = useChecklistStore();
  const { locale } = useI18n();

  // find the selected test case
  let foundTc = null;
  let foundSectionId = '';
  let foundSubId = '';

  if (selectedItemId) {
    for (const section of checklist.sections) {
      for (const sub of section.subsections) {
        const tc = sub.testCases.find((t) => t.id === selectedItemId);
        if (tc) {
          foundTc = tc;
          foundSectionId = section.id;
          foundSubId = sub.id;
          break;
        }
      }
      if (foundTc) break;
    }
  }

  if (!foundTc) {
    return (
      <aside className="anim-slide-right w-72 border-l border-slate-200 dark:border-white/5 glass flex items-center justify-center">
        <p className="text-sm text-slate-400 dark:text-slate-600 text-center px-4">
          {t('selectTestCase', locale)}
        </p>
      </aside>
    );
  }

  const tc = foundTc;

  const update = (field: string, value: unknown) => {
    updateTestCase(checklist.id, foundSectionId, foundSubId, tc.id, {
      [field]: value,
    });
  };

  const updateList = (field: string, raw: string) => {
    update(
      field,
      raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
  };

  const priorities: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
  const severities: Severity[] = ['Blocker', 'Critical', 'Major', 'Minor', 'Trivial'];
  const statuses: TestStatus[] = ['Not Run', 'Pass', 'Fail', 'Blocked', 'Skipped'];
  const types: TestType[] = ['Functional', 'UI', 'API', 'Integration', 'Smoke', 'Regression'];

  return (
    <aside
      key={tc.id}
      className="anim-slide-right w-72 border-l border-slate-200 dark:border-white/5 glass overflow-y-auto"
    >
      <div className="p-3 border-b border-slate-200 dark:border-white/5 bg-gradient-to-r from-indigo-500/10 to-transparent">
        <h2 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {t('properties', locale)}
        </h2>
      </div>

      <div className="p-3 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('title', locale)}</label>
          <input
            type="text"
            value={tc.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
            placeholder={t('titlePlaceholder', locale)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('description', locale)}</label>
          <textarea
            value={tc.description || ''}
            onChange={(e) => update('description', e.target.value)}
            rows={2}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder={t('descriptionPlaceholder', locale)}
          />
        </div>

        {/* Preconditions */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('preconditions', locale)}</label>
          <textarea
            value={tc.preconditions || ''}
            onChange={(e) => update('preconditions', e.target.value)}
            rows={2}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder={t('preconditionsPlaceholder', locale)}
          />
        </div>

        {/* Steps */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
            {t('steps', locale)} ({tc.steps.length})
          </label>
          {tc.steps.map((step, i) => (
            <div key={i} className="flex gap-1 mb-1">
              <span className="text-xs text-slate-400 dark:text-slate-600 pt-2 w-5 shrink-0">{i + 1}.</span>
              <input
                type="text"
                value={step}
                onChange={(e) => {
                  const newSteps = [...tc.steps];
                  newSteps[i] = e.target.value;
                  update('steps', newSteps);
                }}
                className="flex-1 px-2 py-1 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
              />
              <button
                onClick={() => {
                  const newSteps = tc.steps.filter((_, idx) => idx !== i);
                  update('steps', newSteps);
                }}
                className="px-1 text-slate-400 dark:text-slate-600 hover:text-red-400 text-xs"
              >
                x
              </button>
            </div>
          ))}
          <button
            onClick={() => update('steps', [...tc.steps, ''])}
            className="text-xs text-indigo-400 hover:text-indigo-300 mt-1"
          >
            {t('addStep', locale)}
          </button>
        </div>

        {/* Expected result */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('expectedResult', locale)}</label>
          <textarea
            value={tc.expectedResult}
            onChange={(e) => update('expectedResult', e.target.value)}
            rows={2}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder={t('expectedResultPlaceholder', locale)}
          />
        </div>

        {/* Actual result */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('actualResult', locale)}</label>
          <textarea
            value={tc.actualResult || ''}
            onChange={(e) => update('actualResult', e.target.value)}
            rows={2}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder={t('actualResultPlaceholder', locale)}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('priority', locale)}</label>
          <select
            value={tc.priority}
            onChange={(e) => update('priority', e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('severity', locale)}</label>
          <select
            value={tc.severity || ''}
            onChange={(e) => update('severity', e.target.value || undefined)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
          >
            <option value="">{t('notSet', locale)}</option>
            {severities.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('status', locale)}</label>
          <select
            value={tc.status}
            onChange={(e) => update('status', e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('testType', locale)}</label>
          <select
            value={tc.type}
            onChange={(e) => update('type', e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Bug link */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('bugLink', locale)}</label>
          <input
            type="url"
            value={tc.bugLink || ''}
            onChange={(e) => update('bugLink', e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
            placeholder={t('bugLinkPlaceholder', locale)}
          />
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('platforms', locale)}</label>
          <input
            type="text"
            value={tc.platforms.join(', ')}
            onChange={(e) => updateList('platforms', e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
            placeholder={t('commaSeparated', locale)}
          />
        </div>

        {/* Browsers */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('browsers', locale)}</label>
          <input
            type="text"
            value={tc.browsers.join(', ')}
            onChange={(e) => updateList('browsers', e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
            placeholder={t('commaSeparated', locale)}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('tags', locale)}</label>
          <input
            type="text"
            value={tc.tags.join(', ')}
            onChange={(e) => updateList('tags', e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
            placeholder={t('commaSeparated', locale)}
          />
        </div>

        {/* Estimated time */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('estimatedTime', locale)}</label>
          <input
            type="number"
            min={0}
            value={tc.estimatedTime ?? ''}
            onChange={(e) =>
              update('estimatedTime', e.target.value === '' ? undefined : Number(e.target.value))
            }
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{t('comments', locale)}</label>
          <textarea
            value={tc.comments || ''}
            onChange={(e) => update('comments', e.target.value)}
            rows={2}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/70 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder={t('commentsPlaceholder', locale)}
          />
        </div>
      </div>
    </aside>
  );
}
