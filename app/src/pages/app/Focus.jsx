import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Leaf,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

import "../../style/focus.css";
import forestWind from "../../assets/video/forest_wind.mp4";

export default function FocusPage() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const selectDuration = (minutes) => {
    const seconds = minutes * 60;
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) setTimeLeft(duration);
    setIsRunning((current) => !current);
  };

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
  const timerColor =
    progress < 30 ? "#a8d7ba" : progress < 70 ? "#8fc8aa" : "#e8b66a";
  const radius = 94;
  const center = 110;
  const angleInRadians = ((-90 + (progress / 100) * 360) * Math.PI) / 180;
  const dotX = center + radius * Math.cos(angleInRadians);
  const dotY = center + radius * Math.sin(angleInRadians);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <main className="focus-page">
      <video
        className="background-video"
        src={forestWind}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="video-overlay" />

      <header className="topbar">
        <button
          type="button"
          className="brand brand-button"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span>UrPath</span>
        </button>
        <div className="top-focus">
          <Leaf size={15} />
          <span>Focus Mode</span>
        </div>
      </header>

      <section className="content focus-content">
        <div className="focus-section">
          <div className="section-heading">
            <div className="heading-title">
              <Leaf size={18} />
              <span>Focus Mode</span>
            </div>
            <p>Stay focused. Build your path.</p>
          </div>

          <div className="timer-wrapper">
            <svg className="progress-ring" viewBox="0 0 220 220" aria-hidden="true">
              <circle className="progress-background" cx="110" cy="110" r="94" />
              <circle
                className="progress-circle"
                cx="110"
                cy="110"
                r="94"
                style={{
                  strokeDashoffset: 590 - (590 * progress) / 100,
                  stroke: timerColor,
                }}
              />
              <circle
                className="progress-dot"
                cx={dotX}
                cy={dotY}
                r="5"
                style={{ fill: timerColor }}
              />
            </svg>

            <div className="timer-content">
              <Leaf size={20} className="timer-leaf" style={{ color: timerColor }} />
              <div className="timer-value">{formatTime(timeLeft)}</div>
              <div className="timer-label">
                {isRunning
                  ? "Focus in progress"
                  : timeLeft === 0
                    ? "Session complete"
                    : "Focus time"}
              </div>
            </div>
          </div>

          <div className="duration-buttons" aria-label="Choose focus duration">
            {[25, 50, 90].map((minutes) => (
              <button
                type="button"
                key={minutes}
                className={`duration-btn ${duration === minutes * 60 ? "active" : ""}`}
                onClick={() => selectDuration(minutes)}
              >
                {minutes} min
              </button>
            ))}
          </div>

          <div className="timer-actions">
            <button type="button" className="reset-btn" onClick={resetTimer}>
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
            <button type="button" className="start-btn" onClick={toggleTimer}>
              {isRunning ? (
                <>
                  <Pause size={18} fill="currentColor" />
                  <span>Pause Focus</span>
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" />
                  <span>Start Focus</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
