import { cn } from '@libs/cn';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  const baseStyle = 'h-[1.6rem] w-[1.6rem] bg-gray-200 rounded-full';

  const singleDuration = 1.2;

  return (
    <div className="flex-items-center gap-[1.5rem]">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(baseStyle)}
          animate={{
            y: [0, -11, 0],
            backgroundColor: ['#E0E0E0', '#FF0D6E', '#FF0D6E', '#E0E0E0'],
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.2, 0.8, 1],
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 0.5 * 2,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
