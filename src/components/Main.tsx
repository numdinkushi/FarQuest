// QuizApp.tsx
import React, { useState, useEffect } from 'react';



import AnimatedBackground from './animation/animated-background';
import BottomNavigation from './navigation/bottom-navigation';
import HomeTab from './tabs/home';
import QuizTab from './tabs/quiz';
import RewardsTab from './tabs/rewards';
import LeaderboardTab from './tabs/leader-board';
import { AnsweredQuestion, LeaderboardEntry, Particle, Question, TabId } from '~/types';

const QuizApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [totalRewards, setTotalRewards] = useState<number>(0);
  const [animateScore, setAnimateScore] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate floating particles for background
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Quiz questions with crypto/web3 theme
  const questions: Question[] = [
    {
      id: 1,
      question: 'What is the native token of the Celo blockchain?',
      options: ['CELO', 'CUSD', 'ETH', 'BTC'],
      correct: 0,
      category: 'Blockchain',
      difficulty: 'Easy',
      reward: 10,
    },
    {
      id: 2,
      question: 'Which consensus mechanism does Celo use?',
      options: ['Proof of Work', 'Proof of Stake', 'Delegated Proof of Stake', 'Proof of Authority'],
      correct: 1,
      category: 'Technology',
      difficulty: 'Medium',
      reward: 15,
    },
    {
      id: 3,
      question: "What does 'Farcaster' primarily focus on?",
      options: ['DeFi Trading', 'Decentralized Social Media', 'NFT Marketplace', 'Gaming'],
      correct: 1,
      category: 'Social',
      difficulty: 'Easy',
      reward: 10,
    },
    {
      id: 4,
      question: 'What is a MiniApp in the Farcaster ecosystem?',
      options: ['A mobile wallet', 'Interactive app within frames', 'A trading bot', 'A governance token'],
      correct: 1,
      category: 'Development',
      difficulty: 'Medium',
      reward: 15,
    },
    {
      id: 5,
      question: 'Which of these is a key feature of Celo?',
      options: ['Phone number addresses', 'Anonymous transactions', 'Unlimited supply', 'Centralized governance'],
      correct: 0,
      category: 'Features',
      difficulty: 'Hard',
      reward: 20,
    },
  ];

  const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'CryptoMaster', score: 2850, rewards: 285 },
    { rank: 2, name: 'BlockchainPro', score: 2640, rewards: 264 },
    { rank: 3, name: 'Web3Wizard', score: 2480, rewards: 248 },
    { rank: 4, name: 'You', score: totalRewards * 10, rewards: totalRewards },
    { rank: 5, name: 'DefiExplorer', score: 2180, rewards: 218 },
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correct;

    setTimeout(() => {
      if (isCorrect) {
        const newScore = score + 1;
        const reward = questions[currentQuestion].reward;
        setScore(newScore);
        setStreak(streak + 1);
        setTotalRewards(totalRewards + reward);
        setAnimateScore(true);
        setTimeout(() => setAnimateScore(false), 500);
      } else {
        setStreak(0);
      }

      setAnsweredQuestions([
        ...answeredQuestions,
        {
          question: currentQuestion,
          selected: answerIndex,
          correct: questions[currentQuestion].correct,
          isCorrect,
        },
      ]);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
        } else {
          setShowResult(true);
        }
      }, 1000);
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameStarted(false);
    setAnsweredQuestions([]);
    setStreak(0);
  };

  const startGame = () => {
    setGameStarted(true);
    setActiveTab('quiz');
  };

  const handleClaimRewards = () => {
    setActiveTab('rewards');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground particles={particles} />
      <div className="relative z-10 max-w-md mx-auto min-h-screen">
        <div className="p-4">
          {activeTab === 'home' && (
            <HomeTab
              totalRewards={totalRewards}
              score={score}
              animateScore={animateScore}
              onStartGame={startGame}
            />
          )}
          {activeTab === 'quiz' && (
            <QuizTab
              gameStarted={gameStarted}
              showResult={showResult}
              currentQuestion={currentQuestion}
              questions={questions}
              selectedAnswer={selectedAnswer}
              score={score}
              streak={streak}
              totalRewards={totalRewards}
              animateScore={animateScore}
              answeredQuestions={answeredQuestions}
              onStartGame={startGame}
              onAnswerSelect={handleAnswerSelect}
              onResetQuiz={resetQuiz}
              onClaimRewards={handleClaimRewards}
            />
          )}
          {activeTab === 'leaderboard' && <LeaderboardTab leaderboard={mockLeaderboard} />}
          {activeTab === 'rewards' && (
            <RewardsTab
              totalRewards={totalRewards}
              score={score}
              answeredQuestions={answeredQuestions}
              questions={questions}
            />
          )}
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default QuizApp;
