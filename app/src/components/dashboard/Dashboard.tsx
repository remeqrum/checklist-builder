import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChecklistStore } from '../../store/checklistStore';
import { Plus, Copy, Trash2, ChevronRight, Download, Upload } from 'lucide-react';
import { LangSwitcher } from '../shared/LangSwitcher';
import { exportBackup, importBackup } from '../../utils/storage';
import { useI18n, t } from '../../i18n';

export function Dashboard() {
  const { checklists, addChecklist, duplicateChecklist, deleteChecklist, importChecklists } =
    useChecklistStore();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    const name = prompt(t('checklistNamePrompt', locale));
    if (name?.trim()) {
      const id = addChecklist(name.trim());
      navigate(`/checklist/${id}`);
    }
  };

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow picking the same file again
    if (!file) return;
    try {
      const imported = await importBackup(file);
      if (
        checklists.length > 0 &&
        !confirm(t('importConfirm', locale, { count: checklists.length }))
      ) {
        return;
      }
      importChecklists(imported);
      alert(t('importSuccess', locale, { count: imported.length }));
    } catch {
      alert(t('importInvalid', locale));
    }
  };

  const pluralSections = (count: number) => {
    if (count === 1) return t('section', locale);
    return t('sections', locale);
  };

  return (
    <div className="app-shell min-h-screen text-slate-200">
      <header className="glass sticky top-0 z-10 border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
            {t('appTitle', locale)}
          </h1>
          <LangSwitcher />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-white">{t('myChecklists', locale)}</h2>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/70 ring-1 ring-white/5 hover:bg-slate-700/70 hover:ring-white/10 rounded-lg text-sm text-slate-300 transition-all duration-200 active:scale-95"
              title={t('importBackup', locale)}
            >
              <Upload size={14} />
              {t('importBackup', locale)}
            </button>
            <button
              onClick={() => exportBackup(checklists)}
              disabled={checklists.length === 0}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/70 ring-1 ring-white/5 hover:bg-slate-700/70 hover:ring-white/10 rounded-lg text-sm text-slate-300 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              title={t('exportBackup', locale)}
            >
              <Download size={14} />
              {t('exportBackup', locale)}
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={16} />
              {t('createNew', locale)}
            </button>
          </div>
        </div>

        {checklists.length === 0 ? (
          <div className="anim-fade-up text-center py-24 text-slate-500">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-white/10 flex items-center justify-center">
              <Plus size={24} className="text-indigo-300" />
            </div>
            <p className="text-lg mb-2 text-slate-300">{t('noChecklistsYet', locale)}</p>
            <p className="text-sm">{t('createFirstChecklist', locale)}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {checklists.map((cl, i) => (
              <div
                key={cl.id}
                style={{ animationDelay: `${Math.min(i, 10) * 55}ms` }}
                className="anim-fade-up relative flex items-center justify-between p-4 pl-5 glass border border-white/5 rounded-xl overflow-hidden hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/checklist/${cl.id}`)}
                >
                  <h3 className="font-medium text-white group-hover:text-indigo-200 transition-colors">{cl.name}</h3>
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

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateChecklist(cl.id);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all duration-200 active:scale-90"
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
                    className="p-2 hover:bg-red-500/15 rounded-lg text-slate-400 hover:text-red-400 transition-all duration-200 active:scale-90"
                    title={t('delete', locale)}
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => navigate(`/checklist/${cl.id}`)}
                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all duration-200 group-hover:translate-x-0.5 active:scale-90"
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
