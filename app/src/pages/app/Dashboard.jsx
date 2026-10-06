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
    fetchProgress,
    setActiveRoadmap,
    roadmaps,
    progressByRoadmap,
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
    const roadmapIds = Object.keys(roadmaps);
    const missingProgress = roadmapIds.filter((id) => !progressByRoadmap[id]);

    if (!missingProgress.length) return;

    missingProgress.forEach((id) => fetchProgress(id));
  }, [roadmaps, progressByRoadmap, fetchProgress]);

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

  const nextTask = (() => {
    for (const milestone of milestones) {
      const task = (milestone.tasks || []).find((item) => !item.completed);
      if (task) return { ...task, weekNumber: milestone.weekNumber };
    }
    return null;
  })();

  const completed = milestones.filter((item) => item.status === "completed").length;
  const displayName = user?.name || user?.username || user?.firstName || "Learner";

  const domainProgress = Object.values(roadmaps).map((item) => {
    const storedProgress = progressByRoadmap[item.id];
    const totalTasks = item.milestones.reduce(
      (sum, milestone) => sum + (milestone.tasks?.length || 0),
      0,
    );
    const completedTasks = item.milestones.reduce(
      (sum, milestone) =>
        sum + (milestone.tasks?.filter((task) => task.completed).length || 0),
      0,
    );
    const calculatedProgress = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      ...item,
      progress: Math.min(100, Math.max(0, storedProgress?.percentage ?? calculatedProgress)),
      completedTasks: storedProgress?.completedTasks ?? completedTasks,
      totalTasks: storedProgress?.totalTasks ?? totalTasks,
    };
  });

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
              <h2>{nextTask?.title || "Roadmap complete"}</h2>
            </div>
            <Target size={19} />
          </div>

          <div className="today-task today-task--active">
            <span className="task-dot" />
            <div>
              <small>{nextTask ? `WEEK ${nextTask.weekNumber || ""}` : "STATUS"}</small>
              <strong>
                {nextTask?.description || "You have completed every task in this path."}
              </strong>
              <span>
                {nextTask ? "Continue your current learning path." : "Choose another path to keep learning."}
              </span>
            </div>
          </div>

          <button className="text-action" type="button" onClick={() => navigate("/roadmap")}>
            {nextTask ? "Continue learning" : "View roadmap"} <ArrowRight size={14} />
          </button>
        </article>
      </section>

      <section className="dashboard-progress-section">
        <div className="dashboard-progress-section__header">
          <div>
            <span className="panel-kicker">LEARNING PROGRESS</span>
            <h2>See your progress clearly</h2>
            <p>Compare your learning paths and follow your current journey week by week.</p>
          </div>
          <span className="dashboard-progress-chart__count">{domainProgress.length} paths</span>
        </div>

        <div className="dashboard-progress-layout">
          <article className="domain-rings-panel">
            <div className="progress-panel-heading">
              <div>
                <span className="panel-kicker">ALL YOUR PATHS</span>
                <h3>Progress by domain</h3>
              </div>
            </div>

            <div className="domain-rings-grid">
              {domainProgress.map((item) => {
                const label = item.subdomain
                  ? `${item.domain || item.title} · ${item.subdomain}`
                  : item.domain || item.title;
                const radius = 30;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (item.progress / 100) * circumference;

                return (
                  <button
                    type="button"
                    className={`domain-ring-card${item.id === activeRoadmapId ? " is-active" : ""}`}
                    key={item.id}
                    onClick={() => setActiveRoadmap(item.id)}
                    title={`Open ${label}`}
                  >
                    <span className="domain-ring" aria-hidden="true">
                      <svg viewBox="0 0 76 76">
                        <circle className="domain-ring__track" cx="38" cy="38" r={radius} />
                        <circle
                          className="domain-ring__value"
                          cx="38"
                          cy="38"
                          r={radius}
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                        />
                      </svg>
                      <strong>{item.progress}%</strong>
                    </span>
                    <span className="domain-ring-card__label">
                      <strong>{label}</strong>
                      <small>{item.completedTasks}/{item.totalTasks} tasks</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="progress-graph-panel">
            <div className="progress-panel-heading">
              <div>
                <span className="panel-kicker">CURRENT PATH</span>
                <h3>Roadmap progress</h3>
              </div>
              <strong>{overallProgress}%</strong>
            </div>

            <div className="progress-graph" aria-label="Progress through the current roadmap">
              <div className="progress-graph__grid" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              {(() => {
                let completedBefore = 0;
                const totalTasks = milestones.reduce(
                  (sum, milestone) => sum + (milestone.tasks?.length || 0),
                  0,
                );
                const points = milestones.map((milestone, index) => {
                  const weekTasks = milestone.tasks || [];
                  completedBefore += weekTasks.filter((task) => task.completed).length;
                  const percentage = totalTasks
                    ? Math.round((completedBefore / totalTasks) * 100)
                    : 0;
                  const x = milestones.length === 1
                    ? 50
                    : (index / (milestones.length - 1)) * 100;
                  const y = 100 - percentage;
                  return { x, y, percentage, week: milestone.weekNumber };
                });
                const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

                return (
                  <svg className="progress-graph__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <polyline points={polyline} />
                    {points.map((point) => (
                      <circle
                        key={point.week}
                        cx={point.x}
                        cy={point.y}
                        r="1.7"
                      />
                    ))}
                  </svg>
                );
              })()}
              <div className="progress-graph__labels">
                {milestones.map((milestone) => (
                  <span key={milestone.id}>W{milestone.weekNumber}</span>
                ))}
              </div>
            </div>
            <div className="progress-graph__footer">
              <span>Start</span>
              <strong>Week by week</strong>
              <span>100%</span>
            </div>
          </article>
        </div>
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
