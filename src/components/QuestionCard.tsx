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
  const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
    akide: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    fiqh_usul: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    fiqh_amel: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    tasavvuf: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    siyaset: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    modernite: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' }
  };

  const colors = categoryColorMap[question.category];

  return (
    <div className="bg-white rounded-xl shadow-2xl p-10 border border-slate-200">
      {/* Kategori Badge */}
      <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 ${colors.bg} ${colors.text}`}>
        {categoryLabels[question.category]}
      </div>

      {/* Soru Başlığı */}
      <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">
        {question.text}
      </h2>

      <div className="h-1 w-16 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mb-8"></div>

      {/* Cevap Seçenekleri */}
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className={`w-full text-left p-5 rounded-lg border-2 transition-all duration-200 group ${
              selectedAnswer === option.id
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Radio Button */}
              <div
                className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center shrink-0 transition-all ${
                  selectedAnswer === option.id
                    ? 'border-blue-600 bg-blue-600 shadow-lg'
                    : 'border-slate-300 group-hover:border-slate-400'
                }`}
              >
                {selectedAnswer === option.id && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
              </div>

              {/* Seçenek Metni */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <p className={`text-base leading-relaxed ${
                  selectedAnswer === option.id
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-700 group-hover:text-slate-900'
                }`}>
                  {option.text}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Yardımcı Metin */}
      <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-700">💡 İpucu:</span> Cevaplarınız ne kadar samimi olursa, sonuçlar o kadar doğru olur.
        </p>
      </div>
    </div>
  );
}

