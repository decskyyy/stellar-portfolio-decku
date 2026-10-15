'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

const options: Array<{ value: Theme; label: string; icon: LucideIcon }> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function AdminThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = window.localStorage.getItem('admin-theme') as Theme | null;
    const initialTheme = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    setTheme(initialTheme);
    document.documentElement.dataset.adminTheme = initialTheme;
  }, []);

  function changeTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    window.localStorage.setItem('admin-theme', nextTheme);
    document.documentElement.dataset.adminTheme = nextTheme;
  }

  return (
    <div className="admin-theme-control">
      <div className="admin-theme-options" role="group" aria-label="Admin appearance">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={theme === option.value}
            aria-label={`Use ${option.label.toLowerCase()} appearance`}
            className={`admin-theme-option ${theme === option.value ? 'admin-theme-option-active' : ''}`}
            onClick={() => changeTheme(option.value)}
            title={option.label}
          >
            <option.icon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
