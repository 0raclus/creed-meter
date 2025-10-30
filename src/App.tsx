import { useState } from 'react';
import type { UserAnswers, TestResult } from './types';
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
      <div className="flex h-screen">
        {/* Sol Panel - Başlık ve İlerleme */}
        <div className="w-1/3 bg-black text-white p-8 border-r border-gray-300 flex flex-col justify-between">
          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                İslam Mezhepleri
              </h1>
              <h2 className="text-3xl font-semibold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                Kişilik Testi
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Teolojik, fıkhi, tasavvufi, siyasi ve felsefi eğilimlerinizi keşfedin. Sonuçlar size en uyumlu mezhep ve ekolleri gösterecektir.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-5 mb-8 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold text-sm">İlerleme</span>
                <span className="text-white font-bold text-lg">
                  {currentQuestion + 1}/{questions.length}
                </span>
              </div>
              <ProgressBar current={currentQuestion + 1} total={questions.length} />
              <p className="text-gray-400 text-xs mt-3">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% tamamlandı
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-gray-300 text-sm">
                <p className="font-semibold text-white mb-2">📂 Kategori:</p>
                <p className="text-gray-200 font-medium">
                  {questions[currentQuestion]?.category === 'akide' && '📖 Akide (İnanç)'}
                  {questions[currentQuestion]?.category === 'fiqh_usul' && '⚖️ Fıkıh Usulü (Metodoloji)'}
                  {questions[currentQuestion]?.category === 'fiqh_amel' && '🤲 Fıkıh Ameli (Pratik)'}
                  {questions[currentQuestion]?.category === 'tasavvuf' && '🕯️ Tasavvuf (Maneviyat)'}
                  {questions[currentQuestion]?.category === 'siyaset' && '🏛️ Siyaset (Yönetim)'}
                  {questions[currentQuestion]?.category === 'modernite' && '🌍 Modernite (Çağdaşlık)'}
                </p>
              </div>
            </div>
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
        </div>

        {/* Sağ Panel - Soru */}
        <div className="w-2/3 bg-white p-12 overflow-y-auto flex items-center justify-center border-l border-gray-300">
          <div className="w-full max-w-2xl">
            <QuestionCard
              question={questions[currentQuestion] as any}
              onAnswer={handleAnswer}
              selectedAnswer={answers[questions[currentQuestion].id]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
