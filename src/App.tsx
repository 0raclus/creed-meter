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
    <div className="min-h-screen bg-gradient-light">
      <div className="flex h-screen overflow-hidden">
        {/* Sol Panel - Modern Tasarım */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/3 bg-gradient-modern text-white p-8 border-r border-gray-800 flex flex-col justify-between shadow-modern-lg"
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
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </motion.div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  İslam Mezhepleri
                </h1>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">Kişilik Testi</h2>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Teolojik, fıkhi, tasavvufi, siyasi ve felsefi eğilimlerinizi keşfedin.
              </p>
            </motion.div>

            {/* Progress Card */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 shadow-modern"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold text-sm">İlerleme</span>
                </div>
                <motion.span
                  className="text-white font-bold text-lg"
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
                className="text-gray-300 text-xs mt-3"
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
              <div className="text-gray-300 text-sm">
                <p className="font-semibold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Kategori:
                </p>
                <p className="text-gray-200 font-medium">
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
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition font-semibold border border-gray-600"
            >
              ← Geri
            </button>
            <button
              onClick={() => handleAnswer(answers[questions[currentQuestion].id] || '')}
              disabled={!answers[questions[currentQuestion].id]}
              className="flex-1 px-4 py-3 bg-white text-black rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition font-bold border border-black"
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
          className="w-2/3 bg-gradient-light p-12 overflow-y-auto flex items-center justify-center border-l border-gray-200"
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
