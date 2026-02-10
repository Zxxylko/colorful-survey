// import { motion } from 'framer-motion';

const Background = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      {/* Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Stars Layers */}
      <div className="star-layer star-1"></div>
      <div className="star-layer star-2"></div>
      <div className="star-layer star-3"></div>

      {/* Celestial Objects */}
      <div className="celestial moon">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path d="M50 0 A50 50 0 1 0 50 100 A40 40 0 1 1 50 0 Z" fill="url(#moon-gradient)" filter="url(#glow)"/>
          <defs>
            <linearGradient id="moon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#c7d2fe" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <div className="celestial planet">
        <div className="planet-body"></div>
        <div className="planet-ring"></div>
      </div>

      <div className="celestial planet-small"></div>
      <div className="celestial comet"></div>

      <div className="celestial galaxy"></div>
      
      {/* Subtle Scan Lines */}
      <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'repeating-linear-gradient(transparent 0px, transparent 1px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 2px)',
          opacity: 0.5
      }}></div>
    </div>
  );
};

export default Background;
