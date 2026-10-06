import React, { useState } from 'react';
import { DIPLOMA_EQUIVALENCY_RULES, MOCK_COLLEGES } from '../../../data/mockTansikData';
import { DiplomaEquivalencyRule, College } from '../../../types/tanseeqi';
import { 
  Wrench, 
  BookOpen, 
  Cpu, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Briefcase,
  GraduationCap
} from 'lucide-react';

interface DiplomasScreenProps {
  onSelectCollege: (college: College) => void;
  lang: 'ar' | 'en';
}

export const DiplomasScreen: React.FC<DiplomasScreenProps> = ({
  onSelectCollege,
  lang,
}) => {
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number>(0);
  const [diplomaScoreInput, setDiplomaScoreInput] = useState<string>('75');
  const [selectedYears, setSelectedYears] = useState<3 | 5>(3);

  const activeRule: DiplomaEquivalencyRule = DIPLOMA_EQUIVALENCY_RULES[selectedRuleIndex];

  // Tech universities list
  const techColleges = MOCK_COLLEGES.filter(c => c.type === 'technological');

  return (
    <div className="space-y-4 pb-12">
      
      {/* Intro Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            {lang === 'ar' ? 'بوابة طلاب الدبلومات الفنية والمعادلات' : 'Technical Diplomas & Equivalencies Hub'}
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'ar'
            ? 'دليل مسارات خريجي الدبلومات الفنية (نظام 3 و 5 سنوات) للالتحاق بالجامعات الحكومية، معادلات كليات الهندسة والتجارة، والجامعات التكنولوجية الـ 10 الجديدة.'
            : 'Specialized guide for 3-year and 5-year technical diploma graduates in Egypt.'}
        </p>
      </div>

      {/* Diploma Track Switcher */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-2">
          {lang === 'ar' ? 'اختر تخصص الدبلوم الفني للاطلاع على مساراته:' : 'Select Diploma Track:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DIPLOMA_EQUIVALENCY_RULES.map((rule, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedRuleIndex(idx)}
              className={`p-3 rounded-xl text-xs font-semibold text-right transition-all border flex items-center justify-between ${
                selectedRuleIndex === idx
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{rule.diplomaTrack}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {lang === 'ar' ? `نظام ${rule.systemYears} سنوات` : `${rule.systemYears}Y`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Rule Details Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs text-emerald-400 font-bold block mb-1">
              {lang === 'ar' ? 'المسار الأكاديمي وخريطة القبول' : 'Academic Pathway'}
            </span>
            <h3 className="text-base font-bold text-white">
              {activeRule.diplomaTrack}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">{lang === 'ar' ? 'الحد الأدنى للمعادلة' : 'Min for Equivalency'}</span>
            <span className="font-mono font-extrabold text-emerald-400 text-base">
              {activeRule.minimumScorePercentage}%
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {activeRule.descriptionAr}
        </p>

        {/* Target Faculties */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'الكليات والمعاهد المتاحة رسمياً:' : 'Available Colleges & Institutes:'}</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {activeRule.targetCollegesAr.map((collegeName, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{collegeName}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Equivalency Exam Requirements */}
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'شروط ومواد المسابقة المركزية الموحدة (المعادلة):' : 'Equivalency Exam Requirements:'}</span>
          </span>
          <p className="leading-relaxed text-amber-200/90">
            {activeRule.examRequirementsAr}
          </p>
        </div>

      </div>

      {/* Technological Universities Highlight Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'الجامعات التكنولوجية الحديثة (كوتة 80% للدبلومات)' : 'Technological Universities (80% Quota)'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-teal-300 px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800/50">
            مسار المستقبل
          </span>
        </div>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'ar'
            ? 'تمنح بكالوريوس مهني تكنولوجي معتمد في مجالات الأوتوترونكس، الطاقة المتجددة، تكنولوجيا المعلومات، والأطراف الصناعية، مع إعطاء الأولوية القصوى لخريجي الدبلومات الفنية.'
            : 'New technological universities grant 4-year applied bachelor degrees with an 80% seat quota reserved for technical diploma students.'}
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {techColleges.map((tech) => (
            <div
              key={tech.id}
              onClick={() => onSelectCollege(tech)}
              className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white truncate max-w-[280px]">
                  {tech.nameAr}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{tech.governorate}</span>
                  <span>·</span>
                  <span className="font-mono text-teal-400 font-semibold">{tech.cutoffPercentage}%</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
