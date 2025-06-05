import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Switch = () => {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    // Solo en cliente
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));
    }
  }, []);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };
  return (
    <StyledWrapper>
      <div className="theme-toggle-wrapper">
        <label className="toggle-switch">
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
          <span className="slider">
            <div className="clouds">
              <svg viewBox="0 0 100 100" className="cloud cloud1">
                <path d="M30,45 Q35,25 50,25 Q65,25 70,45 Q80,45 85,50 Q90,55 85,60 Q80,65 75,60 Q65,60 60,65 Q55,70 50,65 Q45,70 40,65 Q35,60 25,60 Q20,65 15,60 Q10,55 15,50 Q20,45 30,45" />
              </svg>
              <svg viewBox="0 0 100 100" className="cloud cloud2">
                <path d="M30,45 Q35,25 50,25 Q65,25 70,45 Q80,45 85,50 Q90,55 85,60 Q80,65 75,60 Q65,60 60,65 Q55,70 50,65 Q45,70 40,65 Q35,60 25,60 Q20,65 15,60 Q10,55 15,50 Q20,45 30,45" />
              </svg>
            </div>
          </span>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .theme-toggle-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 600px;
    height: 100%;
    margin: 0;
    transition: 0.6s ease-in-out;
    font-family: "Arial", sans-serif;
  }

  .theme-toggle-wrapper .toggle-switch {
    position: relative;
    display: inline-block;
    width: 80px;
    height: 40px;
    transform: scale(1.2);
    transition: transform 0.2s;
  }

  .theme-toggle-wrapper .toggle-switch:hover {
    transform: scale(1.3);
  }

  .theme-toggle-wrapper .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .theme-toggle-wrapper .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(145deg, #f1c40f, #f39c12);
    transition: 0.4s;
    border-radius: 34px;
    box-shadow: 0 0 15px rgba(241, 196, 15, 0.5);
  }

  .theme-toggle-wrapper .slider:before {
    position: absolute;
    content: "☀️";
    height: 32px;
    width: 32px;
    left: 4px;
    bottom: 4px;
    background: white;
    transition: 0.4s;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 2;
  }

  .theme-toggle-wrapper input:checked + .slider {
    background: linear-gradient(145deg, #2c3e50, #34495e);
    box-shadow: 0 0 15px rgba(44, 62, 80, 0.5);
  }

  .theme-toggle-wrapper input:checked + .slider:before {
    transform: translateX(40px);
    content: "🌙";
  }

  .theme-toggle-wrapper .clouds {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .theme-toggle-wrapper .cloud {
    position: absolute;
    width: 20px;
    height: 20px;
    fill: rgba(255, 255, 255, 0.8);
    transition: all 0.4s ease;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
  }

  .theme-toggle-wrapper .cloud1 {
    top: 10px;
    left: 10px;
    animation: floatCloud1 8s infinite linear;
  }

  .theme-toggle-wrapper .cloud2 {
    top: 15px;
    left: 40px;
    transform: scale(0.8);
    animation: floatCloud2 12s infinite linear;
  }

  @keyframes floatCloud1 {
    0% {
      transform: translateX(-20px);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(80px);
      opacity: 0;
    }
  }

  @keyframes floatCloud2 {
    0% {
      transform: translateX(-20px) scale(0.8);
      opacity: 0;
    }
    20% {
      opacity: 0.7;
    }
    80% {
      opacity: 0.7;
    }
    100% {
      transform: translateX(80px) scale(0.8);
      opacity: 0;
    }
  }

  .theme-toggle-wrapper input:checked + .slider .cloud {
    opacity: 0;
    transform: translateY(-20px);
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-toggle-wrapper .cloud {
      animation: none;
    }
  }`;

export default Switch;
