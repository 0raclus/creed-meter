interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-300">
          İlerleme
        </span>
        <span className="text-sm text-gray-300">
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden border border-gray-600">
        <div
          className="bg-white h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

