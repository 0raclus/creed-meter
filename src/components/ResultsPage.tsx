import type { TestResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
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

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Başlık */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-black mb-3" style={{ fontFamily: 'Space Grotesk' }}>
            ✨ Sonuçlarınız Hazır!
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            İslam mezhepleri ve düşünce ekollerindeki konumunuz
          </p>
          <div className="h-1 w-24 bg-black rounded-full mx-auto mt-4"></div>
        </div>

        {/* Ana Profil Kartları */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {result.topSchools.slice(0, 3).map((school, index) => {
            const schoolData = schools.find(s => s.id === school.school) as any;
            const bgColors = ['bg-black', 'bg-gray-800', 'bg-gray-700'];
            return (
              <div key={school.school} className={`${bgColors[index]} rounded-2xl shadow-lg p-8 text-white border-2 border-black`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-bold opacity-30">{index + 1}</span>
                  <span className="text-3xl font-bold">{school.percentage}%</span>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>{getSchoolName(school.school)}</h3>
                <p className="text-sm text-gray-300 mb-4">{schoolData?.era}</p>
                <p className="text-sm leading-relaxed text-gray-200">{schoolData?.description}</p>
              </div>
            );
          })}
        </div>

        {/* Profil Açıklaması */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-12 border-2 border-black">
          <h2 className="text-3xl font-bold text-black mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            📋 Profil Açıklaması
          </h2>
          <p className="text-lg text-black leading-relaxed font-medium">
            {result.profile}
          </p>
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-black">
            <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              📊 Mezhep Karşılaştırması
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#000000', border: '2px solid #000', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="percentage" fill="#000000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-black">
            <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              🎯 Radar Analizi
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#000000" />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="Uyum %" dataKey="value" stroke="#000000" fill="#000000" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kategori Analizi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-black">
          <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            🔍 Kategori Analizi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result.categoryAnalysis).map(([category, analysis]) => {
              const categoryEmojis: Record<string, string> = {
                akide: '📖',
                fiqh_usul: '⚖️',
                fiqh_amel: '🤲',
                tasavvuf: '🕯️',
                siyaset: '🏛️',
                modernite: '🌍'
              };
              return (
                <div key={category} className="bg-gray-100 border-2 border-black rounded-xl p-5 hover:shadow-lg transition">
                  <h3 className="font-bold text-black mb-3 text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                    {categoryEmojis[category]} {categoryLabels[category as keyof typeof categoryLabels]}
                  </h3>
                  <p className="text-sm text-black leading-relaxed font-medium">
                    <span className="font-bold">Baskın Mezhep:</span> {analysis.dominantSchools.map(s => getSchoolName(s)).join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Öneriler */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-black">
          <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            💡 Kişiselleştirilmiş Öneriler
          </h2>
          <div className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg border-2 border-black">
                <span className="text-black font-bold text-lg mt-0.5 shrink-0 bg-white px-3 py-1 rounded border-2 border-black">{index + 1}</span>
                <span className="text-black leading-relaxed font-medium">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bilginler ve Okuma Önerileri */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ScholarCard
            scholars={scholars.filter(s =>
              result.topSchools.some(ts => ts.school === s.school)
            ) as any}
          />
          <ReadingRecommendations
            recommendations={recommendations.filter(r =>
              result.topSchools.some(ts => ts.school === r.school)
            ) as any}
          />
        </div>

        {/* Butonlar */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onReset}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            🔄 Testi Yeniden Başlat
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            🖨️ Yazdır
          </button>
        </div>
      </div>
    </div>
  );
}

