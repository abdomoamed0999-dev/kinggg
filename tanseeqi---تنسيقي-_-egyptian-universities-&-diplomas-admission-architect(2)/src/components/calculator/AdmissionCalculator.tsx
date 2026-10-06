import React, { useState, useMemo, useEffect } from 'react';
import { 
  EducationStream, 
  College, 
  EligibilityTier, 
  GeographicGroup, 
  UniversityType,
  AcademicField
} from '../../types/tanseeqi';
import { 
  EGYPTIAN_GOVERNORATES, 
  MOCK_COLLEGES 
} from '../../data/mockTansikData';

export function resolveAcademicField(college: College): AcademicField {
  if (college.academicField) return college.academicField;
  const name = college.nameAr.toLowerCase();
  if (name.includes('طب') || name.includes('أسنان') || name.includes('صيدلة') || name.includes('تمريض') || name.includes('علاج طبيعي')) {
    return 'medical';
  }
  if (name.includes('هندسة') || name.includes('حاسبات') || name.includes('ذكاء') || name.includes('معلومات') || name.includes('برمجيات')) {
    return 'engineering';
  }
  if (name.includes('تجارة') || name.includes('إدارة') || name.includes('أعمال') || name.includes('مالية') || name.includes('تجاري') || name.includes('محاسبة')) {
    return 'business';
  }
  if (name.includes('اقتصاد') || name.includes('سياسة') || name.includes('إعلام') || name.includes('ألسن') || name.includes('حقوق') || name.includes('آداب') || name.includes('لغات')) {
    return 'humanities';
  }
  return 'technical_applied';
}
import { 
  Calculator, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  Filter,
  GraduationCap,
  Sparkles,
  History,
  Bookmark,
  BookmarkCheck,
  Trash2,
  RotateCcw,
  Clock,
  Check,
  X,
  BarChart3
} from 'lucide-react';
import { HistoricalTrendsChart } from './HistoricalTrendsChart';

export interface AdmissionHistoryEntry {
  id: string;
  timestamp: string;
  formattedDate: string;
  track: EducationStream;
  trackLabelAr: string;
  trackLabelEn: string;
  percentage: number;
  governorate: string;
  passedAptitude: boolean;
  guaranteedCount: number;
  likelyCount: number;
  aspirationalCount: number;
  totalResultsCount: number;
  topFacultiesPreview: string[];
}

export interface AdmissionCalculatorProps {
  onSelectCollege?: (college: College) => void;
  initialTrack?: EducationStream;
  initialPercentage?: number;
  initialGovernorate?: string;
  lang?: 'ar' | 'en';
  className?: string;
  variant?: 'full' | 'compact';
}

const STORAGE_KEY = 'tanseeqi_admission_history_v1';

export const AdmissionCalculator: React.FC<AdmissionCalculatorProps> = ({
  onSelectCollege,
  initialTrack = 'thanaweya_science',
  initialPercentage = 88.5,
  initialGovernorate = 'القاهرة',
  lang = 'ar',
  className = '',
  variant = 'full',
}) => {
  // State
  const [selectedTrack, setSelectedTrack] = useState<EducationStream>(initialTrack);
  const [percentageInput, setPercentageInput] = useState<string>(initialPercentage.toString());
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>(initialGovernorate);
  const [typeFilter, setTypeFilter] = useState<UniversityType | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<EligibilityTier | 'all'>('all');
  const [academicFieldFilter, setAcademicFieldFilter] = useState<AcademicField | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [passedAptitude, setPassedAptitude] = useState<boolean>(true);

  // Academic Categories Definition
  const academicCategories: Array<{ id: AcademicField | 'all'; labelAr: string; labelEn: string; icon: string }> = [
    { id: 'all', labelAr: 'جميع القطاعات', labelEn: 'All Fields', icon: '✨' },
    { id: 'medical', labelAr: 'القطاع الطبي والصحي', labelEn: 'Medical', icon: '🩺' },
    { id: 'engineering', labelAr: 'الهندسي والحاسبات', labelEn: 'Engineering', icon: '⚙️' },
    { id: 'humanities', labelAr: 'العلوم الإنسانية والإعلام', labelEn: 'Humanities', icon: '📚' },
    { id: 'business', labelAr: 'التجاري وإدارة الأعمال', labelEn: 'Business', icon: '💼' },
    { id: 'technical_applied', labelAr: 'التطبيقي والتكنولوجي', labelEn: 'Applied & Tech', icon: '🔧' },
  ];

  // History state
  const [savedHistory, setSavedHistory] = useState<AdmissionHistoryEntry[]>([]);
  const [showHistoryView, setShowHistoryView] = useState<boolean>(false);
  const [showTrendsChart, setShowTrendsChart] = useState<boolean>(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read admission history from localStorage', e);
    }
  }, []);

  // Save history to localStorage helper
  const persistHistory = (newHistory: AdmissionHistoryEntry[]) => {
    setSavedHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.warn('Could not write admission history to localStorage', e);
    }
  };

  // Group educational tracks into categories for clean selection
  const trackGroups = [
    {
      categoryAr: 'الثانوية العامة',
      categoryEn: 'General Secondary',
      tracks: [
        { id: 'thanaweya_science', labelAr: 'علمي علوم', labelEn: 'Science' },
        { id: 'thanaweya_math', labelAr: 'علمي رياضة', labelEn: 'Math' },
        { id: 'thanaweya_arts', labelAr: 'أدبي', labelEn: 'Literature' },
      ],
    },
    {
      categoryAr: 'الدبلومات الفنية (نظام 3 و 5 سنوات)',
      categoryEn: 'Technical Diplomas (3Y & 5Y)',
      tracks: [
        { id: 'diploma_industrial_3y', labelAr: 'صناعي (3 سنين)', labelEn: 'Industrial 3Y' },
        { id: 'diploma_industrial_5y', labelAr: 'صناعي (5 سنين)', labelEn: 'Industrial 5Y' },
        { id: 'diploma_commercial_3y', labelAr: 'تجاري (3 سنين)', labelEn: 'Commercial 3Y' },
        { id: 'diploma_commercial_5y', labelAr: 'تجاري (5 سنين)', labelEn: 'Commercial 5Y' },
        { id: 'diploma_agricultural_3y', labelAr: 'زراعي (3 سنين)', labelEn: 'Agricultural 3Y' },
        { id: 'diploma_tourism_3y', labelAr: 'سياحة وفنادق', labelEn: 'Tourism & Hotels' },
      ],
    },
  ];

  // Helper to get localized track name
  const getTrackLabels = (trackId: EducationStream) => {
    for (const group of trackGroups) {
      const found = group.tracks.find(t => t.id === trackId);
      if (found) return found;
    }
    return { labelAr: trackId, labelEn: trackId };
  };

  // Numeric percentage parsing
  const numericPercentage = useMemo(() => {
    const val = parseFloat(percentageInput);
    if (isNaN(val)) return 0;
    return Math.min(100, Math.max(0, val));
  }, [percentageInput]);

  // Quick percentage presets
  const percentagePresets = [95, 90, 85, 78, 70, 65, 58];

  // Count available faculties per academic field for current track
  const fieldCounts = useMemo(() => {
    const counts: Record<AcademicField | 'all', number> = {
      all: 0,
      medical: 0,
      engineering: 0,
      humanities: 0,
      business: 0,
      technical_applied: 0,
    };
    const trackEligible = MOCK_COLLEGES.filter(c => c.supportedStreams.includes(selectedTrack));
    counts.all = trackEligible.length;
    for (const c of trackEligible) {
      const f = resolveAcademicField(c);
      counts[f] = (counts[f] || 0) + 1;
    }
    return counts;
  }, [selectedTrack]);

  // Filtering calculation logic
  const calculatedItems = useMemo(() => {
    if (numericPercentage <= 0) return [];

    return MOCK_COLLEGES.filter((college) => {
      // 1. Check supported educational stream
      const isTrackSupported = college.supportedStreams.includes(selectedTrack);
      if (!isTrackSupported) return false;

      // 2. Check university type filter
      if (typeFilter !== 'all' && college.type !== typeFilter) {
        return false;
      }

      // 3. Check academic field / category filter (Medical, Engineering, Humanities, Business, Technical)
      if (academicFieldFilter !== 'all') {
        const field = resolveAcademicField(college);
        if (field !== academicFieldFilter) {
          return false;
        }
      }

      // 4. Check search query (faculty name, university name, code, or governorate)
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesName = 
          college.nameAr.toLowerCase().includes(query) ||
          college.nameEn.toLowerCase().includes(query) ||
          college.universityNameAr.toLowerCase().includes(query) ||
          college.tansikCode.includes(query) ||
          college.governorate.includes(query);
        if (!matchesName) return false;
      }

      return true;
    }).map((college) => {
      const margin = numericPercentage - college.cutoffPercentage;
      const geoGroup: GeographicGroup = college.geographicGroupMap[selectedGovernorate] || 'C';

      let tier: EligibilityTier;
      if (margin >= 1.5) {
        tier = 'guaranteed';
      } else if (margin >= -1.5) {
        tier = 'likely';
      } else if (margin >= -5.0) {
        tier = 'aspirational';
      } else {
        tier = 'alternative';
      }

      if (college.requiresAptitudeTest && !passedAptitude) {
        tier = 'alternative';
      }

      return {
        college,
        tier,
        margin,
        geoGroup,
      };
    });
  }, [numericPercentage, selectedTrack, typeFilter, searchFilter, selectedGovernorate, passedAptitude]);

  // Tier counts
  const tierSummary = useMemo(() => {
    let guaranteed = 0;
    let likely = 0;
    let aspirational = 0;
    for (const item of calculatedItems) {
      if (item.tier === 'guaranteed') guaranteed++;
      else if (item.tier === 'likely') likely++;
      else if (item.tier === 'aspirational') aspirational++;
    }
    return {
      guaranteed,
      likely,
      aspirational,
      total: calculatedItems.length,
      sampleNames: calculatedItems.slice(0, 3).map(i => i.college.nameAr),
    };
  }, [calculatedItems]);

  // Filtered by active tier tab
  const displayResults = useMemo(() => {
    const list = tierFilter === 'all' 
      ? calculatedItems 
      : calculatedItems.filter(i => i.tier === tierFilter);

    return [...list].sort((a, b) => {
      const tierRank: Record<EligibilityTier, number> = {
        guaranteed: 1,
        likely: 2,
        aspirational: 3,
        alternative: 4,
      };
      if (tierRank[a.tier] !== tierRank[b.tier]) {
        return tierRank[a.tier] - tierRank[b.tier];
      }
      const geoRank: Record<GeographicGroup, number> = { A: 1, B: 2, C: 3 };
      if (geoRank[a.geoGroup] !== geoRank[b.geoGroup]) {
        return geoRank[a.geoGroup] - geoRank[b.geoGroup];
      }
      return b.margin - a.margin;
    });
  }, [calculatedItems, tierFilter]);

  // Handle Save to Local Admission History
  const handleSaveCalculation = () => {
    if (numericPercentage <= 0) return;

    const trackLabel = getTrackLabels(selectedTrack);
    const now = new Date();
    const formatted = now.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newEntry: AdmissionHistoryEntry = {
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now.toISOString(),
      formattedDate: formatted,
      track: selectedTrack,
      trackLabelAr: trackLabel.labelAr,
      trackLabelEn: trackLabel.labelEn,
      percentage: numericPercentage,
      governorate: selectedGovernorate,
      passedAptitude,
      guaranteedCount: tierSummary.guaranteed,
      likelyCount: tierSummary.likely,
      aspirationalCount: tierSummary.aspirational,
      totalResultsCount: tierSummary.total,
      topFacultiesPreview: tierSummary.sampleNames,
    };

    const updated = [newEntry, ...savedHistory.filter(h => !(h.track === selectedTrack && h.percentage === numericPercentage && h.governorate === selectedGovernorate))];
    // Keep max 25 saved records
    const sliced = updated.slice(0, 25);
    persistHistory(sliced);

    setSaveToast(
      lang === 'ar' 
        ? `تم حفظ نتيجة (${numericPercentage.toFixed(2)}% - ${trackLabel.labelAr}) في السجل!`
        : `Calculation for (${numericPercentage.toFixed(2)}%) saved to history!`
    );
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Restore calculation from history
  const handleRestoreCalculation = (entry: AdmissionHistoryEntry) => {
    setSelectedTrack(entry.track);
    setPercentageInput(entry.percentage.toString());
    setSelectedGovernorate(entry.governorate);
    setPassedAptitude(entry.passedAptitude);
    setShowHistoryView(false);

    setSaveToast(
      lang === 'ar'
        ? `تم استرجاع الحسبة: ${entry.trackLabelAr} (${entry.percentage}%)`
        : `Restored calculation: ${entry.trackLabelEn} (${entry.percentage}%)`
    );
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Delete single history entry
  const handleDeleteHistoryEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedHistory.filter(h => h.id !== id);
    persistHistory(filtered);
  };

  // Clear all history
  const handleClearAllHistory = () => {
    persistHistory([]);
  };

  const getTierBadge = (tier: EligibilityTier) => {
    switch (tier) {
      case 'guaranteed':
        return {
          label: lang === 'ar' ? 'مؤكد ومضمون' : 'Guaranteed',
          className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
      case 'likely':
        return {
          label: lang === 'ar' ? 'محتمل ومتأرجح' : 'Likely (Close)',
          className: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        };
      case 'aspirational':
        return {
          label: lang === 'ar' ? 'طموح' : 'Aspirational',
          className: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        };
      case 'alternative':
        return {
          label: lang === 'ar' ? 'معاهد وبدائل' : 'Alternative Institutes',
          className: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        };
    }
  };

  const getTypeName = (type: UniversityType) => {
    switch (type) {
      case 'public': return lang === 'ar' ? 'جامعة حكومية' : 'Public';
      case 'national': return lang === 'ar' ? 'جامعة أهلية' : 'National';
      case 'private': return lang === 'ar' ? 'جامعة خاصة' : 'Private';
      case 'technological': return lang === 'ar' ? 'جامعة تكنولوجية' : 'Technological';
      case 'higher_institute': return lang === 'ar' ? 'معهد عالي' : 'Higher Inst.';
      case 'technical_institute': return lang === 'ar' ? 'معهد فني' : 'Technical Inst.';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast(null)} className="p-0.5 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Track & Percentage Input Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        
        {/* Title Header with History and Save Buttons */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              {lang === 'ar' ? 'حاسبة القبول الجامعي الذكية' : 'Smart Admission Calculator'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Trends Chart Toggle Button */}
            <button
              type="button"
              onClick={() => setShowTrendsChart(!showTrendsChart)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                showTrendsChart
                  ? 'bg-slate-200 text-slate-950 border-slate-300 font-bold'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
              title={lang === 'ar' ? 'عرض / إخفاء الرسم البياني للمؤشرات' : 'Toggle Trends Chart'}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الرسم البياني' : 'Trends'}</span>
            </button>

            {/* View History Button with Counter */}
            <button
              type="button"
              onClick={() => setShowHistoryView(!showHistoryView)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                showHistoryView
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
              title={lang === 'ar' ? 'سجل الحسابات المحفوظة' : 'Saved Admission History'}
            >
              <History className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'السجل' : 'History'}</span>
              {savedHistory.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  showHistoryView ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {savedHistory.length}
                </span>
              )}
            </button>

            {/* Save Current Calculation Button */}
            <button
              type="button"
              onClick={handleSaveCalculation}
              disabled={numericPercentage <= 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all disabled:opacity-40"
              title={lang === 'ar' ? 'حفظ النتيجة الحالية في السجل المحلي' : 'Save current calculation'}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'حفظ الحسبة' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* 2. Collapsible Admission History Panel */}
        {showHistoryView && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'ar' ? 'سجل الحسابات السابقة المحفوظة محلياً' : 'Local Admission History'}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  ({savedHistory.length})
                </span>
              </div>

              {savedHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'مسح السجل' : 'Clear all'}</span>
                </button>
              )}
            </div>

            {savedHistory.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs space-y-1">
                <History className="w-6 h-6 mx-auto text-slate-600 mb-1" />
                <p>{lang === 'ar' ? 'لا توجد حسبات سابقة محفوظة بعد.' : 'No saved calculations in history yet.'}</p>
                <p className="text-[11px] text-slate-500">
                  {lang === 'ar' 
                    ? 'أدخل مجموعك واضغط "حفظ الحسبة" للرجوع إليها في أي وقت.' 
                    : 'Enter your score and click "Save" to record it here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {savedHistory.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => handleRestoreCalculation(entry)}
                    className="p-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-emerald-500/40 transition-all cursor-pointer group flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      
                      {/* Top metadata */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-bold text-emerald-400">
                          {lang === 'ar' ? entry.trackLabelAr : entry.trackLabelEn}
                        </span>
                        <span>·</span>
                        <span>{entry.governorate}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-400">{entry.formattedDate}</span>
                      </div>

                      {/* Percentage and metric breakdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-white font-mono">
                          {entry.percentage.toFixed(2)}%
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-semibold">
                            {entry.guaranteedCount} {lang === 'ar' ? 'مؤكد' : 'Guaranteed'}
                          </span>
                          <span className="text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded font-semibold">
                            {entry.likelyCount} {lang === 'ar' ? 'محتمل' : 'Likely'}
                          </span>
                          <span className="text-slate-400">
                            ({entry.totalResultsCount} {lang === 'ar' ? 'كلية' : 'colleges'})
                          </span>
                        </div>
                      </div>

                      {/* Faculty sample */}
                      {entry.topFacultiesPreview && entry.topFacultiesPreview.length > 0 && (
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {entry.topFacultiesPreview.join('، ')}
                        </p>
                      )}

                    </div>

                    {/* Actions: Restore & Delete */}
                    <div className="flex items-center gap-1 shrink-0 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestoreCalculation(entry);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-colors"
                        title={lang === 'ar' ? 'استرجاع هذه الحسبة' : 'Restore calculation'}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteHistoryEntry(entry.id, e)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
                        title={lang === 'ar' ? 'حذف من السجل' : 'Delete entry'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Track Selection Groups */}
        <div className="space-y-2.5">
          {trackGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 block">
                {lang === 'ar' ? group.categoryAr : group.categoryEn}:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {group.tracks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrack(t.id as EducationStream)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all truncate border ${
                      selectedTrack === t.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm shadow-emerald-500/20'
                        : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? t.labelAr : t.labelEn}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Percentage Input and Presets */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'ar' ? 'النسبة المئوية الحاصل عليها (%):' : 'Score Percentage (%):'}
            </label>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">
              {numericPercentage.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                max="100"
                step="0.05"
                value={percentageInput}
                onChange={(e) => setPercentageInput(e.target.value)}
                placeholder="أدخل النسبة مثلاً 88.5"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <span className="absolute left-3 top-3 text-xs text-slate-500 font-mono">
                %
              </span>
            </div>

            {/* Governorate selector */}
            <div className="w-36 relative">
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
              >
                {EGYPTIAN_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="text-[11px] text-slate-400 shrink-0">
              {lang === 'ar' ? 'أمثلة سريعة:' : 'Presets:'}
            </span>
            {percentagePresets.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setPercentageInput(pct.toString())}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-colors border ${
                  numericPercentage === pct
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

        </div>

        {/* Aptitude Test Checkbox */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs text-slate-300">
          <span>{lang === 'ar' ? 'اجتياز اختبارات القدرات (فنون / رياضة / تمريض)' : 'Aptitude Tests Passed'}</span>
          <button
            type="button"
            onClick={() => setPassedAptitude(!passedAptitude)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              passedAptitude ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                passedAptitude ? (lang === 'ar' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
              }`}
            />
          </button>
        </div>

      </div>

      {/* 2. Historical Trends Visualization with Recharts */}
      {showTrendsChart && (
        <HistoricalTrendsChart
          selectedTrack={selectedTrack}
          userPercentage={numericPercentage}
          lang={lang}
        />
      )}

      {/* 3. Filter Bar & Search */}
      <div className="space-y-2">
        
        {/* Enhanced Search Input Field */}
        <div className="relative">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={
              lang === 'ar' 
                ? 'ابحث باسم الكلية (طب، هندسة، تمريض..)، الجامعة، المحافظة أو كود التنسيق...' 
                : 'Search by faculty name, university, governorate, or tansik code...'
            }
            className="w-full h-11 pr-10 pl-10 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          
          {searchFilter.trim() && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="absolute left-3 top-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={lang === 'ar' ? 'مسح البحث' : 'Clear search'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter (Medical, Engineering, Humanities, Business, Technical & Applied) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400 px-0.5">
            <span className="font-semibold text-slate-300">
              {lang === 'ar' ? 'تصنيف القطاع الأكاديمي والتخصص:' : 'Academic Category Filter:'}
            </span>
            {academicFieldFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setAcademicFieldFilter('all')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
              >
                {lang === 'ar' ? 'عرض جميع القطاعات' : 'Show all categories'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {academicCategories.map((cat) => {
              const count = fieldCounts[cat.id];
              const isSelected = academicFieldFilter === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setAcademicFieldFilter(cat.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === 'ar' ? cat.labelAr : cat.labelEn}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setTierFilter('all')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              tierFilter === 'all'
                ? 'bg-slate-200 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? `الكل (${calculatedItems.length})` : `All (${calculatedItems.length})`}
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('guaranteed')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              tierFilter === 'guaranteed'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? `مؤكد 🟢 (${tierSummary.guaranteed})` : `Guaranteed 🟢 (${tierSummary.guaranteed})`}
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('likely')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              tierFilter === 'likely'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? `محتمل 🟡 (${tierSummary.likely})` : `Likely 🟡 (${tierSummary.likely})`}
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('aspirational')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              tierFilter === 'aspirational'
                ? 'bg-purple-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? `طموح 🟣 (${tierSummary.aspirational})` : `Aspirational 🟣 (${tierSummary.aspirational})`}
          </button>
        </div>

      </div>

      {/* 4. Filtered Results List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            {lang === 'ar'
              ? `الكليات المتاحة لنسبة (${numericPercentage.toFixed(2)}%) بمحافظة (${selectedGovernorate}):`
              : `Available faculties for (${numericPercentage.toFixed(2)}%) in (${selectedGovernorate}):`}
          </span>
          <span className="font-mono text-emerald-400 font-bold">{displayResults.length}</span>
        </div>

        {displayResults.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
            <GraduationCap className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-sm font-semibold text-slate-300">
              {lang === 'ar' ? 'لا توجد كليات مطابقة للمحددات الحالية' : 'No matching faculties found'}
            </p>
            <p className="text-xs text-slate-500">
              {lang === 'ar' ? 'جرب تجربة نسبة مئوية أخرى أو إزالة قيود البحث وتصنيف القطاع.' : 'Try adjusting your score or clearing search and category filters.'}
            </p>
            {(searchFilter || academicFieldFilter !== 'all' || tierFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchFilter('');
                  setAcademicFieldFilter('all');
                  setTierFilter('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs text-emerald-400 font-semibold transition-colors border border-slate-700"
              >
                {lang === 'ar' ? 'إعادة ضبط البحث والتصنيف' : 'Reset search & filters'}
              </button>
            )}
          </div>
        ) : (
          displayResults.map(({ college, tier, margin, geoGroup }) => {
            const badge = getTierBadge(tier);

            return (
              <div
                key={college.id}
                onClick={() => onSelectCollege && onSelectCollege(college)}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-start justify-between gap-3">
                  
                  <div className="space-y-1 flex-1">
                    {/* Metadata line: zero-pill typography */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-emerald-400 font-semibold">{college.tansikCode}</span>
                      <span>·</span>
                      <span className="text-slate-300">{getTypeName(college.type)}</span>
                      <span>·</span>
                      <span>{college.governorate}</span>
                      <span>·</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        geoGroup === 'A' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {lang === 'ar' ? `نطاق (${geoGroup})` : `Zone (${geoGroup})`}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {lang === 'ar' ? college.nameAr : college.nameEn}
                    </h3>

                    <p className="text-xs text-slate-400">
                      {lang === 'ar' ? college.universityNameAr : college.universityNameEn}
                    </p>
                  </div>

                  {/* Cutoff & Tier */}
                  <div className="text-right shrink-0 flex flex-col items-end">
                    <div className="font-mono text-sm font-extrabold text-white">
                      {college.cutoffPercentage.toFixed(2)}%
                    </div>
                    
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border mt-1 ${badge.className}`}>
                      {badge.label}
                    </span>

                    <span className={`text-[11px] font-mono mt-0.5 ${
                      margin >= 0 ? 'text-emerald-400' : 'text-purple-400'
                    }`}>
                      {margin >= 0 ? `+${margin.toFixed(2)}%` : `${margin.toFixed(2)}%`}
                    </span>
                  </div>

                </div>

                {/* Aptitude notice tag */}
                {college.requiresAptitudeTest && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-300/90">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {lang === 'ar' ? 'يشترط اجتياز اختبار القدرات' : 'Requires Aptitude Test'}
                    </span>
                    <span className="text-slate-400 flex items-center gap-0.5 group-hover:text-emerald-400 transition-colors">
                      {lang === 'ar' ? 'عرض التفاصيل' : 'Details'}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
