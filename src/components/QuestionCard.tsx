import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Question } from '../types';
import { useState } from 'react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (optionId: string) => void;
  selectedAnswer?: string; // Önceden seçilmiş cevap
}

const categoryLabels: Record<string, string> = {
  akide: 'Akide',
  fiqh_usul: 'Fıkıh Usulü',
  fiqh_amel: 'Amelî Fıkıh',
  tasavvuf: 'Tasavvuf',
  siyaset: 'Siyaset',
  modernite: 'Modernite'
};

const categoryColors: Record<string, { bg: string, text: string }> = {
  akide: { bg: 'rgb(170 198 173)', text: 'rgb(66 43 33)' }, // Mint
  fiqh_usul: { bg: 'rgb(168 185 119)', text: 'rgb(66 43 33)' }, // Cucumber
  fiqh_amel: { bg: 'rgb(228 208 133)', text: 'rgb(66 43 33)' }, // Lemon
  tasavvuf: { bg: 'rgb(235 153 119)', text: 'rgb(66 43 33)' }, // Grapefruit
  siyaset: { bg: 'rgb(220 49 47)', text: 'white' }, // Strawberry
  modernite: { bg: 'rgb(66 43 33)', text: 'white' } // Chocolate
};

export default function QuestionCard({
  question,
  onAnswer,
  selectedAnswer
}: QuestionCardProps) {
  const categoryColor = categoryColors[question.category] || { bg: 'rgb(168 185 119)', text: 'rgb(66 43 33)' };
  const [clickedOption, setClickedOption] = useState<string | null>(null);

  const handleOptionClick = (optionId: string) => {
    setClickedOption(optionId);

    // Animasyon göster, sonra geç
    setTimeout(() => {
      onAnswer(optionId);
      setClickedOption(null);
    }, 600); // 600ms animasyon süresi
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col"
    >
      {/* Soru Başlığı Bölümü - Sticky */}
      <div className="sticky top-0 bg-white z-10 pb-4 sm:pb-6">
        {/* Kategori Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 shadow-modern w-fit border-2 border-black"
          style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
        >
          {categoryLabels[question.category]}
        </motion.div>

        {/* Soru Başlığı */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-black mb-3 sm:mb-4 leading-tight"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          {question.text}
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-1 rounded-full"
          style={{ backgroundColor: categoryColor.bg }}
        />
      </div>

      {/* Cevap Seçenekleri - Scrollable */}
      <div className="space-y-2 sm:space-y-3 overflow-y-auto flex-1 pr-2">
        {question.options.map((option, index) => {
          const isClicked = clickedOption === option.id;
          const isSelected = selectedAnswer === option.id; // Önceden seçilmiş mi?
          const isActive = isClicked || isSelected; // Aktif görünüm

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: isClicked ? 1.05 : 1,
              }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionClick(option.id)}
              disabled={clickedOption !== null}
              className="w-full text-left p-3 sm:p-4 lg:p-5 rounded-xl transition-all duration-300 group border-2 border-black disabled:opacity-50"
              style={{
                backgroundColor: isActive ? categoryColor.bg : 'white',
                color: isActive ? categoryColor.text : 'rgb(66 43 33)',
                boxShadow: isActive
                  ? '0 20px 50px rgba(0, 0, 0, 0.15)'
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div className="flex items-start gap-4">
                {/* Radio Button */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isClicked ? 1.3 : 1,
                    rotate: isClicked ? 360 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="mt-1 shrink-0"
                >
                  {isActive ? (
                    <CheckCircle2 className="w-6 h-6" style={{ color: categoryColor.text }} />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </motion.div>

                {/* Seçenek Metni */}
                <div className="flex-1">
                  <p className="font-semibold text-sm sm:text-base lg:text-lg leading-relaxed">
                    {option.text}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}

        {/* Bilmiyorum Seçeneği */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: (clickedOption === 'UNKNOWN' || selectedAnswer === 'UNKNOWN') ? 1.05 : 1,
          }}
          transition={{ delay: 0.2 + question.options.length * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOptionClick('UNKNOWN')}
          disabled={clickedOption !== null}
          className="w-full text-left p-3 sm:p-4 lg:p-5 rounded-xl transition-all duration-300 group border-2 border-dashed border-gray-400 disabled:opacity-50"
          style={{
            backgroundColor: (clickedOption === 'UNKNOWN' || selectedAnswer === 'UNKNOWN') ? 'rgb(200 200 200)' : 'white',
            color: (clickedOption === 'UNKNOWN' || selectedAnswer === 'UNKNOWN') ? 'white' : 'rgb(100 100 100)',
            boxShadow: (clickedOption === 'UNKNOWN' || selectedAnswer === 'UNKNOWN')
              ? '0 20px 50px rgba(0, 0, 0, 0.15)'
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (clickedOption !== 'UNKNOWN' && selectedAnswer !== 'UNKNOWN') {
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (clickedOption !== 'UNKNOWN' && selectedAnswer !== 'UNKNOWN') {
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <div className="flex items-start gap-4">
            <motion.div
              initial={false}
              animate={{
                scale: (clickedOption === 'UNKNOWN' || selectedAnswer === 'UNKNOWN') ? 1.3 : 1,
                rotate: (clickedOption === 'UNKNOWN' || selectedAnswer === 'UNKNOWN') ? 360 : 0,
              }}
              transition={{ duration: 0.4 }}
              className="mt-1 shrink-0"
            >
              {(clickedOption === 'UNKNOWN' || selectedAnswer === 'UNKNOWN') ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
            </motion.div>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base lg:text-lg leading-relaxed italic">
                Bilmiyorum / Fikrim yok
              </p>
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

