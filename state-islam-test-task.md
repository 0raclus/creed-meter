# İslam Mezhepleri Kişilik Testi - Proje State Dosyası

## PROJE ÖZETI
Kapsamlı bir İslam mezhepleri ve düşünce ekolleri kişilik/eğilim testi sistemi geliştirilecek. Sistem, kullanıcıların teolojik, fıkhi, tasavvufi, siyasi ve felsefi konulardaki tercihlerini ölçerek onları en uyumlu mezhep/ekol ile eşleştirecek.

## MEVCUT DURUM
- Proje başlangıç aşamasında
- Sadece LICENSE ve README dosyaları mevcut
- Hiçbir kod/yapı henüz oluşturulmamış

## BULUNDUĞUMUZ AŞAMA
**AŞAMA 1: Proje Kurulumu ve Temel Yapı**

## YAPILACAK İŞLER (Öncelik Sırasına Göre)

### AŞAMA 1: Proje Kurulumu
- [ ] Node.js/npm proje yapısı oluştur (package.json, vite config)
- [ ] React + TypeScript setup
- [ ] Temel klasör yapısı (src/, public/, data/)
- [ ] Soru bankası JSON yapısı tasarla
- [ ] Puanlama algoritması tasarla

### AŞAMA 2: Soru Bankası Geliştirme
- [ ] 60+ soru yazma (6 kategori × 10-20 soru)
- [ ] Her soruya mezhep-puan eşleştirmesi
- [ ] Ağırlık katsayıları belirleme
- [ ] JSON formatında veri yapısı

### AŞAMA 3: Frontend Geliştirme
- [ ] Test arayüzü (soru gösterimi, seçenekler)
- [ ] İlerleme çubuğu
- [ ] Kategori göstergesi
- [ ] Responsive tasarım

### AŞAMA 4: Puanlama Motoru
- [ ] Algoritma implementasyonu
- [ ] Bileşik puanlama (mezhep ilişkileri)
- [ ] Sonuç hesaplama

### AŞAMA 5: Sonuç Raporlama
- [ ] Radar chart visualizasyonu
- [ ] Bar chart karşılaştırması
- [ ] Detaylı profil açıklamaları
- [ ] Alim eşleştirmesi
- [ ] Okuma önerileri

### AŞAMA 6: Test ve Optimizasyon
- [ ] Bilinen profiller ile test
- [ ] Algoritma doğrulama
- [ ] UI/UX iyileştirmesi

## TEKNIK STACK
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Visualizations**: Recharts (radar, bar charts)
- **Data**: JSON (statik)
- **Deployment**: Static site (Vercel/GitHub Pages)

## DOSYA YAPISI (Planlanan)
```
src/
├── components/
│   ├── QuestionCard.tsx
│   ├── ProgressBar.tsx
│   ├── ResultsPage.tsx
│   └── RadarChart.tsx
├── data/
│   ├── questions.json
│   ├── schools.json
│   └── scholars.json
├── utils/
│   ├── scoring.ts
│   └── calculations.ts
├── types/
│   └── index.ts
└── App.tsx
```

## SONRAKI ADIM
Proje kurulumunu başlat: package.json, vite config, temel React setup

