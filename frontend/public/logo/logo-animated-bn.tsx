import React from 'react';

export const MulyayonLogoBn: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 1600 800"
      style={{ backgroundColor: 'transparent' }}
    >
      <style>{`
        /* 1. Document Outline */
        svg .svg-elem-1 {
          stroke-dashoffset: 1861.7px;
          stroke-dasharray: 1861.7px;
          animation: draw-outline 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0s forwards;
        }

        /* 2. Folded Corner (Outline draws, then fills) */
        svg .svg-elem-2 {
          stroke-dashoffset: 242px;
          stroke-dasharray: 242px;
          fill: transparent;
          animation: draw-corner 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
        }

        /* 3. Document Line 1 */
        svg .svg-elem-3 {
          stroke-dashoffset: 177px;
          stroke-dasharray: 177px;
          animation: draw-simple 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }

        /* 4. Document Line 2 */
        svg .svg-elem-4 {
          stroke-dashoffset: 207px;
          stroke-dasharray: 207px;
          animation: draw-simple 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }

        /* 5. Document Line 3 */
        svg .svg-elem-5 {
          stroke-dashoffset: 157px;
          stroke-dasharray: 157px;
          animation: draw-simple 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }

        /* 6. Checkmark */
        svg .svg-elem-6 {
          stroke-dashoffset: 369.7px;
          stroke-dasharray: 369.7px;
          animation: draw-simple 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
        }

        /* 7. Divider Line */
        svg .svg-elem-7 {
          stroke-dashoffset: 1002px;
          stroke-dasharray: 1002px;
          animation: draw-simple 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
        }

        /* 8. Main Title Text */
        svg .svg-elem-8 {
          opacity: 0;
          animation: fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }

        /* 9. Tagline Text */
        svg .svg-elem-9 {
          opacity: 0;
          animation: fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
        }

        /* Animation Keyframe Definitions */
        @keyframes draw-outline {
          to { stroke-dashoffset: 0; }
        }

        @keyframes draw-simple {
          to { stroke-dashoffset: 0; }
        }

        @keyframes draw-corner {
          0% {
            stroke-dashoffset: 242px;
            fill: transparent;
          }
          70% {
            stroke-dashoffset: 0;
            fill: transparent;
          }
          100% {
            stroke-dashoffset: 0;
            fill: rgb(56, 87, 125);
          }
        }

        @keyframes fade-in {
          to { opacity: 1; }
        }
      `}</style>

      {/* Document icon graphics */}
      <g transform="translate(75 120)">
        {/* Document Outline */}
        <path
          className="svg-elem-1"
          d="M0 0H285L405 120V560H0Z"
          fill="none"
          stroke="#101A72"
          strokeWidth={30}
          strokeLinejoin="miter"
        />

        {/* Folded Corner */}
        <path
          className="svg-elem-2"
          d="M285 0V120H405"
          fill="none"
          stroke="#38577D"
          strokeWidth={2}
        />

        {/* Document Line 1 */}
        <path
          className="svg-elem-3"
          d="M70 180H245"
          stroke="#38577D"
          strokeWidth={18}
          fill="none"
        />

        {/* Document Line 2 */}
        <path
          className="svg-elem-4"
          d="M70 235H275"
          stroke="#38577D"
          strokeWidth={18}
          fill="none"
        />

        {/* Document Line 3 */}
        <path
          className="svg-elem-5"
          d="M70 290H225"
          stroke="#38577D"
          strokeWidth={18}
          fill="none"
        />

        {/* Checkmark */}
        <path
          className="svg-elem-6"
          d="M70 365L145 440L330 255"
          fill="none"
          stroke="#101A72"
          strokeWidth={34}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </g>

      {/* Wordmark and Tagline */}
      <g transform="translate(555 0)">
        {/* Main Bengali Title */}
        <text
          className="svg-elem-8"
          x="0"
          y="365"
          fontFamily="'Noto Sans Bengali','Noto Sans Bengali UI',sans-serif"
          fontSize="170"
          fontWeight="700"
          fill="#101A72"
          textLength="900"
          lengthAdjust="spacingAndGlyphs"
        >
          মূল্যায়ন
        </text>

        {/* Divider Line */}
        <line
          className="svg-elem-7"
          x1="0"
          y1="425"
          x2="900"
          y2="425"
          stroke="#101A72"
          strokeWidth={8}
          fill="none"
        />

        {/* Bengali Tagline */}
        <text
          className="svg-elem-9"
          x="0"
          y="545"
          fontFamily="'Noto Sans Bengali','Noto Sans Bengali UI',sans-serif"
          fontSize="76"
          fontWeight="400"
          fill="#38577D"
          textLength="650"
          lengthAdjust="spacingAndGlyphs"
        >
          কাজ হোক প্রমাণ
        </text>
      </g>
    </svg>
  );
};