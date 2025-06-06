import React from 'react';
import { Particle } from '~/types';

interface AnimatedBackgroundProps {
    particles: Particle[];
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ particles }) => {
    return (
        <>
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                {/* Animated gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-cyan-500/20 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-yellow-500/10 via-transparent to-green-500/10 animate-float"></div>

                {/* Floating particles */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full bg-white/20 animate-pulse animate-float"
                        style={{
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            animationDuration: `${particle.duration}s`,
                            animationDelay: `${particle.delay}s`
                        }}
                    />
                ))}

                {/* Large floating shapes */}
                <div 
                    className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full animate-pulse animate-float" 
                    style={{ animationDuration: '8s' }}
                ></div>
                <div 
                    className="absolute top-1/4 right-10 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full animate-float-reverse" 
                    style={{ animationDuration: '10s' }}
                ></div>
                <div 
                    className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full animate-pulse animate-float" 
                    style={{ animationDuration: '12s' }}
                ></div>

                {/* Mesh gradient overlay */}
                <div className="absolute inset-0 opacity-30" style={{
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
                    `
                }}></div>
            </div>

            {/* CSS Keyframes */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg); 
                    }
                    50% { 
                        transform: translateY(-20px) rotate(180deg); 
                    }
                }

                @keyframes float-reverse {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg); 
                    }
                    50% { 
                        transform: translateY(20px) rotate(-180deg); 
                    }
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                .animate-float-reverse {
                    animation: float-reverse 10s ease-in-out infinite;
                }
            `}</style>
        </>
    );
};

export default AnimatedBackground;