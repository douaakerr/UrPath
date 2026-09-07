import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  FolderKanban,
  MoreHorizontal,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useRoadmapStore } from "../../stores/roadmapStore";
import "../../style/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { getActiveRoadmap, getStats } = useRoadmapStore();

  const activeRoadmap = getActiveRoadmap();
  const { overallProgress, currentMilestone } = getStats();

  const milestones = activeRoadmap?.milestones || [];
  const focusGoals = activeRoadmap?.focusGoals || [];
  const doneGoalsCount = focusGoals.filter((g) => g.done).length;

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponses, setAiResponses] = useState([
    {
      sender: "ai",
      text: `Welcome to your UrPath Dashboard! You are currently on the "${activeRoadmap?.title}" path. How can I assist your study session today?`,
    },
  ]);

  const handleAskAi = (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const userQ = aiQuestion.trim();
    setAiResponses((prev) => [
      ...prev,
      { sender: "user", text: userQ },
      {
        sender: "ai",
        text: `Regarding "${userQ}": Focused study for 30 minutes on ${currentMilestone?.title || "your active module"} will give you maximum retention today. Let's get to work!`,
      },
    ]);
    setAiQuestion("");
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">YOUR LEARNING SPACE</p>

          <h1>
            Welcome back<span>.</span>
          </h1>

          <p className="dashboard-subtitle">
            Keep moving forward. Your path is waiting for you.
          </p>
        </div>

        <button className="dashboard-ai-button" onClick={() => setShowAiModal(true)}>
          <Sparkles size={17} />
          Ask AI
          <ArrowUpRight size={16} />
        </button>
      </header>

      {/* Dynamic Stats */}
      <section className="dashboard-stats">
        <article className="stat-card stat-card--progress">
          <div className="stat-card__top">
            <div className="stat-icon">
              <TrendingUp size={18} />
            </div>

            <span className="stat-label">OVERALL PROGRESS</span>
          </div>

          <div className="stat-card__value">
            <strong>{overallProgress}</strong>
            <span>%</span>
          </div>

          <div className="progress-bar">
            <span style={{ width: `${overallProgress}%`, transition: "width 0.4s ease" }} />
          </div>

          <p>{activeRoadmap?.title}</p>
        </article>

        <article className="stat-card">
          <div className="stat-card__top">
            <div className="stat-icon">
              <Flame size={18} />
            </div>

            <span className="stat-label">CURRENT STREAK</span>
          </div>

          <div className="stat-card__value">
            <strong>{activeRoadmap?.streak || 12}</strong>
            <span>days</span>
          </div>

          <p>You're building a solid habit.</p>
        </article>

        <article className="stat-card">
          <div className="stat-card__top">
            <div className="stat-icon">
              <Target size={18} />
            </div>

            <span className="stat-label">THIS WEEK</span>
          </div>

          <div className="stat-card__value">
            <strong>{doneGoalsCount}</strong>
            <span>/ {focusGoals.length}</span>
          </div>

          <p>Weekly learning goals</p>
        </article>

        <article className="stat-card">
          <div className="stat-card__top">
            <div className="stat-icon">
              <Clock3 size={18} />
            </div>

            <span className="stat-label">LEARNING TIME</span>
          </div>

          <div className="stat-card__value">
            <strong>{activeRoadmap?.learningTimeHours || 14}</strong>
            <span>h</span>
          </div>

          <p>This week</p>
        </article>
      </section>

      {/* Main grid */}
      <section className="dashboard-grid">
        {/* Roadmap Preview */}
        <article className="dashboard-panel dashboard-roadmap">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">YOUR PATH</span>
              <h2>{activeRoadmap?.title || "Learning roadmap"}</h2>
            </div>

            <button className="panel-action" onClick={() => navigate("/roadmap")}>
              View roadmap
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="roadmap-preview">
            <div className="roadmap-line" />

            {milestones.slice(0, 4).map((m) => {
              const isComp = m.status === "completed";
              const isCurr = m.status === "current";

              return (
                <div
                  key={m.id}
                  className={`roadmap-node ${
                    isComp
                      ? "roadmap-node--complete"
                      : isCurr
                      ? "roadmap-node--current"
                      : "roadmap-node--locked"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/roadmap")}
                >
                  <div className="roadmap-node__dot">
                    {isComp ? <CheckCircle2 size={15} /> : isCurr ? <span /> : null}
                  </div>

                  <div>
                    <span>
                      {isComp ? "COMPLETED" : isCurr ? "IN PROGRESS" : "UP NEXT"}
                    </span>
                    <strong>{m.title}</strong>

                    {isCurr && (
                      <>
                        <div className="node-progress">
                          <span style={{ width: `${m.progress || 0}%` }} />
                        </div>
                        <small>{m.progress || 0}% complete</small>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        {/* Continue Learning */}
        <article className="dashboard-panel continue-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">KEEP GOING</span>
              <h2>Continue learning</h2>
            </div>

            <button className="icon-button" onClick={() => navigate("/roadmap")}>
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="course-preview">
            <div className="course-preview__visual">
              <BookOpen size={27} />
            </div>

            <div className="course-preview__content">
              <span>MODULE</span>
              <h3>{currentMilestone?.title || "Machine Learning Foundations"}</h3>

              <div className="course-progress">
                <div>
                  <span>{currentMilestone?.progress || 0}% complete</span>
                  <span>
                    {currentMilestone?.completedLessonsCount ||
                      Math.round(((currentMilestone?.progress || 0) / 100) * (currentMilestone?.lessonsCount || 10))}{" "}
                    / {currentMilestone?.lessonsCount || 10} lessons
                  </span>
                </div>

                <div className="progress-bar">
                  <span style={{ width: `${currentMilestone?.progress || 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <button className="continue-button" onClick={() => navigate("/roadmap")}>
            <Play size={16} fill="currentColor" />
            Continue learning
          </button>
        </article>

        {/* Upcoming */}
        <article className="dashboard-panel upcoming-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">YOUR SCHEDULE</span>
              <h2>Upcoming</h2>
            </div>

            <button className="panel-action" onClick={() => navigate("/calendar")}>
              Calendar
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="upcoming-list">
            <div className="upcoming-item">
              <div className="upcoming-date">
                <span>SEP</span>
                <strong>04</strong>
              </div>

              <div>
                <span>MODULE</span>
                <strong>{currentMilestone?.title || "ML — Decision Trees"}</strong>
                <small>Today · 1 hour</small>
              </div>
            </div>

            <div className="upcoming-item">
              <div className="upcoming-date">
                <span>SEP</span>
                <strong>06</strong>
              </div>

              <div>
                <span>PROJECT</span>
                <strong>Data Analysis Project</strong>
                <small>In 2 days · Deadline</small>
              </div>
            </div>

            <div className="upcoming-item">
              <div className="upcoming-date">
                <span>SEP</span>
                <strong>08</strong>
              </div>

              <div>
                <span>MILESTONE</span>
                <strong>Deep Learning Module</strong>
                <small>Next week</small>
              </div>
            </div>
          </div>
        </article>

        {/* Active Projects */}
        <article className="dashboard-panel projects-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">BUILD SOMETHING</span>
              <h2>Active projects</h2>
            </div>

            <button className="panel-action" onClick={() => navigate("/projects")}>
              View all
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="project-list">
            <div className="project-item">
              <div className="project-icon">
                <FolderKanban size={18} />
              </div>

              <div className="project-info">
                <strong>Data Visualization Dashboard</strong>

                <div className="project-progress">
                  <span style={{ width: "72%" }} />
                </div>
              </div>

              <span>72%</span>
            </div>

            <div className="project-item">
              <div className="project-icon">
                <FolderKanban size={18} />
              </div>

              <div className="project-info">
                <strong>ML Prediction Model</strong>

                <div className="project-progress">
                  <span style={{ width: "38%" }} />
                </div>
              </div>

              <span>38%</span>
            </div>
          </div>
        </article>
      </section>

      {/* Bottom motivation */}
      <section className="dashboard-quote">
        <div className="dashboard-quote__icon">
          <Sparkles size={18} />
        </div>

        <div>
          <span>YOUR PATH · TODAY</span>
          <p>Progress doesn't need to be perfect. It just needs to keep moving.</p>
        </div>

        <CalendarDays size={20} />
      </section>

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "500px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={18} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: "16px" }}>UrPath AI Learning Assistant</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                maxHeight: "260px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "8px",
                background: "var(--bg-soft)",
                borderRadius: "10px",
              }}
            >
              {aiResponses.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    background: msg.sender === "user" ? "var(--color-primary)" : "var(--bg-surface)",
                    color: msg.sender === "user" ? "white" : "var(--text-primary)",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    maxWidth: "85%",
                    lineHeight: "1.4",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleAskAi} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Ask AI anything about your learning space..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                style={{
                  flex: 1,
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "9px",
                  padding: "8px 12px",
                  fontSize: "11px",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "9px",
                  padding: "0 14px",
                  fontSize: "11px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;