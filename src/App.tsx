import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Zap } from 'lucide-react';
import type { UserAnswers, TestResult, Question } from './types';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import ResultsPage from './components/ResultsPage';
import questions from './data/questions.json';
import { calculateScores, generateTestResult } from './utils/scoring';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [testComplete, setTestComplete] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleAnswer = (optionId: string) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: optionId
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeTest(newAnswers);
    }
  };

  const completeTest = (finalAnswers: UserAnswers) => {
    const profiles = calculateScores(finalAnswers);
    const testResult = generateTestResult(profiles, finalAnswers);
    setResult(testResult);
    setTestComplete(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTestComplete(false);
    setResult(null);
  };

  if (testComplete && result) {
    return <ResultsPage result={result} onReset={resetTest} />;
  }



  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row h-auto lg:h-screen overflow-hidden">
        {/* Sol Panel - Soft Contrast Tasarım */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/3 bg-gradient-cucumber text-white p-4 sm:p-6 lg:p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-between shadow-modern-lg"
        >
          <div>
            {/* Header */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 sm:w-8 h-6 sm:h-8" style={{ color: 'rgb(66 43 33)' }} />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: 'rgb(66 43 33)' }}>
                  İslam Mezhepleri
                </h1>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'rgb(66 43 33)' }}>Kişilik Testi</h2>
              <p className="text-xs sm:text-sm leading-relaxed font-light" style={{ color: 'rgb(66 43 33)' }}>
                Teolojik, fıkhi, tasavvufi, siyasi ve felsefi eğilimlerinizi keşfedin.
              </p>
            </motion.div>

            {/* Progress Card */}
            <motion.div
              className="bg-white rounded-2xl p-6 mb-8 border-2 border-black shadow-modern"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" style={{ color: 'rgb(228 208 133)' }} />
                  <span className="font-semibold text-sm" style={{ color: 'rgb(66 43 33)' }}>İlerleme</span>
                </div>
                <motion.span
                  className="font-bold text-lg"
                  style={{ color: 'rgb(66 43 33)' }}
                  key={currentQuestion}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentQuestion + 1}/{questions.length}
                </motion.span>
              </div>
              <ProgressBar current={currentQuestion + 1} total={questions.length} />
              <motion.p
                className="text-xs mt-3"
                style={{ color: 'rgb(66 43 33)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% tamamlandı
              </motion.p>
            </motion.div>

            {/* Category Info */}
            <motion.div
              className="bg-white rounded-2xl p-6 mb-6 border-2 border-black shadow-modern"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm">
                <p className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'rgb(66 43 33)' }}>
                  <BookOpen className="w-4 h-4" />
                  Kategori:
                </p>
                <p className="font-medium" style={{ color: 'rgb(66 43 33)' }}>
                  {questions[currentQuestion]?.category === 'akide' && '📖 Akide (İnanç)'}
                  {questions[currentQuestion]?.category === 'fiqh_usul' && '⚖️ Fıkıh Usulü (Metodoloji)'}
                  {questions[currentQuestion]?.category === 'fiqh_amel' && '🤲 Fıkıh Ameli (Pratik)'}
                  {questions[currentQuestion]?.category === 'tasavvuf' && '🕯️ Tasavvuf (Maneviyat)'}
                  {questions[currentQuestion]?.category === 'siyaset' && '🏛️ Siyaset (Yönetim)'}
                  {questions[currentQuestion]?.category === 'modernite' && '🌍 Modernite (Çağdaşlık)'}
                </p>
              </div>
            </motion.div>

            {/* İstatistikler */}
            <motion.div
              className="bg-white rounded-2xl p-6 mb-6 border-2 border-black shadow-modern"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-bold mb-4 text-sm" style={{ color: 'rgb(66 43 33)' }}>📊 İstatistikler</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'rgb(66 43 33)' }}>Cevaplanan:</span>
                  <span className="font-bold" style={{ color: 'rgb(168 185 119)' }}>
                    {Object.keys(answers).length} soru
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'rgb(66 43 33)' }}>Bilmiyorum:</span>
                  <span className="font-bold" style={{ color: 'rgb(220 49 47)' }}>
                    {Object.values(answers).filter(a => a === 'UNKNOWN').length} adet
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'rgb(66 43 33)' }}>Kalan:</span>
                  <span className="font-bold" style={{ color: 'rgb(228 208 133)' }}>
                    {questions.length - Object.keys(answers).length} soru
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Motivasyon Mesajı */}
            <motion.div
              className="bg-white rounded-2xl p-6 border-2 border-black shadow-modern"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xs italic leading-relaxed" style={{ color: 'rgb(66 43 33)' }}>
                {currentQuestion < 10 && '💡 "İlim, Çin\'de de olsa gidiniz." - Hz. Muhammed (s.a.v)'}
                {currentQuestion >= 10 && currentQuestion < 20 && '🌟 "İlim öğrenmek her Müslüman\'a farzdır." - Hz. Muhammed (s.a.v)'}
                {currentQuestion >= 20 && currentQuestion < 30 && '📚 "Beşikten mezara kadar ilim öğreniniz." - Hz. Muhammed (s.a.v)'}
                {currentQuestion >= 30 && '🎯 Tebrikler! Teste neredeyse tamamladınız!'}
              </p>
            </motion.div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex-1 px-4 py-3 bg-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition font-semibold border-2 border-black"
              style={{ color: 'rgb(66 43 33)' }}
            >
              ← Geri
            </button>
            <button
              onClick={() => handleAnswer(answers[questions[currentQuestion].id] || '')}
              disabled={!answers[questions[currentQuestion].id]}
              className="flex-1 px-4 py-3 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition font-bold border-2 border-black"
              style={{
                backgroundColor: 'rgb(228 208 133)',
                color: 'rgb(66 43 33)'
              }}
            >
              {currentQuestion === questions.length - 1 ? 'Tamamla ✓' : 'İleri →'}
            </button>
          </div>
        </motion.div>

        {/* Sağ Panel - Soru */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full lg:w-2/3 bg-white p-4 sm:p-6 lg:p-12 overflow-y-auto flex items-center justify-center min-h-screen lg:min-h-0"
        >
          <div className="w-full max-w-2xl">
            <QuestionCard
              question={questions[currentQuestion] as Question}
              onAnswer={handleAnswer}
              selectedAnswer={answers[questions[currentQuestion].id]}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
