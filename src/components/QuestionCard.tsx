import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (optionId: string) => void;
  selectedAnswer?: string;
}

const categoryLabels: Record<string, string> = {
  akide: 'Akide',
  fiqh_usul: 'Fıkıh Usulü',
  fiqh_amel: 'Amelî Fıkıh',
  tasavvuf: 'Tasavvuf',
  siyaset: 'Siyaset',
  modernite: 'Modernite'
};

const categoryColors: Record<string, string> = {
  akide: 'from-blue-500 to-blue-600',
  fiqh_usul: 'from-purple-500 to-purple-600',
  fiqh_amel: 'from-green-500 to-green-600',
  tasavvuf: 'from-pink-500 to-pink-600',
  siyaset: 'from-orange-500 to-orange-600',
  modernite: 'from-cyan-500 to-cyan-600'
};

export default function QuestionCard({
  question,
  onAnswer,
  selectedAnswer
}: QuestionCardProps) {
  const categoryColor = categoryColors[question.category] || 'from-gray-500 to-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col"
    >
      {/* Kategori Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 bg-linear-to-r ${categoryColor} text-white shadow-modern w-fit`}
      >
        {categoryLabels[question.category]}
      </motion.div>

      {/* Soru Başlığı */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-5xl font-bold text-black mb-6 leading-tight"
        style={{ fontFamily: 'Space Grotesk' }}
      >
        {question.text}
      </motion.h2>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="h-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mb-8"
      />

      {/* Cevap Seçenekleri */}
      <div className="space-y-3 flex-1">
        {question.options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(option.id)}
            className={`w-full text-left p-5 rounded-xl transition-all duration-300 group ${
              selectedAnswer === option.id
                ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white border border-purple-600'
                : 'bg-white text-black border border-gray-200 hover:border-purple-300'
            }`}
            style={{
              boxShadow: selectedAnswer === option.id
                ? '0 20px 50px rgba(0, 0, 0, 0.15)'
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedAnswer !== option.id) {
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedAnswer !== option.id) {
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <div className="flex items-start gap-4">
              {/* Radio Button */}
              <motion.div
                initial={false}
                animate={{
                  scale: selectedAnswer === option.id ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="mt-1 shrink-0"
              >
                {selectedAnswer === option.id ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 group-hover:text-purple-400" />
                )}
              </motion.div>

              {/* Seçenek Metni */}
              <div className="flex-1">
                <p className="font-semibold text-lg leading-relaxed">
                  {option.text}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="mt-8 pt-6 border-t border-gray-200 text-gray-500 text-sm"
      >
        Seçiminizi yaparak devam edin
      </motion.div>
    </motion.div>
  );
}

