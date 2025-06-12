import { useState, useEffect } from 'react';
import { GameState } from '~/types';

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>({
        state: 'menu',
        currentQuestion: 0,
        score: 0,
        selectedAnswer: null,
        showFeedback: false,
        timeLeft: 30,
        isTimerActive: false
    });

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (gameState.isTimerActive && gameState.timeLeft > 0) {
            interval = setInterval(() => {
                setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState.isTimerActive, gameState.timeLeft]);

    const resetGameState = (): void => {
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

    const startGameState = (): void => {
        setGameState({
            state: 'playing',
            currentQuestion: 0,
            score: 0,
            selectedAnswer: null,
            showFeedback: false,
            timeLeft: 30,
            isTimerActive: true
        });
    };

    const nextQuestion = (): void => {
        setGameState(prev => ({
            ...prev,
            currentQuestion: prev.currentQuestion + 1,
            selectedAnswer: null,
            showFeedback: false,
            timeLeft: 30,
            isTimerActive: true
        }));
    };

    const completeGame = (): void => {
        setGameState(prev => ({
            ...prev,
            state: 'complete',
            isTimerActive: false
        }));
    };

    const showRewards = (): void => {
        setGameState(prev => ({ ...prev, state: 'rewards' }));
    };

    const setAnswer = (answerIndex: number): void => {
        setGameState(prev => ({
            ...prev,
            selectedAnswer: answerIndex,
            showFeedback: true,
            isTimerActive: false
        }));
    };

    const incrementScore = (): void => {
        setGameState(prev => ({ ...prev, score: prev.score + 1 }));
    };

    const stopTimer = (): void => {
        setGameState(prev => ({ ...prev, isTimerActive: false }));
    };

    const showFeedback = (): void => {
        setGameState(prev => ({ ...prev, showFeedback: true }));
    };

    return {
        gameState,
        setGameState,
        resetGameState,
        startGameState,
        nextQuestion,
        completeGame,
        showRewards,
        setAnswer,
        incrementScore,
        stopTimer,
        showFeedback
    };
};