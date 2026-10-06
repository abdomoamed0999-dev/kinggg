import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Cell
} from 'recharts';
import { College, EducationStream } from '../../types/tanseeqi';
import { MOCK_COLLEGES } from '../../data/mockTansikData';
import { TrendingUp, BarChart3, ChevronDown, Award } from 'lucide-react';

interface HistoricalTrendsChartProps {
  selectedTrack: EducationStream;
  userPercentage: number;
  lang?: 'ar' | 'en';
}

export const HistoricalTrendsChart: React.FC<HistoricalTrendsChartProps> = ({
  selectedTrack,
  userPercentage,
  lang = 'ar',
}) => {
  // Available colleges for this track
  const trackColleges = useMemo(() => {
    return MOCK_COLLEGES.filter(c => c.supportedStreams.includes(selectedTrack));
  }, [selectedTrack]);

  // Selected college to display in the chart
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(
    trackColleges[0]?.id || ''
  );

  // If track changed and selected college not in track, pick the first
  const activeCollege = useMemo(() => {
    const found = trackColleges.find(c => c.id === selectedCollegeId);
    return found || trackColleges[0] || null;
  }, [trackColleges, selectedCollegeId]);

  // Transform data for Recharts BarChart
  const chartData = useMemo(() => {
    if (!activeCollege) return [];

    return [
      {
        year: '2023',
        yearLabel: lang === 'ar' ? 'تنسيق 2023' : '2023 Cutoff',
        cutoff: activeCollege.historicalCutoffs.year2023,
      },
      {
        year: '2024',
        yearLabel: lang === 'ar' ? 'تنسيق 2024' : '2024 Cutoff',
        cutoff: activeCollege.historicalCutoffs.year2024,
      },
      {
        year: '2025',
        yearLabel: lang === 'ar' ? 'تنسيق 2025' : '2025 Cutoff',
        cutoff: activeCollege.historicalCutoffs.year2025,
      },
      {
        year: '2026',
        yearLabel: lang === 'ar' ? 'توقع 2026' : '2026 Expected',
        cutoff: activeCollege.cutoffPercentage,
      },
    ];
  }, [activeCollege, lang]);

  // Min and max for domain
  const yDomain = useMemo(() => {
    if (!chartData.length) return [50, 100];
    const cutoffs = chartData.map(d => d.cutoff);
    if (userPercentage > 0) cutoffs.push(userPercentage);
    const minVal = Math.floor(Math.min(...cutoffs) - 4);
    const maxVal = Math.ceil(Math.max(...cutoffs) + 3);
    return [Math.max(40, minVal), Math.min(100, maxVal)];
  }, [chartData, userPercentage]);

  if (!activeCollege) {
    return null;
  }

  // Calculate year-over-year trend
  const lastYearChange = activeCollege.cutoffPercentage - activeCollege.historicalCutoffs.year2025;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
      
      {/* Header and College Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>{lang === 'ar' ? 'مؤشرات التنسيق التاريخية' : 'Historical Cutoff Trends'}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-normal">
                (2023 - 2026)
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'ar' ? 'مقارنة الحد الأدنى للقبول مع مجموعك الحالي' : 'Year-over-year minimum thresholds vs your score'}
            </p>
          </div>
        </div>

        {/* Dropdown to pick college within current track */}
        <div className="relative min-w-[200px]">
          <select
            value={activeCollege.id}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            className="w-full h-9 pr-3 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer truncate"
          >
            {trackColleges.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === 'ar' ? c.nameAr : c.nameEn} ({c.cutoffPercentage}%)
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
        </div>
      </div>

      {/* College Info Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">
            {lang === 'ar' ? activeCollege.nameAr : activeCollege.nameEn}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-400">{activeCollege.governorate}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span className="text-slate-400">{lang === 'ar' ? 'تغير العام:' : 'Trend:'}</span>
            <span className={lastYearChange >= 0 ? 'text-emerald-400 font-bold' : 'text-sky-400 font-bold'}>
              {lastYearChange >= 0 ? `+${lastYearChange.toFixed(2)}%` : `${lastYearChange.toFixed(2)}%`}
            </span>
          </div>

          {userPercentage > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className="text-slate-400">{lang === 'ar' ? 'فارق مجموعك:' : 'Your Margin:'}</span>
              <span className={(userPercentage - activeCollege.cutoffPercentage) >= 0 ? 'text-emerald-400 font-bold' : 'text-purple-400 font-bold'}>
                {(userPercentage - activeCollege.cutoffPercentage) >= 0 
                  ? `+${(userPercentage - activeCollege.cutoffPercentage).toFixed(2)}%` 
                  : `${(userPercentage - activeCollege.cutoffPercentage).toFixed(2)}%`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-56 sm:h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              domain={yDomain} 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `${v}%`}
            />
            
            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-xl text-xs space-y-1 font-sans">
                      <div className="font-bold text-white">{data.yearLabel}</div>
                      <div className="text-emerald-400 font-mono font-bold">
                        {lang === 'ar' ? 'الحد الأدنى: ' : 'Cutoff: '}
                        {data.cutoff}%
                      </div>
                      {userPercentage > 0 && (
                        <div className="text-slate-400 font-mono text-[11px]">
                          {lang === 'ar' ? 'مجموعك الحالي: ' : 'Your Score: '}
                          {userPercentage.toFixed(2)}%
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Reference Line for user score */}
            {userPercentage > 0 && (
              <ReferenceLine
                y={userPercentage}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: lang === 'ar' ? `مجموعك: ${userPercentage.toFixed(1)}%` : `You: ${userPercentage.toFixed(1)}%`,
                  position: 'top',
                  fill: '#10b981',
                  fontSize: 11,
                  fontWeight: 'bold',
                }}
              />
            )}

            {/* Historical Cutoff Bars */}
            <Bar 
              dataKey="cutoff" 
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            >
              {chartData.map((entry, index) => {
                // Highlight 2026 expected bar differently
                const is2026 = entry.year === '2026';
                const meetsRequirement = userPercentage >= entry.cutoff;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      is2026
                        ? (meetsRequirement ? '#10b981' : '#a855f7')
                        : '#3b82f6'
                    }
                    opacity={is2026 ? 1 : 0.75}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 opacity-75" />
          <span>{lang === 'ar' ? 'السنوات السابقة (2023 - 2025)' : 'Past Years (2023 - 2025)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          <span>{lang === 'ar' ? 'توقع 2026 (مستوفي الحد)' : '2026 Target (Eligible)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
          <span>{lang === 'ar' ? 'توقع 2026 (أعلى من المجموع)' : '2026 Target (Reach)'}</span>
        </div>
        {userPercentage > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 border-t border-dashed" />
            <span className="text-emerald-400 font-semibold">{lang === 'ar' ? 'مجموع الطالب' : 'Student Score'}</span>
          </div>
        )}
      </div>

    </div>
  );
};
