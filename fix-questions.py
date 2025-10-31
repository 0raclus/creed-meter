#!/usr/bin/env python3
import json
import sys

# Load questions
with open('src/data/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"📊 Başlangıç: {len(questions)} soru\n")

# 1. TEKRARLAYAN SORULARI SİL
print("1️⃣ TEKRARLAYAN SORULARI SİLİYORUM...")
questions_to_remove = ['AKD_DETAIL_002']  # AKD_005 ile aynı
questions = [q for q in questions if q['id'] not in questions_to_remove]
print(f"   ✅ {len(questions_to_remove)} soru silindi: {', '.join(questions_to_remove)}")
print(f"   📊 Kalan: {len(questions)} soru\n")

# 2. TEKNİK SORULARA "BİLMİYORUM" EKLE
print("2️⃣ TEKNİK SORULARA 'BİLMİYORUM' EKLİYORUM...")
technical_questions = ['AKD_DETAIL_004', 'FIQH_USUL_DETAIL_002', 'FIQH_USUL_DETAIL_003', 'TAS_003', 'SIY_003']
added_count = 0

for q in questions:
    if q['id'] in technical_questions:
        # "Bilmiyorum" seçeneği var mı kontrol et
        has_unknown = any('bilmiyorum' in opt['text'].lower() for opt in q['options'])
        if not has_unknown:
            # Son seçenek ID'sini bul
            last_id = chr(ord(q['options'][-1]['id']) + 1)
            q['options'].append({
                "id": last_id,
                "text": "Bilmiyorum / Bu konuda bilgim yok",
                "scores": {}
            })
            print(f"   ✅ {q['id']}: 'Bilmiyorum' eklendi")
            added_count += 1

print(f"   📊 Toplam {added_count} soruya 'Bilmiyorum' eklendi\n")

# 3. AŞIRI NEGATİF PUANLARI DÜZELT
print("3️⃣ AŞIRI NEGATİF PUANLARI DÜZELTİYORUM...")
fixed_count = 0

for q in questions:
    for opt in q['options']:
        scores = opt['scores']
        negatives = [school for school, score in scores.items() if score < 0]
        
        # Eğer 6'dan fazla negatif varsa, en düşük olanları kaldır
        if len(negatives) > 5:
            # Negatif skorları sırala
            negative_scores = [(school, score) for school, score in scores.items() if score < 0]
            negative_scores.sort(key=lambda x: x[1])  # En düşükten en yükseğe
            
            # En düşük 2-3 tanesini kaldır
            to_remove = negative_scores[:len(negatives) - 5]
            for school, _ in to_remove:
                del scores[school]
            
            if to_remove:
                print(f"   ✅ {q['id']} - Seçenek {opt['id']}: {len(to_remove)} negatif puan kaldırıldı")
                fixed_count += 1

print(f"   📊 Toplam {fixed_count} seçenek düzeltildi\n")

# 4. AĞIRLIKLARI OPTİMİZE ET
print("4️⃣ AĞIRLIKLARI OPTİMİZE EDİYORUM...")
weight_changes = 0

for q in questions:
    if q['weight'] >= 2.0:
        old_weight = q['weight']
        q['weight'] = 1.7  # 2.0'dan 1.7'ye düşür
        print(f"   ✅ {q['id']}: {old_weight} → {q['weight']}")
        weight_changes += 1

print(f"   📊 Toplam {weight_changes} sorunun ağırlığı değiştirildi\n")

# 5. İSTATİSTİKLER
print("📊 SONUÇ İSTATİSTİKLERİ:")
print("=" * 50)
print(f"Toplam soru sayısı: {len(questions)}")

category_count = {}
for q in questions:
    cat = q['category']
    category_count[cat] = category_count.get(cat, 0) + 1

print("\nKategori dağılımı:")
for cat, count in sorted(category_count.items()):
    print(f"  {cat}: {count} soru")

weights = [q['weight'] for q in questions]
print(f"\nAğırlık istatistikleri:")
print(f"  Ortalama: {sum(weights)/len(weights):.2f}")
print(f"  Min: {min(weights)}")
print(f"  Max: {max(weights)}")

# Bilmiyorum seçeneği olan sorular
unknown_count = sum(1 for q in questions if any('bilmiyorum' in opt['text'].lower() for opt in q['options']))
print(f"\n'Bilmiyorum' seçeneği olan sorular: {unknown_count}/{len(questions)}")

# Save
with open('src/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("\n✅ DÜZELTMELER TAMAMLANDI!")
print(f"📁 Dosya kaydedildi: src/data/questions.json")

