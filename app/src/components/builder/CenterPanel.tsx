import { useState } from 'react';
import type { Checklist } from '../../types/checklist';
import { useChecklistStore } from '../../store/checklistStore';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { useI18n, t } from '../../i18n';

interface CenterPanelProps {
  checklist: Checklist;
}

export function CenterPanel({ checklist }: CenterPanelProps) {
  const {
    addSubsection,
    addTestCase,
    deleteSection,
    deleteSubsection,
    deleteTestCase,
    setSelectedItem,
    selectedItemId,
  } = useChecklistStore();
  const { locale } = useI18n();

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400';
      case 'High':
        return 'bg-orange-500/20 text-orange-400';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Low':
        return 'bg-slate-500/20 text-slate-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'Pass':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'Fail':
        return 'bg-red-500/20 text-red-400';
      case 'Blocked':
        return 'bg-orange-500/20 text-orange-400';
      case 'Skipped':
        return 'bg-slate-500/20 text-slate-400';
      default:
        return 'bg-slate-700/50 text-slate-500';
    }
  };

  const pluralCases = (count: number) => {
    if (count === 1) return t('case', locale);
    return t('cases', locale);
  };

  if (checklist.sections.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <p className="mb-1">{t('noSectionsYet', locale)}</p>
          <p className="text-sm">{t('useSidebarHint', locale)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto space-y-3">
        {checklist.sections.map((section) => (
          <div key={section.id} className="border border-slate-800 rounded-lg overflow-hidden">
            {/* section header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/60">
              <button
                onClick={() => toggle(section.id)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {collapsed[section.id] ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              <GripVertical size={14} className="text-slate-700" />
              <span className="font-medium text-white text-sm flex-1">{section.name}</span>
              <button
                onClick={() => {
                  const name = prompt(t('subsectionNamePrompt', locale));
                  if (name?.trim()) addSubsection(checklist.id, section.id, name.trim());
                }}
                className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors"
                title={t('addSubsection', locale)}
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => {
                  if (confirm(t('deleteSectionConfirm', locale, { name: section.name })))
                    deleteSection(checklist.id, section.id);
                }}
                className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400 transition-colors"
                title={t('deleteSection', locale)}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* subsections */}
            {!collapsed[section.id] && (
              <div className="border-t border-slate-800/50">
                {section.subsections.length === 0 ? (
                  <div className="px-6 py-3 text-xs text-slate-600">{t('noSubsections', locale)}</div>
                ) : (
                  section.subsections.map((sub) => (
                    <div key={sub.id} className="border-b border-slate-800/30 last:border-b-0">
                      {/* subsection header */}
                      <div className="flex items-center gap-2 px-6 py-2 bg-slate-900/30">
                        <button
                          onClick={() => toggle(sub.id)}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          {collapsed[sub.id] ? (
                            <ChevronRight size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </button>
                        <span className="text-sm text-slate-300 flex-1">{sub.name}</span>
                        <span className="text-xs text-slate-600">
                          {sub.testCases.length} {pluralCases(sub.testCases.length)}
                        </span>
                        <button
                          onClick={() =>
                            addTestCase(checklist.id, section.id, sub.id, {
                              title: t('newTestCase', locale),
                            })
                          }
                          className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors"
                          title={t('addTestCase', locale)}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(t('deleteSubsectionConfirm', locale, { name: sub.name })))
                              deleteSubsection(checklist.id, section.id, sub.id);
                          }}
                          className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400 transition-colors"
                          title={t('deleteSubsection', locale)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* test cases */}
                      {!collapsed[sub.id] && sub.testCases.length > 0 && (
                        <div className="px-6">
                          {sub.testCases.map((tc, idx) => (
                            <div
                              key={tc.id}
                              onClick={() => setSelectedItem(tc.id)}
                              className={`flex items-center gap-3 px-3 py-2 my-0.5 rounded cursor-pointer text-sm transition-colors ${
                                selectedItemId === tc.id
                                  ? 'bg-indigo-600/20 border border-indigo-500/30'
                                  : 'hover:bg-slate-800/50 border border-transparent'
                              }`}
                            >
                              <span className="text-xs text-slate-600 w-12 shrink-0">
                                TC-{String(idx + 1).padStart(3, '0')}
                              </span>
                              <span className="flex-1 text-slate-300 truncate">
                                {tc.title || t('untitled', locale)}
                              </span>
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded ${priorityColor(tc.priority)}`}
                              >
                                {tc.priority}
                              </span>
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded ${statusColor(tc.status)}`}
                              >
                                {tc.status}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTestCase(checklist.id, section.id, sub.id, tc.id);
                                }}
                                className="p-1 hover:bg-slate-700 rounded text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
