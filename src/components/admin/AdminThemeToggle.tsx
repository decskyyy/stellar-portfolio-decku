'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const options: Array<{ value: Theme; label: string; icon: string }> = [
  { value: 'light', label: 'Light', icon: '☼' },
  { value: 'dark', label: 'Dark', icon: '◐' },
  { value: 'system', label: 'System', icon: '◌' },
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
    <div className="admin-theme-control" aria-label="Admin theme">
      <span className="admin-theme-label">Theme</span>
      <div className="admin-theme-options" role="group" aria-label="Choose a theme">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={theme === option.value}
            className={`admin-theme-option ${theme === option.value ? 'admin-theme-option-active' : ''}`}
            onClick={() => changeTheme(option.value)}
            title={option.label}
          >
            <span aria-hidden="true">{option.icon}</span>
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
