import { useEffect, useRef, useState } from 'react';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  /* 'click' for standalone titles, 'doubleClick' where single click has another action */
  trigger?: 'click' | 'doubleClick';
  className?: string;
  inputClassName?: string;
  title?: string;
}

export function InlineEdit({
  value,
  onSave,
  trigger = 'doubleClick',
  className,
  inputClassName,
  title,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEditing = () => {
    setDraft(value);
    setEditing(true);
  };

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    setEditing(false);
  };

  if (!editing) {
    return (
      <span
        className={`cursor-text ${className ?? ''}`}
        title={title}
        onClick={trigger === 'click' ? startEditing : undefined}
        onDoubleClick={trigger === 'doubleClick' ? startEditing : undefined}
      >
        {value}
      </span>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') setEditing(false);
      }}
      onClick={(e) => e.stopPropagation()}
      className={`bg-white dark:bg-slate-800 border border-indigo-500 rounded px-1.5 py-0.5 text-slate-900 dark:text-white focus:outline-none ${inputClassName ?? ''}`}
    />
  );
}
