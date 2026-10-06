import React, { useState } from 'react';
import { Calculator, Radio, Wrench, Building2, Bot, Wifi, Battery, Maximize2, Minimize2 } from 'lucide-react';
import { CalculatorScreen } from './screens/CalculatorScreen';
import { LiveTrackerScreen } from './screens/LiveTrackerScreen';
import { DiplomasScreen } from './screens/DiplomasScreen';
import { DirectoryScreen } from './screens/DirectoryScreen';
import { CollegeDetailModal } from './screens/CollegeDetailModal';
import { AiCounselorChat } from '../chat/AiCounselorChat';
import { College } from '../../types/tanseeqi';

interface MobileFrameProps {
  lang: 'ar' | 'en';
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'calc' | 'tracker' | 'diplomas' | 'directory' | 'ai'>('calc');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 sm:px-4">
      
      {/* Viewport switch toolbar */}
      <div className="w-full max-w-md sm:max-w-2xl flex items-center justify-between mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{lang === 'ar' ? 'محاكي تطبيق تنسيقي (Flutter / React Native)' : 'Tanseeqi Mobile App Simulator'}</span>
        </div>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
        >
          {isPhoneFrame ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'شاشة عريضة' : 'Full Width'}</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إطار الهاتف' : 'Phone Frame'}</span>
            </>
          )}
        </button>
      </div>

      {/* Frame Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] rounded-[42px] border-[8px] border-slate-800 bg-slate-950 shadow-2xl shadow-emerald-950/20 ring-1 ring-slate-700/50 overflow-hidden relative min-h-[780px] max-h-[880px] flex flex-col'
            : 'max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden relative min-h-[700px] flex flex-col'
        }`}
      >
        
        {/* Mobile Device Status Bar */}
        {isPhoneFrame && (
          <div className="h-10 bg-slate-950 px-6 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none shrink-0 border-b border-slate-900">
            <span className="font-bold text-slate-300">12:45</span>
            {/* Camera notch */}
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-emerald-400">5G</span>
              <Wifi className="w-3 h-3 text-slate-400" />
              <Battery className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        )}

        {/* In-App Mobile Top Bar */}
        <div className="p-3.5 px-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
              ت
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white leading-none">
                {lang === 'ar' ? 'تنسيقي' : 'Tanseeqi'}
              </h1>
              <span className="text-[10px] text-slate-400">
                {lang === 'ar' ? 'بوابة القبول الجامعي' : 'University Admissions'}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
            2026/2027
          </div>
        </div>

        {/* Scrollable Viewport Screen Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
          {activeTab === 'calc' && (
            <CalculatorScreen
              onSelectCollege={(c) => setSelectedCollege(c)}
              lang={lang}
            />
          )}

          {activeTab === 'tracker' && (
            <LiveTrackerScreen lang={lang} />
          )}

          {activeTab === 'diplomas' && (
            <DiplomasScreen
              onSelectCollege={(c) => setSelectedCollege(c)}
              lang={lang}
            />
          )}

          {activeTab === 'directory' && (
            <DirectoryScreen
              onSelectCollege={(c) => setSelectedCollege(c)}
              lang={lang}
            />
          )}

          {activeTab === 'ai' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <p>
                  {lang === 'ar'
                    ? 'اسأل المستشار الذكي عن أي استفسار يخص كليات القمة، الجامعات الأهلية، مسابقات معادلة الدبلومات، والتوزيع الجغرافي.'
                    : 'Ask the AI counselor about faculties, minimum thresholds, technical diploma equivalencies, and zoning.'}
                </p>
              </div>
              <AiCounselorChat lang={lang} />
            </div>
          )}
        </div>

        {/* Mobile Fixed Bottom Navigation Bar (5-column thumb zone) */}
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center h-16 shrink-0 px-1">
          
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'calc' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4 mb-1" />
            <span className="text-[9px] tracking-tight truncate">
              {lang === 'ar' ? 'الحاسبة' : 'Calculator'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex flex-col items-center justify-center h-full transition-colors relative ${
              activeTab === 'tracker' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Radio className="w-4 h-4 mb-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
            <span className="text-[9px] tracking-tight truncate">
              {lang === 'ar' ? 'المراحل' : 'Tracker'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('diplomas')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'diplomas' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4 mb-1" />
            <span className="text-[9px] tracking-tight truncate">
              {lang === 'ar' ? 'الدبلومات' : 'Diplomas'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'directory' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4 mb-1" />
            <span className="text-[9px] tracking-tight truncate">
              {lang === 'ar' ? 'الدليل' : 'Directory'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'ai' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 mb-1 text-emerald-400" />
            <span className="text-[9px] tracking-tight truncate">
              {lang === 'ar' ? 'المستشار' : 'AI Advisor'}
            </span>
          </button>

        </div>

      </div>

      {/* College Detail Modal */}
      <CollegeDetailModal
        college={selectedCollege}
        userGovernorate="القاهرة"
        onClose={() => setSelectedCollege(null)}
        lang={lang}
      />

    </div>
  );
};
