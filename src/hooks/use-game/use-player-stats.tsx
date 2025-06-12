import { useState } from 'react';
import { PlayerStats } from '~/types';

export const usePlayerStats = () => {
    const [playerStats, setPlayerStats] = useState<PlayerStats>({
        health: 100,
        level: 1,
        experience: 0,
        crystalsCollected: 0
    });

    const resetStats = (): void => {
        setPlayerStats({
            health: 100,
            level: 1,
            experience: 0,
            crystalsCollected: 0
        });
    };

    const updateHealth = (newHealth: number): void => {
        setPlayerStats(prev => ({
            ...prev,
            health: Math.max(0, Math.min(100, newHealth))
        }));
    };

    const takeDamage = (damage: number): void => {
        setPlayerStats(prev => ({
            ...prev,
            health: Math.max(0, prev.health - damage)
        }));
    };

    const healPlayer = (healAmount: number): void => {
        setPlayerStats(prev => ({
            ...prev,
            health: Math.min(100, prev.health + healAmount)
        }));
    };

    const addExperience = (exp: number): void => {
        setPlayerStats(prev => ({
            ...prev,
            experience: prev.experience + exp
        }));
    };

    const addCrystals = (crystals: number): void => {
        setPlayerStats(prev => ({
            ...prev,
            crystalsCollected: prev.crystalsCollected + crystals
        }));
    };

    const updateLevel = (level: number): void => {
        setPlayerStats(prev => ({
            ...prev,
            level
        }));
    };

    const updateAllStats = (stats: Partial<PlayerStats>): void => {
        setPlayerStats(prev => ({
            ...prev,
            ...stats
        }));
    };

    return {
        playerStats,
        setPlayerStats,
        resetStats,
        updateHealth,
        takeDamage,
        healPlayer,
        addExperience,
        addCrystals,
        updateLevel,
        updateAllStats
    };
};