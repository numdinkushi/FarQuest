import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, PlayerStats, Question, Difficulty } from '~/types';
import { MenuScreen } from '~/sreens/main';
import { PlayerStatsDisplay } from '../player-stats';
import { Timer } from '../timer';
import { QuestionDisplay } from '../question-display';
import { Feedback } from '../feedback';
import { GameCompleteScreen } from '~/sreens/complete';
import { RewardsScreen } from '~/sreens/rewards';

interface GameContentProps {
    gameState: GameState;
    playerStats: PlayerStats;
    currentQuestion: Question;
    currentDifficulty: Difficulty;
    questionInLevel: number;
    wallet: { isConnected: boolean; };
    isBonus: boolean;
    isGameOver: boolean;
    levelCompleted: boolean;
    onStartGame: () => void;
    onAnswerSelect: (answerIndex: number) => void;
    onClaimRewards: () => Promise<void>;
    onResetGame: () => void;
    totalNumberOfQuestions: number;
}

export const GameContent: React.FC<GameContentProps> = ({
    gameState,
    playerStats,
    currentQuestion,
    currentDifficulty,
    questionInLevel,
    wallet,
    isBonus,
    isGameOver,
    levelCompleted,
    onStartGame,
    onAnswerSelect,
    onClaimRewards,
    onResetGame,
    totalNumberOfQuestions
}) => {
    return (
        <div className="p-6">
            <AnimatePresence mode="wait">
                {gameState.state === 'menu' && (
                    <MenuScreen
                        isWalletConnected={wallet.isConnected}
                        onStartGame={onStartGame}
                    />
                )}

                {gameState.state === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="space-y-6"
                    >
                        <AnimatePresence>
                            {gameState.showFeedback && (
                                <Feedback
                                    isCorrect={gameState.selectedAnswer === currentQuestion.correct}
                                    isTimeUp={gameState.timeLeft === 0}
                                    isBonus={isBonus}
                                    levelCompleted={levelCompleted}
                                    currentDifficulty={currentDifficulty}
                                    reward={currentQuestion.reward}
                                />
                            )}
                        </AnimatePresence>
                        <PlayerStatsDisplay
                            stats={playerStats}
                            currentDifficulty={currentDifficulty}
                            questionInLevel={questionInLevel}
                        />
                        <Timer timeLeft={gameState.timeLeft} />
                        <QuestionDisplay
                            question={currentQuestion}
                            questionNumber={questionInLevel}
                            totalQuestions={12}
                            selectedAnswer={gameState.selectedAnswer}
                            showFeedback={gameState.showFeedback}
                            onAnswerSelect={onAnswerSelect}
                        />


                    </motion.div>
                )}

                {gameState.state === 'complete' && (
                    <GameCompleteScreen
                        score={gameState.score}
                        totalQuestions={totalNumberOfQuestions}
                        stats={playerStats}
                        isGameOver={isGameOver}
                        onClaimRewards={onClaimRewards}
                        onResetGame={onResetGame}
                    />
                )}

                {gameState.state === 'rewards' && <RewardsScreen />}
            </AnimatePresence>
        </div>
    );
};