import React, { useState } from 'react';
import { MOCK_TANSIK_STAGES } from '../../../data/mockTansikData';
import { AdmissionStatus, TansikStage } from '../../../types/tanseeqi';
import { 
  Radio, 
  Bell, 
  BellRing, 
  ExternalLink, 
  Calendar, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Sparkles
} from 'lucide-react';

interface LiveTrackerScreenProps {
  lang: 'ar' | 'en';
}

export const LiveTrackerScreen: React.FC<LiveTrackerScreenProps> = ({ lang }) => {
  const [subscribedStageIds, setSubscribedStageIds] = useState<string[]>(['stage_1', 'stage_diplomas']);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const toggleSubscription = (stage: TansikStage) => {
    if (subscribedStageIds.includes(stage.id)) {
      setSubscribedStageIds(prev => prev.filter(id => id !== stage.id));
      triggerToast(
        lang === 'ar' 
          ? `تم إلغاء تنبيهات: ${stage.titleAr}`
          : `Unsubscribed from alerts for: ${stage.titleEn}`
      );
    } else {
      setSubscribedStageIds(prev => [...prev, stage.id]);
      triggerToast(
        lang === 'ar' 
          ? `🔔 تم تفعيل إشعارات FCM الفورية لـ: ${stage.titleAr}`
          : `🔔 Push alerts enabled for: ${stage.titleEn}`
      );
    }
  };

  const triggerToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  };

  const getStatusBadge = (status: AdmissionStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === 'ar' ? '🟢 مفتوح للتسجيل الآن' : '🟢 Open for Application'}</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? '🟡 قادم قريباً / موعد محدد' : '🟡 Upcoming / Pending'}</span>
          </span>
        );
      case 'closed':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'ar' ? '🔴 مغلق / انتهت المرحلة' : '🔴 Closed / Finalized'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-12">
      
      {/* Toast Alert */}
      {notificationToast && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto p-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-xl flex items-center justify-between animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4" />
            <span>{notificationToast}</span>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">
              {lang === 'ar' ? 'تتبع مراحل التنسيق والقدرات (Live)' : 'Live Tansik Admission Tracker'}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {lang === 'ar' ? 'تحديث لحظي من الوزارة' : 'Official Sync'}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'ar'
            ? 'متابعة لحظية لحالات فتح وقفل مراحل التنسيق الحكومي والأهلي، مع تفعيل التنبيهات الفورية (Push Notifications) عبر Firebase Cloud Messaging.'
            : 'Real-time monitoring of all Egyptian Tansik phases, aptitude tests, and direct admissions.'}
        </p>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-emerald-400 font-extrabold text-lg font-mono">3</div>
          <div className="text-slate-400 text-[11px] mt-0.5">{lang === 'ar' ? 'مراحل مفتوحة' : 'Open Stages'}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-amber-400 font-extrabold text-lg font-mono">2</div>
          <div className="text-slate-400 text-[11px] mt-0.5">{lang === 'ar' ? 'مراحل قادمة' : 'Upcoming'}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-rose-400 font-extrabold text-lg font-mono">1</div>
          <div className="text-slate-400 text-[11px] mt-0.5">{lang === 'ar' ? 'مراحل منتهية' : 'Closed'}</div>
        </div>
      </div>

      {/* Stages Cards Feed */}
      <div className="space-y-3">
        {MOCK_TANSIK_STAGES.map((stage) => {
          const isSubscribed = subscribedStageIds.includes(stage.id);

          return (
            <div
              key={stage.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                stage.status === 'open'
                  ? 'bg-slate-900 border-emerald-500/30 shadow-sm shadow-emerald-500/5'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(stage.status)}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {lang === 'ar' ? stage.titleAr : stage.titleEn}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>{stage.targetStreamAr}</span>
                  </div>
                </div>

                {/* Notification Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleSubscription(stage)}
                  className={`p-2 rounded-xl transition-colors border ${
                    isSubscribed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={lang === 'ar' ? 'تفعيل تنبيهات المرحلة' : 'Toggle Stage Alert'}
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>

              {/* Threshold details if any */}
              {(stage.minPercentageScience || stage.minPercentageDiploma) && (
                <div className="my-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                  <span className="font-semibold text-slate-300 block mb-1">
                    {lang === 'ar' ? 'الحدود الدنيا المعلنة للتقديم في هذه المرحلة:' : 'Minimum Declared Thresholds:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {stage.minPercentageScience && (
                      <div className="text-slate-400">
                        <span>علمي علوم: </span>
                        <strong className="text-emerald-400 font-mono">{stage.minPercentageScience}%</strong>
                        <span className="text-[10px] text-slate-500"> ({stage.minScoreScience} د)</span>
                      </div>
                    )}
                    {stage.minPercentageMath && (
                      <div className="text-slate-400">
                        <span>علمي رياضة: </span>
                        <strong className="text-emerald-400 font-mono">{stage.minPercentageMath}%</strong>
                        <span className="text-[10px] text-slate-500"> ({stage.minScoreMath} د)</span>
                      </div>
                    )}
                    {stage.minPercentageArts && (
                      <div className="text-slate-400">
                        <span>أدبي: </span>
                        <strong className="text-emerald-400 font-mono">{stage.minPercentageArts}%</strong>
                        <span className="text-[10px] text-slate-500"> ({stage.minScoreArts} د)</span>
                      </div>
                    )}
                    {stage.minPercentageDiploma && (
                      <div className="text-slate-400 col-span-2">
                        <span>دبلومات فنية (3 و 5 سنوات): </span>
                        <strong className="text-emerald-400 font-mono">{stage.minPercentageDiploma}%</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Date & Note Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{stage.startDate}</span>
                  <span>←</span>
                  <span>{stage.endDate}</span>
                </div>

                <a
                  href={stage.activeOfficialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  <span>{lang === 'ar' ? 'بوابة التسجيل الرسمية' : 'Official Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {stage.notesAr && (
                <p className="mt-2 text-xs text-slate-400/90 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                  {stage.notesAr}
                </p>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
