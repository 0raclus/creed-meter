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

export interface TestResult {
  topSchools: SchoolProfile[];
  allSchools: SchoolProfile[];
  categoryAnalysis: Record<Category, {
    dominantSchools: School[];
    description: string;
  }>;
  profile: string;
  recommendations: string[];
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

