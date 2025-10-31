import fs from 'fs';

// Load questions
const questions = JSON.parse(fs.readFileSync('src/data/questions.json', 'utf8'));

console.log('=== SORU KALİTESİ ANALİZİ ===\n');

// 1. TEKRARLAYAN SORULAR
console.log('1. TEKRARLAYAN VEYA ÇOK BENZER SORULAR:');
console.log('----------------------------------------');
const questionTexts = questions.map(q => ({ id: q.id, text: q.text.toLowerCase() }));
const duplicates = [];

for (let i = 0; i < questionTexts.length; i++) {
  for (let j = i + 1; j < questionTexts.length; j++) {
    const text1 = questionTexts[i].text;
    const text2 = questionTexts[j].text;
    
    // Benzerlik kontrolü (basit kelime eşleşmesi)
    const words1 = text1.split(' ').filter(w => w.length > 3);
    const words2 = text2.split(' ').filter(w => w.length > 3);
    const commonWords = words1.filter(w => words2.includes(w));
    const similarity = commonWords.length / Math.max(words1.length, words2.length);
    
    if (similarity > 0.6) {
      duplicates.push({
        q1: questionTexts[i].id,
        q2: questionTexts[j].id,
        similarity: (similarity * 100).toFixed(0) + '%',
        text1: questions[i].text,
        text2: questions[j].text
      });
    }
  }
}

if (duplicates.length > 0) {
  duplicates.forEach(d => {
    console.log(`\n${d.q1} vs ${d.q2} (Benzerlik: ${d.similarity})`);
    console.log(`  - ${d.text1}`);
    console.log(`  - ${d.text2}`);
  });
} else {
  console.log('✅ Tekrarlayan soru bulunamadı.');
}

// 2. TEKRARLAYAN CEVAP SEÇENEKLERİ
console.log('\n\n2. TEKRARLAYAN CEVAP SEÇENEKLERİ:');
console.log('----------------------------------------');
const allOptions = [];
questions.forEach(q => {
  q.options.forEach(opt => {
    allOptions.push({
      questionId: q.id,
      optionId: opt.id,
      text: opt.text.toLowerCase()
    });
  });
});

const optionDuplicates = [];
for (let i = 0; i < allOptions.length; i++) {
  for (let j = i + 1; j < allOptions.length; j++) {
    if (allOptions[i].questionId !== allOptions[j].questionId) {
      const text1 = allOptions[i].text;
      const text2 = allOptions[j].text;
      
      // Tam eşleşme veya çok benzer
      if (text1 === text2 || 
          (text1.includes(text2) && text2.length > 20) ||
          (text2.includes(text1) && text1.length > 20)) {
        optionDuplicates.push({
          q1: allOptions[i].questionId,
          q2: allOptions[j].questionId,
          text: allOptions[i].text
        });
      }
    }
  }
}

if (optionDuplicates.length > 0) {
  const uniqueDuplicates = [...new Map(optionDuplicates.map(d => [d.text, d])).values()];
  uniqueDuplicates.slice(0, 10).forEach(d => {
    console.log(`\n"${d.text}"`);
    console.log(`  Sorular: ${d.q1}, ${d.q2}`);
  });
  console.log(`\n⚠️ Toplam ${uniqueDuplicates.length} tekrarlayan cevap bulundu.`);
} else {
  console.log('✅ Tekrarlayan cevap bulunamadı.');
}

// 3. MANTIKSI NEGATİF PUANLAR
console.log('\n\n3. MANTIKSI NEGATİF PUANLAR:');
console.log('----------------------------------------');
const negativeIssues = [];

questions.forEach(q => {
  q.options.forEach(opt => {
    const scores = Object.entries(opt.scores);
    const positives = scores.filter(([_, score]) => score > 0);
    const negatives = scores.filter(([_, score]) => score < 0);
    
    // Eğer bir seçenek çok fazla negatif puan veriyorsa
    if (negatives.length > 6) {
      negativeIssues.push({
        question: q.id,
        option: opt.id,
        text: opt.text,
        negativeCount: negatives.length,
        positiveCount: positives.length
      });
    }
  });
});

if (negativeIssues.length > 0) {
  negativeIssues.slice(0, 10).forEach(issue => {
    console.log(`\n${issue.question} - Seçenek ${issue.option}:`);
    console.log(`  "${issue.text}"`);
    console.log(`  Pozitif: ${issue.positiveCount}, Negatif: ${issue.negativeCount}`);
  });
  console.log(`\n⚠️ Toplam ${negativeIssues.length} aşırı negatif puanlı seçenek bulundu.`);
} else {
  console.log('✅ Aşırı negatif puanlama bulunamadı.');
}

// 4. SORU ZORLUK ANALİZİ
console.log('\n\n4. SORU ZORLUK ANALİZİ:');
console.log('----------------------------------------');
questions.forEach(q => {
  const avgOptions = q.options.length;
  const hasUnknown = q.options.some(opt => opt.text.toLowerCase().includes('bilmiyorum'));
  
  // Çok teknik terimler
  const technicalTerms = ['te\'vil', 'tefviz', 'kesb', 'istihsan', 'istislah', 'sadd-i zerâi', 
                          'vahdet-i vücud', 'antropomorfik', 'maslahat', 'tekfir'];
  const hasTechnical = technicalTerms.some(term => q.text.toLowerCase().includes(term));
  
  if (hasTechnical && !hasUnknown) {
    console.log(`\n⚠️ ${q.id}: Teknik terim var ama "Bilmiyorum" seçeneği yok`);
    console.log(`   "${q.text}"`);
  }
});

// 5. KATEGORİ DAĞILIMI
console.log('\n\n5. KATEGORİ DAĞILIMI:');
console.log('----------------------------------------');
const categoryCount = {};
questions.forEach(q => {
  categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
});

Object.entries(categoryCount).forEach(([cat, count]) => {
  console.log(`${cat}: ${count} soru`);
});

// 6. AĞIRLIK ANALİZİ
console.log('\n\n6. AĞIRLIK ANALİZİ:');
console.log('----------------------------------------');
const weights = questions.map(q => q.weight);
const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
const minWeight = Math.min(...weights);
const maxWeight = Math.max(...weights);

console.log(`Ortalama ağırlık: ${avgWeight.toFixed(2)}`);
console.log(`Min ağırlık: ${minWeight}`);
console.log(`Max ağırlık: ${maxWeight}`);

const highWeightQuestions = questions.filter(q => q.weight >= 2.0);
if (highWeightQuestions.length > 0) {
  console.log(`\n⚠️ Çok yüksek ağırlıklı sorular (≥2.0):`);
  highWeightQuestions.forEach(q => {
    console.log(`  ${q.id} (${q.weight}): ${q.text}`);
  });
}

console.log('\n\n=== ANALİZ TAMAMLANDI ===');

