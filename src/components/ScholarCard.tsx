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

  // Soft Contrast renk paleti
  const scholarColors = [
    { bg: 'rgb(170 198 173)', border: 'rgb(168 185 119)', badge: 'rgb(228 208 133)' }, // Mint + Cucumber + Lemon
    { bg: 'rgb(235 153 119)', border: 'rgb(220 49 47)', badge: 'rgb(228 208 133)' },   // Grapefruit + Strawberry + Lemon
    { bg: 'rgb(228 208 133)', border: 'rgb(168 185 119)', badge: 'rgb(170 198 173)' }, // Lemon + Cucumber + Mint
    { bg: 'rgb(168 185 119)', border: 'rgb(170 198 173)', badge: 'rgb(235 153 119)' }, // Cucumber + Mint + Grapefruit
    { bg: 'rgb(170 198 173)', border: 'rgb(235 153 119)', badge: 'rgb(168 185 119)' }  // Mint + Grapefruit + Cucumber
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-modern-lg p-8 border-2 border-black"
    >
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6" style={{ color: 'rgb(168 185 119)' }} />
        <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'Space Grotesk' }}>
          Profil ile Uyumlu Alimler
        </h2>
      </div>
      <div className="space-y-4">
        {scholars.slice(0, 5).map((scholar, index) => {
          const color = scholarColors[index % scholarColors.length];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="border-l-4 rounded-lg pl-5 pr-4 py-4 shadow-modern border-r-2 border-t-2 border-b-2"
              style={{
                backgroundColor: color.bg,
                borderLeftColor: color.border,
                borderRightColor: 'rgb(66 43 33)',
                borderTopColor: 'rgb(66 43 33)',
                borderBottomColor: 'rgb(66 43 33)'
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk', color: 'rgb(66 43 33)' }}>
                  {scholar.name}
                </h3>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  className="text-xs font-semibold px-3 py-1 rounded-full border-2"
                  style={{
                    backgroundColor: color.badge,
                    color: 'rgb(66 43 33)',
                    borderColor: 'rgb(66 43 33)'
                  }}
                >
                  {getSchoolName(scholar.school)}
                </motion.span>
              </div>
              <p className="text-sm mb-2 font-medium" style={{ color: 'rgb(66 43 33)' }}>
                📅 {scholar.era}
              </p>
              <p className="text-sm leading-relaxed font-medium" style={{ color: 'rgb(66 43 33)' }}>
                {scholar.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

