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

        if (isCorrect) {
            setGameState(prev => ({ ...prev, score: prev.score + 1 }));
            setPlayerStats(prev => {
                const newExp = prev.experience + question.reward.exp;
                return {
                    ...prev,
                    experience: newExp,
                    crystalsCollected: prev.crystalsCollected + question.reward.crystals,
                    level: newExp >= prev.level * 100 ? prev.level + 1 : prev.level
                };
            });
        } else {
            setPlayerStats(prev => ({
                ...prev,
                health: Math.max(0, prev.health - 20)
            }));
        }

        setTimeout(() => {
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
                setGameState(prev => ({ ...prev, state: 'complete', isTimerActive: false }));
            }
        }, 2000);
    };

    const handleTimeUp = (): void => {
        setGameState(prev => ({ ...prev, isTimerActive: false, showFeedback: true }));
        setPlayerStats(prev => ({ ...prev, health: Math.max(0, prev.health - 20) }));

        setTimeout(() => {
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
    };

    return {
        wallet,
        gameState,
        playerStats,
        connectWallet,
        disconnectWallet,
        startGame,
        handleAnswer,
        claimRewards,
        resetGame,
        currentQuestion: QUESTIONS[gameState.currentQuestion]
    };
};
