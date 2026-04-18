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
    <aside className="w-56 border-r border-slate-800 bg-slate-900/30 flex flex-col">
      <div className="p-3 border-b border-slate-800">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {t('actions', locale)}
        </h2>
        <div className="space-y-1">
          <button
            onClick={handleAddSection}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
          >
            <FolderPlus size={14} />
            {t('addSection', locale)}
          </button>
        </div>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {t('blocksLibrary', locale)}
        </h2>
        <div className="space-y-1">
          {blocks.map((block) => (
            <button
              key={block.name}
              onClick={() => addSectionFromBlock(checklistId, block.name)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors text-left"
              title={t('addBlockTooltip', locale, { name: block.name, count: block.caseCount })}
            >
              <PackagePlus size={14} className="shrink-0" />
              <span className="flex-1 truncate">{block.name}</span>
              <span className="text-xs text-slate-600">{block.caseCount}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3 px-3">
          {t('addBlockHint', locale)}
        </p>
      </div>
    </aside>
  );
}
