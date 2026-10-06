export type EducationStream = 
  | 'thanaweya_science' // علمي علوم
  | 'thanaweya_math'    // علمي رياضة
  | 'thanaweya_arts'    // أدبي
  | 'diploma_industrial_3y'  // دبلوم صناعي 3 سنوات
  | 'diploma_industrial_5y'  // دبلوم صناعي 5 سنوات
  | 'diploma_commercial_3y'  // دبلوم تجاري 3 سنوات
  | 'diploma_commercial_5y'  // دبلوم تجاري 5 سنوات
  | 'diploma_agricultural_3y'// دبلوم زراعي 3 سنوات
  | 'diploma_agricultural_5y'// دبلوم زراعي 5 سنوات
  | 'diploma_tourism_3y'     // دبلوم سياحة وفنادق 3 سنوات
  | 'diploma_tourism_5y';    // دبلوم سياحة وفنادق 5 سنوات

export type UniversityType = 
  | 'public'          // حكومية
  | 'national'        // أهلية (حلوان الأهلية، المنصورة الجديدة، الجلالة..)
  | 'private'         // خاصة (MUST, BUC, 6th October..)
  | 'technological'   // تكنولوجية (الجامعات التكنولوجية التابعة لصندوق تطوير التعليم)
  | 'higher_institute'// معاهد عليا خاصة (هندسة، حاسبات، إدارة)
  | 'technical_institute'; // معاهد فنية حكومية سنتين (صناعي، تجاري)

export type AdmissionStatus = 'open' | 'closed' | 'upcoming';

export type AcademicField = 
  | 'medical'           // القطاع الطبي والصحي (طب، أسنان، صيدلة، تمريض، علاج طبيعي)
  | 'engineering'       // القطاع الهندسي والتكنولوجي (هندسة، حاسبات، ذكاء اصطناعي)
  | 'humanities'        // العلوم الإنسانية والإعلام واللغات (اقتصاد وسياسة، ألسن، إعلام، حقوق)
  | 'business'          // العلوم التجارية والإدارية (تجارة، إدارة أعمال، نظم ومعلومات إدارية)
  | 'technical_applied'; // القطاع التطبيقي والفني (تكنولوجيا، فنون تطبيقية، زراعة، سياحة)

export type GeographicGroup = 'A' | 'B' | 'C'; // التوزيع الجغرافي (أ، ب، ج)

export type EligibilityTier = 'guaranteed' | 'likely' | 'aspirational' | 'alternative';

export interface College {
  id: string;
  tansikCode: string; // رقم طابع التنسيق (e.g. 1102)
  nameAr: string;
  nameEn: string;
  universityNameAr: string;
  universityNameEn: string;
  type: UniversityType;
  academicField?: AcademicField; // المجال الأكاديمي (طب، هندسة، إنساني، تجاري، تطبيقي)
  governorate: string;
  cutoffScore: number; // e.g. 365 or percentage 89.0
  cutoffPercentage: number; // e.g. 89.02%
  historicalCutoffs: {
    year2023: number;
    year2024: number;
    year2025: number;
  };
  supportedStreams: EducationStream[];
  requiresAptitudeTest: boolean; // اختبار قدرات
  aptitudeTestNameAr?: string;
  annualFeesEGP?: number; // 0 for public regular, fees for national/private/institutes
  isAccredited: boolean;
  geographicGroupMap: Record<string, GeographicGroup>; // governorate -> 'A' | 'B' | 'C'
  degreeAwarded: string; // e.g. بكالوريوس الهندسة، بكالوريوس الحاسبات
  studyDurationYears: number;
  websiteUrl: string;
  specialNoteAr?: string;
  featuredSponsored?: boolean; // For monetization
}

export interface TansikStage {
  id: string;
  titleAr: string;
  titleEn: string;
  targetStreamAr: string;
  minScoreScience?: number;
  minScoreMath?: number;
  minScoreArts?: number;
  minScoreDiploma?: number;
  minPercentageScience?: number;
  minPercentageMath?: number;
  minPercentageArts?: number;
  minPercentageDiploma?: number;
  status: AdmissionStatus;
  startDate: string;
  endDate: string;
  activeOfficialUrl: string;
  notesAr: string;
}

export interface DiplomaEquivalencyRule {
  diplomaTrack: string;
  systemYears: 3 | 5;
  targetCollegesAr: string[];
  minimumScorePercentage: number;
  examRequirementsAr: string;
  descriptionAr: string;
  technologyUniversitiesAllowed: boolean;
}

export interface UserCalculationQuery {
  stream: EducationStream;
  score: number;
  maxScore: number;
  percentage: number;
  governorate: string;
  passedAptitudeTest: boolean;
}

export interface CalculationResult {
  college: College;
  tier: EligibilityTier;
  marginDifference: number; // userScore - cutoffScore
  geoGroup: GeographicGroup;
  statusTextAr: string;
}
