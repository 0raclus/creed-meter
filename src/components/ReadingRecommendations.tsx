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

  // Soft Contrast renk paleti
  const bookColors = [
    { bg: 'rgb(228 208 133)', badge: 'rgb(168 185 119)' }, // Lemon + Cucumber
    { bg: 'rgb(170 198 173)', badge: 'rgb(235 153 119)' }, // Mint + Grapefruit
    { bg: 'rgb(235 153 119)', badge: 'rgb(228 208 133)' }, // Grapefruit + Lemon
    { bg: 'rgb(168 185 119)', badge: 'rgb(170 198 173)' }, // Cucumber + Mint
    { bg: 'rgb(228 208 133)', badge: 'rgb(235 153 119)' }, // Lemon + Grapefruit
    { bg: 'rgb(170 198 173)', badge: 'rgb(168 185 119)' }  // Mint + Cucumber
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-modern-lg p-8 border-2 border-black"
    >
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6" style={{ color: 'rgb(235 153 119)' }} />
        <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
          Önerilen Okumalar
        </h2>
      </div>
      <div className="space-y-4">
        {recommendations.slice(0, 6).map((rec, index) => {
          const color = bookColors[index % bookColors.length];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02, x: -5 }}
              className="border-2 rounded-lg p-5 shadow-modern"
              style={{
                backgroundColor: color.bg,
                borderColor: 'rgb(66 43 33)'
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-base flex-1" style={{ fontFamily: 'Space Grotesk', color: 'rgb(66 43 33)' }}>
                  {rec.title}
                </h3>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  className="text-xs font-semibold px-3 py-1 rounded-full ml-2 shrink-0 border-2"
                  style={{
                    backgroundColor: color.badge,
                    color: 'rgb(66 43 33)',
                    borderColor: 'rgb(66 43 33)'
                  }}
                >
                  {getSchoolName(rec.school)}
                </motion.span>
              </div>
              <p className="text-sm mb-2 font-medium" style={{ color: 'rgb(66 43 33)' }}>
                ✍️ {rec.author}
              </p>
              <p className="text-sm leading-relaxed font-medium" style={{ color: 'rgb(66 43 33)' }}>
                {rec.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

