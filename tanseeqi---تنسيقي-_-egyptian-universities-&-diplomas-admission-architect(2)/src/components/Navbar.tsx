import React from 'react';
import { Smartphone, BookOpen, Layers, Sparkles, Database } from 'lucide-react';

interface NavbarProps {
  activeView: 'simulator' | 'architecture';
  setActiveView: (view: 'simulator' | 'architecture') => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  lang,
  setLang,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-emerald-500/20">
            ت
          </div>
          <button 
            onClick={() => setActiveView('simulator')}
            className="text-right text-lg font-bold text-white tracking-tight hover:text-emerald-400 transition-colors"
          >
            {lang === 'ar' ? 'تنسيقي · Tanseeqi' : 'Tanseeqi · تنسيقي'}
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single Line Text Links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveView('simulator')}
            className={`transition-colors flex items-center gap-1.5 ${
              activeView === 'simulator' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{lang === 'ar' ? 'المحاكي التفاعلي' : 'Live Simulator'}</span>
          </button>

          <button
            onClick={() => setActiveView('architecture')}
            className={`transition-colors flex items-center gap-1.5 ${
              activeView === 'architecture' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{lang === 'ar' ? 'المعمارية وقواعد البيانات' : 'Architecture & DB'}</span>
          </button>

          <a
            href="https://tansik.digital.gov.eg"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-200 transition-colors flex items-center gap-1 text-slate-400"
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'ar' ? 'بوابة التنسيق الرسمية' : 'Official Portal'}</span>
          </a>
        </nav>

        {/* Zone 3: Actions (Mode switch & language) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="تبديل اللغة / Toggle Language"
          >
            {lang === 'ar' ? 'English' : 'عربي'}
          </button>

          <button
            onClick={() => setActiveView(activeView === 'simulator' ? 'architecture' : 'simulator')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 whitespace-nowrap"
          >
            {activeView === 'simulator' ? (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'عرض وثائق المعمارية' : 'View Architecture'}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تجربة المحاكي' : 'Launch Simulator'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
