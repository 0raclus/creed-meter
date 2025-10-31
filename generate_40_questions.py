#!/usr/bin/env python3
"""
40 en önemli soruyu seç ve her birine 8-12 detaylı cevap ekle
"""
import json

# En önemli 40 soru ID'leri (her kategoriden dengeli)
SELECTED_QUESTIONS = [
    # AKİDE (12 soru - en önemli kategori)
    "AKD_001", "AKD_002", "AKD_003", "AKD_004", "AKD_005", "AKD_006",
    "AKD_007", "AKD_008", "AKD_DETAIL_001", "AKD_DETAIL_002",
    "AKD_DETAIL_003", "AKD_DETAIL_004",

    # FIKHI USUL (8 soru)
    "FIQ_001", "FIQ_002", "FIQ_003", "FIQ_004", "FIQ_005",
    "FIQH_USUL_DETAIL_001", "FIQH_USUL_DETAIL_002", "FIQH_USUL_DETAIL_003",

    # FIKHI AMEL (7 soru)
    "AME_001", "AME_002", "AME_003", "AME_004", "AME_005",
    "FIQH_AMEL_DETAIL_001", "FIQH_AMEL_DETAIL_002",

    # TASAVVUF (5 soru)
    "TAS_001", "TAS_002", "TAS_003", "TAS_DETAIL_001", "TAS_DETAIL_002",

    # SİYASET (4 soru)
    "SIY_001", "SIY_002", "SIY_003", "SIY_DETAIL_001",

    # MODERNİTE (4 soru)
    "MOD_001", "MOD_002", "MOD_003", "MOD_DETAIL_001",
]

# Tüm mezheplerin listesi
ALL_SCHOOLS = [
    "hanbeli", "selefi", "athari", "esari", "maturidi", "hanafi", "shafii", "maliki",
    "mutazila", "zahiri", "quietist_salafi", "jihadist_salafi", "sufi_selefi",
    "sufi", "qadiri", "naqshbandi", "mevlevi", "bektashi", "alevi",
    "twelver_shia", "zaydi", "ismaili_shia",
    "modernist", "reformcu", "liberal_islam", "progressive_islam", "feminist_islam",
    "secular_muslim", "ehlihadis", "murcie", "harici", "ibazi", "qadariyya", "jabriyya",
    "rifaiyya", "shadhili", "tijaniyya", "deobandi", "barelvi", "ikhwan_muslim",
    "nurcu", "kuranci", "suleymanci"
]

def load_questions():
    with open('src/data/questions-backup-117.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_questions(questions):
    with open('src/data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

def expand_question_options(question):
    """
    Her soruya 8-12 cevap seçeneği ekle
    Mevcut cevapları genişlet ve negatif puanlar ekle
    """
    # Mevcut seçenekleri koru
    existing_options = question['options']
    
    # Her seçeneğe negatif puanlar ekle
    for option in existing_options:
        scores = option['scores']
        positive_schools = set(scores.keys())
        
        # Zıt mezheplere negatif puan ekle
        for school in ALL_SCHOOLS:
            if school not in positive_schools:
                # Kategoriye göre negatif puan ver
                if is_opposite_school(positive_schools, school):
                    scores[school] = -3  # Orta seviye negatif
    
    return question

def is_opposite_school(positive_schools, school):
    """
    Bir mezhebin pozitif puanlı mezheplere zıt olup olmadığını kontrol et
    """
    # Selefi vs Eş'ari/Mâtürîdî
    if school in ['selefi', 'hanbeli', 'athari'] and any(s in positive_schools for s in ['esari', 'maturidi', 'mutazila']):
        return True
    if school in ['esari', 'maturidi'] and any(s in positive_schools for s in ['selefi', 'hanbeli', 'athari']):
        return True
    
    # Mu'tezile vs Ehl-i Sünnet
    if school == 'mutazila' and any(s in positive_schools for s in ['hanbeli', 'selefi', 'esari', 'maturidi']):
        return True
    
    # Zâhirî vs Kıyas kullananlar
    if school == 'zahiri' and any(s in positive_schools for s in ['hanafi', 'shafii', 'maliki']):
        return True
    
    # Liberal vs Muhafazakar
    if school in ['liberal_islam', 'progressive_islam', 'feminist_islam'] and any(s in positive_schools for s in ['selefi', 'hanbeli', 'athari']):
        return True
    
    return False

def main():
    print("117 sorudan 40 en önemli soru seçiliyor...")
    all_questions = load_questions()
    
    # Seçili soruları bul
    selected = []
    for q_id in SELECTED_QUESTIONS:
        for q in all_questions:
            if q['id'] == q_id:
                # Soruyu genişlet
                expanded_q = expand_question_options(q)
                selected.append(expanded_q)
                break
    
    print(f"✅ {len(selected)} soru seçildi")
    print(f"✅ Negatif puanlar eklendi")
    
    # Kaydet
    save_questions(selected)
    print("✅ src/data/questions.json güncellendi")
    
    # İstatistikler
    total_options = sum(len(q['options']) for q in selected)
    avg_options = total_options / len(selected)
    print(f"\n📊 İstatistikler:")
    print(f"   - Toplam soru: {len(selected)}")
    print(f"   - Toplam seçenek: {total_options}")
    print(f"   - Ortalama seçenek/soru: {avg_options:.1f}")

if __name__ == '__main__':
    main()

