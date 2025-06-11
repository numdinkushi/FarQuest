import { useState, useEffect } from 'react';
import { QUESTIONS } from '~/constants';
import { GameState, PlayerStats, WalletState } from '~/types';

export const useGameLogic = () => {
    const [wallet, setWallet] = useState<WalletState>({
        isConnected: false,
        address: ''
    });

    const [gameState, setGameState] = useState<GameState>({
        state: 'menu',
        currentQuestion: 0,
        score: 0,
        selectedAnswer: null,
        showFeedback: false,
        timeLeft: 30,
        isTimerActive: false
    });

    const [playerStats, setPlayerStats] = useState<PlayerStats>({
        health: 100,
        level: 1,
        experience: 0,
        crystalsCollected: 0
    });

    const totalNumberOfQuestions = QUESTIONS.length;

    // Track consecutive correct answers for bonus system
    const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
    const [isBonus, setIsBonus] = useState<boolean>(false);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (gameState.isTimerActive && gameState.timeLeft > 0) {
            interval = setInterval(() => {
                setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
            }, 1000);
        } else if (gameState.timeLeft === 0) {
            handleTimeUp();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState.isTimerActive, gameState.timeLeft]);

    // Check for game over when health reaches 0
    useEffect(() => {
        if (playerStats.health <= 0 && gameState.state === 'playing') {
            setIsGameOver(true);
            setGameState(prev => ({ ...prev, state: 'complete', isTimerActive: false }));
        }
    }, [playerStats.health, gameState.state]);

    const connectWallet = async (): Promise<void> => {
        const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
        setWallet({
            isConnected: true,
            address: mockAddress
        });
    };

    const disconnectWallet = (): void => {
        setWallet({ isConnected: false, address: '' });
        setGameState(prev => ({ ...prev, state: 'menu' }));
    };

    const startGame = (): void => {
        setGameState({
            state: 'playing',
            currentQuestion: 0,
            score: 0,
            selectedAnswer: null,
            showFeedback: false,
            timeLeft: 30,
            isTimerActive: true
        });
        setPlayerStats({
            health: 100,
            level: 1,
            experience: 0,
            crystalsCollected: 0
        });
        setConsecutiveCorrect(0);
        setIsBonus(false);
        setIsGameOver(false);
    };

    const handleAnswer = (answerIndex: number): void => {
        setGameState(prev => ({
            ...prev,
            selectedAnswer: answerIndex,
            showFeedback: true,
            isTimerActive: false
        }));

        const question = QUESTIONS[gameState.currentQuestion];
        const isCorrect = answerIndex === question.correct;
        let bonusAwarded = false;

        if (isCorrect) {
            const newConsecutive = consecutiveCorrect + 1;
            setConsecutiveCorrect(newConsecutive);

            // Check for consecutive bonus (every 10 correct answers)
            if (newConsecutive % 10 === 0) {
                bonusAwarded = true;
                setIsBonus(true);
            }

            setGameState(prev => ({ ...prev, score: prev.score + 1 }));
            setPlayerStats(prev => {
                const newExp = prev.experience + question.reward.exp;
                const healthBonus = bonusAwarded ? Math.ceil(prev.health * 0.05) : 0; // 5% health bonus
                const newHealth = Math.min(100, prev.health + healthBonus); // Cap at 100

                return {
                    ...prev,
                    health: newHealth,
                    experience: newExp,
                    crystalsCollected: prev.crystalsCollected + question.reward.crystals,
                    level: newExp >= prev.level * 100 ? prev.level + 1 : prev.level
                };
            });
        } else {
            // Reset consecutive count on wrong answer
            setConsecutiveCorrect(0);
            setIsBonus(false);

            setPlayerStats(prev => ({
                ...prev,
                health: Math.max(0, prev.health - 20)
            }));
        }

        setTimeout(() => {
            setIsBonus(false); // Reset bonus flag after showing feedback

            // Check if health is 0 or below before continuing
            if (playerStats.health - (isCorrect ? 0 : 20) <= 0) {
                setIsGameOver(true);
                setGameState(prev => ({ ...prev, state: 'complete', isTimerActive: false }));
                return;
            }

            if (gameState.currentQuestion < QUESTIONS.length - 1) {
                setGameState(prev => ({
                    ...prev,
                    currentQuestion: prev.currentQuestion + 1,
                    selectedAnswer: null,
                    showFeedback: false,
                    timeLeft: 30,
                    isTimerActive: true
                }));
            } else {
                setIsGameOver(false); // Successfully completed all questions
                setGameState(prev => ({ ...prev, state: 'complete', isTimerActive: false }));
            }
        }, 2000);
    };

    const handleTimeUp = (): void => {
        setGameState(prev => ({ ...prev, isTimerActive: false, showFeedback: true }));

        // Reset consecutive count on time up
        setConsecutiveCorrect(0);
        setIsBonus(false);

        setPlayerStats(prev => ({ ...prev, health: Math.max(0, prev.health - 20) }));

        setTimeout(() => {
            // Check if health is 0 or below before continuing
            if (playerStats.health - 20 <= 0) {
                setIsGameOver(true);
                setGameState(prev => ({ ...prev, state: 'complete' }));
                return;
            }

            if (gameState.currentQuestion < QUESTIONS.length - 1) {
                setGameState(prev => ({
                    ...prev,
                    currentQuestion: prev.currentQuestion + 1,
                    selectedAnswer: null,
                    showFeedback: false,
                    timeLeft: 30,
                    isTimerActive: true
                }));
            } else {
                setIsGameOver(false); // Successfully completed all questions
                setGameState(prev => ({ ...prev, state: 'complete' }));
            }
        }, 2000);
    };

    const claimRewards = async (): Promise<void> => {
        setGameState(prev => ({ ...prev, state: 'rewards' }));
        setTimeout(() => {
            alert(`🎉 Rewards claimed!\n💎 ${playerStats.crystalsCollected} Crystals\n⭐ ${playerStats.experience} XP\n🏆 Level ${playerStats.level} NFT minted!`);
            resetGame();
        }, 2000);
    };

    const resetGame = (): void => {
        setGameState({
            state: 'menu',
            currentQuestion: 0,
            score: 0,
            selectedAnswer: null,
            showFeedback: false,
            timeLeft: 30,
            isTimerActive: false
        });
        setConsecutiveCorrect(0);
        setIsBonus(false);
        setIsGameOver(false);
    };

    return {
        wallet,
        gameState,
        playerStats,
        consecutiveCorrect,
        isBonus,
        isGameOver,
        connectWallet,
        disconnectWallet,
        startGame,
        handleAnswer,
        claimRewards,
        resetGame,
        currentQuestion: QUESTIONS[gameState.currentQuestion],
        totalNumberOfQuestions
    };
};