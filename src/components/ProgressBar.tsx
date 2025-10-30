import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/20 backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full shadow-modern"
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </div>
  );
}

