import { useChecklistStore } from '../../store/checklistStore';
import { Plus, Copy, Trash2, ChevronRight } from 'lucide-react';
import { LangSwitcher } from '../shared/LangSwitcher';
import { useI18n, t } from '../../i18n';

export function Dashboard() {
  const { checklists, addChecklist, duplicateChecklist, deleteChecklist, setActiveChecklist } =
    useChecklistStore();
  const { locale } = useI18n();

  const handleCreate = () => {
    const name = prompt(t('checklistNamePrompt', locale));
    if (name?.trim()) {
      addChecklist(name.trim());
    }
  };

  const pluralSections = (count: number) => {
    if (count === 1) return t('section', locale);
    return t('sections', locale);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">{t('appTitle', locale)}</h1>
          <LangSwitcher />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-white">{t('myChecklists', locale)}</h2>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            {t('createNew', locale)}
          </button>
        </div>

        {checklists.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg mb-2">{t('noChecklistsYet', locale)}</p>
            <p className="text-sm">{t('createFirstChecklist', locale)}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {checklists.map((cl) => (
              <div
                key={cl.id}
                className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setActiveChecklist(cl.id)}
                >
                  <h3 className="font-medium text-white">{cl.name}</h3>
                  <div className="flex gap-4 mt-1 text-xs text-slate-500">
                    <span>
                      {cl.sections.length} {pluralSections(cl.sections.length)}
                    </span>
                    <span>
                      {cl.sections.reduce(
                        (sum, s) =>
                          sum +
                          s.subsections.reduce((ss, sub) => ss + sub.testCases.length, 0),
                        0
                      )}{' '}
                      {t('testCases', locale)}
                    </span>
                    <span>{t('updated', locale)} {new Date(cl.updatedAt).toLocaleDateString(locale)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateChecklist(cl.id);
                    }}
                    className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                    title={t('duplicate', locale)}
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`${t('deleteConfirm', locale)} "${cl.name}"?`)) {
                        deleteChecklist(cl.id);
                      }
                    }}
                    className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                    title={t('delete', locale)}
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => setActiveChecklist(cl.id)}
                    className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                    title={t('open', locale)}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
