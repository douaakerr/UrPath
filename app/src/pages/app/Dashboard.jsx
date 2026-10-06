import {
  ArrowRight,
  Bell,
  Check,
  Clock3,
  Flame,
  Play,
  RotateCcw,
  Target,
  X,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useEffect,  useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../../services/authService";
import { useRoadmapStore } from "../../stores/roadmapStore";
import { useOnboardingStore } from "../../stores/onboardingStore";
import "../../style/dashboard.css";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
};

function Dashboard() {
  const navigate = useNavigate();
  const {
    getActiveRoadmap,
    getStats,
    fetchRoadmaps,
    setActiveRoadmap,
    roadmaps,
    activeRoadmapId,
    loading,
    error,
  } = useRoadmapStore();
  const roadmap = getActiveRoadmap();
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const [user, setUser] = useState(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);

  useEffect(() => {
    fetchRoadmaps();
    getCurrentUser()
      .then((response) => setUser(response?.user || response?.data?.user || response?.data || response))
      .catch(() => setUser(null));
  }, [fetchRoadmaps]);

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

  const { overallProgress, currentMilestone } = getStats();
  const milestones = roadmap?.milestones || [];

  // const nextTask = useMemo(() => {
  //   for (const milestone of milestones) {
  //     const task = (milestone.tasks || []).find((item) => !item.completed);
  //     if (task) return { ...task, weekNumber: milestone.weekNumber };
  //   }
  //   return null;
  // }, [milestones]);

  const completed = milestones.filter((item) => item.status === "completed").length;
  const displayName = user?.name || user?.username || user?.firstName || "Learner";

  const resetFocus = () => {
    setFocusRunning(false);
    setFocusSeconds(25 * 60);
  };

  if (loading && !roadmap) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-empty">Loading your learning data…</div>
      </main>
    );
  }

  if (!roadmap) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-empty">
          <Target size={28} />
          <h1>Hello, {displayName}.</h1>
          <p>{error || "You do not have a roadmap yet."}</p>
          <button type="button" className="journey-button" onClick={() => { resetOnboarding(); navigate("/onboarding"); }}>
            Build my path <ArrowRight size={16} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-kicker">YOUR LEARNING SPACE</span>
          <h1>Hello, {displayName}<span>.</span></h1>
          <p>{roadmap.title}</p>
          {error && <small>{error}</small>}
        </div>
        <div className="dashboard-header__actions">
          <label className="roadmap-switcher">
            <span>ACTIVE PATH</span>
            <select
              value={activeRoadmapId || ""}
              onChange={(event) => setActiveRoadmap(event.target.value)}
              aria-label="Choose active learning path"
            >
              {Object.values(roadmaps).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.domain || item.title}{item.subdomain ? ` · ${item.subdomain}` : ""}
                </option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
          <button className="dashboard-new-path" type="button" onClick={() => navigate("/onboarding")}>
            <Plus size={16} /> Learn something new
          </button>
          <button
            className="dashboard-header__notification"
            type="button"
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
        </div>
      </header>

      <section className="dashboard-hero-grid">
        <article className="journey-card">
          <div className="journey-card__content">
            <span className="panel-kicker">YOUR JOURNEY</span>
            <h2>{currentMilestone?.title || "Roadmap complete"}</h2>
            <p>{currentMilestone?.description || roadmap.subtitle || roadmap.goal || ""}</p>

            <div className="journey-card__progress">
              <div>
                <span>{overallProgress}% journey complete</span>
                <strong>{completed}/{milestones.length}</strong>
              </div>
              <div className="thin-progress">
                <span style={{ width: `${overallProgress}%` }} />
              </div>
            </div>

            <button type="button" onClick={() => navigate("/roadmap")} className="journey-button">
              Open roadmap <ArrowRight size={16} />
            </button>
          </div>
        </article>

        <article className="today-card">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">NEXT STEP</span>
              {/* <h2>{nextTask?.title || currentMilestone?.title || "Roadmap complete"}</h2> */}
            </div>
            <Target size={19} />
          </div>

          {/* <div className="today-task today-task--active">
            <span className="task-dot" />
            <div>
              <small>{nextTask ? `WEEK ${nextTask.weekNumber || ""}` : "STATUS"}</small>
              <strong>{nextTask?.title || currentMilestone?.title || "All roadmap tasks completed"}</strong>
              <span>{nextTask?.description || currentMilestone?.progress || 0}{nextTask?.description ? "" : "% complete"}</span>
            </div>
          </div> */}

          <button className="text-action" type="button" onClick={() => navigate("/roadmap")}>
            View roadmap <ArrowRight size={14} />
          </button>
        </article>
      </section>

      <section className="dashboard-stats">
        <article>
          <div className="metric-icon"><Target size={17} /></div>
          <div><small>PROGRESS</small><strong>{overallProgress}%</strong></div>
        </article>
        <article>
          <div className="metric-icon metric-icon--fire"><Flame size={17} /></div>
          <div><small>STREAK</small><strong>{roadmap.streak || 0}<em> days</em></strong></div>
        </article>
        <article>
          <div className="metric-icon metric-icon--time"><Clock3 size={17} /></div>
          <div><small>LEARNING TIME</small><strong>{roadmap.learningTimeHours || 0}<em> h</em></strong></div>
        </article>
        <article>
          <div className="metric-icon"><Check size={17} /></div>
          <div><small>COMPLETED</small><strong>{completed}<em> milestones</em></strong></div>
        </article>
      </section>

      <section className="dashboard-lower-grid dashboard-lower-grid--clean">
        <article className="workspace-panel roadmap-data-widget">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">BACKEND ROADMAP</span>
              <h2>{roadmap.title}</h2>
            </div>
            <Target size={19} />
          </div>

          <div className="roadmap-data-grid">
            <div><span>Domain</span><strong>{roadmap.domain || "—"}</strong></div>
            <div><span>Subdomain</span><strong>{roadmap.subdomain || "—"}</strong></div>
            <div><span>Goal</span><strong>{roadmap.goal || "—"}</strong></div>
            <div><span>Weeks</span><strong>{milestones.length}</strong></div>
          </div>

          <button type="button" className="next-link" onClick={() => navigate("/roadmap")}>
            Open full roadmap <ArrowRight size={15} />
          </button>
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
              <span>{focusRunning ? "Stay focused" : "Ready when you are"}</span>
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
            <button type="button" className="focus-reset" onClick={resetFocus} aria-label="Reset timer">
              <RotateCcw size={16} />
            </button>
          </div>
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

          <div className="focus-scene" aria-hidden="true"><div /><div /><div /></div>

          <div className="focus-content">
            <span>URPATH · FOCUS SESSION</span>
            <h2>{currentMilestone?.title || roadmap.title}</h2>
            <div className="focus-full-ring">
              <strong>{formatTime(focusSeconds)}</strong>
              <small>
                {focusRunning ? "Stay with it." : focusSeconds === 0 ? "Session complete." : "Paused."}
              </small>
            </div>

            <div className="focus-full-actions">
              <button type="button" onClick={() => setFocusRunning((value) => !value)}>
                {focusRunning ? "Pause" : "Resume"}
              </button>
              <button type="button" onClick={resetFocus}>Reset</button>
              <button type="button" onClick={() => navigate("/focus")}>Open Focus Mode</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
