import { useI18n, LOCALE_LABELS, LOCALE_NAMES } from '../../i18n';
import type { Locale } from '../../i18n';

const locales: Locale[] = ['en', 'ru', 'sk'];

export function LangSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-0.5 bg-slate-800/50 rounded-lg p-0.5 ring-1 ring-white/5">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          title={LOCALE_NAMES[loc]}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 active:scale-95 ${
            locale === loc
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/70'
          }`}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
