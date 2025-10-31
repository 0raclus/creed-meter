#!/usr/bin/env python3
"""
Cevap şıklarını iyileştir:
1. Kaçamak/belirsiz cevapları düzelt
2. Tekrarlayan genel cevapları her soruya özel hale getir
3. Her cevap o sorunun konusuna uygun olmalı
"""

import json
import re

# Her soru için özel cevap şablonları
QUESTION_SPECIFIC_IMPROVEMENTS = {
    "AKD_001": {  # Allah'ın eli
        "Kesin bir görüşüm yok, farklı yorumları meşru görüyorum": 
            "İmam Malik gibi 'İstiva malum, keyfiyet meçhul' derim",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Selef-i Salihin'in anladığı gibi zahir manasıyla kabul ederim",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Mu'tezile gibi mecaz olarak 'nimet' veya 'kudret' anlarım",
        "Tasavvufi bakışla batıni/gizli mana ararım": 
            "İbn Arabi gibi tecelli ve zuhur manasında anlarım"
    },
    "AKD_002": {  # Kader ve irade
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Kader ve irade konusunda farklı mezhep görüşlerini saygıyla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Kaderi geniş anlamda Allah'ın ilmi olarak yorumlarım",
        "Tasavvufi bakışla batıni/gizli mana ararım": 
            "Kader meselesini 'kulun fiili Allah'ın fiilidir' şeklinde anlarım"
    },
    "AKD_003": {  # Büyük günah
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Büyük günah konusunda farklı mezhep görüşlerini anlayışla karşılarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Büyük günah işleyenin durumunu Kur'an ve Hadis'e göre belirlerim"
    },
    "AKD_004": {  # İmamet/Hilafet
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "İmamet konusunu çağdaş bağlamda yeniden yorumlarım",
        "Tasavvufi bakışla batıni/gizli mana ararım": 
            "İmameti manevi liderlik olarak anlarım"
    },
    "AKD_005": {  # Kur'an'ın yaratılmışlığı
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Kur'an'ın yaratılmışlığı konusunda farklı görüşleri meşru görürüm",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Kur'an'ın kadim oluşunu Selef'in görüşüne göre kabul ederim",
        "Tasavvufi bakışla batıni/gizli mana ararım": 
            "Kur'an'ın lafzı yaratılmış, manası kadim derim",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Kur'an'ın yaratılmışlığını felsefi bağlamda ele alırım"
    },
    "AKD_006": {  # Kabir azabı
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Kabir azabı konusunda farklı yorumları anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Kabir azabını psikolojik/manevi bir durum olarak yorumlarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Kabir azabını sahih hadislerde geçtiği gibi kabul ederim"
    },
    "AKD_007": {  # Şia İmam kavramı
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Şia'nın İmam anlayışını farklı bir perspektif olarak görürüm",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "İmam kavramını manevi liderlik bağlamında anlarım"
    },
    "AKD_008": {  # Ehl-i Kitap
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Ehl-i Kitap konusunda farklı mezhep görüşlerini saygıyla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Ehl-i Kitap'la ilişkileri çağdaş bağlamda yorumlarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Ehl-i Kitap hakkında Kur'an ve Hadis'teki hükümlere uyarım"
    },
    "AKD_DETAIL_001": {  # Semî ve Basîr
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Semî ve Basîr sıfatları konusunda farklı yorumları meşru görürüm",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Semî ve Basîr'i 'ilim' manasında mecazi olarak anlarım",
        "Tasavvufi bakışla batıni/gizli mana ararım": 
            "Semî ve Basîr'i Allah'ın her şeyi kuşatması olarak anlarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Semî ve Basîr sıfatlarını zahir manasıyla kabul ederim"
    },
    "AKD_DETAIL_002": {  # Kur'an yaratılmışlığı (detay)
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Kur'an'ın yaratılmışlığı tartışmasında farklı görüşleri anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Kur'an'ın yaratılmışlığını felsefi bir mesele olarak görürüm",
        "Tasavvufi bakışla batıni/gizli mana ararım": 
            "Kur'an'ın ezeli kelam, mushaf'ın yaratılmış olduğunu söylerim"
    },
    "AKD_DETAIL_003": {  # Vech sıfatı
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Vech sıfatı konusunda farklı mezhep yorumlarını saygıyla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Vech'i 'zat' veya 'rıza' manasında mecazi olarak anlarım",
        "Tasavvufi bakışla batıni/gizli mana ararım": 
            "Vech'i Allah'ın tecellisi olarak anlarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Vech sıfatını Selef'in yolunda teşbihsiz kabul ederim"
    },
    "AKD_DETAIL_004": {  # Kesb teorisi
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Kesb teorisi konusunda farklı kelam ekollerinin görüşlerini anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Kesb teorisini psikolojik bir açıklama olarak görürüm"
    },
    "FIQ_001": {  # Rey vs Rivayet
        "İkisi dengeli kullanılmalı, duruma göre değişir": 
            "Rey ve rivayeti dengeli kullanır, konuya göre öncelik veririm",
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Rey ve rivayet konusunda farklı mezhep yaklaşımlarını saygıyla karşılarım"
    },
    "FIQ_002": {  # İctihad kapısı
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "İctihad kapısı konusunda farklı görüşleri anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "İctihad kapısını çağdaş ihtiyaçlara göre yorumlarım"
    },
    "FIQ_003": {  # Hadis otoritesi
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Hadis otoritesi konusunda farklı mezhep yaklaşımlarını saygıyla karşılarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Hadis otoritesini Kur'an'dan sonra en yüksek kaynak olarak görürüm"
    },
    "FIQ_004": {  # Sahabe adaleti
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Sahabe adaleti konusunda farklı mezhep görüşlerini anlayışla karşılarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Sahabe adaletini Kur'an ve Hadis'teki övgülere göre kabul ederim",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Sahabe adaletini tarihsel bağlamda değerlendiririm"
    },
    "FIQ_005": {  # Hadis kritiği
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Hadis kritiği konusunda farklı yaklaşımları anlayışla karşılarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Hadis kritiğinde klasik cerh-ta'dil yöntemini esas alırım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Hadis kritiğinde modern tarihsel yöntemleri de kullanırım"
    },
    "FIQH_USUL_DETAIL_001": {  # İstihsan
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "İstihsan yöntemi konusunda farklı mezhep görüşlerini saygıyla karşılarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "İstihsan'ı bid'at görür, sadece nas'a dayanırım"
    },
    "FIQH_USUL_DETAIL_002": {  # İstislah
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "İstislah yöntemi konusunda farklı mezhep yaklaşımlarını anlayışla karşılarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "İstislah'ı kabul etmez, sadece nas'a uyarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "İstislah'ı çağdaş ihtiyaçlara göre geniş yorumlarım"
    },
    "FIQH_USUL_DETAIL_003": {  # Sadd-i Zerâi
        "Sadede Kur'an ve Sahih Hadis'e göre anlarım": 
            "Sadd-i Zerâi'yi Kur'an ve Hadis'teki örneklere göre uygularım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Sadd-i Zerâi'yi çağdaş bağlamda yorumlarım"
    },
    "AME_001": {  # Fatiha
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Fatiha konusunda sahih hadislere göre hareket ederim"
    },
    "AME_002": {  # Faiz
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Faiz konusunda farklı mezhep görüşlerini anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Faiz yasağını çağdaş ekonomik bağlamda yorumlarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Faiz yasağını Kur'an ve Hadis'teki gibi kesin kabul ederim"
    },
    "AME_003": {  # Hicap
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Hicap konusunda farklı mezhep görüşlerini saygıyla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Hicap'ı kültürel bağlamda yorumlarım",
        "Sadece Kur'an ve Sahis'e göre anlarım": 
            "Hicap konusunda Kur'an ve Hadis'teki hükümlere uyarım"
    },
    "AME_004": {  # Cihad
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Cihad konusunda farklı mezhep yorumlarını anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Cihad'ı manevi mücadele olarak yorumlarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Cihad konusunda Kur'an ve Hadis'teki hükümlere uyarım"
    },
    "AME_005": {  # Alkol
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Alkol yasağını Kur'an ve Hadis'teki gibi kesin kabul ederim"
    },
    "FIQH_AMEL_DETAIL_001": {  # Namaz şekli
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Namaz şeklini sahih hadislere göre belirlerim"
    },
    "FIQH_AMEL_DETAIL_002": {  # Abdest
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Abdest şeklini Kur'an ve Hadis'e göre belirlerim"
    },
    "TAS_001": {  # Tasavvuf
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Tasavvuf konusunda farklı görüşleri anlayışla karşılarım"
    },
    "TAS_002": {  # Tevessül
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Tevessül konusunda farklı mezhep görüşlerini saygıyla karşılarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Tevessül konusunda Kur'an ve Hadis'teki hükümlere uyarım"
    },
    "TAS_003": {  # Vahdet-i vücud
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Vahdet-i vücud konusunda farklı sufi görüşlerini anlayışla karşılarım",
        "Tasavvufi bakışla batıni/gizli mana ararım": 
            "Vahdet-i vücud'u İbn Arabi'nin yorumuna göre anlarım"
    },
    "TAS_DETAIL_001": {  # Selefi tasavvuf
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Selefi tasavvuf anlayışı konusunda farklı görüşleri saygıyla karşılarım"
    },
    "TAS_DETAIL_002": {  # İbn Kayyim
        "Tasavvufi bakışla batıni/gizli mana ararım": 
            "İbn Kayyim'in zühd vurgusunu tasavvufi bağlamda anlarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "İbn Kayyim'in zühd vurgusunu çağdaş bağlamda yorumlarım"
    },
    "SIY_001": {  # Devlet-din
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Devlet-din ilişkisi konusunda farklı görüşleri anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Devlet-din ilişkisini çağdaş bağlamda yorumlarım"
    },
    "SIY_002": {  # Hilafet restorasyonu
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Hilafet restorasyonu konusunda farklı görüşleri saygıyla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Hilafet'i tarihsel bir kurum olarak görürüm"
    },
    "SIY_003": {  # Tekfir
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Tekfir konusunda farklı mezhep görüşlerini anlayışla karşılarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Tekfir konusunda Kur'an ve Hadis'teki kriterlere uyarım"
    },
    "SIY_DETAIL_001": {  # İslam devleti
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "İslam devleti konusunda farklı görüşleri anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "İslam devletini çağdaş bağlamda yorumlarım"
    },
    "MOD_001": {  # Tarihsel okuma
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Tarihsel okuma konusunda farklı yaklaşımları anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Kur'an ve Sünnet'i tarihsel bağlamda yorumlarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Kur'an ve Sünnet'i evrensel olarak anlarım, tarihselci yaklaşımı reddederim"
    },
    "MOD_002": {  # Bilim-din
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Bilim-din ilişkisi konusunda farklı görüşleri saygıyla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Bilim-din ilişkisini çağdaş bağlamda yorumlarım"
    },
    "MOD_003": {  # Feminizm
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Feminizm konusunda farklı İslami görüşleri anlayışla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Cinsiyet eşitliğini İslami bağlamda yorumlarım",
        "Sadece Kur'an ve Sahih Hadis'e göre anlarım": 
            "Cinsiyet rolleri konusunda Kur'an ve Hadis'teki hükümlere uyarım"
    },
    "MOD_DETAIL_001": {  # Kadın çalışması
        "Farklı yorumları meşru görürüm, çoğulculuğu benimserim": 
            "Kadınların çalışması konusunda farklı görüşleri saygıyla karşılarım",
        "Sembolik/mecazi olarak anlarım, literal yorumu reddederim": 
            "Kadınların çalışmasını çağdaş bağlamda yorumlarım"
    }
}

def improve_question_answers(question):
    """Bir sorunun cevaplarını iyileştir"""
    question_id = question["id"]
    
    if question_id not in QUESTION_SPECIFIC_IMPROVEMENTS:
        return question
    
    improvements = QUESTION_SPECIFIC_IMPROVEMENTS[question_id]
    
    for option in question["options"]:
        old_text = option["text"]
        if old_text in improvements:
            option["text"] = improvements[old_text]
            print(f"✓ {question_id}: '{old_text[:50]}...' → '{option['text'][:50]}...'")
    
    return question

def main():
    # Soruları yükle
    with open("src/data/questions.json", "r", encoding="utf-8") as f:
        questions = json.load(f)
    
    print(f"📊 Toplam soru sayısı: {len(questions)}\n")
    
    # Her soruyu iyileştir
    improved_questions = []
    for q in questions:
        improved = improve_question_answers(q)
        improved_questions.append(improved)
    
    # Kaydet
    with open("src/data/questions.json", "w", encoding="utf-8") as f:
        json.dump(improved_questions, f, ensure_ascii=False, indent=2)
    
    print("\n🎉 Cevaplar başarıyla iyileştirildi!")

if __name__ == "__main__":
    main()

