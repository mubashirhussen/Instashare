import './index.css'

const Logo = ({ size = 'md', showText = false, className = '' }) => {
  return (
    <div className={`instashare-logo-brand ${size} ${className}`}>
      <div className="logo-icon-wrapper">
        <svg
          viewBox="0 0 100 100"
          className="logo-svg-icon"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="instaShareGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
            <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Squircle Background */}
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx="24"
            fill="url(#instaShareGrad)"
          />

          {/* Inner Camera Outline */}
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            rx="16"
            stroke="#ffffff"
            strokeWidth="6"
          />

          {/* Center Lens Circle */}
          <circle
            cx="50"
            cy="50"
            r="15"
            stroke="#ffffff"
            strokeWidth="6"
          />

          {/* Flash Dot */}
          <circle
            cx="66"
            cy="34"
            r="3.5"
            fill="#ffffff"
          />

          {/* Share Flash Accent */}
          <circle
            cx="50"
            cy="50"
            r="7"
            fill="url(#lensGrad)"
          />
        </svg>
      </div>
      {showText && <h1 className="logo-brand-text">Insta Share</h1>}
    </div>
  )
}

export default Logo
