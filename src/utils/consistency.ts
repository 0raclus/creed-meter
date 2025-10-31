/**
 * Tutarlılık Kuralları
 * 
 * Bu dosya, sorular arasındaki mantıksal tutarsızlıkları tespit eder.
 * Örnek: Hem "Kur'an yaratılmıştır" hem "Kur'an yaratılmamıştır" diyemez.
 */

export interface ConsistencyRule {
  questionId: string;
  conflictingQuestions: {
    questionId: string;
    conflictingOptions: {
      thisOption: string;
      thatOption: string;
      warningMessage: string;
    }[];
  }[];
}

/**
 * Tutarlılık Kuralları Listesi
 * 
 * Her kural, bir sorunun hangi diğer sorularla çelişebileceğini tanımlar.
 */
export const CONSISTENCY_RULES: ConsistencyRule[] = [
  // AKİDE - Kur'an'ın Yaratılmışlığı
  {
    questionId: "AKD_001", // Allah'ın sıfatları - zahiri yorum
    conflictingQuestions: [
      {
        questionId: "AKD_002", // Kur'an'ın yaratılmışlığı
        conflictingOptions: [
          {
            thisOption: "A", // Zahir manasına inanırım
            thatOption: "A", // Kur'an yaratılmıştır
            warningMessage: "Zahiri yorumu benimseyen biri genellikle Kur'an'ın yaratılmamış olduğuna inanır."
          }
        ]
      }
    ]
  },
  
  // AKİDE - Kader ve İrade
  {
    questionId: "AKD_005", // İnsan iradesi
    conflictingQuestions: [
      {
        questionId: "AKD_006", // Kader anlayışı
        conflictingOptions: [
          {
            thisOption: "A", // İnsan tamamen özgürdür
            thatOption: "A", // Her şey önceden belirlenmiştir
            warningMessage: "Tam özgürlük ile tam kader inancı çelişir."
          }
        ]
      }
    ]
  },

  // FIKHI USUL - Kıyas ve İcma
  {
    questionId: "FU_001", // Kıyas kullanımı
    conflictingQuestions: [
      {
        questionId: "FU_002", // Nassların yorumu
        conflictingOptions: [
          {
            thisOption: "E", // Kıyası reddederim
            thatOption: "A", // Geniş yorum yaparım
            warningMessage: "Kıyası reddeden biri genellikle nassları dar yorumlar."
          }
        ]
      }
    ]
  },

  // TASAVVUF - Keramet ve Velayat
  {
    questionId: "TSV_001", // Keramet inancı
    conflictingQuestions: [
      {
        questionId: "TSV_005", // Tarikat bağlılığı
        conflictingOptions: [
          {
            thisOption: "E", // Kerameti reddederim
            thatOption: "A", // Tarikata bağlıyım
            warningMessage: "Kerameti reddeden biri genellikle tarikata da mesafelidir."
          }
        ]
      }
    ]
  },

  // SİYASET - Hilafet ve Demokrasi
  {
    questionId: "SYS_001", // Hilafet sistemi
    conflictingQuestions: [
      {
        questionId: "MOD_001", // Demokrasi
        conflictingOptions: [
          {
            thisOption: "A", // Hilafet gereklidir
            thatOption: "A", // Demokrasi İslam'a uygundur
            warningMessage: "Klasik hilafet ile modern demokrasi farklı sistemlerdir."
          }
        ]
      }
    ]
  },

  // MODERNİTE - Bilim ve Din
  {
    questionId: "MOD_005", // Evrim teorisi
    conflictingQuestions: [
      {
        questionId: "AKD_010", // Yaratılış inancı
        conflictingOptions: [
          {
            thisOption: "A", // Evrimi kabul ederim
            thatOption: "A", // Adem doğrudan yaratıldı
            warningMessage: "Evrim teorisi ile doğrudan yaratılış inancı çelişebilir."
          }
        ]
      }
    ]
  }
];

/**
 * Tutarsızlıkları Kontrol Et
 * 
 * @param answers Kullanıcının cevapları
 * @returns Tutarsızlık uyarıları listesi
 */
export function checkConsistency(answers: Record<string, string>): string[] {
  const warnings: string[] = [];

  CONSISTENCY_RULES.forEach(rule => {
    const userAnswer = answers[rule.questionId];
    if (!userAnswer) return;

    rule.conflictingQuestions.forEach(conflict => {
      const conflictAnswer = answers[conflict.questionId];
      if (!conflictAnswer) return;

      conflict.conflictingOptions.forEach(option => {
        if (userAnswer === option.thisOption && conflictAnswer === option.thatOption) {
          warnings.push(option.warningMessage);
        }
      });
    });
  });

  return warnings;
}

/**
 * Güven Skorunu Hesapla
 * 
 * Tutarsızlık sayısına göre güven skorunu düşürür.
 * 
 * @param baseScore Temel skor (0-100)
 * @param warnings Tutarsızlık uyarıları
 * @returns Düzeltilmiş güven skoru
 */
export function calculateConfidenceScore(
  baseScore: number,
  warnings: string[],
  unknownCount: number,
  totalQuestions: number
): number {
  let confidence = baseScore;

  // Her tutarsızlık için %5 düşür
  confidence -= warnings.length * 5;

  // Bilmiyorum oranına göre düşür
  const unknownRatio = unknownCount / totalQuestions;
  confidence -= unknownRatio * 30; // %30'a kadar düşebilir

  // 0-100 arasında sınırla
  return Math.max(0, Math.min(100, confidence));
}

