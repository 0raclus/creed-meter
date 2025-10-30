import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="w-full rounded-full h-2 overflow-hidden border-2 border-black" style={{ backgroundColor: 'rgb(255 255 255 / 0.3)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full shadow-modern"
          style={{
            backgroundColor: 'rgb(66 43 33)',
          }}
        />
      </div>
    </div>
  );
}

