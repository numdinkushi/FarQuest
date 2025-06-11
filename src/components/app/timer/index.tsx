import { motion } from 'framer-motion';

interface TimerProps {
    timeLeft: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
    return (
        <div className="text-center">
            <motion.div
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${timeLeft <= 10 ? 'bg-red-600/20 text-red-400' : 'bg-yellow-600/20 text-yellow-400'
                    }`}
                animate={{ scale: timeLeft <= 5 ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.5 }}
            >
                <span>⏰</span>
                <span className="font-bold">{timeLeft}s</span>
            </motion.div>
        </div>
    );
};