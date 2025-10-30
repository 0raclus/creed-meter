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
  const getSchoolName = (schoolId: string) => {
    return schools.find(s => s.id === schoolId)?.name || schoolId;
  };

  const barChartData = result.topSchools.map(school => ({
    name: getSchoolName(school.school),
    percentage: school.percentage
  }));

  const radarData = result.allSchools.slice(0, 8).map(school => ({
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white py-12"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-12 text-center"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Award className="w-12 h-12" style={{ color: 'rgb(168 185 119)' }} />
          </motion.div>
          <h1 className="text-5xl font-bold text-black mb-3" style={{ fontFamily: 'Space Grotesk' }}>
            Sonuçlarınız Hazır!
          </h1>
          <p className="text-xl font-medium" style={{ color: 'rgb(66 43 33)' }}>
            İslam mezhepleri ve düşünce ekollerindeki konumunuz
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 rounded-full mx-auto mt-4"
            style={{ backgroundColor: 'rgb(168 185 119)' }}
          />

          {/* Sosyal Medya Paylaşım ve PDF Export Butonları */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* Sosyal Medya Paylaşım */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2" style={{ color: 'rgb(66 43 33)' }}>
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Paylaş:</span>
              </div>
              <div className="flex gap-3">
                <TwitterShareButton
                  url={window.location.href}
                  title={`İslam Mezhepleri Kişilik Testi sonucum: ${getSchoolName(result.topSchools[0].school)} - %${result.topSchools[0].percentage.toFixed(1)}`}
                  hashtags={['İslamMezhepleri', 'KişilikTesti']}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <TwitterIcon size={40} round />
                  </motion.div>
                </TwitterShareButton>

                <FacebookShareButton
                  url={window.location.href}
                  hashtag="#İslamMezhepleri"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <FacebookIcon size={40} round />
                  </motion.div>
                </FacebookShareButton>

                <WhatsappShareButton
                  url={window.location.href}
                  title={`İslam Mezhepleri Kişilik Testi sonucum: ${getSchoolName(result.topSchools[0].school)} - %${result.topSchools[0].percentage.toFixed(1)}`}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <WhatsappIcon size={40} round />
                  </motion.div>
                </WhatsappShareButton>
              </div>
            </div>

            {/* PDF Export Butonu */}
            <motion.button
              onClick={exportToPDF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full shadow-modern hover:shadow-modern-lg transition-all duration-300 font-medium border-2 border-black"
              style={{ backgroundColor: 'rgb(170 198 173)', color: 'rgb(66 43 33)' }}
            >
              <Download className="w-5 h-5" />
              <span>PDF İndir</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* PDF Export için içerik wrapper */}
        <div id="results-content">
          {/* Ana Profil Kartları */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
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
                className="rounded-2xl shadow-modern-lg p-8 border-2 border-black"
                style={{ backgroundColor: colors[index].bg, color: colors[index].text }}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.span
                    className="text-4xl font-bold opacity-40"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    #{index + 1}
                  </motion.span>
                  <motion.span
                    className="text-3xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  >
                    {school.percentage}%
                  </motion.span>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>{getSchoolName(school.school)}</h3>
                <p className="text-sm mb-4 opacity-70">{schoolData?.era}</p>
                <p className="text-sm leading-relaxed opacity-80">{schoolData?.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Profil Açıklaması */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-modern-lg p-10 mb-12 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
              Profil Açıklaması
            </h2>
          </div>
          <p className="text-lg text-gray-800 leading-relaxed font-medium">
            {result.profile}
          </p>
        </motion.div>

        {/* Grafikler */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="bg-white rounded-2xl shadow-modern-lg p-8 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
                Mezhep Karşılaştırması
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#000' }} />
                <Bar dataKey="percentage" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="bg-white rounded-2xl shadow-modern-lg p-8 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
                Radar Analizi
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="Uyum %" dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Kategori Analizi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-modern-lg p-8 mb-12 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-green-500" />
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
              const categoryColors = ['from-blue-50 to-blue-100', 'from-purple-50 to-purple-100', 'from-green-50 to-green-100', 'from-pink-50 to-pink-100', 'from-orange-50 to-orange-100', 'from-cyan-50 to-cyan-100'];
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-linear-to-br ${categoryColors[idx]} rounded-xl p-5 border border-gray-200 shadow-modern`}
                >
                  <h3 className="font-bold text-gray-900 mb-3 text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                    {categoryEmojis[category]} {categoryLabels[category as keyof typeof categoryLabels]}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
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
          className="bg-white rounded-2xl shadow-modern-lg p-8 mb-12 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
              Kişiselleştirilmiş Öneriler
            </h2>
          </div>
          <div className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                className="flex items-start gap-4 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-modern"
              >
                <motion.span
                  className="text-white font-bold text-lg mt-0.5 shrink-0 bg-linear-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                >
                  {index + 1}
                </motion.span>
                <span className="text-gray-800 leading-relaxed font-medium">{rec}</span>
              </motion.div>
            ))}
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
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg shadow-modern-lg hover:shadow-modern-lg"
          >
            🔄 Testi Yeniden Başlat
          </motion.button>
          <motion.button
            onClick={() => window.print()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-lg shadow-modern-lg hover:shadow-modern-lg"
          >
            🖨️ Yazdır
          </motion.button>
        </motion.div>
        </div> {/* results-content wrapper end */}
      </div>
    </motion.div>
  );
}

