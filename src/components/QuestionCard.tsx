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

export default function QuestionCard({
  question,
  onAnswer,
  selectedAnswer
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 border-2 border-black">
      {/* Kategori Badge */}
      <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 bg-black text-white border-2 border-black">
        {categoryLabels[question.category]}
      </div>

      {/* Soru Başlığı */}
      <h2 className="text-4xl font-bold text-black mb-3 leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
        {question.text}
      </h2>

      <div className="h-1 w-20 bg-black rounded-full mb-8"></div>

      {/* Cevap Seçenekleri */}
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group ${
              selectedAnswer === option.id
                ? 'border-black bg-black text-white shadow-lg'
                : 'border-black bg-white text-black hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Radio Button */}
              <div
                className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center shrink-0 transition-all ${
                  selectedAnswer === option.id
                    ? 'border-white bg-white'
                    : 'border-black bg-white'
                }`}
              >
                {selectedAnswer === option.id && (
                  <div className="w-2.5 h-2.5 bg-black rounded-full" />
                )}
              </div>

              {/* Seçenek Metni */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-bold px-2.5 py-0.5 rounded-lg ${
                    selectedAnswer === option.id
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <p className={`text-base leading-relaxed font-medium ${
                  selectedAnswer === option.id
                    ? 'text-white'
                    : 'text-black'
                }`} style={{ fontFamily: 'Space Grotesk' }}>
                  {option.text}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Yardımcı Metin */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg border-2 border-black">
        <p className="text-sm text-black font-medium">
          <span className="font-bold">💡 İpucu:</span> Cevaplarınız ne kadar samimi olursa, sonuçlar o kadar doğru olur.
        </p>
      </div>
    </div>
  );
}

