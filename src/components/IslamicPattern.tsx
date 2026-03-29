const IslamicPattern = () => (
  <div className="islamic-watermark">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="islamic-geo" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <g stroke="#D4AF37" strokeWidth="0.5" fill="none">
            <polygon points="60,10 110,35 110,85 60,110 10,85 10,35" />
            <polygon points="60,25 95,42 95,78 60,95 25,78 25,42" />
            <line x1="60" y1="10" x2="60" y2="25" />
            <line x1="110" y1="35" x2="95" y2="42" />
            <line x1="110" y1="85" x2="95" y2="78" />
            <line x1="60" y1="110" x2="60" y2="95" />
            <line x1="10" y1="85" x2="25" y2="78" />
            <line x1="10" y1="35" x2="25" y2="42" />
            <circle cx="60" cy="60" r="15" />
            <line x1="60" y1="10" x2="110" y2="85" />
            <line x1="110" y1="35" x2="10" y2="85" />
            <line x1="60" y1="110" x2="10" y2="35" />
            <line x1="60" y1="10" x2="10" y2="85" />
            <line x1="110" y1="35" x2="60" y2="110" />
            <line x1="110" y1="85" x2="10" y2="35" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-geo)" />
    </svg>
  </div>
);

export default IslamicPattern;
