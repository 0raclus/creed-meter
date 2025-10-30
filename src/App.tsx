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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex h-screen">
        {/* Sol Panel - Başlık ve İlerleme */}
        <div className="w-1/3 bg-linear-to-b from-slate-800 to-slate-900 p-8 border-r border-slate-700 flex flex-col justify-between">
          <div>
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-white mb-2">
                İslam Mezhepleri
              </h1>
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">
                Kişilik Testi
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Teolojik, fıkhi, tasavvufi, siyasi ve felsefi eğilimlerinizi keşfedin. Sonuçlar size en uyumlu mezhep ve ekolleri gösterecektir.
              </p>
            </div>

            <div className="bg-slate-700 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">İlerleme</span>
                <span className="text-blue-400 font-bold">
                  {currentQuestion + 1}/{questions.length}
                </span>
              </div>
              <ProgressBar current={currentQuestion + 1} total={questions.length} />
              <p className="text-slate-400 text-xs mt-2">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% tamamlandı
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-slate-400 text-sm">
                <p className="font-semibold text-white mb-1">Kategori:</p>
                <p className="text-blue-300">
                  {questions[currentQuestion]?.category === 'akide' && 'Akide (İnanç)'}
                  {questions[currentQuestion]?.category === 'fiqh_usul' && 'Fıkıh Usulü (Metodoloji)'}
                  {questions[currentQuestion]?.category === 'fiqh_amel' && 'Fıkıh Ameli (Pratik)'}
                  {questions[currentQuestion]?.category === 'tasavvuf' && 'Tasavvuf (Maneviyat)'}
                  {questions[currentQuestion]?.category === 'siyaset' && 'Siyaset (Yönetim)'}
                  {questions[currentQuestion]?.category === 'modernite' && 'Modernite (Çağdaşlık)'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex-1 px-4 py-3 bg-slate-600 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-500 transition font-semibold"
            >
              ← Geri
            </button>
            <button
              onClick={() => handleAnswer(answers[questions[currentQuestion].id] || '')}
              disabled={!answers[questions[currentQuestion].id]}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 transition font-semibold"
            >
              {currentQuestion === questions.length - 1 ? 'Tamamla ✓' : 'İleri →'}
            </button>
          </div>
        </div>

        {/* Sağ Panel - Soru */}
        <div className="w-2/3 bg-linear-to-br from-slate-50 to-slate-100 p-12 overflow-y-auto flex items-center justify-center">
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
