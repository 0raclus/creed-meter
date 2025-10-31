export type Category = 'akide' | 'fiqh_usul' | 'fiqh_amel' | 'tasavvuf' | 'siyaset' | 'modernite';

export type School =
  | 'hanbeli'
  | 'selefi'
  | 'esari'
  | 'maturidi'
  | 'hanafi'
  | 'shafii'
  | 'maliki'
  | 'mutazila'
  | 'imamiyye'
  | 'zeydi'
  | 'ismaili'
  | 'zahiri'
  | 'modernist'
  | 'reformcu'
  | 'kuranci'
  | 'sufi'
  | 'quietist_salafi'
  | 'jihadist_salafi'
  | 'liberal_islam'
  | 'feminist_islam'
  | 'secular_muslim'
  | 'ehlihadis'
  | 'murcie'
  | 'harici'
  | 'ibazi'
  | 'qadariyya'
  | 'jabriyya'
  | 'qadiriyya'
  | 'naqshbandi'
  | 'mevlevi'
  | 'rifaiyya'
  | 'shadhili'
  | 'tijaniyya'
  | 'deobandi'
  | 'barelvi'
  | 'ikhwan'
  | 'nurculuk'
  | 'salafi_jihadist'
  | 'quietist_salafi_2'
  | 'progressive_islam'
  | 'ahmadiyya'
  | 'twelver_shia'
  | 'zaydi_shia'
  | 'ismaili_shia';

export interface SchoolData {
  id: School;
  name: string;
  era: string;
  founder: string;
  description: string;
  detailedProfile?: string;
  characteristics: string[];
  regions: string[];
  modernRepresentatives: string[];
  relationships?: Record<string, number>;
  keyFigures?: string[];
  keyBooks?: string[];
  modernCommunities?: string[];
  estimatedFollowers?: string;
  relatedSchools?: string[];
  commonMisconceptions?: string[];
  faqs?: { q: string; a: string }[];
  icon?: string;
  color?: string;
  pattern?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  scores: Partial<Record<School, number>>;
}

export interface Question {
  id: string;
  category: Category;
  weight: number;
  text: string;
  options: QuestionOption[];
}

export interface UserAnswers {
  [questionId: string]: string;
}

export interface SchoolProfile {
  school: School;
  score: number;
  percentage: number;
  categoryScores: Partial<Record<Category, number>>;
}

export interface QuestionAnalysis {
  questionId: string;
  questionText: string;
  category: Category;
  selectedOption: string;
  topSchools: { school: School; score: number }[];
  insight: string;
}

export interface TestResult {
  topSchools: SchoolProfile[];
  allSchools: SchoolProfile[];
  categoryAnalysis: Record<Category, {
    dominantSchools: School[];
    description: string;
  }>;
  profile: string;
  recommendations: string[];
  confidenceScore: number; // 0-100 arası güven skoru
  consistencyWarnings: string[]; // Tutarsızlık uyarıları
  unknownAnswersCount: number; // Bilmiyorum cevap sayısı
  totalQuestions: number; // Toplam soru sayısı
  isAwam: boolean; // %50+ bilmiyorum = avam
  questionAnalysis: QuestionAnalysis[]; // Soru bazlı analiz
}

export interface Scholar {
  name: string;
  era: string;
  school: School;
  description: string;
}

export interface ReadingRecommendation {
  title: string;
  author: string;
  school: School;
  description: string;
}

