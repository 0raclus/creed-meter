#!/usr/bin/env python3
"""
Cevaplardan mezhep/imam/alim isimlerini temizle.
Sadece cevabı bırak, kullanıcı hangi mezhebe ait olduğunu bilmesin.
"""

import json
import re

# Mezhep/isim referanslarını temizleme kuralları
REPLACEMENTS = [
    # Genel kalıplar
    (r"Selef-i Salihin'in anladığı gibi ", "Önceki nesillerin anladığı gibi "),
    (r"Selef'in görüşüne göre ", "Önceki alimlerin görüşüne göre "),
    (r"Ehl-i Beyt'in yorumunu", "Peygamber ailesinin yorumunu"),
    (r"Ehl-i Beyt'ten olmalı", "Peygamber ailesinden olmalı"),
    (r"Ehl-i Beyt hadisleri", "Peygamber ailesi hadisleri"),
    (r"Ehl-i Kitap", "Kitap ehli"),
    
    # Parantez içindeki mezhep isimleri
    (r" \(Atharî-Selefî\)", ""),
    (r" \(Mu'tezile\)", ""),
    (r" \(Zahirî\)", ""),
    (r" \(Zâhirî-Selefî\)", ""),
    (r" \(Ehl-i Sünnet\)", ""),
    (r" \(Cihadi Selefî-İhvan\)", ""),
    (r" \(Gelenekçi-Selefî\)", ""),
    
    # İmam/Alim isimleri
    (r"İmam Malik gibi ", ""),
    (r"İbn Arabi gibi ", ""),
    (r"İbn Kayyim el-Cevziyye'nin ", ""),
    (r"İbn Kayyim'in ", "Bu "),
    (r"İbn Arabi haklıdır", "bu görüş doğrudur"),
    
    # Mezhep isimleri cümle başında
    (r"Mu'tezile gibi mecaz olarak", "Mecaz olarak"),
    (r"Şia'nın İmam anlayışını", "Bu İmam anlayışını"),
    (r"Şii hadis anlayışı doğru,", "Bu hadis anlayışı doğru,"),
    (r"Selefiler tasavvufu", "Tasavvuf"),
    (r"Selefiler zühd", "Zühd"),
    (r"Selefiler arasında", "Bu konuda"),
    
    # Özel durumlar
    (r"sahih hadislerde geçtiği gibi", "hadislerde geçtiği gibi"),
    (r"İslam devleti kurulması farzdır", "İslam devleti kurulması gereklidir"),
]

def clean_text(text):
    """Metinden mezhep/isim referanslarını temizle"""
    for pattern, replacement in REPLACEMENTS:
        text = re.sub(pattern, replacement, text)
    return text

def clean_question(question):
    """Bir sorunun tüm cevaplarını temizle"""
    for option in question["options"]:
        old_text = option["text"]
        new_text = clean_text(old_text)
        
        if old_text != new_text:
            option["text"] = new_text
            print(f"✓ {question['id']}: '{old_text[:60]}...' → '{new_text[:60]}...'")
    
    return question

def main():
    # Soruları yükle
    with open("src/data/questions.json", "r", encoding="utf-8") as f:
        questions = json.load(f)
    
    print(f"📊 Toplam soru sayısı: {len(questions)}\n")
    
    # Her soruyu temizle
    cleaned_questions = []
    for q in questions:
        cleaned = clean_question(q)
        cleaned_questions.append(cleaned)
    
    # Kaydet
    with open("src/data/questions.json", "w", encoding="utf-8") as f:
        json.dump(cleaned_questions, f, ensure_ascii=False, indent=2)
    
    print("\n🎉 Mezhep/isim referansları başarıyla temizlendi!")

if __name__ == "__main__":
    main()

