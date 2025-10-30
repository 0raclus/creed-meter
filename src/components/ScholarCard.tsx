import type { Scholar } from '../types';
import schools from '../data/schools.json';

interface ScholarCardProps {
  scholars: Scholar[];
}

export default function ScholarCard({ scholars }: ScholarCardProps) {
  const getSchoolName = (schoolId: string) => {
    return schools.find(s => s.id === schoolId)?.name || schoolId;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-black">
      <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Space Grotesk' }}>
        👨‍🎓 Profil ile Uyumlu Alimler
      </h2>
      <div className="space-y-4">
        {scholars.slice(0, 5).map((scholar, index) => (
          <div key={index} className="border-l-4 border-black bg-gray-100 rounded-lg pl-5 pr-4 py-4 hover:shadow-md transition border-2">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-black text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                {scholar.name}
              </h3>
              <span className="text-xs font-semibold bg-black text-white px-3 py-1 rounded-full">
                {getSchoolName(scholar.school)}
              </span>
            </div>
            <p className="text-sm text-black mb-2 font-medium">
              📅 {scholar.era}
            </p>
            <p className="text-sm text-black leading-relaxed font-medium">
              {scholar.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

