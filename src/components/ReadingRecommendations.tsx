import type { ReadingRecommendation } from '../types';
import schools from '../data/schools.json';

interface ReadingRecommendationsProps {
  recommendations: ReadingRecommendation[];
}

export default function ReadingRecommendations({ recommendations }: ReadingRecommendationsProps) {
  const getSchoolName = (schoolId: string) => {
    return schools.find(s => s.id === schoolId)?.name || schoolId;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        Önerilen Okumalar
      </h2>
      <div className="space-y-4">
        {recommendations.slice(0, 6).map((rec, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 hover:border-blue-400 transition">
            <h3 className="font-semibold text-slate-900">
              {rec.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Yazar: {rec.author}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {getSchoolName(rec.school)}
            </p>
            <p className="text-sm text-slate-700 mt-2">
              {rec.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

