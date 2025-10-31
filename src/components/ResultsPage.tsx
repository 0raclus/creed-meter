import { motion } from 'framer-motion';
import { Award, BookOpen, Users, Zap, Share2, Download } from 'lucide-react';
import type { TestResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TwitterShareButton, FacebookShareButton, WhatsappShareButton, TwitterIcon, FacebookIcon, WhatsappIcon } from 'react-share';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import schools from '../data/schools.json';
import scholars from '../data/scholars.json';
import recommendations from '../data/recommendations.json';
import ScholarCard from './ScholarCard';
import ReadingRecommendations from './ReadingRecommendations';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

interface ResultsPageProps {
  result: TestResult;
  onReset: () => void;
}

const categoryLabels: Record<string, string> = {
  akide: 'Akide',
  fiqh_usul: 'Fıkıh Usulü',
  fiqh_amel: 'Amelî Fıkıh',
  tasavvuf: 'Tasavvuf',
  siyaset: 'Siyaset',
  modernite: 'Modernite'
};

export default function ResultsPage({ result, onReset }: ResultsPageProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    // Konfeti 5 saniye sonra dursun
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const getSchoolName = (schoolId: string) => {
    return schools.find(s => s.id === schoolId)?.name || schoolId;
  };

  // TÜM MEZHEPLERİ GÖSTER (60+ mezhep)
  const barChartData = result.allSchools
    .filter(school => school.percentage > 0) // Sadece puan alanlar
    .map(school => ({
      name: getSchoolName(school.school),
      percentage: school.percentage
    }));

  const radarData = result.allSchools
    .slice(0, 12) // İlk 12 mezhep radar grafiğinde
    .map(school => ({
      name: getSchoolName(school.school),
      value: school.percentage
    }));

  const exportToPDF = async () => {
    const element = document.getElementById('results-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`islam-mezhepleri-test-sonucu-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF oluşturulurken hata:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <>
      {/* Konfeti Patlaması */}
      {showConfetti && !result.isAwam && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={500}
          recycle={false}
          colors={['#ABB977', '#DC312F', '#EB9977', '#AAC6AD', '#422B21', '#E4D085']}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <motion.div
            className="inline-block mb-3 sm:mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Award className="w-10 sm:w-12 h-10 sm:h-12" style={{ color: 'rgb(168 185 119)' }} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2 sm:mb-3" style={{ fontFamily: 'Space Grotesk' }}>
            Sonuçlarınız Hazır!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl font-medium px-4" style={{ color: 'rgb(66 43 33)' }}>
            İslam mezhepleri ve düşünce ekollerindeki konumunuz
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 rounded-full mx-auto mt-4"
            style={{ backgroundColor: 'rgb(168 185 119)' }}
          />

          {/* Güven Skoru ve Avam Uyarısı */}
          {result.isAwam && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-2xl border-2 border-black mx-4 sm:mx-0"
              style={{ backgroundColor: 'rgb(220 49 47)', color: 'white' }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-2">⚠️ Bilgi Eksikliği Tespit Edildi</h3>
              <p className="text-sm sm:text-base lg:text-lg">
                Soruların %{Math.round((result.unknownAnswersCount / result.totalQuestions) * 100)}'ine "Bilmiyorum" cevabı verdiniz.
                Bu, İslami mezhep ve düşünce ekolleri konusunda temel bilgi eksikliğiniz olduğunu gösterir.
              </p>
            </motion.div>
          )}

          {!result.isAwam && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 flex items-center justify-center gap-4"
            >
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: 'rgb(66 43 33)' }}>Güven Skoru</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-32 h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidenceScore}%` }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: result.confidenceScore >= 70 ? 'rgb(168 185 119)' :
                                       result.confidenceScore >= 40 ? 'rgb(228 208 133)' :
                                       'rgb(220 49 47)'
                      }}
                    />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: 'rgb(66 43 33)' }}>
                    %{Math.round(result.confidenceScore)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {result.consistencyWarnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-4 p-4 rounded-xl border-2 border-black"
              style={{ backgroundColor: 'rgb(235 153 119)', color: 'rgb(66 43 33)' }}
            >
              <h4 className="font-bold mb-2">⚠️ Tutarsızlık Uyarıları ({result.consistencyWarnings.length})</h4>
              <ul className="text-sm space-y-1">
                {result.consistencyWarnings.slice(0, 3).map((warning, idx) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Sosyal Medya Paylaşım ve PDF Export Butonları */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* Sosyal Medya Paylaşım */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2" style={{ color: 'rgb(66 43 33)' }}>
                <Share2 className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">Paylaş:</span>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <TwitterShareButton
                  url={window.location.href}
                  title={`İslam Mezhepleri Kişilik Testi sonucum: ${getSchoolName(result.topSchools[0].school)} - %${result.topSchools[0].percentage.toFixed(1)}`}
                  hashtags={['İslamMezhepleri', 'KişilikTesti']}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <TwitterIcon size={32} round className="sm:w-10 sm:h-10" />
                  </motion.div>
                </TwitterShareButton>

                <FacebookShareButton
                  url={window.location.href}
                  hashtag="#İslamMezhepleri"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <FacebookIcon size={32} round className="sm:w-10 sm:h-10" />
                  </motion.div>
                </FacebookShareButton>

                <WhatsappShareButton
                  url={window.location.href}
                  title={`İslam Mezhepleri Kişilik Testi sonucum: ${getSchoolName(result.topSchools[0].school)} - %${result.topSchools[0].percentage.toFixed(1)}`}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <WhatsappIcon size={32} round className="sm:w-10 sm:h-10" />
                  </motion.div>
                </WhatsappShareButton>
              </div>
            </div>

            {/* PDF Export Butonu */}
            <motion.button
              onClick={exportToPDF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-modern hover:shadow-modern-lg transition-all duration-300 font-bold border-2 border-black text-sm sm:text-base"
              style={{ backgroundColor: 'rgb(228 208 133)', color: 'rgb(66 43 33)' }}
            >
              <Download className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>PDF İndir</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* PDF Export için içerik wrapper */}
        <div id="results-content">
          {/* Ana Profil Kartları */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
          {result.topSchools.slice(0, 3).map((school, index) => {
            const schoolData = schools.find(s => s.id === school.school) as any;
            const colors = [
              { bg: 'rgb(168 185 119)', text: 'rgb(66 43 33)' }, // Cucumber
              { bg: 'rgb(235 153 119)', text: 'rgb(66 43 33)' }, // Grapefruit
              { bg: 'rgb(170 198 173)', text: 'rgb(66 43 33)' }  // Mint
            ];
            return (
              <motion.div
                key={school.school}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-2xl shadow-modern-lg p-4 sm:p-6 lg:p-8 border-2 border-black"
                style={{ backgroundColor: colors[index].bg, color: colors[index].text }}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <motion.span
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold opacity-40"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    #{index + 1}
                  </motion.span>
                  <motion.span
                    className="text-2xl sm:text-3xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  >
                    {school.percentage}%
                  </motion.span>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>{getSchoolName(school.school)}</h3>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4 opacity-70">{schoolData?.era}</p>
                <p className="text-xs sm:text-sm leading-relaxed opacity-80">{schoolData?.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Profil Açıklaması */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-modern-lg p-4 sm:p-6 lg:p-10 mb-8 sm:mb-12 border-2 border-black"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <BookOpen className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: 'rgb(168 185 119)' }} />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
              Profil Açıklaması
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-medium" style={{ color: 'rgb(66 43 33)' }}>
            {result.profile}
          </p>
        </motion.div>

        {/* Grafikler */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="bg-white rounded-2xl shadow-modern-lg p-4 sm:p-6 lg:p-8 border-2 border-black"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Zap className="w-5 sm:w-6 h-5 sm:h-6" style={{ color: 'rgb(235 153 119)' }} />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
                Mezhep Karşılaştırması
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={600} className="sm:h-[700px] lg:h-[800px]">
              <BarChart data={barChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} style={{ fill: 'rgb(66 43 33)', fontSize: '11px' }} />
                <YAxis style={{ fill: 'rgb(66 43 33)' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #000', borderRadius: '8px', color: 'rgb(66 43 33)' }} />
                <Bar dataKey="percentage" fill="rgb(168 185 119)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="bg-white rounded-2xl shadow-modern-lg p-4 sm:p-6 lg:p-8 border-2 border-black"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Award className="w-5 sm:w-6 h-5 sm:h-6" style={{ color: 'rgb(170 198 173)' }} />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
                Radar Analizi
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="name" style={{ fill: 'rgb(66 43 33)' }} />
                <PolarRadiusAxis style={{ fill: 'rgb(66 43 33)' }} />
                <Radar name="Uyum %" dataKey="value" stroke="rgb(170 198 173)" fill="rgb(170 198 173)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Kategori Analizi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-modern-lg p-8 mb-12 border-2 border-black"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6" style={{ color: 'rgb(228 208 133)' }} />
            <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
              Kategori Analizi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result.categoryAnalysis).map(([category, analysis], idx) => {
              const categoryEmojis: Record<string, string> = {
                akide: '📖',
                fiqh_usul: '⚖️',
                fiqh_amel: '🤲',
                tasavvuf: '🕯️',
                siyaset: '🏛️',
                modernite: '🌍'
              };
              const categoryBgColors = [
                'rgb(170 198 173)', // Mint - Akide
                'rgb(168 185 119)', // Cucumber - Fıkıh Usulü
                'rgb(228 208 133)', // Lemon - Fıkıh Ameli
                'rgb(235 153 119)', // Grapefruit - Tasavvuf
                'rgb(220 49 47)',   // Strawberry - Siyaset
                'rgb(66 43 33)'     // Chocolate - Modernite
              ];
              const categoryTextColors = [
                'rgb(66 43 33)', // Chocolate
                'rgb(66 43 33)', // Chocolate
                'rgb(66 43 33)', // Chocolate
                'rgb(66 43 33)', // Chocolate
                'white',         // White for Strawberry
                'white'          // White for Chocolate
              ];
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl p-5 border-2 border-black shadow-modern"
                  style={{ backgroundColor: categoryBgColors[idx], color: categoryTextColors[idx] }}
                >
                  <h3 className="font-bold mb-3 text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                    {categoryEmojis[category]} {categoryLabels[category as keyof typeof categoryLabels]}
                  </h3>
                  <p className="text-sm leading-relaxed font-medium">
                    <span className="font-bold">Baskın Mezhep:</span> {analysis.dominantSchools.map(s => getSchoolName(s)).join(', ')}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Öneriler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-modern-lg p-8 mb-12 border-2 border-black"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6" style={{ color: 'rgb(228 208 133)' }} />
            <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
              Kişiselleştirilmiş Öneriler
            </h2>
          </div>
          <div className="space-y-3">
            {result.recommendations.map((rec, index) => {
              // Soft Contrast renk paleti
              const colors = [
                { bg: 'rgb(170 198 173)', badge: 'rgb(168 185 119)', border: 'rgb(66 43 33)' }, // Mint + Cucumber
                { bg: 'rgb(235 153 119)', badge: 'rgb(220 49 47)', border: 'rgb(66 43 33)' },   // Grapefruit + Strawberry
                { bg: 'rgb(228 208 133)', badge: 'rgb(168 185 119)', border: 'rgb(66 43 33)' }, // Lemon + Cucumber
                { bg: 'rgb(168 185 119)', badge: 'rgb(170 198 173)', border: 'rgb(66 43 33)' }, // Cucumber + Mint
                { bg: 'rgb(170 198 173)', badge: 'rgb(235 153 119)', border: 'rgb(66 43 33)' }  // Mint + Grapefruit
              ];
              const color = colors[index % colors.length];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                  className="flex items-start gap-4 p-4 rounded-lg border-2 hover:shadow-modern"
                  style={{ backgroundColor: color.bg, borderColor: color.border }}
                >
                  <motion.span
                    className="font-bold text-lg mt-0.5 shrink-0 px-3 py-1 rounded-full border-2"
                    style={{
                      backgroundColor: color.badge,
                      color: 'rgb(66 43 33)',
                      borderColor: 'rgb(66 43 33)'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                  >
                    {index + 1}
                  </motion.span>
                  <span className="leading-relaxed font-medium" style={{ color: 'rgb(66 43 33)' }}>{rec}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bilginler ve Okuma Önerileri */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            <ScholarCard
              scholars={scholars.filter(s =>
                result.topSchools.some(ts => ts.school === s.school)
              ) as any}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            <ReadingRecommendations
              recommendations={recommendations.filter(r =>
                result.topSchools.some(ts => ts.school === r.school)
              ) as any}
            />
          </motion.div>
        </motion.div>

        {/* Butonlar */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-modern-lg hover:shadow-modern-lg border-2 border-black"
            style={{ backgroundColor: 'rgb(168 185 119)', color: 'rgb(66 43 33)' }}
          >
            🔄 Testi Yeniden Başlat
          </motion.button>
          <motion.button
            onClick={() => window.print()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-modern-lg hover:shadow-modern-lg border-2 border-black"
            style={{ backgroundColor: 'rgb(235 153 119)', color: 'rgb(66 43 33)' }}
          >
            🖨️ Yazdır
          </motion.button>
        </motion.div>
        </div> {/* results-content wrapper end */}
      </div>
    </motion.div>
    </>
  );
}

