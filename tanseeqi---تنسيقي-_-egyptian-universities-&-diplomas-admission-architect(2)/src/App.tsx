/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileFrame } from './components/mobile/MobileFrame';
import { ArchitecturePortal } from './components/docs/ArchitecturePortal';
import { 
  Smartphone, 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'simulator' | 'architecture'>('simulator');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:py-6">
        
        {/* Quick View Mode Switcher Header Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              {activeView === 'simulator' ? <Smartphone className="w-4 h-4" /> : <Database className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-bold text-white block">
                {activeView === 'simulator' 
                  ? (lang === 'ar' ? 'المحاكي التفاعلي المباشر لتطبيق الموبايل' : 'Interactive Mobile Simulator View')
                  : (lang === 'ar' ? 'المواصفات المعمارية والهندسية للإنتاج' : 'Production Software Architecture View')}
              </span>
              <span className="text-slate-400">
                {activeView === 'simulator'
                  ? (lang === 'ar' ? 'جرب حساب التنسيق لطلاب الثانوية والدبلومات الفنية مباشرة وتفقد المراحل' : 'Test Egyptian Thanaweya & Diploma cutoffs directly')
                  : (lang === 'ar' ? 'مخططات قواعد البيانات (SQL & NoSQL)، كود Flutter، استراتيجية الدخل وخطة الـ 4 أسابيع' : 'Database schemas, Flutter/RN engine code, JSON OTA models')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView('simulator')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeView === 'simulator'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المحاكي (تطبيق الهاتف)' : 'Simulator'}</span>
            </button>

            <button
              onClick={() => setActiveView('architecture')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeView === 'architecture'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المواصفات والمعمارية' : 'Tech Specs'}</span>
            </button>
          </div>
        </div>

        {/* View Switch */}
        {activeView === 'simulator' ? (
          <MobileFrame lang={lang} />
        ) : (
          <ArchitecturePortal lang={lang} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'ar' 
                ? 'تنسيقي (Tanseeqi) · النظام المعتمد لتنسيق الجامعات المصرية والدبلومات الفنية 2026'
                : 'Tanseeqi · Egyptian University & Technical Diplomas Admission Engine 2026'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a 
              href="https://tansik.digital.gov.eg" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'موقع التنسيق الإلكتروني' : 'Official Tansik Portal'}</span>
            </a>
            <span>·</span>
            <span>{lang === 'ar' ? 'وزارة التعليم العالي والبحث العلمي' : 'Ministry of Higher Education'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
