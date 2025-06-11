import { Question } from "~/types";

export const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
        case 'Starter':
            return 'bg-green-600/20 text-green-400';
        case 'Novice':
            return 'bg-green-500/20 text-green-300';
        case 'Explorer':
            return 'bg-lime-500/20 text-lime-300';
        case 'Adventurer':
            return 'bg-lime-400/20 text-lime-200';
        case 'Legend':
            return 'bg-yellow-500/20 text-yellow-300';
        case 'Conqueror':
            return 'bg-yellow-400/20 text-yellow-200';
        case 'Star':
            return 'bg-amber-400/20 text-amber-200';
        case 'Galaxy':
            return 'bg-orange-400/20 text-orange-200';
        case 'Cosmic':
            return 'bg-orange-500/20 text-orange-300';
        case 'Oracle':
            return 'bg-red-400/20 text-red-200';
        case 'Sage':
            return 'bg-red-500/20 text-red-300';
        case 'Visionary':
            return 'bg-purple-400/20 text-purple-200';
        case 'Luminary':
            return 'bg-purple-500/20 text-purple-300';
        case 'Titan':
            return 'bg-purple-600/20 text-purple-400';
        case 'Farquest Master':
            return 'bg-pink-500/20 text-pink-300';
        default:
            return 'bg-gray-500/20 text-gray-300'; // Default color
    }
};
