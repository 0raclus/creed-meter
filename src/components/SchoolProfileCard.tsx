import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Users, Globe, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { SchoolData } from '../types';

interface SchoolProfileCardProps {
  school: SchoolData;
  percentage: number;
  rank: number;
  color: { bg: string; text: string };
}

export default function SchoolProfileCard({ school, percentage, rank, color }: SchoolProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + rank * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="rounded-2xl shadow-modern-lg p-4 sm:p-6 lg:p-8 border-2 border-black"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <motion.span
          className="text-2xl sm:text-3xl lg:text-4xl font-bold opacity-40"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ delay: 0.3 + rank * 0.1, duration: 0.5 }}
        >
          #{rank + 1}
        </motion.span>
        <motion.span
          className="text-2xl sm:text-3xl font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 + rank * 0.1, duration: 0.4 }}
        >
          {percentage}%
        </motion.span>
      </div>

      {/* Basic Info */}
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
        {school.name}
      </h3>
      <p className="text-xs sm:text-sm mb-3 sm:mb-4 opacity-70">{school.era}</p>
      <p className="text-xs sm:text-sm leading-relaxed opacity-80 mb-4">{school.description}</p>

      {/* Expand Button */}
      {(school.keyFigures || school.keyBooks || school.faqs) && (
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 font-bold text-sm hover:opacity-80 transition-opacity"
          style={{ borderColor: color.text, color: color.text }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Daha Az Göster
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Detaylı Bilgi
            </>
          )}
        </motion.button>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            {/* Key Figures */}
            {school.keyFigures && school.keyFigures.length > 0 && (
              <div className="p-4 rounded-lg border-2" style={{ borderColor: color.text, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4" />
                  <h4 className="font-bold text-sm">Önemli Şahsiyetler</h4>
                </div>
                <ul className="text-xs space-y-1">
                  {school.keyFigures.slice(0, 5).map((figure, i) => (
                    <li key={i} className="opacity-80">• {figure}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Books */}
            {school.keyBooks && school.keyBooks.length > 0 && (
              <div className="p-4 rounded-lg border-2" style={{ borderColor: color.text, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <h4 className="font-bold text-sm">Temel Eserler</h4>
                </div>
                <ul className="text-xs space-y-1">
                  {school.keyBooks.slice(0, 5).map((book, i) => (
                    <li key={i} className="opacity-80">• {book}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modern Communities */}
            {school.modernCommunities && school.modernCommunities.length > 0 && (
              <div className="p-4 rounded-lg border-2" style={{ borderColor: color.text, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4" />
                  <h4 className="font-bold text-sm">Yaygın Olduğu Bölgeler</h4>
                </div>
                <p className="text-xs opacity-80">{school.modernCommunities.join(', ')}</p>
                {school.estimatedFollowers && (
                  <p className="text-xs opacity-70 mt-2">Tahmini: {school.estimatedFollowers}</p>
                )}
              </div>
            )}

            {/* Common Misconceptions */}
            {school.commonMisconceptions && school.commonMisconceptions.length > 0 && (
              <div className="p-4 rounded-lg border-2" style={{ borderColor: color.text, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4" />
                  <h4 className="font-bold text-sm">Yaygın Yanlış Anlamalar</h4>
                </div>
                <ul className="text-xs space-y-2">
                  {school.commonMisconceptions.slice(0, 3).map((misconception, i) => (
                    <li key={i} className="opacity-80">• {misconception}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {school.faqs && school.faqs.length > 0 && (
              <div className="p-4 rounded-lg border-2" style={{ borderColor: color.text, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <h4 className="font-bold text-sm mb-3">Sıkça Sorulan Sorular</h4>
                <div className="space-y-3">
                  {school.faqs.slice(0, 3).map((faq, i) => (
                    <div key={i}>
                      <p className="text-xs font-bold mb-1">S: {faq.q}</p>
                      <p className="text-xs opacity-80">C: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

