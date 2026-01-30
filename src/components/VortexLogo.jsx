const VortexLogo = ({ size = 40 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.5))' }}
        >
            <defs>
                <linearGradient id="vortexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#00f0ff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#7000ff', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* Outer spiral */}
            <path
                d="M50 10 Q70 20, 80 40 T90 70 Q85 85, 70 90 T40 85 Q20 75, 15 55 T20 30 Q30 15, 50 10"
                stroke="url(#vortexGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
            />

            {/* Middle spiral */}
            <path
                d="M50 25 Q65 30, 70 45 T75 65 Q72 75, 60 78 T45 73 Q35 65, 33 50 T38 35 Q43 28, 50 25"
                stroke="url(#vortexGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.8"
            />

            {/* Inner spiral */}
            <path
                d="M50 40 Q58 42, 60 50 T58 60 Q55 63, 50 63 T45 58 Q43 53, 45 48 T50 40"
                stroke="url(#vortexGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Center dot */}
            <circle
                cx="50"
                cy="50"
                r="4"
                fill="url(#vortexGradient)"
            />
        </svg>
    );
};

export default VortexLogo;
