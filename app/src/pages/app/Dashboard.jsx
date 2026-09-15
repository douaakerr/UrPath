import {
  ArrowRight,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Target,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useRoadmapStore } from "../../stores/roadmapStore";
import "../../style/dashboard.css";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
};

function Dashboard() {
  const navigate = useNavigate();
  const { getActiveRoadmap, getStats } = useRoadmapStore();
  const roadmap = getActiveRoadmap();
  const { overallProgress, currentMilestone } = getStats();

  const milestones = roadmap?.milestones || [];
  const completed = milestones.filter(
    (item) => item.status === "completed",
  ).length;
  const today = new Date();
  const [monthDate, setMonthDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [musicOpen, setMusicOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [trackName, setTrackName] = useState("Choose a study track");
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    if (!focusRunning) return undefined;
    const timer = window.setInterval(() => {
      setFocusSeconds((value) => {
        if (value <= 1) {
          setFocusRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [focusRunning]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const calendar = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = (firstDay + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    return { year, month, offset, days };
  }, [monthDate]);

  const monthLabel = monthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleMusicFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setTrackName(file.name.replace(/\.[^/.]+$/, ""));
    setMusicPlaying(false);
  };

  const toggleMusic = async () => {
    if (!audioRef.current || !audioUrl) {
      setMusicOpen(true);
      return;
    }
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setMusicPlaying(true);
    } else {
      audioRef.current.pause();
      setMusicPlaying(false);
    }
  };

  const resetFocus = () => {
    setFocusRunning(false);
    setFocusSeconds(25 * 60);
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-atmosphere" aria-hidden="true" />

      <header className="dashboard-header">
        <div>
          <span className="dashboard-kicker">YOUR LEARNING SPACE</span>
          <h1>
            Good morning<span>.</span>
          </h1>
          <p>{roadmap?.title || "Your learning journey"}</p>
        </div>
        <button
          className="dashboard-header__notification"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <i />
        </button>
      </header>

      <section className="dashboard-hero-grid">
        <article className="journey-card">
          <div className="journey-card__content">
            <span className="panel-kicker">YOUR JOURNEY</span>
            <h2>{currentMilestone?.title || "Your next step"}</h2>
            <p>
              {currentMilestone?.description ||
                "Continue your path and keep moving toward the summit."}
            </p>
            <div className="journey-card__progress">
              <div>
                <span>{overallProgress}% journey complete</span>
                <strong>
                  {completed}/{milestones.length || 0}
                </strong>
              </div>
              <div className="thin-progress">
                <span style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/roadmap")}
              className="journey-button"
            >
              Continue journey <ArrowRight size={16} />
            </button>
          </div>
          <div className="journey-mountain" aria-hidden="true">
            <div className="journey-sun" />
            <div className="journey-ridge journey-ridge--back" />
            <div className="journey-ridge journey-ridge--front" />
            <div className="journey-trail" />
            <div className="journey-marker">●</div>
          </div>
        </article>

        <article className="today-card">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">TODAY</span>
              <h2>Keep climbing</h2>
            </div>
            <Target size={19} />
          </div>
          <div className="today-task today-task--active">
            <span className="task-dot" />
            <div>
              <small>CONTINUE</small>
              <strong>
                {currentMilestone?.title || "Your current milestone"}
              </strong>
              <span>{currentMilestone?.progress || 0}% complete</span>
            </div>
          </div>
          <div className="today-task">
            <span className="task-dot" />
            <div>
              <small>NEXT</small>
              <strong>Practice today's lesson</strong>
              <span>Build consistency</span>
            </div>
          </div>
          <button
            className="text-action"
            type="button"
            onClick={() => navigate("/calendar")}
          >
            View calendar <ArrowRight size={14} />
          </button>
        </article>
      </section>

      <section className="dashboard-stats">
        <article>
          <div className="metric-icon">
            <Target size={17} />
          </div>
          <div>
            <small>PROGRESS</small>
            <strong>{overallProgress}%</strong>
          </div>
        </article>
        <article>
          <div className="metric-icon metric-icon--fire">
            <Flame size={17} />
          </div>
          <div>
            <small>STREAK</small>
            <strong>
              {roadmap?.streak || 0}
              <em> days</em>
            </strong>
          </div>
        </article>
        <article>
          <div className="metric-icon metric-icon--time">
            <Clock3 size={17} />
          </div>
          <div>
            <small>LEARNING TIME</small>
            <strong>
              {roadmap?.learningTimeHours || 0}
              <em> h</em>
            </strong>
          </div>
        </article>
        <article>
          <div className="metric-icon">
            <Check size={17} />
          </div>
          <div>
            <small>COMPLETED</small>
            <strong>
              {completed}
              <em> milestones</em>
            </strong>
          </div>
        </article>
      </section>

      <section className="dashboard-lower-grid">
        <article className="workspace-panel calendar-widget">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">YOUR RHYTHM</span>
              <h2>Calendar</h2>
            </div>
            <div className="month-controls">
              <button
                type="button"
                onClick={() =>
                  setMonthDate(new Date(calendar.year, calendar.month - 1, 1))
                }
              >
                <ChevronLeft size={15} />
              </button>
              <span>{monthLabel}</span>
              <button
                type="button"
                onClick={() =>
                  setMonthDate(new Date(calendar.year, calendar.month + 1, 1))
                }
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
          <div className="calendar-weekdays">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <span key={`${day}-${i}`}>{day}</span>
            ))}
          </div>
          <div className="calendar-days">
            {Array.from({ length: calendar.offset }).map((_, i) => (
              <span className="is-empty" key={`empty-${i}`} />
            ))}
            {Array.from({ length: calendar.days }, (_, i) => i + 1).map(
              (day) => {
                const isToday =
                  day === today.getDate() &&
                  calendar.month === today.getMonth() &&
                  calendar.year === today.getFullYear();
                return (
                  <span className={isToday ? "is-today" : ""} key={day}>
                    {day}
                  </span>
                );
              },
            )}
          </div>
          <div className="calendar-summary">
            <span>
              <i className="summary-dot summary-dot--done" /> Learning activity
            </span>
            <strong>{completed} milestones completed</strong>
          </div>
        </article>

        <article className="workspace-panel focus-widget">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">DEEP WORK</span>
              <h2>Focus mode</h2>
            </div>
            <Clock3 size={19} />
          </div>
          <div className="focus-ring">
            <div>
              <strong>{formatTime(focusSeconds)}</strong>
              <span>
                {focusRunning ? "Stay focused" : "Ready when you are"}
              </span>
            </div>
          </div>
          <div className="focus-actions">
            <button
              type="button"
              className="focus-main-button"
              onClick={() => {
                setFocusOpen(true);
                setFocusRunning(true);
              }}
            >
              <Play size={15} fill="currentColor" /> Start focus
            </button>
            <button
              type="button"
              className="focus-reset"
              onClick={resetFocus}
              aria-label="Reset timer"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </article>

        <article className="workspace-panel music-widget">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">STUDY SOUND</span>
              <h2>Music listening</h2>
            </div>
            <Headphones size={19} />
          </div>
          <div className="music-main">
            <div className="music-art">
              <Headphones size={22} />
            </div>
            <div>
              <strong>{trackName}</strong>
              <span>
                {audioUrl ? "Local study track" : "Add your own study music"}
              </span>
            </div>
          </div>
          <div className="music-controls">
            <button type="button" onClick={() => setMusicOpen(true)}>
              Choose track
            </button>
            <button
              type="button"
              className="music-play"
              onClick={toggleMusic}
              disabled={!audioUrl}
              aria-label={musicPlaying ? "Pause music" : "Play music"}
            >
              {musicPlaying ? (
                <Pause size={17} />
              ) : (
                <Play size={17} fill="currentColor" />
              )}
            </button>
            <Volume2 size={16} />
          </div>
          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            onEnded={() => setMusicPlaying(false)}
          />
        </article>

        <article className="workspace-panel next-widget">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">NEXT UP</span>
              <h2>Keep the momentum</h2>
            </div>
            <ArrowRight size={19} />
          </div>
          <p>
            One focused session is enough for today. Pick up where you stopped
            and make one more step.
          </p>
          <button
            type="button"
            className="next-link"
            onClick={() => navigate("/roadmap")}
          >
            Open your roadmap <ArrowRight size={15} />
          </button>
        </article>
      </section>

      {focusOpen && (
        <div className="focus-overlay">
          <button
            className="focus-close"
            type="button"
            onClick={() => {
              setFocusOpen(false);
              setFocusRunning(false);
            }}
            aria-label="Close focus mode"
          >
            <X size={20} />
          </button>
          <div className="focus-scene" aria-hidden="true">
            <div />
            <div />
            <div />
          </div>
          <div className="focus-content">
            <span>URPATH · FOCUS SESSION</span>
            <h2>{currentMilestone?.title || "Your learning session"}</h2>
            <div className="focus-full-ring">
              <strong>{formatTime(focusSeconds)}</strong>
              <small>
                {focusRunning
                  ? "Stay with it."
                  : focusSeconds === 0
                    ? "Session complete."
                    : "Paused."}
              </small>
            </div>
            <div className="focus-full-actions">
              <button
                type="button"
                onClick={() => setFocusRunning((value) => !value)}
              >
                {focusRunning ? (
                  <Pause size={17} />
                ) : (
                  <Play size={17} fill="currentColor" />
                )}{" "}
                {focusRunning ? "Pause" : "Resume"}
              </button>
              <button type="button" onClick={resetFocus}>
                <RotateCcw size={16} /> Reset
              </button>
              <button type="button" onClick={toggleMusic}>
                <Headphones size={16} />{" "}
                {musicPlaying ? "Pause music" : "Music"}
              </button>
            </div>
          </div>
        </div>
      )}

      {musicOpen && (
        <div
          className="music-dialog-backdrop"
          onMouseDown={() => setMusicOpen(false)}
        >
          <div
            className="music-dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dialog-close"
              onClick={() => setMusicOpen(false)}
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <Headphones size={22} />
            <span className="panel-kicker">STUDY SOUND</span>
            <h2>Add your study music</h2>
            <p>
              Choose an audio file from your computer. It stays local to this
              browser session.
            </p>
            <label className="music-file-button">
              Choose audio
              <input type="file" accept="audio/*" onChange={handleMusicFile} />
            </label>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
