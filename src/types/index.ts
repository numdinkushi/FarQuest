// Types
export type Difficulty = 'Starter' | 'Novice' | 'Explorer' | 'Adventurer' | 'Legend' | 'Conqueror' | 'Star' | 'Galaxy' | 'Cosmic' | 'Oracle' | 'Sage' | 'Visionary' | 'Luminary' | 'Titan' | 'Farquest Master';

export interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    difficulty: Difficulty;
    reward: {
        exp: number;
        crystals: number;
    };
}

export interface PlayerStats {
    health: number;
    level: number;
    experience: number;
    crystalsCollected: number;
}

export interface GameState {
    state: 'menu' | 'playing' | 'complete' | 'rewards';
    currentQuestion: number;
    score: number;
    selectedAnswer: number | null;
    showFeedback: boolean;
    timeLeft: number;
    isTimerActive: boolean;
}

export interface WalletState {
    isConnected: boolean;
    address: string;
}