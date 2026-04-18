import { useChecklistStore } from '../../store/checklistStore';
import { ArrowLeft, Save as SaveIcon, Download } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { CenterPanel } from './CenterPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { exportToExcel } from '../../utils/excelExport';
import { LangSwitcher } from '../shared/LangSwitcher';
import { useI18n, t } from '../../i18n';

export function Builder() {
  const { activeChecklist, setActiveChecklist } = useChecklistStore();
  const { locale } = useI18n();
  const checklist = activeChecklist();

  if (!checklist) return null;

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200">
      {/* toolbar */}
      <header className="flex items-center gap-3 px-4 py-2 border-b border-slate-800 bg-slate-900/50">
        <button
          onClick={() => setActiveChecklist(null)}
          className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
          title={t('backToDashboard', locale)}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-sm font-medium text-white truncate">{checklist.name}</h1>
        <span className="text-xs text-slate-500">v{checklist.version}</span>
        <div className="flex-1" />
        <LangSwitcher />
        <button
          onClick={() => exportToExcel(checklist)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-md text-xs font-medium transition-colors"
          title={t('exportToExcel', locale)}
        >
          <Download size={13} />
          {t('exportXlsx', locale)}
        </button>
        <span className="text-xs text-slate-500">{t('autoSaved', locale)}</span>
        <SaveIcon size={14} className="text-slate-500" />
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
