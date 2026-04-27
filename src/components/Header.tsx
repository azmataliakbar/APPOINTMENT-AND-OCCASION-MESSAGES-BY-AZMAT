"use client";

import { Moon, Sun } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/20 bg-white/30 px-3 py-3 backdrop-blur-xl sm:px-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        <div className="w-10" />
        <h1 className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-center text-2xl font-extrabold text-transparent drop-shadow-sm sm:text-3xl">
          MY APPOINTMENT / MY MESSAGE
        </h1>
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="inline-flex h-11 min-h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/40 text-slate-700 shadow-lg hover:scale-105 dark:bg-slate-900/50 dark:text-slate-100"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
