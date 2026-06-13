import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useChecklistStore } from '../../store/checklistStore';
import { ArrowLeft, Save as SaveIcon, Download } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { CenterPanel } from './CenterPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { exportToExcel } from '../../utils/excelExport';
import { LangSwitcher } from '../shared/LangSwitcher';
import { ThemeToggle } from '../shared/ThemeToggle';
import { InlineEdit } from '../shared/InlineEdit';
import { useI18n, t } from '../../i18n';

export function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const checklist = useChecklistStore((s) => s.checklists.find((cl) => cl.id === id));
  const updateChecklist = useChecklistStore((s) => s.updateChecklist);
  const setSelectedItem = useChecklistStore((s) => s.setSelectedItem);
  const { locale } = useI18n();

  // drop selection carried over from a previously opened checklist
  useEffect(() => {
    setSelectedItem(null);
  }, [id, setSelectedItem]);

  if (!checklist) return <Navigate to="/" replace />;

  return (
    <div className="app-shell h-screen flex flex-col text-slate-800 dark:text-slate-200">
      {/* toolbar */}
      <header className="glass flex items-center gap-3 px-4 py-2 border-b border-slate-200 dark:border-white/5 z-10">
        <button
          onClick={() => navigate('/')}
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 hover:-translate-x-0.5 active:scale-90"
          title={t('backToDashboard', locale)}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-medium text-slate-900 dark:text-white truncate">
          <InlineEdit
            value={checklist.name}
            onSave={(name) => updateChecklist(checklist.id, { name })}
            trigger="click"
            title={t('clickToRename', locale)}
            inputClassName="text-sm font-medium"
          />
        </h1>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 ring-1 ring-indigo-500/30 dark:ring-indigo-500/20 rounded-full px-2 py-0.5">
          v{checklist.version}
        </span>
        <div className="flex-1" />
        <ThemeToggle />
        <LangSwitcher />
        <button
          onClick={() => exportToExcel(checklist)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-lg text-xs font-medium text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          title={t('exportToExcel', locale)}
        >
          <Download size={13} />
          {t('exportXlsx', locale)}
        </button>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <SaveIcon size={14} className="text-emerald-500/70" />
          {t('autoSaved', locale)}
        </span>
      </header>

      {/* three panel layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar checklistId={checklist.id} />
        <CenterPanel checklist={checklist} />
        <PropertiesPanel checklist={checklist} />
      </div>
    </div>
  );
}
