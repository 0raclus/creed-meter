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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-slate-900 mb-2">
            Sonuçlarınız Hazır!
          </h1>
          <p className="text-center text-slate-600">
            İslam mezhepleri düşünce haritanız
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ana Profil
            </h2>
            <div className="space-y-3">
              {result.topSchools.map((school, index) => (
                <div key={school.school} className="flex items-center justify-between">
                  <span className="text-slate-700 font-semibold">
                    {index + 1}. {getSchoolName(school.school)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${school.percentage}%` }}
                      />
                    </div>
                    <span className="text-slate-900 font-bold w-12 text-right">
                      %{school.percentage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Profil Açıklaması
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {result.profile}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Karşılaştırma
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Radar Grafik
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="Uyum %" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Kategori Analizi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result.categoryAnalysis).map(([category, analysis]) => (
              <div key={category} className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                <p className="text-sm text-slate-600">
                  {analysis.dominantSchools.map(s => getSchoolName(s)).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Öneriler
          </h2>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span className="text-slate-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Testi Yeniden Başlat
          </button>
        </div>
      </div>
    </div>
  );
}

