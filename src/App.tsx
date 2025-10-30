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
    const testResult = generateTestResult(profiles);
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
      <div className="flex h-screen overflow-hidden">
        {/* Sol Panel - Soft Contrast Tasarım */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/3 bg-gradient-cucumber text-white p-8 border-r-2 border-black flex flex-col justify-between shadow-modern-lg"
        >
          <div>
            {/* Header */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: 'rgb(66 43 33)' }} />
                </motion.div>
                <h1 className="text-4xl font-bold" style={{ color: 'rgb(66 43 33)' }}>
                  İslam Mezhepleri
                </h1>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'rgb(66 43 33)' }}>Kişilik Testi</h2>
              <p className="text-sm leading-relaxed font-light" style={{ color: 'rgb(66 43 33)' }}>
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
              className="space-y-3"
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
          className="w-2/3 bg-white p-12 overflow-y-auto flex items-center justify-center"
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
