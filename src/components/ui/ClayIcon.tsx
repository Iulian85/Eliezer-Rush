import React from 'react';

interface ClayIconProps {
  type: 'bomb' | 'shuffle' | 'extraMoves' | 'shield';
  className?: string;
}

const ClayIcon: React.FC<ClayIconProps> = ({ type, className = "w-20 h-20" }) => {
    
    // Gradients and Filters
    const defs = (
        <defs>
            {/* Highlights */}
            <linearGradient id="highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            
            <linearGradient id="highlight-diagonal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                <stop offset="40%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* Bomb Gradients */}
            <radialGradient id="grad-bomb" cx="35%" cy="35%" r="80%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <linearGradient id="grad-fuse" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            
            {/* Shuffle Gradients */}
            <linearGradient id="grad-shuffle-front" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFB085" />
                <stop offset="100%" stopColor="#FF844B" />
            </linearGradient>
             <linearGradient id="grad-shuffle-back" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            
            {/* Bolt Gradients */}
            <linearGradient id="grad-bolt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="grad-bolt-depth" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Shield Gradients */}
            <linearGradient id="grad-shield" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="grad-shield-depth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Drop Shadow */}
            <filter id="clayShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="0" dy="5" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
    );

    const renderBomb = () => (
        <g filter="url(#clayShadow)">
            {/* Fuse Base (Cylinder) */}
            <path d="M42 20 L42 28 L58 28 L58 20" fill="#64748b" />
            <ellipse cx="50" cy="20" rx="8" ry="3" fill="#cbd5e1" />
            <ellipse cx="50" cy="28" rx="8" ry="3" fill="#475569" />
            
            {/* Main Body */}
            <circle cx="50" cy="58" r="32" fill="url(#grad-bomb)" />
            
            {/* Specular Highlight */}
            <circle cx="40" cy="48" r="10" fill="white" opacity="0.15" filter="blur(2px)" />
            <ellipse cx="50" cy="35" rx="15" ry="5" fill="white" opacity="0.1" />

            {/* Wick */}
            <path d="M50 20 Q50 5 65 8" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Spark */}
            <path d="M65 8 L67 3 M65 8 L70 6 M65 8 L68 11" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="65" cy="8" r="2" fill="#F59E0B" />
        </g>
    );

    const renderShuffle = () => (
        <g filter="url(#clayShadow)">
             {/* Back Arrow (Depth) */}
            <path 
                d="M 22 38 C 45 38, 55 68, 78 68" 
                stroke="#C2410C" 
                strokeWidth="18" 
                strokeLinecap="round" 
                fill="none" 
                transform="translate(0, 4)"
            />
            <path d="M72 59 L90 68 L72 77" fill="#C2410C" transform="translate(0, 4)" />

            {/* Back Arrow (Main) */}
            <path 
                d="M 22 38 C 45 38, 55 68, 78 68" 
                stroke="url(#grad-shuffle-back)" 
                strokeWidth="18" 
                strokeLinecap="round" 
                fill="none" 
            />
            <path d="M72 59 L90 68 L72 77" fill="url(#grad-shuffle-back)" />

            {/* Front Arrow (Depth) */}
            <path 
                d="M 22 68 C 45 68, 55 38, 78 38" 
                stroke="#9A3412" 
                strokeWidth="18" 
                strokeLinecap="round" 
                fill="none" 
                transform="translate(0, 4)"
            />
            <path d="M72 47 L90 38 L72 29" fill="#9A3412" transform="translate(0, 4)" />

            {/* Front Arrow (Main) */}
            <path 
                d="M 22 68 C 45 68, 55 38, 78 38" 
                stroke="url(#grad-shuffle-front)" 
                strokeWidth="18" 
                strokeLinecap="round" 
                fill="none" 
            />
            <path d="M72 47 L90 38 L72 29" fill="url(#grad-shuffle-front)" />

            {/* Highlights */}
             <path 
                d="M 25 68 C 45 68, 53 43, 75 41" 
                stroke="url(#highlight-diagonal)" 
                strokeWidth="6" 
                strokeLinecap="round" 
                fill="none"
                opacity="0.8" 
            />
        </g>
    );

    const renderBolt = () => (
        <g filter="url(#clayShadow)">
            {/* Depth Layer */}
            <path 
                d="M55 10 L30 50 L50 50 L45 90 L70 50 L50 50 L55 10 Z" 
                fill="url(#grad-bolt-depth)" 
                strokeLinejoin="round"
                transform="translate(0, 5)"
            />
            {/* Main Body */}
            <path 
                d="M55 10 L30 50 L50 50 L45 90 L70 50 L50 50 L55 10 Z" 
                fill="url(#grad-bolt)" 
                stroke="#FDE68A"
                strokeWidth="1"
            />
            {/* Top Highlight */}
            <path 
                d="M55 10 L30 50 L50 50 L45 90 L70 50 L50 50 L55 10 Z" 
                fill="url(#highlight-diagonal)" 
                opacity="0.6"
            />
        </g>
    );

    const renderShield = () => (
        <g filter="url(#clayShadow)">
             {/* Depth Layer */}
             <path 
                d="M50 10 C20 10, 20 35, 20 35 C20 65, 50 90, 50 90 C50 90, 80 65, 80 35 C80 35, 80 10, 50 10 Z" 
                fill="url(#grad-shield-depth)" 
                transform="translate(0, 6)"
            />
            
            {/* Main Body */}
            <path 
                d="M50 10 C20 10, 20 35, 20 35 C20 65, 50 90, 50 90 C50 90, 80 65, 80 35 C80 35, 80 10, 50 10 Z" 
                fill="url(#grad-shield)" 
            />
            
            {/* Inner Ridge */}
             <path 
                d="M50 16 C26 16, 26 38, 26 38 C26 62, 50 82, 50 82 C50 82, 74 62, 74 38 C74 38, 74 16, 50 16 Z" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="2" 
                opacity="0.5"
            />

            {/* Specular Highlight */}
             <path 
                d="M50 10 C20 10, 20 35, 20 35 C20 65, 50 90, 50 90" 
                fill="none"
                stroke="url(#highlight-diagonal)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.5"
                clipPath="inset(0 50% 0 0)"
            />
        </g>
    );

    const renderIcon = () => {
        switch(type) {
            case 'bomb': return renderBomb();
            case 'shuffle': return renderShuffle();
            case 'extraMoves': return renderBolt();
            case 'shield': return renderShield();
            default: return null;
        }
    }

    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            {defs}
            {renderIcon()}
        </svg>
    );
};

export default ClayIcon;
