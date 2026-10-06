import React from 'react';
import { College, GeographicGroup } from '../../../types/tanseeqi';
import { X, ExternalLink, Award, MapPin, Clock, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CollegeDetailModalProps {
  college: College | null;
  userGovernorate: string;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const CollegeDetailModal: React.FC<CollegeDetailModalProps> = ({
  college,
  userGovernorate,
  onClose,
  lang,
}) => {
  if (!college) return null;

  const geoGroup: GeographicGroup = college.geographicGroupMap[userGovernorate] || 'C';

  const geoGroupExplanation = {
    A: lang === 'ar' ? 'المجموعة (أ): النطاق الجغرافي الأول لمحافظتك (إلزامي ترتيبة أولاً بالرغبات)' : 'Group (A): Primary Home Governorate Zone (Must be ranked first)',
    B: lang === 'ar' ? 'المجموعة (ب): النطاق الجغرافي الثاني (المحافظات المجاورة جغرافياً)' : 'Group (B): Secondary Adjacent Zone',
    C: lang === 'ar' ? 'المجموعة (ج): باقي الجامعات بالجمهورية (يخضع لتقليل الاغتراب لاحقاً)' : 'Group (C): Other Governorates (Subject to Expatriate Reduction rules)',
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'public': return lang === 'ar' ? 'جامعة حكومية' : 'Public University';
      case 'national': return lang === 'ar' ? 'جامعة أهلية' : 'National University';
      case 'private': return lang === 'ar' ? 'جامعة خاصة' : 'Private University';
      case 'technological': return lang === 'ar' ? 'جامعة تكنولوجية' : 'Technological University';
      case 'higher_institute': return lang === 'ar' ? 'معهد عالي خاص' : 'Higher Private Institute';
      case 'technical_institute': return lang === 'ar' ? 'معهد فني حكومي' : 'Technical Institute (2Y)';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-emerald-400">{getTypeName(college.type)}</span>
              <span>·</span>
              <span>{lang === 'ar' ? `كود التنسيق: ${college.tansikCode}` : `Tansik Code: ${college.tansikCode}`}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {lang === 'ar' ? college.nameAr : college.nameEn}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar' ? college.universityNameAr : college.universityNameEn}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">
                {lang === 'ar' ? 'الحد الأدنى المتوقع' : 'Expected Cutoff'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {college.cutoffPercentage.toFixed(2)}%
                </span>
                <span className="text-xs text-slate-400">
                  ({college.cutoffScore} {lang === 'ar' ? 'درجة' : 'marks'})
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">
                {lang === 'ar' ? 'الموقع والمحافظة' : 'Location & Governorate'}
              </span>
              <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{college.governorate}</span>
              </div>
            </div>
          </div>

          {/* Geographic Distribution Rule (Egyptian Tansik Group A / B / C) */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">
                {lang === 'ar' ? `التوزيع الجغرافي لطالب محافظة (${userGovernorate})` : `Zoning Rule for (${userGovernorate})`}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold font-mono ${
                geoGroup === 'A' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                geoGroup === 'B' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {lang === 'ar' ? `المجموعة (${geoGroup})` : `Group ${geoGroup}`}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {geoGroupExplanation[geoGroup]}
            </p>
          </div>

          {/* Historical Cutoffs (3 Years) */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'تطور الحد الأدنى للقبول (آخر 3 سنوات)' : 'Historical Admission Cutoffs'}
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-0.5">2023</div>
                <div className="font-mono font-bold text-slate-200">
                  {college.historicalCutoffs.year2023.toFixed(2)}%
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-0.5">2024</div>
                <div className="font-mono font-bold text-slate-200">
                  {college.historicalCutoffs.year2024.toFixed(2)}%
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                <div className="text-[11px] text-emerald-400 mb-0.5">2025</div>
                <div className="font-mono font-bold text-emerald-300">
                  {college.historicalCutoffs.year2025.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Academic Profile Details */}
          <div className="space-y-2.5 divide-y divide-slate-800/60">
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                {lang === 'ar' ? 'الدرجة العلمية الممنوحة:' : 'Degree Awarded:'}
              </span>
              <span className="text-slate-200 font-medium text-xs text-right max-w-[60%]">
                {college.degreeAwarded}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {lang === 'ar' ? 'سنوات الدراسة:' : 'Study Duration:'}
              </span>
              <span className="text-slate-200 font-medium text-xs">
                {college.studyDurationYears} {lang === 'ar' ? 'سنوات' : 'years'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                {lang === 'ar' ? 'المصروفات السنوية التقديرية:' : 'Estimated Annual Tuition:'}
              </span>
              <span className="text-slate-200 font-medium text-xs font-mono">
                {college.annualFeesEGP === 0 || !college.annualFeesEGP
                  ? (lang === 'ar' ? 'مجانية حكومية (رسوم رمزية)' : 'Government Free (Nominal fees)')
                  : `${college.annualFeesEGP.toLocaleString()} ${lang === 'ar' ? 'ج.م' : 'EGP'}`}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'ar' ? 'اعتماد المجلس الأعلى للجامعات:' : 'Supreme Council Accreditation:'}
              </span>
              <span className="text-emerald-400 font-medium text-xs">
                {college.isAccredited ? (lang === 'ar' ? 'معتمد رسمياً' : 'Fully Accredited') : (lang === 'ar' ? 'تحت الإجراء' : 'Pending')}
              </span>
            </div>
          </div>

          {/* Aptitude Test Notice */}
          {college.requiresAptitudeTest && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block mb-0.5">
                  {lang === 'ar' ? 'يشترط اجتياز اختبارات القدرات' : 'Aptitude Test Required'}
                </span>
                {college.aptitudeTestNameAr || (lang === 'ar' ? 'يجب حجز الاختبار عبر بوابة التنسيق قبل انتهاء المرحلة.' : 'Must book aptitude test before stage deadline.')}
              </div>
            </div>
          )}

          {/* Special note if available */}
          {college.specialNoteAr && (
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-200 block mb-1">
                {lang === 'ar' ? 'ملاحظة خاصة بالقبول:' : 'Admission Note:'}
              </span>
              {college.specialNoteAr}
            </div>
          )}

        </div>

        {/* Action Button Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center gap-3">
          <a
            href={college.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{lang === 'ar' ? 'زيارة الموقع الرسمي للكلية' : 'Visit Official Website'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
