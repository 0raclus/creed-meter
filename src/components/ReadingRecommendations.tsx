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
    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-black">
      <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Space Grotesk' }}>
        📚 Önerilen Okumalar
      </h2>
      <div className="space-y-4">
        {recommendations.slice(0, 6).map((rec, index) => (
          <div key={index} className="border-2 border-black rounded-lg p-5 hover:shadow-lg transition bg-gray-100">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-black text-base flex-1" style={{ fontFamily: 'Space Grotesk' }}>
                {rec.title}
              </h3>
              <span className="text-xs font-semibold bg-black text-white px-3 py-1 rounded-full ml-2 shrink-0">
                {getSchoolName(rec.school)}
              </span>
            </div>
            <p className="text-sm text-black mb-2 font-medium">
              ✍️ {rec.author}
            </p>
            <p className="text-sm text-black leading-relaxed font-medium">
              {rec.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

