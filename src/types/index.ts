// types/index.ts
export interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    reward: number;
}

export interface AnsweredQuestion {
    question: number;
    selected: number;
    correct: number;
    isCorrect: boolean;
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    rewards: number;
}

export interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

export interface Achievement {
    icon: React.ComponentType<{ className?: string; }>;
    text: string;
    reward: string;
    color: string;
}

export type TabId = 'home' | 'quiz' | 'leaderboard' | 'rewards';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface MotionDivProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    animate?: string;
    initial?: string;
    transition?: string;
    whileHover?: string;
    whileTap?: string;
    layout?: boolean;
    [key: string]: any;
}

export interface TabItem {
    id: TabId;
    icon: React.ComponentType<{ className?: string; }>;
    label: string;
}

export interface QuizState {
    activeTab: TabId;
    currentQuestion: number;
    score: number;
    selectedAnswer: number | null;
    showResult: boolean;
    gameStarted: boolean;
    answeredQuestions: AnsweredQuestion[];
    streak: number;
    totalRewards: number;
    animateScore: boolean;
    particles: Particle[];
}

export interface QuizActions {
    setActiveTab: (tab: TabId) => void;
    setCurrentQuestion: (question: number) => void;
    setScore: (score: number) => void;
    setSelectedAnswer: (answer: number | null) => void;
    setShowResult: (show: boolean) => void;
    setGameStarted: (started: boolean) => void;
    setAnsweredQuestions: (questions: AnsweredQuestion[]) => void;
    setStreak: (streak: number) => void;
    setTotalRewards: (rewards: number) => void;
    setAnimateScore: (animate: boolean) => void;
    setParticles: (particles: Particle[]) => void;
}