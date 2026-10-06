import React, { useState, useMemo } from 'react';
import { MOCK_COLLEGES } from '../../../data/mockTansikData';
import { College, UniversityType } from '../../../types/tanseeqi';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Coins, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface DirectoryScreenProps {
  onSelectCollege: (college: College) => void;
  lang: 'ar' | 'en';
}

export const DirectoryScreen: React.FC<DirectoryScreenProps> = ({
  onSelectCollege,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'national' | 'private' | 'higher_institute'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxFeesFilter, setMaxFeesFilter] = useState<number>(200000);

  // Filter non-public or institutes directory
  const nonPublicColleges = useMemo(() => {
    return MOCK_COLLEGES.filter(c => c.type !== 'public' && c.type !== 'technical_institute');
  }, []);

  const filteredColleges = useMemo(() => {
    return nonPublicColleges.filter(c => {
      // Category tab
      if (activeTab !== 'all' && c.type !== activeTab) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.nameAr.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q);
        const matchesUni = c.universityNameAr.toLowerCase().includes(q) || c.universityNameEn.toLowerCase().includes(q);
        const matchesGov = c.governorate.toLowerCase().includes(q);
        if (!matchesName && !matchesUni && !matchesGov) return false;
      }
      // Fees filter
      if (c.annualFeesEGP && c.annualFeesEGP > maxFeesFilter) {
        return false;
      }
      return true;
    });
  }, [nonPublicColleges, activeTab, searchQuery, maxFeesFilter]);

  const getTypeName = (type: UniversityType) => {
    switch (type) {
      case 'national': return lang === 'ar' ? 'جامعة أهلية' : 'National University';
      case 'private': return lang === 'ar' ? 'جامعة خاصة' : 'Private University';
      case 'technological': return lang === 'ar' ? 'جامعة تكنولوجية' : 'Technological University';
      case 'higher_institute': return lang === 'ar' ? 'معهد عالي خاص' : 'Higher Private Institute';
      default: return type;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      
      {/* Intro Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              {lang === 'ar' ? 'دليل الجامعات الأهلية والخاصة والمعاهد' : 'National & Private Universities Directory'}
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            {lang === 'ar' ? 'معتمدة رسمياً' : 'Accredited'}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'ar'
            ? 'دليل استرشادي شامل يضم المصروفات السنوية، الحدود الدنيا للقبول المباشر، حالة اعتماد المجلس الأعلى للجامعات، وروابط التسجيل المباشرة.'
            : 'Comprehensive directory with fees, accreditation status, minimum scores, and direct application links.'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث باسم الكلية أو الجامعة أو المحافظة...' : 'Search by faculty, university, or governorate...'}
            className="w-full h-11 pr-10 pl-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-200 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'الكل' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('national')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'national'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'جامعات أهلية' : 'National'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('private')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'private'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'جامعات خاصة' : 'Private'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('higher_institute')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'higher_institute'
                ? 'bg-purple-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'معاهد عليا خاصة' : 'Higher Institutes'}
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredColleges.map((college) => (
          <div
            key={college.id}
            onClick={() => onSelectCollege(college)}
            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400">{getTypeName(college.type)}</span>
                  <span>·</span>
                  <span>{college.governorate}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'معتمد' : 'Accredited'}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {lang === 'ar' ? college.nameAr : college.nameEn}
                </h3>

                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? college.universityNameAr : college.universityNameEn}
                </p>
              </div>

              {/* Min Percentage Tag */}
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'الحد الأدنى' : 'Min Cutoff'}</span>
                <span className="font-mono font-extrabold text-sm text-emerald-400">
                  {college.cutoffPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Bottom Row: Fees & Direct Apply Link */}
            <div className="pt-2.5 mt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'المصروفات السنوية:' : 'Tuition:'}</span>
                <span className="font-mono font-bold text-white">
                  {college.annualFeesEGP ? `${college.annualFeesEGP.toLocaleString()} ج.م` : 'غير محدد'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-emerald-400 group-hover:text-emerald-300 font-semibold">
                <span>{lang === 'ar' ? 'تفاصيل التقديم' : 'View Details'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        ))}

        {filteredColleges.length === 0 && (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
            <p className="text-sm">
              {lang === 'ar' ? 'لا توجد نتائج تطابق بحثك الحالي.' : 'No institutions match your search.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
