import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Headphones, Music2, Pause, Play, RotateCcw, SkipBack, SkipForward, Timer } from "lucide-react";
import "../../style/focus.css";

const presets = [
  { label: "25 min", minutes: 25 },
  { label: "50 min", minutes: 50 },
  { label: "90 min", minutes: 90 },
];

const providers = [
  { id: "spotify", name: "Spotify", description: "Connect your playlists and keep your study music in one place.", className: "focus-provider--spotify" },
  { id: "apple", name: "Apple Music", description: "Use your Apple Music library while you focus.", className: "focus-provider--apple" },
];

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remaining = (seconds % 60).toString().padStart(2, "0");
  return minutes + ":" + remaining;
}

function Focus() {
  const [duration, setDuration] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [provider, setProvider] = useState("none");
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [localTrack, setLocalTrack] = useState(null);
  const [localPlaying, setLocalPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const progress = useMemo(() => ((duration - secondsLeft) / duration) * 100, [duration, secondsLeft]);

  const choosePreset = (minutes) => {
    setRunning(false);
    setDuration(minutes * 60);
    setSecondsLeft(minutes * 60);
  };

  const resetTimer = () => {
    setRunning(false);
    setSecondsLeft(duration);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (localTrack?.url) URL.revokeObjectURL(localTrack.url);
    };
  }, [localTrack]);

  const connectProvider = (id) => {
    if (id === "local") return;
    setProvider(id);
    setConnectedProvider(id);
    setLocalPlaying(false);
  };

  const handleLocalFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (localTrack?.url) URL.revokeObjectURL(localTrack.url);
    const url = URL.createObjectURL(file);
    setLocalTrack({ name: file.name, url });
    setProvider("local");
    setConnectedProvider("local");
    setLocalPlaying(false);
  };

  const toggleLocalPlayback = () => {
    if (!audioRef.current || !localTrack) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setLocalPlaying(true);
    } else {
      audioRef.current.pause();
      setLocalPlaying(false);
    }
  };

  return (
    <section className="focus-page">
      <div className="focus-nature" aria-hidden="true" />\n      <header className="focus-page__header">
        <div>
          <span className="focus-page__eyebrow">Focus Mode</span>
          <h1>Make time for the work that matters.</h1>
          <p>Set a session, choose your music, and stay in your flow.</p>
        </div>
        <div className="focus-page__status">
          <span className={running ? "focus-status-dot focus-status-dot--active" : "focus-status-dot"} />
          {running ? "Session active" : "Ready to focus"}
        </div>
      </header>

      <div className="focus-grid">
        <section className="focus-card focus-card--timer">
          <div className="focus-card__topline">
            <div className="focus-card__icon"><Timer size={19} /></div>
            <div><span>Study session</span><strong>{running ? "In progress" : "Choose your pace"}</strong></div>
          </div>

          <div className="focus-timer">
            <div className="focus-timer__ring" style={{ "--focus-progress": progress + "%" }}>
              <div className="focus-timer__inner">
                <span>{formatTime(secondsLeft)}</span>
                <small>{secondsLeft === 0 ? "Complete" : running ? "Focus" : "Minutes"}</small>
              </div>
            </div>
          </div>

          <div className="focus-presets">
            {presets.map((preset) => (
              <button
                key={preset.minutes}
                type="button"
                className={duration === preset.minutes * 60 ? "focus-preset focus-preset--active" : "focus-preset"}
                onClick={() => choosePreset(preset.minutes)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="focus-timer__actions">
            <button type="button" className="focus-button focus-button--secondary" onClick={resetTimer}><RotateCcw size={17} />Reset</button>
            <button type="button" className="focus-button focus-button--primary" onClick={() => setRunning((value) => !value)} disabled={secondsLeft === 0}>
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? "Pause" : "Start focus"}
            </button>
          </div>
        </section>

        <section className="focus-card focus-card--music">
          <div className="focus-card__topline">
            <div className="focus-card__icon focus-card__icon--music"><Headphones size={19} /></div>
            <div><span>Study music</span><strong>{connectedProvider === "local" ? "Local music loaded" : connectedProvider ? (connectedProvider === "spotify" ? "Spotify connected" : "Apple Music connected") : "Choose your source"}</strong></div>
          </div>

          <div className="focus-music-now">
            <div className="focus-music-art"><Music2 size={28} /></div>
            <div>
              <strong>{provider === "local" && localTrack ? localTrack.name : provider === "none" ? "No music selected" : "Your study playlist"}</strong>
              <span>{provider === "local" && localTrack ? "Playing from this device." : provider === "none" ? "Your timer works without music." : "Ready when you are."}</span>
            </div>
          </div>

          {localTrack && <audio className="focus-local-audio" ref={audioRef} src={localTrack.url} onEnded={() => setLocalPlaying(false)} />}

          <div className="focus-player">
            <button type="button" aria-label="Previous track"><SkipBack size={17} /></button>
            <button type="button" className="focus-player__play" aria-label={localPlaying ? "Pause local music" : "Play local music"} onClick={toggleLocalPlayback} disabled={!localTrack}>
              {localPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button type="button" aria-label="Next track"><SkipForward size={17} /></button>
          </div>

          <div className="focus-providers">
            {providers.map((item) => (
              <button key={item.id} type="button" className={"focus-provider " + item.className + (provider === item.id ? " focus-provider--selected" : "")} onClick={() => connectProvider(item.id)}>
                <span className="focus-provider__brand">{item.id === "spotify" ? "S" : "♪"}</span>
                <span><strong>{item.name}</strong><small>{item.description}</small></span>
                <span className="focus-provider__action">{connectedProvider === item.id ? "Connected" : "Connect"}</span>
              </button>
            ))}
          </div>

          <label className={"focus-provider focus-provider--local" + (provider === "local" ? " focus-provider--selected" : "")}>
            <span className="focus-provider__brand"><Music2 size={17} /></span>
            <span><strong>{localTrack ? "Local music" : "Use local music"}</strong><small>{localTrack ? localTrack.name : "Choose an audio file from your device."}</small></span>
            <span className="focus-provider__action">{localTrack ? "Change" : "Choose"}</span>
            <input className="focus-local-input" type="file" accept="audio/*" onChange={handleLocalFile} />
          </label>

          <button type="button" className={"focus-provider focus-provider--none" + (provider === "none" ? " focus-provider--selected" : "")} onClick={() => { setProvider("none"); setConnectedProvider(null); setLocalPlaying(false); }}>
            <span className="focus-provider__brand"><Clock3 size={17} /></span>
            <span><strong>No music</strong><small>Keep Focus Mode completely distraction-free.</small></span>
          </button>
        </section>
      </div>

      <div className="focus-note"><span>♪</span><p>Choose Spotify, Apple Music, a local audio file, or keep the session quiet.</p></div>
    </section>
  );
}

export default Focus;
