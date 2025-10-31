# SORU İYİLEŞTİRME TASK - DURUM DOSYASI

## 🎯 GÖREV
İslam Mezhepleri Kişilik Testi'ndeki soruların kalitesini artırmak ve sistemi iyileştirmek.

## 📊 ANALİZ SONUÇLARI

### 1. TEKRARLAYAN SORULAR
- **AKD_005** vs **AKD_DETAIL_002** (75% benzerlik)
  - Her ikisi de "Kur'an'ın yaratılmışlığı" konusunda
  - **Çözüm:** AKD_DETAIL_002'yi sil, AKD_005'i güçlendir

### 2. TEKRARLAYAN CEVAPLAR (14 adet)
1. "Her şey Allah'ın takdiridir..." → AKD_002, AKD_DETAIL_004
2. "İnsan tamamen özgürdür..." → AKD_002, AKD_DETAIL_004
3. "Allah bilir, insan seçer..." → AKD_002, AKD_DETAIL_004
4. "Kur'an yaratılmıştır..." → AKD_005, AKD_DETAIL_002
5. "Kıyas ve içtihadı geniş kullanırım" → FIQ_001, FIQH_USUL_DETAIL_003
6. "Faiz kesinlikle haramdır..." → AME_002, AME_005
7. "Maneviyatı önemserim..." → TAS_001, TAS_DETAIL_001
8. "Demokrasiyi İslam'la uyumlu görürüm" → SIY_001, SIY_DETAIL_001
9. "Aktif siyasi mücadeleyi..." → SIY_001, SIY_DETAIL_001
10. "Hilafet sistemini savunurum" → SIY_001, SIY_DETAIL_001

**Çözüm:** DETAIL sorularını sil veya cevapları farklılaştır

### 3. AŞIRI NEGATİF PUANLAR (3 adet)
1. **FIQH_USUL_DETAIL_003 - Seçenek A:** 3 pozitif, 7 negatif
2. **AME_001 - Seçenek B:** 3 pozitif, 7 negatif
3. **FIQH_AMEL_DETAIL_002 - Seçenek A:** 5 pozitif, 7 negatif

**Çözüm:** Negatif puanları azalt (max 4-5 negatif)

### 4. TEKNİK TERİMLİ SORULARDA "BİLMİYORUM" EKSİK (5 adet)
1. **AKD_DETAIL_004:** "Kesb" teorisi
2. **FIQH_USUL_DETAIL_002:** "İstislah"
3. **FIQH_USUL_DETAIL_003:** "Sadd-i Zerâi"
4. **TAS_003:** "Vahdet-i vücud"
5. **SIY_003:** "Tekfir"

**Çözüm:** Her birine "Bilmiyorum" seçeneği ekle

### 5. KATEGORİ DAĞILIMI
- Akide: 12 soru ✅
- Fıkıh Usulü: 8 soru ✅
- Fıkıh Ameli: 7 soru ✅
- Tasavvuf: 5 soru ⚠️ (az)
- Siyaset: 4 soru ⚠️ (az)
- Modernite: 4 soru ⚠️ (az)

**Öneri:** Tasavvuf, Siyaset, Modernite kategorilerine 2-3 soru daha ekle

### 6. AĞIRLIK ANALİZİ
- Ortalama: 1.43
- Min: 1.1
- Max: 2.0
- **Çok yüksek ağırlıklı (≥2.0):** 6 soru

**Öneri:** Ağırlıkları 1.1-1.8 arasında tut

## 🔧 YAPILACAK DÜZELTMELERİ

### Adım 1: Tekrarlayan Soruları Sil
- [ ] AKD_DETAIL_002'yi sil (AKD_005 ile aynı)
- [ ] AKD_DETAIL_004'ü sil veya farklılaştır (AKD_002 ile benzer)

### Adım 2: Teknik Sorulara "Bilmiyorum" Ekle
- [ ] AKD_DETAIL_004
- [ ] FIQH_USUL_DETAIL_002
- [ ] FIQH_USUL_DETAIL_003
- [ ] TAS_003
- [ ] SIY_003

### Adım 3: Negatif Puanları Düzelt
- [ ] FIQH_USUL_DETAIL_003 - Seçenek A
- [ ] AME_001 - Seçenek B
- [ ] FIQH_AMEL_DETAIL_002 - Seçenek A

### Adım 4: Yeni Sorular Ekle (Opsiyonel)
- [ ] Tasavvuf: 2 yeni soru
- [ ] Siyaset: 2 yeni soru
- [ ] Modernite: 2 yeni soru

### Adım 5: Ağırlıkları Optimize Et
- [ ] 2.0 ağırlıklı soruları 1.6-1.8'e düşür

## 📝 PROBLEM ÇÖZME YAKLAŞIMI

1. **Önce Analiz:** questions.json'u baştan sona oku
2. **Sorunları Tespit Et:** Tekrar, mantıksızlık, zorluk dengesi
3. **Çözüm Üret:** Her sorun için spesifik çözüm
4. **Uygula:** Dosyayı düzenle
5. **Test Et:** Build ve sonuç kontrolü

## 📂 DOSYA YAPISI

### questions.json
- **Toplam:** 40 soru
- **Format:** JSON array
- **Her soru:**
  - id: string
  - category: string
  - weight: number
  - text: string
  - options: array
    - id: string
    - text: string
    - scores: object (school_id: score)

### Kategoriler
- akide (inanç)
- fiqh_usul (fıkıh metodolojisi)
- fiqh_amel (pratik fıkıh)
- tasavvuf (mistisizm)
- siyaset (politik görüş)
- modernite (çağdaş meseleler)

## 🎯 BAŞARI KRİTERLERİ

- [ ] Tekrarlayan sorular kaldırıldı
- [ ] Teknik sorulara "Bilmiyorum" eklendi
- [ ] Negatif puanlar optimize edildi
- [ ] Kategori dağılımı dengeli
- [ ] Ağırlıklar optimize edildi
- [ ] Build başarılı
- [ ] Test sonuçları doğru

## 📌 NOTLAR

- Dosya 4704 satır, çok büyük
- Dikkatli edit gerekli
- Her değişiklikten sonra build test et
- Mezhep puanlamaları tarihsel olarak doğru olmalı

## 🔄 DURUM

**Şu an:** Analiz tamamlandı, düzeltmelere başlanacak
**Sonraki:** AKD_DETAIL_002'yi sil

