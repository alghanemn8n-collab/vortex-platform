import { memo } from 'react';

/**
 * VortexLogo - Professional SaaS Logo Component
 * Represents the Vortex brand with a dynamic spiral/vortex design
 * featuring connected nodes symbolizing SaaS cloud connectivity
 */
const VortexLogo = memo(({ size = 40, animate = true }) => {
    const uniqueId = `vortex-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                filter: 'drop-shadow(0 0 12px rgba(0, 240, 255, 0.4))',
            }}
            className={animate ? 'vortex-logo-animated' : ''}
        >
            <defs>
                {/* Main gradient - Cyan to Purple */}
                <linearGradient id={`${uniqueId}-main`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="50%" stopColor="#7000ff" />
                    <stop offset="100%" stopColor="#ff00aa" />
                </linearGradient>

                {/* Glow gradient */}
                <radialGradient id={`${uniqueId}-glow`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#7000ff" stopOpacity="0" />
                </radialGradient>

                {/* Center glow */}
                <radialGradient id={`${uniqueId}-center`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                    <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7000ff" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Background glow */}
            <circle cx="50" cy="50" r="45" fill={`url(#${uniqueId}-glow)`} opacity="0.3" />

            {/* Outer ring - SaaS Cloud Symbol */}
            <circle
                cx="50"
                cy="50"
                r="42"
                stroke={`url(#${uniqueId}-main)`}
                strokeWidth="1.5"
                fill="none"
                opacity="0.4"
                strokeDasharray="8 4"
            >
                {animate && (
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="20s"
                        repeatCount="indefinite"
                    />
                )}
            </circle>

            {/* Main Vortex spiral - outer */}
            <path
                d="M50 8 Q75 18, 85 40 T88 65 Q82 85, 60 90 T30 80 Q12 65, 12 45 T25 20 Q38 10, 50 8"
                stroke={`url(#${uniqueId}-main)`}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.9"
            >
                {animate && (
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="-360 50 50"
                        dur="12s"
                        repeatCount="indefinite"
                    />
                )}
            </path>

            {/* Middle spiral */}
            <path
                d="M50 20 Q68 28, 75 45 T74 65 Q68 78, 52 80 T35 72 Q22 60, 24 45 T35 28 Q45 22, 50 20"
                stroke={`url(#${uniqueId}-main)`}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.8"
            >
                {animate && (
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                )}
            </path>

            {/* Inner spiral */}
            <path
                d="M50 32 Q62 36, 66 48 T64 62 Q60 70, 50 70 T40 64 Q34 56, 36 48 T44 36 Q48 33, 50 32"
                stroke={`url(#${uniqueId}-main)`}
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                opacity="0.7"
            >
                {animate && (
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="-360 50 50"
                        dur="5s"
                        repeatCount="indefinite"
                    />
                )}
            </path>

            {/* Center core - pulsing */}
            <circle
                cx="50"
                cy="50"
                r="8"
                fill={`url(#${uniqueId}-center)`}
            >
                {animate && (
                    <animate
                        attributeName="r"
                        values="6;8;6"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                )}
            </circle>

            {/* Inner core */}
            <circle
                cx="50"
                cy="50"
                r="4"
                fill="#fff"
            >
                {animate && (
                    <animate
                        attributeName="opacity"
                        values="1;0.6;1"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                )}
            </circle>

            {/* SaaS Connection nodes - representing cloud connectivity */}
            <g opacity="0.9">
                {/* Node 1 - Top */}
                <circle cx="50" cy="15" r="3" fill="#00f0ff">
                    {animate && (
                        <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite" />
                    )}
                </circle>

                {/* Node 2 - Right */}
                <circle cx="82" cy="50" r="3" fill="#7000ff">
                    {animate && (
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
                    )}
                </circle>

                {/* Node 3 - Bottom */}
                <circle cx="50" cy="85" r="3" fill="#00f0ff">
                    {animate && (
                        <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite" />
                    )}
                </circle>

                {/* Node 4 - Left */}
                <circle cx="18" cy="50" r="3" fill="#7000ff">
                    {animate && (
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
                    )}
                </circle>
            </g>

            {/* Connection lines from center to nodes */}
            <g stroke={`url(#${uniqueId}-main)`} strokeWidth="0.5" opacity="0.3">
                <line x1="50" y1="42" x2="50" y2="15" />
                <line x1="58" y1="50" x2="82" y2="50" />
                <line x1="50" y1="58" x2="50" y2="85" />
                <line x1="42" y1="50" x2="18" y2="50" />
            </g>
        </svg>
    );
});

VortexLogo.displayName = 'VortexLogo';

export default VortexLogo;
