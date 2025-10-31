#!/usr/bin/env python3
"""
Soruları 8-12 seçenekli hale getir ve negatif puanları ekle.
Her soruya farklı mezhep perspektiflerinden cevaplar ekle.
"""

import json
import random

# Tüm mezhep listesi
ALL_SCHOOLS = [
    "athari", "esari", "maturidi", "mutazila", "murcie",
    "hanafi", "shafii", "maliki", "hanbeli", "zahiri",
    "selefi", "quietist_salafi", "jihadist_salafi", "sufi_selefi",
    "sufi", "qadiri", "naqshbandi", "mevlevi",
    "twelver_shia", "zaydi", "ismaili",
    "khariji", "ibadi", "jahmiyya", "qadariyya",
    "ashari_moderate", "maturidi_moderate",
    "modernist", "reformist", "liberal", "conservative",
    "salafi_quietist", "salafi_activist", "salafi_jihadist",
    "traditional_sunni", "neo_traditional"
]

# Kategori bazlı ek seçenekler
ADDITIONAL_OPTIONS = {
    "akide": [
        {
            "text": "Sembolik/mecazi olarak anlarım, literal yorumu reddederim",
            "schools": {"modernist": 5, "liberal": 4, "reformist": 4, "mutazila": 3},
            "negative": {"athari": -4, "selefi": -5, "hanbeli": -4, "zahiri": -5}
        },
        {
            "text": "Tasavvufi bakışla batıni/gizli mana ararım",
            "schools": {"sufi": 5, "qadiri": 4, "naqshbandi": 4, "mevlevi": 4},
            "negative": {"zahiri": -5, "selefi": -4, "athari": -3}
        },
        {
            "text": "Ehl-i Beyt'in yorumunu esas alırım",
            "schools": {"twelver_shia": 5, "zaydi": 4, "ismaili": 4},
            "negative": {"selefi": -5, "athari": -4, "hanbeli": -4}
        },
        {
            "text": "Farklı yorumları meşru görürüm, çoğulculuğu benimserim",
            "schools": {"liberal": 5, "modernist": 4, "reformist": 4},
            "negative": {"selefi": -4, "zahiri": -5, "jihadist_salafi": -5}
        },
        {
            "text": "Akıl ve nakli dengeli kullanırım",
            "schools": {"esari": 4, "maturidi": 5, "ashari_moderate": 4},
            "negative": {"athari": -2, "zahiri": -3}
        },
        {
            "text": "Sadece Kur'an ve Sahih Hadis'e göre anlarım",
            "schools": {"athari": 5, "selefi": 5, "hanbeli": 4, "zahiri": 4},
            "negative": {"mutazila": -5, "liberal": -4, "modernist": -4}
        }
    ],
    "fiqh_usul": [
        {
            "text": "Kıyas ve içtihadı geniş kullanırım",
            "schools": {"hanafi": 5, "maliki": 4, "shafii": 3},
            "negative": {"zahiri": -5, "athari": -3}
        },
        {
            "text": "Sadece nas'a (Kur'an ve Hadis) dayanırım",
            "schools": {"zahiri": 5, "athari": 4, "selefi": 4},
            "negative": {"hanafi": -3, "liberal": -4}
        },
        {
            "text": "Maslahat ve örf'ü dikkate alırım",
            "schools": {"maliki": 5, "hanafi": 4, "modernist": 4},
            "negative": {"zahiri": -5, "selefi": -4}
        },
        {
            "text": "İcma'yı (ümmet ittifakı) önemserim",
            "schools": {"shafii": 5, "esari": 4, "traditional_sunni": 4},
            "negative": {"khariji": -5, "liberal": -3}
        },
        {
            "text": "Çağdaş ihtiyaçlara göre yeniden yorumlarım",
            "schools": {"modernist": 5, "reformist": 5, "liberal": 4},
            "negative": {"selefi": -5, "zahiri": -5, "conservative": -4}
        }
    ],
    "fiqh_amel": [
        {
            "text": "Kolaylık prensibini (yüsr) esas alırım",
            "schools": {"hanafi": 4, "maliki": 4, "modernist": 5},
            "negative": {"zahiri": -3, "conservative": -2}
        },
        {
            "text": "En sıkı/ihtiyatlı olanı tercih ederim",
            "schools": {"hanbeli": 5, "selefi": 4, "conservative": 5},
            "negative": {"liberal": -4, "modernist": -4}
        },
        {
            "text": "Mezhep imamımın görüşüne uyarım",
            "schools": {"traditional_sunni": 5, "hanafi": 4, "shafii": 4, "maliki": 4},
            "negative": {"selefi": -3, "liberal": -2}
        },
        {
            "text": "Doğrudan Kur'an ve Hadis'ten anlamaya çalışırım",
            "schools": {"selefi": 5, "athari": 4, "zahiri": 4},
            "negative": {"traditional_sunni": -2, "sufi": -2}
        }
    ],
    "tasavvuf": [
        {
            "text": "Tasavvufu bid'at görürüm",
            "schools": {"selefi": 5, "zahiri": 4, "jihadist_salafi": 5},
            "negative": {"sufi": -5, "qadiri": -5, "naqshbandi": -5, "mevlevi": -5}
        },
        {
            "text": "Tarikat ehline bağlanmayı gerekli görürüm",
            "schools": {"sufi": 5, "qadiri": 5, "naqshbandi": 5, "mevlevi": 5},
            "negative": {"selefi": -5, "zahiri": -5}
        },
        {
            "text": "Tasavvufu Sünnet çerçevesinde kabul ederim",
            "schools": {"sufi_selefi": 5, "traditional_sunni": 4, "esari": 3},
            "negative": {"selefi": -2, "zahiri": -3}
        },
        {
            "text": "Maneviyatı önemserim ama tarikata girmem",
            "schools": {"modernist": 4, "reformist": 4, "liberal": 3},
            "negative": {"selefi": -1}
        }
    ],
    "siyaset": [
        {
            "text": "Hilafet sistemini savunurum",
            "schools": {"jihadist_salafi": 5, "conservative": 4, "traditional_sunni": 3},
            "negative": {"liberal": -5, "modernist": -5, "reformist": -4}
        },
        {
            "text": "Demokrasiyi İslam'la uyumlu görürüm",
            "schools": {"modernist": 5, "liberal": 5, "reformist": 4},
            "negative": {"jihadist_salafi": -5, "conservative": -4}
        },
        {
            "text": "Siyasetten uzak durmayı tercih ederim",
            "schools": {"quietist_salafi": 5, "sufi": 4, "traditional_sunni": 3},
            "negative": {"jihadist_salafi": -4, "khariji": -5}
        },
        {
            "text": "Aktif siyasi mücadeleyi gerekli görürüm",
            "schools": {"jihadist_salafi": 5, "khariji": 4, "salafi_activist": 5},
            "negative": {"quietist_salafi": -5, "sufi": -3}
        }
    ],
    "modernite": [
        {
            "text": "Modern değerleri tamamen reddederim",
            "schools": {"selefi": 5, "conservative": 5, "jihadist_salafi": 5},
            "negative": {"liberal": -5, "modernist": -5, "reformist": -5}
        },
        {
            "text": "İslam'ı çağdaş değerlerle uyumlu hale getiririm",
            "schools": {"modernist": 5, "liberal": 5, "reformist": 5},
            "negative": {"selefi": -5, "conservative": -5, "zahiri": -4}
        },
        {
            "text": "Seçici davranırım, uygun olanı alırım",
            "schools": {"reformist": 4, "modernist": 3, "traditional_sunni": 3},
            "negative": {"selefi": -2, "liberal": -1}
        },
        {
            "text": "Geleneksel değerleri korumayı öncelik görürüm",
            "schools": {"conservative": 5, "traditional_sunni": 5, "selefi": 4},
            "negative": {"liberal": -4, "modernist": -4}
        }
    ]
}

def expand_question_options(question):
    """Bir soruya 8-12 seçenek olacak şekilde yeni seçenekler ekle"""
    category = question["category"]
    current_options = question["options"]
    current_count = len(current_options)
    
    # Hedef: 8-12 seçenek
    target_count = random.randint(8, 12)
    needed = target_count - current_count
    
    if needed <= 0:
        return question
    
    # Kategori için ek seçenekler al
    additional = ADDITIONAL_OPTIONS.get(category, [])
    
    # Rastgele seç
    if len(additional) < needed:
        # Yeterli seçenek yoksa, mevcut seçenekleri tekrarla
        selected = additional + random.sample(additional, needed - len(additional)) if additional else []
    else:
        selected = random.sample(additional, needed)
    
    # Yeni seçenekler ekle
    for i, opt in enumerate(selected):
        option_id = f"{chr(65 + current_count + i)}"  # A, B, C, ...
        new_option = {
            "id": option_id,
            "text": opt["text"],
            "scores": opt["schools"]
        }
        
        # Negatif puanları ekle
        if "negative" in opt:
            for school, score in opt["negative"].items():
                new_option["scores"][school] = score
        
        current_options.append(new_option)
    
    question["options"] = current_options
    return question

def main():
    # Soruları yükle
    with open("src/data/questions.json", "r", encoding="utf-8") as f:
        questions = json.load(f)
    
    print(f"📊 Mevcut soru sayısı: {len(questions)}")
    print(f"📊 Ortalama seçenek sayısı: {sum(len(q['options']) for q in questions) / len(questions):.1f}")
    
    # Her soruyu genişlet
    expanded_questions = []
    for q in questions:
        expanded = expand_question_options(q)
        expanded_questions.append(expanded)
    
    print(f"\n✅ Genişletilmiş soru sayısı: {len(expanded_questions)}")
    print(f"✅ Yeni ortalama seçenek sayısı: {sum(len(q['options']) for q in expanded_questions) / len(expanded_questions):.1f}")
    
    # Kaydet
    with open("src/data/questions.json", "w", encoding="utf-8") as f:
        json.dump(expanded_questions, f, ensure_ascii=False, indent=2)
    
    print("\n🎉 Sorular başarıyla genişletildi!")

if __name__ == "__main__":
    main()

