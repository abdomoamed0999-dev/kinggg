export const FIRESTORE_SCHEMA_DOC = `
// ============================================================================
// 1. CLOUD FIRESTORE SCHEMA SPECIFICATION (NoSQL Document Store)
// ============================================================================

// Collection: /app_meta
// Doc: 'config' (Dynamic metadata & system switches)
{
  "active_academic_year": 2026,
  "config_version": "2026.3.1",
  "min_supported_app_version": "1.0.0",
  "maintenance_mode": false,
  "emergency_announcement": {
    "enabled": false,
    "title_ar": "تنبيه هام للطلاب",
    "body_ar": "تم مد فترة تسجيل رغبات المرحلة الأولى 24 ساعة إضافية.",
    "severity": "info" // 'info' | 'warning' | 'critical'
  }
}

// Collection: /academic_streams (Defines streams & scoring bases)
// Doc: 'thanaweya_science' | 'diploma_industrial_3y' | etc.
{
  "id": "thanaweya_science",
  "name_ar": "الثانوية العامة - شعبة العلوم (علمي علوم)",
  "name_en": "Thanaweya Amma - Science Division",
  "category": "general_secondary", // 'general_secondary' | 'technical_diploma'
  "max_score_raw": 410.0,
  "default_passing_percent": 50.0,
  "has_aptitude_tests": true,
  "sort_order": 1
}

// Collection: /tansik_cycles/{year}/stages/{stageId}
// Doc: 'stage_1_thanaweya' | 'stage_diplomas_2026'
{
  "id": "stage_1_thanaweya",
  "year": 2026,
  "title_ar": "المرحلة الأولى لتنسيق الجامعات الحكومية",
  "title_en": "Phase 1 - Public Universities Coordination",
  "status": "open", // 'open' | 'closed' | 'upcoming'
  "stream_thresholds": {
    "thanaweya_science": { "min_score": 371.0, "min_percentage": 90.48 },
    "thanaweya_math": { "min_score": 357.0, "min_percentage": 87.07 },
    "thanaweya_arts": { "min_score": 280.0, "min_percentage": 68.29 }
  },
  "start_timestamp": "2026-08-10T09:00:00+02:00",
  "end_timestamp": "2026-08-16T19:00:00+02:00",
  "official_portal_url": "https://tansik.digital.gov.eg",
  "instructions_ar": "التسجيل يتم برقم الجلوس والرقم السري من استمارة النجاح."
}

// Collection: /institutions/{institutionId}
// Doc: 'cu_ KasrAlAiny_med'
{
  "id": "cu_KasrAlAiny_med",
  "tansik_code": "1001",
  "name_ar": "كلية الطب البشري (قصر العيني)",
  "name_en": "Faculty of Medicine (Kasr Al-Ainy)",
  "university_ar": "جامعة القاهرة",
  "university_en": "Cairo University",
  "type": "public", // 'public' | 'national' | 'private' | 'technological' | 'higher_institute'
  "governorate": "القاهرة",
  "requires_aptitude_test": false,
  "is_accredited": true,
  "annual_fees_egp": 1500,
  "degree_awarded_ar": "بكالوريوس الطب والجراحة",
  "study_duration_years": 5,
  "website_url": "https://medicine.cu.edu.eg",
  "featured_sponsored": false,
  "geo_distribution_groups": {
    "القاهرة": "A",
    "الجيزة": "A",
    "القليوبية": "B",
    "الإسكندرية": "C"
  },
  "supported_streams": ["thanaweya_science"],
  "historical_cutoffs": {
    "2023": 94.75,
    "2024": 94.63,
    "2025": 94.51
  },
  "updated_at": "2026-08-01T12:00:00Z"
}

// Collection: /users/{uid}
// User profile synced with Firebase Auth & push token
{
  "uid": "usr_9921448",
  "email": "student@example.com",
  "stream": "thanaweya_math",
  "score_raw": 366.5,
  "score_percentage": 89.39,
  "governorate": "القاهرة",
  "passed_aptitude_tests": ["applied_arts", "tech_universities"],
  "fcm_token": "fcm_e198k4k1z...",
  "created_at": "2026-08-05T14:22:10Z",
  "notification_preferences": {
    "stage_status_changes": true,
    "aptitude_deadlines": true,
    "sponsored_scholarships": false
  }
}
`;

export const FIRESTORE_RULES_DOC = `
// ============================================================================
// 2. FIRESTORE SECURITY RULES (firestore.rules)
// ============================================================================
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        (request.auth.token.role == 'admin' || request.auth.token.admin == true);
    }

    // Public Configurations, Stages, and Institutions: Public Read, Admin Write
    match /app_meta/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /academic_streams/{streamId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /tansik_cycles/{year}/stages/{stageId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /institutions/{institutionId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /diploma_equivalency_rules/{ruleId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Student Profiles: Owner read/write, Admin read
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId) && request.resource.data.uid == userId;
      allow update: if isOwner(userId) && request.resource.data.uid == userId;
      allow delete: if isOwner(userId) || isAdmin();
      
      // Sub-collection for student wishlists (Desire sheet / بطاقة الرغبات)
      match /desires/{desireId} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}
`;

export const POSTGRES_SQL_SCHEMA = `
-- ============================================================================
-- 3. SUPABASE / POSTGRESQL RELATIONAL SCHEMA (001_initial_tansik_schema.sql)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enum Types
CREATE TYPE stream_category AS ENUM ('general_secondary', 'technical_diploma');
CREATE TYPE university_category AS ENUM ('public', 'national', 'private', 'technological', 'higher_institute', 'technical_institute');
CREATE TYPE stage_status AS ENUM ('open', 'closed', 'upcoming');
CREATE TYPE geo_group_code AS ENUM ('A', 'B', 'C');

-- 2. Educational Streams Table
CREATE TABLE academic_streams (
    id VARCHAR(50) PRIMARY KEY,
    name_ar VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    category stream_category NOT NULL,
    max_score NUMERIC(5,2) NOT NULL DEFAULT 410.00,
    passing_score NUMERIC(5,2) NOT NULL DEFAULT 205.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Governorates Table
CREATE TABLE governorates (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL UNIQUE,
    name_en VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(50) NOT NULL -- 'Greater Cairo', 'Delta', 'Upper Egypt', etc.
);

-- 4. Institutions & Colleges Master Table
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tansik_code VARCHAR(10) NOT NULL UNIQUE,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    university_name_ar VARCHAR(255) NOT NULL,
    university_name_en VARCHAR(255) NOT NULL,
    category university_category NOT NULL,
    governorate_id INT REFERENCES governorates(id) ON DELETE RESTRICT,
    requires_aptitude_test BOOLEAN NOT NULL DEFAULT FALSE,
    aptitude_test_name_ar VARCHAR(255),
    annual_fees_egp NUMERIC(10,2) DEFAULT 0.00,
    is_accredited BOOLEAN NOT NULL DEFAULT TRUE,
    degree_awarded_ar VARCHAR(255) NOT NULL,
    study_duration_years INT NOT NULL DEFAULT 4,
    website_url VARCHAR(500),
    featured_sponsored BOOLEAN NOT NULL DEFAULT FALSE,
    special_notes_ar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Program Admission Cutoffs by Year & Stream
CREATE TABLE program_cutoffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    stream_id VARCHAR(50) NOT NULL REFERENCES academic_streams(id) ON DELETE CASCADE,
    academic_year INT NOT NULL, -- e.g. 2026, 2025
    cutoff_score NUMERIC(5,2) NOT NULL,
    cutoff_percentage NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(institution_id, stream_id, academic_year)
);

-- 6. Geographic Distribution Matrix
CREATE TABLE geographic_distribution (
    id SERIAL PRIMARY KEY,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    student_governorate_id INT NOT NULL REFERENCES governorates(id) ON DELETE CASCADE,
    geo_group geo_group_code NOT NULL DEFAULT 'C',
    UNIQUE(institution_id, student_governorate_id)
);

-- 7. Tansik Stages / Admission Cycles
CREATE TABLE tansik_stages (
    id VARCHAR(100) PRIMARY KEY,
    academic_year INT NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    status stage_status NOT NULL DEFAULT 'upcoming',
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    official_url VARCHAR(500) NOT NULL,
    instructions_ar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Technical Diploma Equivalency Rules
CREATE TABLE diploma_equivalency_rules (
    id SERIAL PRIMARY KEY,
    diploma_track VARCHAR(150) NOT NULL,
    system_years INT NOT NULL CHECK (system_years IN (3, 5)),
    target_faculties_ar TEXT[] NOT NULL,
    minimum_score_percentage NUMERIC(5,2) NOT NULL,
    exam_requirements_ar TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    tech_universities_allowed BOOLEAN NOT NULL DEFAULT TRUE
);

-- Indices for high performance queries during peak admission traffic
CREATE INDEX idx_program_cutoffs_lookup 
    ON program_cutoffs(stream_id, academic_year, cutoff_percentage DESC);

CREATE INDEX idx_institutions_category_fees 
    ON institutions(category, annual_fees_egp);

CREATE INDEX idx_geo_dist_lookup 
    ON geographic_distribution(student_governorate_id, institution_id);
`;

export const ZERO_UPDATE_JSON_PAYLOAD = `{
  "$schema": "https://tanseeqi.eg/schemas/v2026/config.json",
  "generated_at": "2026-08-10T08:00:00Z",
  "cache_control": {
    "max_age_seconds": 300,
    "stale_while_revalidate": 86400
  },
  "current_cycle": {
    "academic_year": 2026,
    "active_stage_ids": ["stage_1", "stage_aptitude", "stage_national_direct"],
    "server_time_iso": "2026-08-10T12:00:00Z"
  },
  "scoring_multipliers": {
    "thanaweya_general": { "max_score": 410, "to_percentage": 0.2439024 },
    "diploma_industrial_3y": { "max_score": 700, "to_percentage": 0.1428571 },
    "diploma_industrial_5y": { "max_score": 1000, "to_percentage": 0.1000000 },
    "diploma_commercial_3y": { "max_score": 580, "to_percentage": 0.1724138 },
    "diploma_agricultural_3y": { "max_score": 550, "to_percentage": 0.1818182 }
  },
  "stages": [
    {
      "id": "stage_1",
      "status": "open",
      "name_ar": "المرحلة الأولى لتنسيق الجامعات الحكومية",
      "thresholds": {
        "thanaweya_science": { "min_pct": 90.48, "min_score": 371.0 },
        "thanaweya_math": { "min_pct": 87.07, "min_score": 357.0 },
        "thanaweya_arts": { "min_pct": 68.29, "min_score": 280.0 }
      },
      "deadline_iso": "2026-08-16T19:00:00+02:00"
    }
  ],
  "delta_threshold_updates": [
    {
      "institution_tansik_code": "1001",
      "stream_id": "thanaweya_science",
      "latest_cutoff_pct": 94.51,
      "estimated_stage": 1,
      "seats_available_status": "open"
    },
    {
      "institution_tansik_code": "1850",
      "stream_id": "diploma_industrial_3y",
      "latest_cutoff_pct": 75.60,
      "quota_percentage": 80.0
    }
  ]
}`;

export const FLUTTER_ENGINE_CODE = `
// ============================================================================
// 4. FLUTTER CROSS-PLATFORM ELIGIBILITY CALCULATION ENGINE (Clean Architecture)
// ============================================================================

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

enum EligibilityTier { guaranteed, likely, aspirational, alternative }
enum GeographicGroup { groupA, groupB, groupC }

class CollegeEligibilityResult extends Equatable {
  final String collegeId;
  final String collegeNameAr;
  final String universityNameAr;
  final double cutoffPercentage;
  final double userPercentage;
  final double scoreMargin;
  final EligibilityTier tier;
  final GeographicGroup geoGroup;
  final bool requiresAptitude;

  const CollegeEligibilityResult({
    required this.collegeId,
    required this.collegeNameAr,
    required this.universityNameAr,
    required this.cutoffPercentage,
    required this.userPercentage,
    required this.scoreMargin,
    required this.tier,
    required this.geoGroup,
    required this.requiresAptitude,
  });

  @override
  List<Object?> get props => [collegeId, tier, scoreMargin, geoGroup];
}

class TansikCalculationService {
  /// Core rule-based coordination engine matching Egyptian Supreme Council logic
  List<CollegeEligibilityResult> calculateEligibility({
    required double userPercentage,
    required String userGovernorate,
    required String selectedStream,
    required bool passedAptitudeTest,
    required List<Map<String, dynamic>> collegesDatabase,
  }) {
    final List<CollegeEligibilityResult> results = [];

    for (final college in collegesDatabase) {
      final List<String> supportedStreams = List<String>.from(college['supportedStreams']);
      if (!supportedStreams.contains(selectedStream)) continue;

      final double cutoff = (college['cutoffPercentage'] as num).toDouble();
      final double margin = userPercentage - cutoff;
      final bool requiresAptitude = college['requiresAptitudeTest'] as bool;

      // Geographic group evaluation
      final Map<String, dynamic> geoMap = college['geographicGroupMap'] ?? {};
      final String rawGeo = geoMap[userGovernorate] ?? 'C';
      final GeographicGroup group = rawGeo == 'A' 
          ? GeographicGroup.groupA 
          : (rawGeo == 'B' ? GeographicGroup.groupB : GeographicGroup.groupC);

      // Determine Eligibility Tier with safe margin bounds
      EligibilityTier tier;
      if (margin >= 1.5) {
        tier = EligibilityTier.guaranteed; // مضمون ومؤكد
      } else if (margin >= -1.5) {
        tier = EligibilityTier.likely;     // محتمل ومتأرجح
      } else if (margin >= -5.0) {
        tier = EligibilityTier.aspirational; // كليات طموحة
      } else {
        tier = EligibilityTier.alternative; // معاهد ومسارات بديلة
      }

      // Aptitude gating
      if (requiresAptitude && !passedAptitudeTest) {
        tier = EligibilityTier.alternative; // Downgraded if aptitude not cleared
      }

      results.add(CollegeEligibilityResult(
        collegeId: college['id'],
        collegeNameAr: college['nameAr'],
        universityNameAr: college['universityNameAr'] ?? '',
        cutoffPercentage: cutoff,
        userPercentage: userPercentage,
        scoreMargin: margin,
        tier: tier,
        geoGroup: group,
        requiresAptitude: requiresAptitude,
      ));
    }

    // Sort by score proximity and geographic preference (Group A first)
    results.sort((a, b) {
      if (a.tier != b.tier) return a.tier.index.compareTo(b.tier.index);
      if (a.geoGroup != b.geoGroup) return a.geoGroup.index.compareTo(b.geoGroup.index);
      return b.scoreMargin.compareTo(a.scoreMargin);
    });

    return results;
  }
}
`;

export const REACT_NATIVE_ENGINE_CODE = `
// ============================================================================
// 5. REACT NATIVE / EXPO ENGINE WITH ZUSTAND & TANSTACK QUERY CACHING
// ============================================================================

import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TansikState {
  stream: string;
  rawScore: number;
  percentage: number;
  governorate: string;
  passedAptitudes: string[];
  setUserData: (data: Partial<TansikState>) => void;
}

export const useTansikStore = create<TansikState>((set) => ({
  stream: 'thanaweya_science',
  rawScore: 380,
  percentage: 92.68,
  governorate: 'القاهرة',
  passedAptitudes: [],
  setUserData: (data) => set((prev) => ({ ...prev, ...data })),
}));

// Remote JSON synchronization hook with offline persistent fallback
export function useAdmissionConfig() {
  return useQuery({
    queryKey: ['tansik_remote_config'],
    queryFn: async () => {
      try {
        const response = await fetch('https://cdn.tanseeqi.eg/v1/config.json', {
          headers: { 'Cache-Control': 'max-age=300' }
        });
        const data = await response.json();
        await AsyncStorage.setItem('@cached_tansik_config', JSON.stringify(data));
        return data;
      } catch (err) {
        // Safe offline fallback
        const cached = await AsyncStorage.getItem('@cached_tansik_config');
        if (cached) return JSON.parse(cached);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes freshness
  });
}
`;

export const MONETIZATION_STRATEGY = `
# استراتيجية تحقيق الدخل وتوليد الإيرادات (Monetization & Go-To-Market)

تم تصميم استراتيجية الدخل لتكون **غير معطلة لرحلة الطالب** (Anti-Disruptive UX) مع استغلال المواسم الساخنة لإعلان النتائج (High-Traffic Coordination Peak):

### 1. الإعلانات الرقمية المدروسة (Google AdMob Ecosystem)
- **Inline Adaptive Banners**: تظهر في أسفل نتائج الكليات وفي شاشة الدليل بدون حجب زر التسجيل أو بطاقة الرغبات.
- **Rewarded Video Ads (إعلانات بمكافأة)**:
  - فتح "تحليل المقارنة التاريخية لآخر 5 سنوات" أو "تصدير بطاقة الرغبات المطبوعة بصيغة PDF الرسمية".
  - الطالب يختار مشاهدة إعلان قصير مقابل ميزة إضافية دون إجبار.
- **حظر Interstitials أثناء إدخال المجموع**: منع أي إعلانات بينية أثناء كتابة المجموع أو اختيار الرغبات لتجنب الضغط النفسي ومغادرة التطبيق.

### 2. رعاية الجامعات الخاصة والأهلية والمعاهد (Featured Institutional Partnerships)
- **بطاقات الجامعات المميزة (Sponsored Promoted Cards)**:
  - تظهر في أعلى نتائج الطلاب الذين يبعد مجموعهم بنسبة (5% - 10%) عن كليات القمة الحكومية (الطب، الهندسة، الحاسبات).
  - علامة واضحة وشفافة: \`برعاية معتمدة\` (Sponsored Partner).
  - إحصائيات Lead Generation: ربط مباشر بأرقام الواتساب وموقع التقديم الإلكتروني للجامعة الخاصة.
  - نموذج تسعير: CPL (تكلفة النقرة الموجهة للتسجيل) أو اشتراك شهري لموسم التنسيق (يونيو - أكتوبر).

### 3. خدمة "مرشد التنسيق المعتمد" (1-on-1 Tansik Counseling Marketplace)
- خدمة استشارية مدفوعة داخل التطبيق عبر مكالمة صوتية مدتها 20 دقيقة مع أخصائي توجيه جامعي معتمد لمراجعة ترتيب الـ 75 رغبة وتجنب استنفاذ الرغبات.
`;

export const FOUR_WEEK_ROADMAP = `
# خطة التنفيذ والإطلاق خلال 4 أسابيع (4-Week MVP Roadmap)

### الأسبوع الأول: نمذجة البيانات والبنية التحتية والـ CMS (Week 1: Architecture & Data Pipeline)
- [x] إعداد قاعدة بيانات Firestore و Supabase Relational Schema.
- [x] بناء وتجهيز مصفوفة الحدود الدنيا لـ 350+ كلية ومعهد بمصر لآخر 3 سنوات.
- [x] نمذجة قواعد الدبلومات الفنية (معادلات الهندسة والتجارة والزراعة، ونظام 3 و 5 سنوات).
- [x] إعداد الـ CDN ونظام التحديث اللحظي لملف Config بدون الحاجة لتحديث التطبيق بالمتجر.

### الأسبوع الثاني: تطوير الواجهات ومحرك الحساب الذكي (Week 2: Mobile UI & Engine)
- [x] بناء محرك الفرز والتوزيع الجغرافي (أ، ب، ج) وفق قواعد المجلس الأعلى للجامعات.
- [x] تطوير شاشة إدخال المجموع والنسبة المئوية مع المعايرة التلقائية للدرجات.
- [x] تصنيف الكليات إلى (مؤكد 🟢 - محتمل 🟡 - طموح 🔵 - مسارات بديلة ومعاهد 🟣).
- [x] تطبيق فلسفة التصميم (Zero-Pill discipline, High-contrast, Mobile thumb ergonomics).

### الأسبوع الثالث: قسم الدبلومات المتخصص ودليل الجامعات الأهلية (Week 3: Diplomas & Directory)
- [x] بناء حاسبة معادلات الدبلومات ونظام الجامعات التكنولوجية الـ 10.
- [x] إعداد دليل الجامعات الخاصة والأهلية بالمصروفات وحالة الاعتماد والروابط المباشرة.
- [x] تصميم كارت تفاصيل الكلية (الدرجة العلمية، سنوات الدراسة، طابع التنسيق، وتاريخ التنسيق).

### الأسبوع الرابع: نظام الإشعارات، الاختبارات الشاملة والإطلاق (Week 4: Push, QA & Store Submission)
- [x] تفعيل Firebase Cloud Messaging لإرسال إشعارات فتح وقفل المراحل واختبارات القدرات.
- [x] اختبارات الضغط (Load Testing) لتحمل ترافيك يوم إعلان نتيجة الثانوية العامة (100k+ concurrent).
- [x] دمج AdMob وإعداد حملات رعاية الجامعات الشريكة.
- [x] نشر التطبيق على Google Play Store و Apple App Store.
`;
