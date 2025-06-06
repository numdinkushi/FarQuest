// components/MotionDiv.tsx
import React, { useState, useEffect } from 'react';
import { MotionDivProps } from '~/types';

const MotionDiv: React.FC<MotionDivProps> = ({
    children,
    className = '',
    style,
    animate,
    initial,
    transition,
    whileHover,
    whileTap,
    layout,
    ...props
}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const getAnimationClass = (): string => {
        if (animate === 'fadeInUp') return isVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-4';
        if (animate === 'slideInLeft') return isVisible ? 'animate-slideInLeft' : 'opacity-0 -translate-x-4';
        if (animate === 'scaleIn') return isVisible ? 'animate-scaleIn' : 'opacity-0 scale-95';
        if (animate === 'bounceIn') return isVisible ? 'animate-bounceIn' : 'opacity-0 scale-50';
        return '';
    };

    return (
        <div
            className={`${className} ${getAnimationClass()} transition-all duration-700 ease-out`}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
};

export default MotionDiv;