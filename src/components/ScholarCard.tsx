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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        Profil ile Uyumlu Alimler
      </h2>
      <div className="space-y-3">
        {scholars.slice(0, 5).map((scholar, index) => (
          <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
            <h3 className="font-semibold text-slate-900">
              {scholar.name}
            </h3>
            <p className="text-sm text-slate-600">
              {scholar.era} • {getSchoolName(scholar.school)}
            </p>
            <p className="text-sm text-slate-700 mt-1">
              {scholar.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

