import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (optionId: string) => void;
  selectedAnswer?: string;
}

const categoryColors: Record<string, string> = {
  akide: 'bg-purple-100 border-purple-300',
  fiqh_usul: 'bg-blue-100 border-blue-300',
  fiqh_amel: 'bg-green-100 border-green-300',
  tasavvuf: 'bg-amber-100 border-amber-300',
  siyaset: 'bg-red-100 border-red-300',
  modernite: 'bg-indigo-100 border-indigo-300'
};

const categoryLabels: Record<string, string> = {
  akide: 'Akide',
  fiqh_usul: 'Fıkıh Usulü',
  fiqh_amel: 'Amelî Fıkıh',
  tasavvuf: 'Tasavvuf',
  siyaset: 'Siyaset',
  modernite: 'Modernite'
};

export default function QuestionCard({
  question,
  onAnswer,
  selectedAnswer
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${categoryColors[question.category]}`}>
        {categoryLabels[question.category]}
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedAnswer === option.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start">
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                  selectedAnswer === option.id
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-slate-300'
                }`}
              >
                {selectedAnswer === option.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="text-slate-700">{option.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

