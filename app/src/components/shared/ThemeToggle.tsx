import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import { useI18n, t } from '../../i18n';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { locale } = useI18n();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={t(isDark ? 'switchToLight' : 'switchToDark', locale)}
      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200 active:scale-90 hover:rotate-12"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
