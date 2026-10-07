import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import {
  ChevronRight,
  Leaf,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Upload,
} from "lucide-react";

import "../../style/focus.css";

import forestWind from "../../assets/video/forest_wind.mp4";

// OPTIONAL:
// Add your own music file here:
//
// import studyMusic from "../../assets/audio/study-music.mp3";

const musicOptions = [
  {
    name: "Spotify",
    icon: "spotify",
  },
  {
    name: "Apple Music",
    icon: "apple",
  },
  {
    name: "Local Music",
    icon: "music",
  },
  {
    name: "No Music",
    icon: "mute",
  },
];

function MusicIcon({ type }) {
  if (type === "mute") {
    return <VolumeX size={18} />;
  }

  if (type === "music") {
    return <Music2 size={18} />;
  }

  if (type === "spotify") {
    return (
      <div className="music-brand spotify-brand">
        <span />
      </div>
    );
  }

  if (type === "apple") {
    return <div className="music-brand apple-brand">●</div>;
  }

  return <Music2 size={18} />;
}

export default function FocusPage() {
  const navigate = useNavigate();

  
   

  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

 
  const [selectedMusic, setSelectedMusic] = useState("No Music");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [localMusicUrl, setLocalMusicUrl] = useState("");
  const [localMusicName, setLocalMusicName] = useState("");

  const audioRef = useRef(null);
  const localMusicInputRef = useRef(null);

  

  useEffect(() => {
    if (!isRunning) {
      return;
    }

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

  

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = isMuted ? 0 : 1;
  }, [isMuted, localMusicUrl]);

  useEffect(() => {
    return () => {
      if (localMusicUrl) {
        URL.revokeObjectURL(localMusicUrl);
      }
    };
  }, [localMusicUrl]);

  

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
    if (timeLeft === 0) {
      setTimeLeft(duration);
    }

    setIsRunning((current) => !current);
  };

  /*
   * ==========================================
   * TIMER PROGRESS
   * ==========================================
   */

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  /*
   * ==========================================
   * TIMER COLOR
   *
   * Purple at the beginning
   * Brighter purple in the middle
   * Pink/purple near completion
   * ==========================================
   */

  const timerColor =
    progress < 30 ? "#a78bfa" : progress < 70 ? "#c084fc" : "#e879f9";

  /*
   * ==========================================
   * TIMER DOT POSITION
   * ==========================================
   */

  const radius = 94;

  const center = 110;

  const angle = -90 + (progress / 100) * 360;

  const angleInRadians = (angle * Math.PI) / 180;

  const dotX = center + radius * Math.cos(angleInRadians);

  const dotY = center + radius * Math.sin(angleInRadians);

  /*
   * ==========================================
   * FORMAT TIMER
   * ==========================================
   */

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0",
    )}:${String(secs).padStart(2, "0")}`;
  };

const connectSpotify = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  if (!apiBaseUrl) {
    console.error("VITE_API_URL is not configured.");
    return;
  }

  // Use the same host as the app's authenticated API requests so the
  // UrPath JWT cookie is included when Spotify login starts.
  const spotifyLoginUrl = new URL("/api/v1/spotify/login", apiBaseUrl);
  window.location.assign(spotifyLoginUrl.toString());
};

  const toggleMusic = async () => {
   
    if (selectedMusic === "No Music") {
      return;
    }

    

    if (audioRef.current) {
      try {
        if (isMusicPlaying) {
          audioRef.current.pause();

          setIsMusicPlaying(false);
        } else {
          await audioRef.current.play();

          setIsMusicPlaying(true);
        }
      } catch (error) {
        console.error("Unable to play music:", error);
      }

      return;
    }

   

    setIsMusicPlaying((current) => !current);
  };

  const handleLocalMusic = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      event.target.value = "";
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setLocalMusicUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return nextUrl;
    });
    setLocalMusicName(file.name);
    setSelectedMusic("Local Music");
    setIsMusicPlaying(false);
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    setIsMusicPlaying(false);
  };

  const selectMusic = (name) => {
  
  if (name === "Spotify") {
    connectSpotify();
    return;
  }

  if (name === "Local Music") {
    localMusicInputRef.current?.click();
    return;
  }

  setSelectedMusic(name);

  if (name === "No Music") {
    stopMusic();
    return;
  }

  
  if (name === "Apple Music") {
    stopMusic();
  }
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

      {localMusicUrl && (
        <audio ref={audioRef} src={localMusicUrl} loop preload="metadata" />
      )}

      <input
        ref={localMusicInputRef}
        type="file"
        accept="audio/*"
        className="local-music-input"
        onChange={handleLocalMusic}
      />

      {/* ======================================
          OPTIONAL LOCAL AUDIO

          When you have an MP3:

          1. Import it:
             import studyMusic from
             "../../assets/audio/study-music.mp3";

          2. Uncomment this:
      ====================================== */}

      {/*
      <audio
        ref={audioRef}
        src={studyMusic}
        loop
      />
      */}

      {/* ======================================
          TOP BAR
      ====================================== */}

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

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <section className="content">
        {/* ====================================
            FOCUS / TIMER
        ==================================== */}

        <div className="focus-section">
          <div className="section-heading">
            <div className="heading-title">
              <Leaf size={18} />

              <span>Focus Mode</span>
            </div>

            <p>Stay focused. Build your path.</p>
          </div>

          {/* TIMER */}
          <div className="timer-wrapper">
            <svg className="progress-ring" viewBox="0 0 220 220">
              {/* Background ring */}
              <circle
                className="progress-background"
                cx="110"
                cy="110"
                r="94"
              />

              {/* Progress ring */}
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

              {/* Moving dot */}
              <circle
                className="progress-dot"
                cx={dotX}
                cy={dotY}
                r="5"
                style={{
                  fill: timerColor,
                }}
              />
            </svg>

            {/* Timer content */}
            <div className="timer-content">
              <Leaf
                size={20}
                className="timer-leaf"
                style={{
                  color: timerColor,
                }}
              />

              <div className="timer-value">{formatTime(timeLeft)}</div>

              <div className="timer-label">
                {isRunning
                  ? "Focus in progress"
                  : timeLeft === 0
                    ? "Session complete"
                    : "Focus Time"}
              </div>
            </div>
          </div>

          {/* DURATION */}
          <div className="duration-buttons">
            {[25, 50, 90].map((minutes) => (
              <button
                type="button"
                key={minutes}
                className={`duration-btn ${
                  duration === minutes * 60 ? "active" : ""
                }`}
                onClick={() => selectDuration(minutes)}
              >
                {minutes} min
              </button>
            ))}
          </div>

          {/* TIMER ACTIONS */}
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

        {/* ====================================
            MUSIC
        ==================================== */}

        <div className="music-section">
          <div className="section-heading music-heading">
            <div className="heading-title">
              <Music2 size={18} />

              <span>Study Music</span>
            </div>

            <p>Choose your sound, find your flow.</p>
          </div>

          {/* CURRENT TRACK */}
          <div className="track-card">
            <div className="track-image">
              <div className="track-image-gradient">
                <Leaf size={28} />
              </div>
            </div>

            <div className="track-info">
              <strong>
                {selectedMusic === "No Music"
                  ? "No Music"
                  : selectedMusic === "Local Music" && localMusicName
                    ? localMusicName
                    : "Spotify"}
              </strong>

              <span>
                {selectedMusic === "No Music"
                  ? "Music disabled"
                  : selectedMusic === "Local Music"
                    ? "From your device"
                    : "Spotify connected"}
              </span>
            </div>
          </div>

          {/* MUSIC PROGRESS */}
          <div className="music-progress">
            <div className="music-progress-bar">
              <div
                className={`music-progress-value ${
                  isMusicPlaying ? "playing" : ""
                }`}
              />
            </div>

            <div className="music-times">
              <span>1:24</span>

              <span>3:42</span>
            </div>
          </div>

          {/* MUSIC CONTROLS */}
          <div className="music-controls">
            {/* Shuffle */}
            <button type="button" title="Shuffle">
              <Shuffle size={16} />
            </button>

            {/* Previous */}
            <button type="button" title="Previous" onClick={stopMusic}>
              <SkipBack size={19} fill="currentColor" />
            </button>

            {/* Play / Pause */}
            <button
              type="button"
              className="play-circle"
              onClick={toggleMusic}
              disabled={selectedMusic === "No Music"}
              title={
                selectedMusic === "No Music"
                  ? "Select music first"
                  : isMusicPlaying
                    ? "Pause music"
                    : "Play music"
              }
            >
              {isMusicPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>

            {/* Next */}
            <button type="button" title="Next" onClick={stopMusic}>
              <SkipForward size={19} fill="currentColor" />
            </button>

            {/* Mute */}
            <button
              type="button"
              title={isMuted ? "Unmute" : "Mute"}
              onClick={() => setIsMuted((current) => !current)}
            >
              {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          </div>

          {/* MUSIC PROVIDERS */}
          <div className="music-providers">
            {musicOptions.map((option) => (
              <button
                type="button"
                key={option.name}
                className={`provider ${
                  selectedMusic === option.name ? "selected" : ""
                }`}
                onClick={() => selectMusic(option.name)}
              >
                <div className="provider-left">
                  <MusicIcon type={option.icon} />

                  <span>{option.name}</span>
                  {option.name === "Local Music" && <Upload size={15} />}
                </div>

                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
