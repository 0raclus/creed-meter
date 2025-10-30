import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-modern-lg p-8 border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
          Profil ile Uyumlu Alimler
        </h2>
      </div>
      <div className="space-y-4">
        {scholars.slice(0, 5).map((scholar, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="border-l-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg pl-5 pr-4 py-4 shadow-modern border-r border-t border-b border-gray-200"
            style={{ borderLeftColor: '#a855f7' }}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                {scholar.name}
              </h3>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                className="text-xs font-semibold bg-linear-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full"
              >
                {getSchoolName(scholar.school)}
              </motion.span>
            </div>
            <p className="text-sm text-gray-700 mb-2 font-medium">
              📅 {scholar.era}
            </p>
            <p className="text-sm text-gray-800 leading-relaxed font-medium">
              {scholar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

