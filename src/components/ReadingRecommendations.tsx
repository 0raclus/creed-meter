import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-modern-lg p-8 border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
          Önerilen Okumalar
        </h2>
      </div>
      <div className="space-y-4">
        {recommendations.slice(0, 6).map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.02, x: -5 }}
            className="border border-gray-200 rounded-lg p-5 shadow-modern bg-linear-to-r from-green-50 to-emerald-50"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-base flex-1" style={{ fontFamily: 'Space Grotesk' }}>
                {rec.title}
              </h3>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                className="text-xs font-semibold bg-linear-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full ml-2 shrink-0"
              >
                {getSchoolName(rec.school)}
              </motion.span>
            </div>
            <p className="text-sm text-gray-700 mb-2 font-medium">
              ✍️ {rec.author}
            </p>
            <p className="text-sm text-gray-800 leading-relaxed font-medium">
              {rec.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

