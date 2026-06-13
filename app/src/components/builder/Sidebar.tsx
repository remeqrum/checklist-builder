import { useChecklistStore } from '../../store/checklistStore';
import { FolderPlus, PackagePlus } from 'lucide-react';
import { getAvailableBlocks } from '../../utils/blocks';
import { useI18n, t } from '../../i18n';

interface SidebarProps {
  checklistId: string;
}

export function Sidebar({ checklistId }: SidebarProps) {
  const { addSection, addSectionFromBlock } = useChecklistStore();
  const { locale } = useI18n();
  const blocks = getAvailableBlocks();

  const handleAddSection = () => {
    const name = prompt(t('sectionNamePrompt', locale));
    if (name?.trim()) {
      addSection(checklistId, name.trim());
    }
  };

  return (
    <aside className="anim-slide-left w-56 border-r border-slate-200 dark:border-white/5 glass flex flex-col">
      <div className="p-3 border-b border-slate-200 dark:border-white/5">
        <h2 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
          {t('actions', locale)}
        </h2>
        <div className="space-y-1">
          <button
            onClick={handleAddSection}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg transition-all duration-200 hover:text-slate-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-violet-500/10 hover:translate-x-0.5 active:scale-[0.98]"
          >
            <FolderPlus size={14} className="text-indigo-400" />
            {t('addSection', locale)}
          </button>
        </div>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <h2 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
          {t('blocksLibrary', locale)}
        </h2>
        <div className="space-y-1">
          {blocks.map((block, i) => (
            <button
              key={block.name}
              onClick={() => addSectionFromBlock(checklistId, block.name)}
              style={{ animationDelay: `${i * 50}ms` }}
              className="anim-fade-up group w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-lg transition-all duration-200 text-left hover:text-slate-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-violet-500/10 hover:translate-x-0.5 active:scale-[0.98]"
              title={t('addBlockTooltip', locale, { name: block.name, count: block.caseCount })}
            >
              <PackagePlus size={14} className="shrink-0 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              <span className="flex-1 truncate">{block.name}</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 rounded-full px-1.5 py-0.5 transition-colors">
                {block.caseCount}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-600 mt-3 px-3">
          {t('addBlockHint', locale)}
        </p>
      </div>
    </aside>
  );
}
