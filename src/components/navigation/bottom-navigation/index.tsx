// components/BottomNavigation.tsx
import React from 'react';
import { Trophy, Zap, Star, Users, Award, ChevronRight, Check, X, Play, Coins } from 'lucide-react';
import { TabId, TabItem } from '~/types';
import MotionDiv from '~/components/animation/motion-div';

interface BottomNavigationProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
    const tabs: TabItem[] = [
        { id: 'home', icon: Zap, label: 'Home' },
        { id: 'quiz', icon: Play, label: 'Quiz' },
        { id: 'leaderboard', icon: Trophy, label: 'Rankings' },
        { id: 'rewards', icon: Award, label: 'Rewards' }
    ];

    return (
        <MotionDiv
            animate="fadeInUp"
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full  bg-white/90 backdrop-blur-xl border-t border-white/30 px-4 py-2 shadow-2xl"
        >
            <div className="flex justify-around">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${activeTab === tab.id
                            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? 'animate-bounce' : ''}`} />
                        <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>
        </MotionDiv>
    );
};

export default BottomNavigation;