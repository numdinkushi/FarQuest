import { useState } from 'react';

export const useGameMechanics = () => {
    // Track consecutive correct answers for bonus system
    const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
    const [isBonus, setIsBonus] = useState<boolean>(false);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [levelCompleted, setLevelCompleted] = useState<boolean>(false);

    const resetMechanics = (): void => {
        setConsecutiveCorrect(0);
        setIsBonus(false);
        setIsGameOver(false);
        setLevelCompleted(false);
    };

    const incrementConsecutive = (): number => {
        const newCount = consecutiveCorrect + 1;
        setConsecutiveCorrect(newCount);

        // Check for consecutive bonus (every 10 correct answers)
        if (newCount % 10 === 0) {
            setIsBonus(true);
            return newCount;
        }

        return newCount;
    };

    const resetConsecutive = (): void => {
        setConsecutiveCorrect(0);
        setIsBonus(false);
    };

    const setBonusState = (bonus: boolean): void => {
        setIsBonus(bonus);
    };

    const setGameOverState = (gameOver: boolean): void => {
        setIsGameOver(gameOver);
    };

    const setLevelCompletedState = (completed: boolean): void => {
        setLevelCompleted(completed);
    };

    const checkBonusEligibility = (): boolean => {
        return consecutiveCorrect > 0 && consecutiveCorrect % 10 === 0;
    };

    const calculateHealthBonus = (currentHealth: number): number => {
        return Math.ceil(currentHealth * 0.05);
    };

    return {
        consecutiveCorrect,
        isBonus,
        isGameOver,
        levelCompleted,
        resetMechanics,
        incrementConsecutive,
        resetConsecutive,
        setBonusState,
        setGameOverState,
        setLevelCompletedState,
        checkBonusEligibility,
        calculateHealthBonus,
        setConsecutiveCorrect
    };
};