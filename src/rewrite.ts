import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

const map: Record<string, string> = {
  "bg-slate-900/50": "bg-slate-100/80 dark:bg-slate-900/50",
  "bg-slate-800\"": "bg-white dark:bg-slate-800\"",
  "bg-slate-800/80": "bg-white/80 dark:bg-slate-800/80",
  "bg-slate-800/90": "bg-white/90 dark:bg-slate-800/90",
  "bg-slate-800/40": "bg-slate-200/40 dark:bg-slate-800/40",
  "bg-slate-700\"": "bg-slate-200 dark:bg-slate-700\"",
  "bg-slate-700/80": "bg-slate-200/80 dark:bg-slate-700/80",
  "bg-slate-900/30": "bg-slate-50/50 dark:bg-slate-900/30",
  "bg-slate-900 ": "bg-slate-100 dark:bg-slate-900 ",
  "text-slate-50 ": "text-slate-900 dark:text-slate-50 ",
  "text-slate-300": "text-slate-700 dark:text-slate-300",
  "text-slate-400": "text-slate-600 dark:text-slate-400",
  "text-slate-500": "text-slate-500 dark:text-slate-400",
  "text-white": "text-slate-900 dark:text-white",
  "border-slate-800": "border-slate-200 dark:border-slate-800",
  "border-slate-800/60": "border-slate-200/60 dark:border-slate-800/60",
  "border-slate-700": "border-slate-300 dark:border-slate-700",
  "border-slate-600": "border-slate-300 dark:border-slate-600",
  "text-cyan-300": "text-cyan-700 dark:text-cyan-300",
  "text-cyan-200": "text-cyan-800 dark:text-cyan-200",
  "text-purple-300": "text-purple-700 dark:text-purple-300",
  "text-green-300": "text-green-700 dark:text-green-300",
  "bg-[#020617]": "bg-[#f8fafc] dark:bg-[#020617]",
  "border-white/20": "border-black/20 dark:border-white/20",
  "bg-slate-800 border": "bg-white dark:bg-slate-800 border",
  "text-slate-100\"": "text-slate-800 dark:text-slate-100\"",
  "text-cyan-400": "text-cyan-600 dark:text-cyan-400"
};

for (const [k, v] of Object.entries(map)) {
  code = code.split(k).join(v);
}

// Ensure the outer wrapper supports dark context
code = code.replace(/import \{ Sun, Moon \} from 'lucide-react';/g, "");
code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, Sun, Moon } from 'lucide-react';");

// Import useEffect
if (!code.includes("useEffect")) {
  code = code.replace(/import React, \{ createContext, useContext, useState \} from 'react';/, "import React, { createContext, useContext, useState, useEffect } from 'react';");
}

const oldContext = `const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof content['zh'];
}>({
  lang: 'zh',
  setLang: () => {},
  t: content['zh']
});

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: content[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  return useContext(LanguageContext);
}`;

const newContext = `type Theme = 'light' | 'dark';

const AppContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: typeof content['zh'];
}>({
  lang: 'zh',
  setLang: () => {},
  theme: 'dark',
  setTheme: () => {},
  t: content['zh']
});

function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>('dark');
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, t: content[lang] }}>
      {children}
    </AppContext.Provider>
  );
}

function useLanguage() {
  return useContext(AppContext);
}`;

code = code.replace(oldContext, newContext);
code = code.replace(/<LanguageProvider>/g, "<AppProvider>");
code = code.replace(/<\/LanguageProvider>/g, "</AppProvider>");

const oldHeader = `<div className="fixed top-6 right-6 md:top-8 md:right-8 z-50">
        <button`;

const replHeader = `<div className="fixed top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-3">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-center w-10 h-10 bg-white/80 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700/90 border border-slate-300 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-all backdrop-blur-md shadow-xl"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
        <button`;

code = code.replace(oldHeader, replHeader);

// make sure the context extraction handles setLang AND theme:
code = code.replace(/const \{ t, lang, setLang \} = useLanguage\(\);/g, "const { t, lang, setLang, theme, setTheme } = useLanguage();");

// To fix some specific bg-slate-900 text issue that became text-slate-100 dark:text-slate-900 (selection class)
code = code.replace("selection:text-slate-100 dark:text-slate-900", "selection:text-slate-900 dark:selection:text-slate-900");

// Adjust text colors in grids and spans
code = code.replace(/"w-full h-full rounded bg-slate-200 dark:bg-slate-700"/g, `"w-full h-full rounded ${'${'}isMasked ? 'bg-slate-200 dark:bg-slate-700' : (i % 2 === 0 ? 'bg-cyan-500' : 'bg-purple-500')} \`}`);
code = code.replace(/bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400/g, 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400');

fs.writeFileSync('src/App.tsx', code);
