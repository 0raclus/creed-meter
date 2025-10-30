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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-slate-900 mb-2">
            İslam Mezhepleri Kişilik Testi
          </h1>
          <p className="text-center text-slate-600">
            Teolojik, fıkhi ve siyasi eğilimlerinizi keşfedin
          </p>
        </div>

        <ProgressBar current={currentQuestion + 1} total={questions.length} />

        <div className="mt-8">
          <QuestionCard
            question={questions[currentQuestion] as any}
            onAnswer={handleAnswer}
            selectedAnswer={answers[questions[currentQuestion].id]}
          />
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-400 transition"
          >
            Geri
          </button>
          <span className="text-slate-600">
            {currentQuestion + 1} / {questions.length}
          </span>
          <button
            onClick={() => handleAnswer(answers[questions[currentQuestion].id] || '')}
            disabled={!answers[questions[currentQuestion].id]}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            {currentQuestion === questions.length - 1 ? 'Tamamla' : 'İleri'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
