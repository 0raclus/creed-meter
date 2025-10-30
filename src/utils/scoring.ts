import type { UserAnswers, SchoolProfile, TestResult, Category } from '../types';
import questions from '../data/questions.json';
import schools from '../data/schools.json';

const SCHOOL_RELATIONSHIPS: Record<string, Record<string, number>> = {
  // Akide Mezhepleri
  athari: { hanbeli: 0.9, quietist_salafi: 0.9, selefi: 0.85, zahiri: 0.75 },
  esari: { maturidi: 0.8, shafii: 0.85, hanafi: 0.5, maliki: 0.6, sufi: 0.75, selefi: 0.2, hanbeli: 0.25 },
  maturidi: { esari: 0.8, hanafi: 0.95, shafii: 0.6, sufi: 0.7, selefi: 0.15, hanbeli: 0.2, deobandi: 0.85, barelvi: 0.85 },
  mutazila: { modernist: 0.8, liberal_islam: 0.75, reformcu: 0.7, esari: 0.6, maturidi: 0.65 },
  zahiri: { selefi: 0.7, hanbeli: 0.6, athari: 0.75, quietist_salafi: 0.65 },

  // Selefî Kolları
  selefi: { hanbeli: 0.85, zahiri: 0.7, quietist_salafi: 0.8, jihadist_salafi: 0.65, esari: 0.2, maturidi: 0.15, athari: 0.85 },
  quietist_salafi: { selefi: 0.8, hanbeli: 0.75, athari: 0.9, sufi_selefi: 0.85 },
  jihadist_salafi: { selefi: 0.65, hanbeli: 0.3, ikhwan_muslim: 0.6 },
  sufi_selefi: { quietist_salafi: 0.85, athari: 0.8, sufi: 0.4, naqshbandi: 0.3 },

  // Fıkıh Mezhepleri
  hanbeli: { selefi: 0.85, zahiri: 0.6, quietist_salafi: 0.75, esari: 0.25, maturidi: 0.2, athari: 0.9 },
  hanafi: { maturidi: 0.95, esari: 0.5, shafii: 0.4, maliki: 0.35, sufi: 0.6, selefi: 0.15, deobandi: 0.9, barelvi: 0.85 },
  shafii: { esari: 0.85, maliki: 0.65, hanafi: 0.4, sufi: 0.7, selefi: 0.25, hanbeli: 0.3 },
  maliki: { esari: 0.6, shafii: 0.65, hanafi: 0.35, sufi: 0.65, selefi: 0.2, hanbeli: 0.25 },

  // Tasavvuf Tarikatları
  sufi: { esari: 0.75, maturidi: 0.7, shafii: 0.7, maliki: 0.65, hanafi: 0.6, qadiri: 0.95, mevlevi: 0.95, naqshbandi: 0.9, bektashi: 0.85 },
  qadiri: { esari: 0.8, sufi: 0.95, mevlevi: 0.7, naqshbandi: 0.6 },
  mevlevi: { esari: 0.85, sufi: 0.95, qadiri: 0.7, naqshbandi: 0.5 },
  naqshbandi: { maturidi: 0.85, sufi: 0.9, qadiri: 0.6, mevlevi: 0.5, deobandi: 0.7, barelvi: 0.6, suleymanci: 0.9 },
  bektashi: { alevi: 0.9, sufi: 0.85, twelver_shia: 0.6 },
  alevi: { bektashi: 0.9, twelver_shia: 0.7, sufi: 0.8 },

  // Şia Mezhepleri
  twelver_shia: { zaydi: 0.6, ismaili_shia: 0.5, esari: 0.4, sufi: 0.5, alevi: 0.7 },
  zaydi: { twelver_shia: 0.6, reformcu: 0.4, liberal_islam: 0.35 },
  ismaili_shia: { twelver_shia: 0.5, liberal_islam: 0.4, modernist: 0.35 },

  // Modern Hareketler
  ikhwan_muslim: { esari: 0.7, sufi: 0.5, modernist: 0.8, reformcu: 0.7, jihadist_salafi: 0.6 },
  modernist: { reformcu: 0.8, liberal_islam: 0.7, mutazila: 0.8, feminist_islam: 0.6, nurcu: 0.8, ikhwan_muslim: 0.8 },
  reformcu: { modernist: 0.8, liberal_islam: 0.6, mutazila: 0.7, hanafi: 0.3, zaydi: 0.4 },
  liberal_islam: { modernist: 0.7, reformcu: 0.6, feminist_islam: 0.8, mutazila: 0.75, twelver_shia: 0.4 },

  // Hint Alt Kıtası Hareketleri
  deobandi: { maturidi: 0.85, hanafi: 0.9, hanbeli: 0.6, selefi: 0.5, quietist_salafi: 0.7, naqshbandi: 0.7 },
  barelvi: { sufi: 0.8, esari: 0.6, shafii: 0.5, maturidi: 0.85, hanafi: 0.85, naqshbandi: 0.6 },

  // Türkiye Hareketleri
  nurcu: { modernist: 0.8, reformcu: 0.6, esari: 0.8, ikhwan_muslim: 0.6 },
  suleymanci: { naqshbandi: 0.9, maturidi: 0.85, hanafi: 0.85, sufi: 0.7 }
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

    const categoryWeight = CATEGORY_WEIGHTS[question.category as Category];
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

  // Apply relationship bonuses with improved algorithm
  Object.entries(schoolScores).forEach(([schoolId]) => {
    const relationships = SCHOOL_RELATIONSHIPS[schoolId] || {};
    Object.entries(relationships).forEach(([relatedSchool, relationshipStrength]) => {
      if (schoolScores[relatedSchool] && schoolScores[relatedSchool] > 0) {
        // Bonus = related school score * relationship strength * 0.15
        // Higher relationship strength = higher bonus
        const bonus = schoolScores[relatedSchool] * relationshipStrength * 0.15;
        schoolScores[schoolId] += bonus;
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
    return 'Sonuçlarınız belirgin bir mezhep eğilimi göstermemektedir. Bu, İslami düşüncenin çeşitliliğine açık bir yaklaşım sergilediğinizi gösterir.';
  }

  const primary = topSchools[0];
  const secondary = topSchools[1];
  const tertiary = topSchools[2];

  const primarySchool = schools.find(s => s.id === primary.school);
  const _secondarySchool = secondary ? schools.find(s => s.id === secondary.school) : null;

  let description = `Düşünce haritanız ağırlıklı olarak %${primary.percentage} ${getSchoolName(primary.school)} eğilimini göstermektedir. `;

  if (primarySchool?.detailedProfile) {
    description += `${primarySchool.detailedProfile} `;
  }

  if (secondary && secondary.percentage > 20) {
    description += `\n\nİkincil olarak %${secondary.percentage} ${getSchoolName(secondary.school)} eğilimi de gözlenmektedir. `;
    if (_secondarySchool?.detailedProfile) {
      description += `${_secondarySchool.detailedProfile} `;
    }
  }

  if (tertiary && tertiary.percentage > 15) {
    description += `\n\nÜçüncü olarak %${tertiary.percentage} ${getSchoolName(tertiary.school)} eğilimi de belirgindir.`;
  }

  description += '\n\nBu profil, geleneksel İslami düşüncenin zenginliğini ve çeşitliliğini yansıtmaktadır. Farklı mezheplerin görüşlerini anlamak, İslami düşüncenin derinliğini kavramanıza yardımcı olacaktır.';

  return description;
}

function generateRecommendations(topSchools: SchoolProfile[]): string[] {
  const recommendations: string[] = [];

  if (topSchools.length > 0) {
    const primarySchool = schools.find(s => s.id === topSchools[0].school);
    recommendations.push(`${getSchoolName(topSchools[0].school)} geleneğinin klasik eserlerini inceleyebilirsiniz. ${primarySchool?.modernRepresentatives?.join(', ') || ''} gibi alimler bu geleneğin önemli temsilcileridir.`);
  }

  if (topSchools.length > 1) {
    recommendations.push(`${getSchoolName(topSchools[1].school)} ile ${getSchoolName(topSchools[0].school)} arasındaki farkları anlamak faydalı olabilir. Her iki mezhep de İslami düşüncenin önemli kollarıdır ve birbirlerini tamamlarlar.`);
  }

  if (topSchools.length > 2) {
    recommendations.push(`${getSchoolName(topSchools[2].school)} mezhebinin görüşlerini de incelemek, daha bütünsel bir anlayış geliştirmenize yardımcı olacaktır.`);
  }

  recommendations.push('Farklı mezheplerin görüşlerini karşılaştırmalı olarak incelemek, İslami düşüncenin zenginliğini ve çeşitliliğini anlamanıza yardımcı olacaktır. Her mezhep, belirli tarihsel ve sosyal koşullar içinde gelişmiş ve kendi içinde tutarlı bir sistem oluşturmuştur.');

  recommendations.push('Mezhep farklılıklarını anlamak, İslam\'ın evrenselliğini ve esnekliğini gösterir. Farklı görüşleri saygıyla karşılamak ve öğrenmek, İslami bilgeliğin temel ilkelerindendir.');

  return recommendations;
}

function getSchoolName(schoolId: string): string {
  const school = schools.find(s => s.id === schoolId);
  return school?.name || schoolId;
}

