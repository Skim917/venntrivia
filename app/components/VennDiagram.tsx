import React, { useState, useEffect } from 'react';

const VennDiagram = ({ circle1Text, circle2Text, circle3Text, centerText }) => {
  const [circle1Opacity, setCircle1Opacity] = useState(0);
  const [circle2Opacity, setCircle2Opacity] = useState(0);
  const [circle3Opacity, setCircle3Opacity] = useState(0);
  const [centerOpacity, setCenterOpacity] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      setTimeout(() => setCircle1Opacity(1), 100);    // First circle
      setTimeout(() => setCircle2Opacity(1), 600);   // Second circle
      setTimeout(() => setCircle3Opacity(1), 1100); // Third circle
      setTimeout(() => setCenterOpacity(1), 1600); // Center text
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  return (
    <svg viewBox="0 0 400 300" className="w-full bg-black rounded-lg">
      <defs>
        <clipPath id="circle1">
          <circle cx="160" cy="130" r="70"/>
        </clipPath>
        <clipPath id="circle2">
          <circle cx="240" cy="130" r="70"/>
        </clipPath>
        <clipPath id="circle3">
          <circle cx="200" cy="170" r="70"/>
        </clipPath>
      </defs>
      <g transform="scale(1.5) translate(-60 -45)">
        {/* All rectangles must stay together for proper transparency */}
        <rect x="0" y="0" width="400" height="300" fill="#333333" 
              clipPath="url(#circle1)"
              clipRule="evenodd"
              opacity={circle1Opacity}
              style={{ transition: 'opacity 0.5s ease-in' }}/>
        <rect x="0" y="0" width="400" height="300" fill="#333333" 
              clipPath="url(#circle2)"
              clipRule="evenodd"
              opacity={circle2Opacity}
              style={{ transition: 'opacity 0.5s ease-in' }}/>
        <rect x="0" y="0" width="400" height="300" fill="#333333" 
              clipPath="url(#circle3)"
              clipRule="evenodd"
              opacity={circle3Opacity}
              style={{ transition: 'opacity 0.5s ease-in' }}/>
            
        {/* Circle outlines */}
        <circle 
          cx="160" 
          cy="130" 
          r="70" 
          fill="none" 
          stroke="white" 
          strokeWidth="1" 
          opacity={circle1Opacity * 0.7}
          style={{ transition: 'opacity 0.5s ease-in' }}
        />
        <circle 
          cx="240" 
          cy="130" 
          r="70" 
          fill="none" 
          stroke="white" 
          strokeWidth="1" 
          opacity={circle2Opacity * 0.7}
          style={{ transition: 'opacity 0.5s ease-in' }}
        />
        <circle 
          cx="200" 
          cy="170" 
          r="70" 
          fill="none" 
          stroke="white" 
          strokeWidth="1" 
          opacity={circle3Opacity * 0.7}
          style={{ transition: 'opacity 0.5s ease-in' }}
        />
      
        {/* Labels */}
        <text 
          x="120" 
          y="125" 
          textAnchor="middle" 
          fill="white" 
          fontSize="8"
          opacity={circle1Opacity}
          style={{ transition: 'opacity 0.5s ease-in' }}
        >
          {(circle1Text || '').split(/\\n/).map((line, i) => 
            <tspan x="120" dy={i === 0 ? 0 : 10} key={i}>{line}</tspan>
          )}
        </text>
        <text 
          x="280" 
          y="125" 
          textAnchor="middle" 
          fill="white" 
          fontSize="8"
          opacity={circle2Opacity}
          style={{ transition: 'opacity 0.5s ease-in' }}
        >
          {(circle2Text || '').split(/\\n/).map((line, i) => 
            <tspan x="280" dy={i === 0 ? 0 : 10} key={i}>{line}</tspan>
          )}
        </text>
        <text 
          x="200" 
          y="220" 
          textAnchor="middle" 
          fill="white" 
          fontSize="8"
          opacity={circle3Opacity}
          style={{ transition: 'opacity 0.5s ease-in' }}
        >
          {(circle3Text || '').split(/\\n/).map((line, i) => 
            <tspan x="200" dy={i === 0 ? 0 : 10} key={i}>{line}</tspan>
          )}
        </text>
        
        {/* Center text */}
        <text 
          x="200" 
          y="150" 
          textAnchor="middle" 
          fill="white" 
          fontSize="10" 
          fontWeight="bold"
          opacity={centerOpacity}
          style={{ transition: 'opacity 0.5s ease-in' }}
        >
          {centerText}
        </text>
      </g>
    </svg>
  );
};

export default VennDiagram;