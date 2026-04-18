import { useI18n, LOCALE_LABELS, LOCALE_NAMES } from '../../i18n';
import type { Locale } from '../../i18n';

const locales: Locale[] = ['en', 'ru', 'sk'];

export function LangSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-0.5 bg-slate-800/50 rounded-md p-0.5">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          title={LOCALE_NAMES[loc]}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            locale === loc
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
