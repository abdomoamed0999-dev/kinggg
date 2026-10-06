import React, { useState } from 'react';
import { 
  Database, 
  FileCode, 
  Layers, 
  Workflow, 
  DollarSign, 
  Calendar, 
  Copy, 
  Check, 
  Download,
  Terminal,
  Server,
  Smartphone,
  Cpu
} from 'lucide-react';
import { 
  FIRESTORE_SCHEMA_DOC, 
  FIRESTORE_RULES_DOC, 
  POSTGRES_SQL_SCHEMA, 
  ZERO_UPDATE_JSON_PAYLOAD, 
  FLUTTER_ENGINE_CODE, 
  REACT_NATIVE_ENGINE_CODE, 
  MONETIZATION_STRATEGY, 
  FOUR_WEEK_ROADMAP 
} from '../../data/architectureDocs';

interface ArchitecturePortalProps {
  lang: 'ar' | 'en';
}

export const ArchitecturePortal: React.FC<ArchitecturePortalProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'db' | 'json' | 'engine' | 'workflow' | 'monetization' | 'roadmap'>('db');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title & Architecture Summary Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Server className="w-4 h-4" />
            <span>Lead Software Architect & Product Specification</span>
            <span>·</span>
            <span>Tanseeqi Engine v2026.3</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'ar' 
              ? 'المخطط الهندسي والمعماري المتكامل لتطبيق "تنسيقي"' 
              : 'Tanseeqi Comprehensive Architecture & Technical Blueprint'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'المواصفات الفنية المعتمدة لدعم طلاب الثانوية العامة والدبلومات الفنية (صناعي، تجاري، زراعي، سياحة وفنادق 3 و5 سنوات)، تشمل مخططات قواعد البيانات (NoSQL & SQL)، محرك الحساب اللحظي، نظام التحديث بدون نشر إصدارات جديدة (OTA Config)، واستراتيجية تحقيق الدخل وخارطة طريق الـ 4 أسابيع.'
              : 'End-to-end technical specification, database models, calculation engines, zero-update over-the-air JSON models, monetization strategy, and 4-week execution roadmap.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <div><strong className="text-white">Target Platforms:</strong> Flutter 3.x / React Native Expo</div>
            <div><strong className="text-white">Backend:</strong> Firebase Firestore / Supabase Edge</div>
            <div><strong className="text-white">OTA Latency:</strong> &lt; 250ms (Cloudflare CDN)</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        
        <button
          onClick={() => setActiveTab('db')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'db'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{lang === 'ar' ? '1. قواعد البيانات (Firestore & PostgreSQL)' : '1. Database Schemas'}</span>
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'json'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>{lang === 'ar' ? '2. نموذج الـ JSON بدون تحديث المتجر (OTA)' : '2. Zero-Update JSON'}</span>
        </button>

        <button
          onClick={() => setActiveTab('engine')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'engine'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{lang === 'ar' ? '3. محرك الحساب (Flutter & React Native)' : '3. Engine Code (Flutter & RN)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'workflow'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>{lang === 'ar' ? '4. مسار الشاشات وتجربة المستخدم' : '4. UI/UX Workflow'}</span>
        </button>

        <button
          onClick={() => setActiveTab('monetization')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'monetization'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{lang === 'ar' ? '5. استراتيجية تحقيق الدخل' : '5. Monetization Strategy'}</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'roadmap'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{lang === 'ar' ? '6. خطة الـ 4 أسابيع (MVP)' : '6. 4-Week Roadmap'}</span>
        </button>

      </div>

      {/* Tab 1: Database Schemas */}
      {activeTab === 'db' && (
        <div className="space-y-6">
          
          {/* Firestore NoSQL Section */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>Google Cloud Firestore Schema (NoSQL Document Store)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  مخطط الوثائق المتطابقة مع هيكل التطبيق وقواعد الأمان المشددة (Security Rules)
                </p>
              </div>
              <button
                onClick={() => handleCopy('firestore', FIRESTORE_SCHEMA_DOC)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                {copiedKey === 'firestore' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'firestore' ? 'تم النسخ' : 'نسخ Schema'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[380px]">
              {FIRESTORE_SCHEMA_DOC}
            </pre>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                قواعد الحماية والصلاحيات المشددة (firestore.rules):
              </h4>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed max-h-[260px]">
                {FIRESTORE_RULES_DOC}
              </pre>
            </div>
          </div>

          {/* Relational PostgreSQL Schema */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-sky-400" />
                  <span>Supabase / PostgreSQL Schema (001_initial_tansik_schema.sql)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  المخطط العلائقي الكامل المزود بالفهارس المركبة (Composite B-Tree Indexes) لتحمل ذروة التنسيق
                </p>
              </div>
              <button
                onClick={() => handleCopy('postgres', POSTGRES_SQL_SCHEMA)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                {copiedKey === 'postgres' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'postgres' ? 'تم النسخ' : 'نسخ SQL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[420px]">
              {POSTGRES_SQL_SCHEMA}
            </pre>
          </div>

        </div>
      )}

      {/* Tab 2: Zero-Update JSON Config */}
      {activeTab === 'json' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-emerald-400" />
                  <span>Over-The-Air (OTA) Zero-Update JSON Architecture</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  استراتيجية البيانات التي تتيح للوزارة أو إدارة التطبيق تحديث الحدود الدنيا ومواعيد المراحل فورياً بمجرد إعلانها رسمياً عبر CDN، بدون الحاجة لموافقة أو نشر تحديث جديد على متجر Google Play أو Apple App Store.
                </p>
              </div>
              <button
                onClick={() => handleCopy('json_payload', ZERO_UPDATE_JSON_PAYLOAD)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                {copiedKey === 'json_payload' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ JSON</span>
              </button>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-emerald-400 block mb-1">1. HTTP Caching Headers</strong>
                <span className="text-slate-400">max-age=300 مع stale-while-revalidate لتوفير استجابة فورية مع التحديث في الخلفية.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-sky-400 block mb-1">2. Local Storage Sync</strong>
                <span className="text-slate-400">تخزين نسخة احتياطية في MMKV أو AsyncStorage ليعمل التطبيق بدون اتصال بالإنترنت (Offline Mode).</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-purple-400 block mb-1">3. Dynamic Delta Updates</strong>
                <span className="text-slate-400">تحديث الكليات التي تغير حدها الأدنى فقط (Delta) لتقليل استهلاك باقة الموبايل لطلاب مصر.</span>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[440px]">
              {ZERO_UPDATE_JSON_PAYLOAD}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Cross-Platform Implementation Code */}
      {activeTab === 'engine' && (
        <div className="space-y-6">
          
          {/* Flutter Clean Architecture */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-sky-400" />
                  <span>Flutter Clean Architecture - Tansik Calculator Engine (BLoC)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  كود محرك التنسيق بلغة Dart مع تطبيق قواعد التوزيع الجغرافي (أ، ب، ج) واختبارات القدرات
                </p>
              </div>
              <button
                onClick={() => handleCopy('flutter', FLUTTER_ENGINE_CODE)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                {copiedKey === 'flutter' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ Flutter Code</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed max-h-[360px]">
              {FLUTTER_ENGINE_CODE}
            </pre>
          </div>

          {/* React Native Code */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-teal-400" />
                  <span>React Native / Expo - Zustand & TanStack Query State Layer</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  إدارة الحالة والمزامنة مع التخزين المحلي والـ Cache
                </p>
              </div>
              <button
                onClick={() => handleCopy('react_native', REACT_NATIVE_ENGINE_CODE)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
              >
                {copiedKey === 'react_native' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ React Native Code</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-teal-300 overflow-x-auto leading-relaxed max-h-[320px]">
              {REACT_NATIVE_ENGINE_CODE}
            </pre>
          </div>

        </div>
      )}

      {/* Tab 4: UI/UX Screen Workflow */}
      {activeTab === 'workflow' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-emerald-400" />
              <span>مخطط تدفق شاشات تجربة المستخدم (UI/UX User Journey Matrix)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              رحلة الطالب الكاملة خطوة بخطوة من شاشة البداية وحتى استخراج بطاقة الرغبات والتقديم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm">المرحلة 1: التهيئة وتحديد المسار (Stream Selection)</span>
              <p className="text-slate-300 leading-relaxed">
                • اختيار نوع الشهادة: ثانوية عامة (علمي علوم / علمي رياضة / أدبي) أو دبلوم فني (صناعي / تجاري / زراعي / سياحة وفنادق).<br/>
                • تحديد نظام الدبلوم: 3 سنوات أو 5 سنوات (لضبط معادلة المجموع تلقائياً).<br/>
                • طلب إذن الإشعارات الفورية للمراحل (FCM Push Permission) مع شرح القيمة المضافة.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm">المرحلة 2: إدخال المجموع والتوزيع الجغرافي (Score Input)</span>
              <p className="text-slate-300 leading-relaxed">
                • إدخال الدرجات أو النسبة المئوية مع المعايرة الفورية للمجموع الكلي (410، 700، 1000).<br/>
                • اختيار المحافظة لحساب التوزيع الجغرافي الإلزامي (مجموعة أ، ب، ج).<br/>
                • تأكيد اجتياز اختبارات القدرات (للكليات التي تشترطها كالفنون والتربية الرياضية).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 text-sm">المرحلة 3: عرض وتصنيف النتائج (Categorized Matrix)</span>
              <p className="text-slate-300 leading-relaxed">
                • تصنيف النتائج إلى: مؤكد ومضمون (أعلى من الحد بـ 1.5%+)، محتمل ومتأرجح (في حدود ±1.5%)، وطموح.<br/>
                • فلترة سريعة حسب نوع الجامعة: حكومية، أهلية، خاصة، تكنولوجية، أو معاهد عليا.<br/>
                • إبراز بطاقة الجامعة الشريكة (Sponsored Partner) لخيارات القبول المباشر.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm">المرحلة 4: تفاصيل الكلية وبطاقة الرغبات (College Detail)</span>
              <p className="text-slate-300 leading-relaxed">
                • عرض كود طابع التنسيق الرسمي لتسهيل كتابته على موقع الحكومة.<br/>
                • رسم بياني لمؤشرات الحد الأدنى لآخر 3 سنوات متتالية.<br/>
                • المصروفات السنوية، والدرجة العلمية الممنوحة، والرابط الرسمي للتقديم.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Tab 5: Monetization Strategy */}
      {activeTab === 'monetization' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>استراتيجية توليد الإيرادات (Monetization & Growth Blueprint)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                توليد دخل مستدام مع الحفاظ على تجربة مستخدم نقية دون إعلانات مزعجة تشتت الطالب
              </p>
            </div>
            <button
              onClick={() => handleCopy('monetization', MONETIZATION_STRATEGY)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              {copiedKey === 'monetization' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>نسخ الاستراتيجية</span>
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400 text-sm">1. Google AdMob الذكي</div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  • بنرات غير معطلة أسفل شاشة النتائج.<br/>
                  • إعلانات بمكافأة (Rewarded Ads) لفتح ميزة "تحليل تطور الحد الأدنى لـ 5 سنوات" أو تصدير الرغبات PDF.<br/>
                  • حظر الإعلانات البينية تماماً أثناء كتابة المجموع لتفادي مغادرة الطالب.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-sky-400 text-sm">2. رعاية الجامعات الخاصة والأهلية</div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  • كروت مميزة تحمل علامة "شريك معتمد" تظهر للطلاب في النطاق المستهدف للقبول المباشر.<br/>
                  • توليد طلبات التقديم (Lead Generation) والربط المباشر مع مكاتب القبول بالجامعات عبر WhatsApp.<br/>
                  • باقات اشتراك موسمية خلال ذروة التنسيق (يوليو - سبتمبر).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-purple-400 text-sm">3. استشارات تنسيق بلس (1-on-1)</div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  • جلسات استشارية مدفوعة مدتها 20 دقيقة مع أخصائي توجيه جامعي معتمد لمراجعة ترتيب الـ 75 رغبة وتجنب استنفاذ الرغبات.<br/>
                  • باقات خاصة لأولياء الأمور وطلاب الشهادات الفنية والمعادلة.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Tab 6: 4-Week Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>خارطة طريق إطلاق المنتج الأولي (4-Week MVP Roadmap)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                جدول زمني تنفيذي محكم لإطلاق التطبيق تزامناً مع إعلان نتائج الثانوية العامة والدبلومات
              </p>
            </div>
            <button
              onClick={() => handleCopy('roadmap', FOUR_WEEK_ROADMAP)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              {copiedKey === 'roadmap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>نسخ الخطة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm">الأسبوع 1: البنية التحتية ونمذجة البيانات</span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>إعداد قاعدة بيانات Firestore و Supabase schema.</li>
                <li>تغذية بيانات 350+ كلية ومعهد وحدودها الدنيا لآخر 3 سنوات.</li>
                <li>إعداد قواعد الدبلومات ونظام المعادلات (هندسة، تجارة، زراعة).</li>
                <li>إنشاء وتكوين CDN الـ OTA للتحديث اللحظي للـ JSON.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm">الأسبوع 2: واجهات الموبايل ومحرك الحساب</span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>بناء محرك الفرز والتوزيع الجغرافي (مجموعة أ، ب، ج).</li>
                <li>شاشات إدخال المجموع والنسبة المئوية مع التصنيف الرباعي للنتائج.</li>
                <li>تطبيق مبادئ التصميم الاحترافية (Zero-pill, high contrast).</li>
                <li>دعم العمل Offline والـ Caching المحلي.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 text-sm">الأسبوع 3: بوابة الدبلومات ودليل الجامعات</span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>حاسبة معادلات الدبلومات وبوابة الجامعات التكنولوجية الـ 10.</li>
                <li>دليل الجامعات الأهلية والخاصة مع المصروفات وحالة الاعتماد.</li>
                <li>كارت تفاصيل الكلية مع طابع التنسيق وروابط التقديم المباشر.</li>
                <li>دمج بطاقات الرعاية الإعلانية المعتمدة.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm">الأسبوع 4: الإشعارات، الاختبارات والإطلاق</span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>تفعيل Firebase Cloud Messaging لإرسال إشعارات فتح وقفل المراحل.</li>
                <li>اختبارات الضغط (Load Testing) لتحمل ترافيك يوم النتيجة (100k+ concurrent).</li>
                <li>دمج AdMob ومراجعة معايير متجر التطبيقات.</li>
                <li>النشر على Google Play و Apple App Store.</li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
