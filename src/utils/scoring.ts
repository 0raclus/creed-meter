import type { UserAnswers, SchoolProfile, TestResult, Category } from '../types';
import questions from '../data/questions.json';
import schools from '../data/schools.json';

const SCHOOL_RELATIONSHIPS: Record<string, Record<string, number>> = {
  hanbeli: { selefi: 0.8, esari: 0.3, maturidi: 0.2 },
  selefi: { hanbeli: 0.8, jihadist_salafi: 0.6, quietist_salafi: 0.7 },
  esari: { maturidi: 0.7, shafii: 0.8, hanafi: 0.4 },
  maturidi: { esari: 0.7, hanafi: 0.9, shafii: 0.5 },
  hanafi: { maturidi: 0.9, esari: 0.4, maliki: 0.3 },
  shafii: { esari: 0.8, maliki: 0.6, hanafi: 0.3 },
  maliki: { shafii: 0.6, esari: 0.5, hanafi: 0.3 },
  mutazila: { modernist: 0.7, liberal_islam: 0.6 },
  imamiyye: { zeydi: 0.6, ismaili: 0.5 },
  zeydi: { imamiyye: 0.6, reformcu: 0.4 },
  ismaili: { imamiyye: 0.5, liberal_islam: 0.4 },
  zahiri: { selefi: 0.5, hanbeli: 0.3 },
  modernist: { reformcu: 0.8, liberal_islam: 0.7, mutazila: 0.7 },
  reformcu: { modernist: 0.8, liberal_islam: 0.6, hanafi: 0.3 },
  kuranci: { selefi: 0.5, modernist: 0.6 },
  sufi: { esari: 0.7, maturidi: 0.6, shafii: 0.6 },
  quietist_salafi: { selefi: 0.7, hanbeli: 0.5 },
  jihadist_salafi: { selefi: 0.6, hanbeli: 0.3 },
  liberal_islam: { modernist: 0.7, reformcu: 0.6, feminist_islam: 0.8 },
  feminist_islam: { liberal_islam: 0.8, modernist: 0.7 },
  secular_muslim: { liberal_islam: 0.8, modernist: 0.6 }
};

const CATEGORY_WEIGHTS: Record<Category, number> = {
  akide: 1.5,
  fiqh_usul: 1.3,
  fiqh_amel: 1.1,
  tasavvuf: 1.0,
  siyaset: 1.2,
  modernite: 1.1
};

export function calculateScores(answers: UserAnswers): SchoolProfile[] {
  const schoolScores: Record<string, number> = {};
  const schoolWeights: Record<string, number> = {};
  const categoryScores: Record<string, Record<string, number>> = {};

  schools.forEach(school => {
    schoolScores[school.id] = 0;
    schoolWeights[school.id] = 0;
    categoryScores[school.id] = {};
  });

  questions.forEach(question => {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) return;

    const option = question.options.find(opt => opt.id === selectedOptionId);
    if (!option) return;

    const categoryWeight = CATEGORY_WEIGHTS[question.category];
    const questionWeight = question.weight * categoryWeight;

    Object.entries(option.scores).forEach(([schoolId, score]) => {
      if (!schoolScores[schoolId]) {
        schoolScores[schoolId] = 0;
        schoolWeights[schoolId] = 0;
      }

      schoolScores[schoolId] += score * questionWeight;
      schoolWeights[schoolId] += questionWeight;

      if (!categoryScores[schoolId][question.category as Category]) {
        categoryScores[schoolId][question.category as Category] = 0;
      }
      categoryScores[schoolId][question.category as Category] += score * question.weight;
    });
  });

  // Apply relationship bonuses
  Object.entries(schoolScores).forEach(([schoolId, score]) => {
    const relationships = SCHOOL_RELATIONSHIPS[schoolId] || {};
    Object.entries(relationships).forEach(([relatedSchool, bonus]) => {
      if (schoolScores[relatedSchool] && schoolScores[relatedSchool] > 0) {
        schoolScores[schoolId] += schoolScores[relatedSchool] * bonus * 0.1;
      }
    });
  });

  // Normalize scores
  const profiles: SchoolProfile[] = schools.map(school => {
    const weight = schoolWeights[school.id] || 1;
    const normalizedScore = weight > 0 ? schoolScores[school.id] / weight : 0;
    const percentage = Math.max(0, Math.min(100, (normalizedScore / 5) * 100));

    return {
      school: school.id as any,
      score: normalizedScore,
      percentage: Math.round(percentage),
      categoryScores: categoryScores[school.id] || {}
    };
  });

  return profiles.sort((a, b) => b.percentage - a.percentage);
}

export function generateTestResult(profiles: SchoolProfile[]): TestResult {
  const topSchools = profiles.slice(0, 3).filter(p => p.percentage > 20);

  const categoryAnalysis: Record<Category, any> = {
    akide: { dominantSchools: [], description: '' },
    fiqh_usul: { dominantSchools: [], description: '' },
    fiqh_amel: { dominantSchools: [], description: '' },
    tasavvuf: { dominantSchools: [], description: '' },
    siyaset: { dominantSchools: [], description: '' },
    modernite: { dominantSchools: [], description: '' }
  };

  const categories: Category[] = ['akide', 'fiqh_usul', 'fiqh_amel', 'tasavvuf', 'siyaset', 'modernite'];

  categories.forEach(category => {
    const categoryProfiles = profiles
      .filter(p => p.categoryScores[category] && p.categoryScores[category] > 0)
      .sort((a, b) => (b.categoryScores[category] || 0) - (a.categoryScores[category] || 0))
      .slice(0, 2);

    categoryAnalysis[category].dominantSchools = categoryProfiles.map(p => p.school);
  });

  const profile = generateProfileDescription(topSchools);
  const recommendations = generateRecommendations(topSchools);

  return {
    topSchools,
    allSchools: profiles,
    categoryAnalysis,
    profile,
    recommendations
  };
}

function generateProfileDescription(topSchools: SchoolProfile[]): string {
  if (topSchools.length === 0) {
    return 'Sonuçlarınız belirgin bir mezhep eğilimi göstermemektedir.';
  }

  const primary = topSchools[0];
  const secondary = topSchools[1];

  let description = `Düşünce haritanız ağırlıklı olarak %${primary.percentage} ${getSchoolName(primary.school)} eğilimini göstermektedir.`;

  if (secondary) {
    description += ` İkincil olarak %${secondary.percentage} ${getSchoolName(secondary.school)} eğilimi de gözlenmektedir.`;
  }

  description += ' Bu profil, geleneksel İslami düşüncenin zenginliğini ve çeşitliliğini yansıtmaktadır.';

  return description;
}

function generateRecommendations(topSchools: SchoolProfile[]): string[] {
  const recommendations: string[] = [];

  if (topSchools.length > 0) {
    recommendations.push(`${getSchoolName(topSchools[0].school)} geleneğinin klasik eserlerini inceleyebilirsiniz.`);
  }

  if (topSchools.length > 1) {
    recommendations.push(`${getSchoolName(topSchools[1].school)} ile ${getSchoolName(topSchools[0].school)} arasındaki farkları anlamak faydalı olabilir.`);
  }

  recommendations.push('Farklı mezheplerin görüşlerini karşılaştırmalı olarak incelemek, İslami düşüncenin zenginliğini anlamanıza yardımcı olacaktır.');

  return recommendations;
}

function getSchoolName(schoolId: string): string {
  const school = schools.find(s => s.id === schoolId);
  return school?.name || schoolId;
}

