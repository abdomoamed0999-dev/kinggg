import React from 'react';
import { College } from '../../../types/tanseeqi';
import { AdmissionCalculator } from '../../calculator/AdmissionCalculator';
import { MOCK_COLLEGES } from '../../../data/mockTansikData';

interface CalculatorScreenProps {
  onSelectCollege: (college: College) => void;
  lang: 'ar' | 'en';
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({
  onSelectCollege,
  lang,
}) => {
  return (
    <div className="space-y-4 pb-12">
      
      {/* Sponsored Partner Spotlight (Monetization component) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-800/40 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            BUC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-1.5 py-0.2 rounded">
                {lang === 'ar' ? 'جامعة شريكة معتمدة' : 'Sponsored Partner'}
              </span>
              <span className="text-xs font-bold text-white truncate">
                {lang === 'ar' ? 'جامعة بدر بالقاهرة (BUC)' : 'Badr University Cairo'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
              {lang === 'ar' 
                ? 'فتح باب التقديم المباشر لكليات الهندسة والصيدلة والذكاء الاصطناعي بحد أدنى 66%' 
                : 'Direct admission open with 66% minimum cutoff'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const buc = MOCK_COLLEGES.find(c => c.id === 'priv_buc_eng');
            if (buc) onSelectCollege(buc);
          }}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shrink-0 transition-colors"
        >
          {lang === 'ar' ? 'تفاصيل المنح' : 'Details'}
        </button>
      </div>

      {/* The Reusable AdmissionCalculator Component */}
      <AdmissionCalculator
        onSelectCollege={onSelectCollege}
        initialTrack="thanaweya_science"
        initialPercentage={88.5}
        initialGovernorate="القاهرة"
        lang={lang}
      />

    </div>
  );
};
