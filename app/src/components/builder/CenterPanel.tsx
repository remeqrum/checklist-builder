import { useState } from 'react';
import type { Checklist } from '../../types/checklist';
import { useChecklistStore } from '../../store/checklistStore';
import {
  ChevronDown,
  Plus,
  Trash2,
  FolderPlus,
} from 'lucide-react';
import { useI18n, t } from '../../i18n';
import { InlineEdit } from '../shared/InlineEdit';

interface CenterPanelProps {
  checklist: Checklist;
}

export function CenterPanel({ checklist }: CenterPanelProps) {
  const {
    addSubsection,
    addTestCase,
    updateSection,
    updateSubsection,
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
        return 'bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30';
      case 'High':
        return 'bg-orange-500/15 text-orange-300 ring-1 ring-inset ring-orange-500/30';
      case 'Medium':
        return 'bg-yellow-500/15 text-yellow-300 ring-1 ring-inset ring-yellow-500/30';
      case 'Low':
        return 'bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-500/30';
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'Pass':
        return 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30';
      case 'Fail':
        return 'bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30';
      case 'Blocked':
        return 'bg-orange-500/15 text-orange-300 ring-1 ring-inset ring-orange-500/30';
      case 'Skipped':
        return 'bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-500/30';
      default:
        return 'bg-slate-700/40 text-slate-400 ring-1 ring-inset ring-slate-600/40';
    }
  };

  const pluralCases = (count: number) => {
    if (count === 1) return t('case', locale);
    return t('cases', locale);
  };

  if (checklist.sections.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        <div className="anim-fade-up text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-white/10 flex items-center justify-center">
            <FolderPlus size={24} className="text-indigo-300" />
          </div>
          <p className="mb-1 text-slate-300">{t('noSectionsYet', locale)}</p>
          <p className="text-sm">{t('useSidebarHint', locale)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto space-y-3">
        {checklist.sections.map((section, si) => (
          <div
            key={section.id}
            style={{ animationDelay: `${Math.min(si, 12) * 50}ms` }}
            className="anim-fade-up glass border border-white/5 rounded-xl overflow-hidden shadow-lg shadow-black/20 hover:border-indigo-500/30 transition-colors duration-300"
          >
            {/* section header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-indigo-500/10 to-transparent">
              <button
                onClick={() => toggle(section.id)}
                className="text-slate-400 hover:text-white transition-all duration-200 active:scale-90"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${collapsed[section.id] ? '-rotate-90' : ''}`}
                />
              </button>
              <InlineEdit
                value={section.name}
                onSave={(name) => updateSection(checklist.id, section.id, { name })}
                title={t('dblClickToRename', locale)}
                className="font-medium text-white text-sm flex-1"
                inputClassName="font-medium text-sm flex-1"
              />
              <button
                onClick={() => {
                  const name = prompt(t('subsectionNamePrompt', locale));
                  if (name?.trim()) addSubsection(checklist.id, section.id, name.trim());
                }}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all duration-200 active:scale-90"
                title={t('addSubsection', locale)}
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => {
                  if (confirm(t('deleteSectionConfirm', locale, { name: section.name })))
                    deleteSection(checklist.id, section.id);
                }}
                className="p-1 hover:bg-red-500/15 rounded-lg text-slate-500 hover:text-red-400 transition-all duration-200 active:scale-90"
                title={t('deleteSection', locale)}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* subsections */}
            {!collapsed[section.id] && (
              <div className="anim-fade border-t border-white/5">
                {section.subsections.length === 0 ? (
                  <div className="px-6 py-3 text-xs text-slate-600">{t('noSubsections', locale)}</div>
                ) : (
                  section.subsections.map((sub) => (
                    <div key={sub.id} className="border-b border-white/5 last:border-b-0">
                      {/* subsection header */}
                      <div className="flex items-center gap-2 px-6 py-2 bg-white/[0.02]">
                        <button
                          onClick={() => toggle(sub.id)}
                          className="text-slate-500 hover:text-white transition-all duration-200 active:scale-90"
                        >
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-300 ${collapsed[sub.id] ? '-rotate-90' : ''}`}
                          />
                        </button>
                        <InlineEdit
                          value={sub.name}
                          onSave={(name) =>
                            updateSubsection(checklist.id, section.id, sub.id, { name })
                          }
                          title={t('dblClickToRename', locale)}
                          className="text-sm text-slate-300 flex-1"
                          inputClassName="text-sm flex-1"
                        />
                        <span className="text-xs text-slate-600">
                          {sub.testCases.length} {pluralCases(sub.testCases.length)}
                        </span>
                        <button
                          onClick={() =>
                            addTestCase(checklist.id, section.id, sub.id, {
                              title: t('newTestCase', locale),
                            })
                          }
                          className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all duration-200 active:scale-90"
                          title={t('addTestCase', locale)}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(t('deleteSubsectionConfirm', locale, { name: sub.name })))
                              deleteSubsection(checklist.id, section.id, sub.id);
                          }}
                          className="p-1 hover:bg-red-500/15 rounded-lg text-slate-500 hover:text-red-400 transition-all duration-200 active:scale-90"
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
                              style={{ animationDelay: `${Math.min(idx, 12) * 35}ms` }}
                              className={`anim-fade-up group relative flex items-center gap-3 pl-4 pr-3 py-2 my-0.5 rounded-lg cursor-pointer text-sm transition-all duration-200 ${
                                selectedItemId === tc.id
                                  ? 'bg-gradient-to-r from-indigo-500/25 to-violet-500/10 ring-1 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                                  : 'ring-1 ring-transparent hover:bg-white/[0.04] hover:translate-x-0.5'
                              }`}
                            >
                              {selectedItemId === tc.id && (
                                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500" />
                              )}
                              <span className="text-xs text-slate-500 w-12 shrink-0 font-mono">
                                TC-{String(idx + 1).padStart(3, '0')}
                              </span>
                              <span className="flex-1 text-slate-300 truncate">
                                {tc.title || t('untitled', locale)}
                              </span>
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColor(tc.priority)}`}
                              >
                                {tc.priority}
                              </span>
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(tc.status)}`}
                              >
                                {tc.status}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const name = tc.title || t('untitled', locale);
                                  if (confirm(t('deleteTestCaseConfirm', locale, { name })))
                                    deleteTestCase(checklist.id, section.id, sub.id, tc.id);
                                }}
                                className="p-1 hover:bg-red-500/15 rounded-lg text-slate-600 hover:text-red-400 transition-all duration-200 active:scale-90 opacity-0 group-hover:opacity-100"
                                title={t('deleteTestCase', locale)}
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
