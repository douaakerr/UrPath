import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Code2,
  Lock,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { useRoadmapStore } from "../../stores/roadmapStore";
import "../../style/roadmap.css";

function Roadmap() {
  const {
    activeRoadmapId,
    roadmaps,
    setActiveRoadmap,
    getActiveRoadmap,
    getStats,
    setMilestoneStatus,
    updateMilestoneProgress,
    addMilestone,
    editMilestone,
    deleteMilestone,
    toggleFocusGoal,
    addFocusGoal,
    deleteFocusGoal,
    createRoadmap,
    resetToDefaults,
  } = useRoadmapStore();

  const activeRoadmap = getActiveRoadmap();
  const { total, completed, remaining, overallProgress } = getStats();

  // Modals & UI States
  const [showAiModal, setShowAiModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateRoadmapModal, setShowCreateRoadmapModal] = useState(false);
  const [activeMenuMilestoneId, setActiveMenuMilestoneId] = useState(null);
  const [activeLearningMilestone, setActiveLearningMilestone] = useState(null);

  // New Milestone Form State
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [newMilestoneLessons, setNewMilestoneLessons] = useState(6);
  const [newMilestoneHours, setNewMilestoneHours] = useState(10);
  const [newMilestoneProjects, setNewMilestoneProjects] = useState(1);

  // Edit Milestone Form State
  const [editingMilestone, setEditingMilestone] = useState(null);

  // Focus Goal Input State
  const [newGoalText, setNewGoalText] = useState("");

  // Create Roadmap Form State
  const [newRoadmapTitle, setNewRoadmapTitle] = useState("");
  const [newRoadmapSub, setNewRoadmapSub] = useState("");

  // AI Prompt State
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponses, setAiResponses] = useState([
    {
      sender: "ai",
      text: `Hello! I'm your UrPath AI Learning Guide. You are currently focusing on "${
        activeRoadmap?.title
      }". How can I help you tackle your next milestone?`,
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
        text: `Great question about "${userQ}"! For your ${activeRoadmap.title} path, I recommend reviewing your current milestone topics, building a mini-project, and checking off 1 key task every day. Keep up the momentum!`,
      },
    ]);
    setAiQuestion("");
  };

  const handleAddMilestoneSubmit = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    addMilestone({
      title: newMilestoneTitle,
      description: newMilestoneDesc,
      lessonsCount: newMilestoneLessons,
      hours: newMilestoneHours,
      projectsCount: newMilestoneProjects,
      status: "upcoming",
    });

    setNewMilestoneTitle("");
    setNewMilestoneDesc("");
    setShowAddModal(false);
  };

  const handleEditMilestoneSubmit = (e) => {
    e.preventDefault();
    if (!editingMilestone || !editingMilestone.title.trim()) return;

    editMilestone(editingMilestone.id, {
      title: editingMilestone.title,
      description: editingMilestone.description,
      lessonsCount: editingMilestone.lessonsCount,
      hours: editingMilestone.hours,
      projectsCount: editingMilestone.projectsCount,
    });

    setEditingMilestone(null);
  };

  const handleCreateRoadmapSubmit = (e) => {
    e.preventDefault();
    if (!newRoadmapTitle.trim()) return;

    createRoadmap({
      title: newRoadmapTitle,
      subtitle: newRoadmapSub,
    });

    setNewRoadmapTitle("");
    setNewRoadmapSub("");
    setShowCreateRoadmapModal(false);
  };

  const handleAddGoalSubmit = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    addFocusGoal(newGoalText);
    setNewGoalText("");
  };

  return (
    <div className="roadmap-page">
      {/* HEADER */}
      <header className="roadmap-header">
        <div className="roadmap-header__content">
          <p className="roadmap-eyebrow">YOUR LEARNING JOURNEY</p>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h1>
              My <span>Roadmap</span>
            </h1>

            {/* Selector for active roadmap */}
            <select
              value={activeRoadmapId}
              onChange={(e) => {
                if (e.target.value === "__NEW__") {
                  setShowCreateRoadmapModal(true);
                } else {
                  setActiveRoadmap(e.target.value);
                }
              }}
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: "9px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {Object.values(roadmaps).map((rm) => (
                <option key={rm.id} value={rm.id}>
                  {rm.title}
                </option>
              ))}
              <option value="__NEW__">+ Create Custom Roadmap</option>
            </select>
          </div>

          <p className="roadmap-subtitle">{activeRoadmap?.subtitle}</p>
        </div>

        <div className="roadmap-header__actions">
          <button
            className="roadmap-secondary-button"
            title="Roadmap Settings"
            onClick={() => setShowSettingsModal(true)}
          >
            <MoreHorizontal size={17} />
          </button>

          <button className="roadmap-ai-button" onClick={() => setShowAiModal(true)}>
            <Sparkles size={16} />
            Ask AI
            <ArrowUpRight size={15} />
          </button>
        </div>
      </header>

      {/* OVERVIEW */}
      <section className="roadmap-overview">
        <div className="roadmap-overview__main">
          <div className="roadmap-overview__top">
            <div>
              <span className="roadmap-label">CURRENT ROADMAP</span>
              <h2>{activeRoadmap?.title}</h2>
            </div>

            <div className="roadmap-progress-number">
              <strong>{overallProgress}</strong>
              <span>%</span>
            </div>
          </div>

          <div className="roadmap-overview__bar">
            <span style={{ width: `${overallProgress}%`, transition: "width 0.4s ease" }} />
          </div>

          <div className="roadmap-overview__bottom">
            <span>
              {completed} of {total} milestones completed
            </span>
            <span>
              {overallProgress === 100
                ? "🎉 You have completed this roadmap!"
                : "Keep going — you're making steady progress."}
            </span>
          </div>
        </div>

        <div className="roadmap-overview__stats">
          <div className="roadmap-mini-stat">
            <div className="roadmap-mini-stat__icon roadmap-mini-stat__icon--blue">
              <Target size={16} />
            </div>
            <div>
              <strong>{total}</strong>
              <span>Milestones</span>
            </div>
          </div>

          <div className="roadmap-mini-stat">
            <div className="roadmap-mini-stat__icon roadmap-mini-stat__icon--green">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <strong>{completed}</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="roadmap-mini-stat">
            <div className="roadmap-mini-stat__icon roadmap-mini-stat__icon--orange">
              <Clock3 size={16} />
            </div>
            <div>
              <strong>{remaining}</strong>
              <span>Remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP LAYOUT */}
      <div className="roadmap-layout">
        {/* MAIN PATH */}
        <main className="roadmap-path">
          <div className="roadmap-section-header">
            <div>
              <span className="roadmap-label">YOUR PATH</span>
              <h2>Learning milestones</h2>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                className="roadmap-ai-button"
                style={{ height: "30px", fontSize: "10px", padding: "0 10px" }}
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={13} />
                Add Milestone
              </button>

              <button className="roadmap-view-button" onClick={() => setShowSettingsModal(true)}>
                Roadmap settings
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="roadmap-timeline">
            {activeRoadmap?.milestones?.map((step) => {
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";
              const isLocked = step.status === "locked";

              return (
                <article
                  key={step.id}
                  className={`roadmap-step roadmap-step--${step.status}`}
                >
                  <div className="roadmap-step__rail">
                    <div
                      className="roadmap-step__node"
                      style={{ cursor: "pointer" }}
                      title="Click to toggle status"
                      onClick={() => {
                        const statusCycle = {
                          upcoming: "current",
                          current: "completed",
                          completed: "locked",
                          locked: "upcoming",
                        };
                        setMilestoneStatus(step.id, statusCycle[step.status] || "upcoming");
                      }}
                    >
                      {isCompleted ? (
                        <Check size={15} strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <span />
                      ) : isLocked ? (
                        <Lock size={12} />
                      ) : (
                        <Circle size={11} />
                      )}
                    </div>
                  </div>

                  <div className="roadmap-step__card">
                    <div className="roadmap-step__top">
                      <div>
                        <span className="roadmap-step__status">
                          {isCompleted
                            ? "COMPLETED"
                            : isCurrent
                            ? "CURRENT MILESTONE"
                            : isLocked
                            ? "LOCKED"
                            : "UP NEXT"}
                        </span>
                        <h3>{step.title}</h3>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="roadmap-step__number">{step.number}</span>
                        <div style={{ position: "relative" }}>
                          <button
                            className="roadmap-step-more"
                            style={{ width: "24px", height: "24px" }}
                            onClick={() =>
                              setActiveMenuMilestoneId(
                                activeMenuMilestoneId === step.id ? null : step.id
                              )
                            }
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {activeMenuMilestoneId === step.id && (
                            <div
                              style={{
                                position: "absolute",
                                right: 0,
                                top: "28px",
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                boxShadow: "var(--shadow-soft)",
                                zIndex: 10,
                                width: "160px",
                                overflow: "hidden",
                              }}
                            >
                              <button
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "8px 12px",
                                  fontSize: "10px",
                                  background: "none",
                                  border: "none",
                                  color: "var(--text-primary)",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setEditingMilestone(step);
                                  setActiveMenuMilestoneId(null);
                                }}
                              >
                                ✏️ Edit Details
                              </button>
                              <button
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "8px 12px",
                                  fontSize: "10px",
                                  background: "none",
                                  border: "none",
                                  color: "var(--text-primary)",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setMilestoneStatus(step.id, "completed");
                                  setActiveMenuMilestoneId(null);
                                }}
                              >
                                ✅ Mark Completed
                              </button>
                              <button
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "8px 12px",
                                  fontSize: "10px",
                                  background: "none",
                                  border: "none",
                                  color: "var(--text-primary)",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setMilestoneStatus(step.id, "current");
                                  setActiveMenuMilestoneId(null);
                                }}
                              >
                                🎯 Set as Current
                              </button>
                              <button
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "8px 12px",
                                  fontSize: "10px",
                                  background: "none",
                                  border: "none",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  deleteMilestone(step.id);
                                  setActiveMenuMilestoneId(null);
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p>{step.description}</p>

                    {(isCurrent || step.progress > 0) && (
                      <div className="roadmap-step__progress">
                        <div className="roadmap-step__progress-top">
                          <span>Progress</span>
                          <strong>{step.progress}%</strong>
                        </div>
                        <div className="roadmap-progress-bar">
                          <span
                            style={{
                              width: `${step.progress}%`,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="roadmap-step__meta">
                      <span>
                        <BookOpen size={13} />
                        {step.lessonsCount} lessons
                      </span>
                      <span>
                        <Clock3 size={13} />
                        {step.hours}h
                      </span>
                      {step.projectsCount && (
                        <span>
                          <Code2 size={13} />
                          {step.projectsCount} project{step.projectsCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {isCompleted && (
                        <span>
                          <Trophy size={13} />
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="roadmap-step__actions">
                      <button
                        className="roadmap-continue-button"
                        onClick={() => setActiveLearningMilestone(step)}
                      >
                        {isCompleted
                          ? "Review lessons"
                          : isCurrent
                          ? "Continue learning"
                          : "Start milestone"}
                        <ArrowRight size={15} />
                      </button>

                      {/* Interactive quick progress slider / controls */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={step.progress || 0}
                        onChange={(e) =>
                          updateMilestoneProgress(step.id, Number(e.target.value))
                        }
                        title={`Adjust progress (${step.progress || 0}%)`}
                        style={{
                          width: "90px",
                          accentColor: "var(--color-primary)",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="roadmap-sidebar">
          {/* AI RECOMMENDATION CARD */}
          <section className="roadmap-ai-card">
            <div className="roadmap-ai-card__icon">
              <Sparkles size={18} />
            </div>

            <span className="roadmap-label">AI INSIGHT</span>

            <h3>You're on track to level up.</h3>

            <p>
              {overallProgress > 50
                ? "You have passed the halfway mark! Consistently completing your current milestone will unlock your target goals."
                : "Building daily consistency is key. Work through your current lessons and complete your weekly goals."}
            </p>

            <button onClick={() => setShowAiModal(true)}>
              Ask AI for guidance
              <ArrowRight size={14} />
            </button>
          </section>

          {/* CURRENT FOCUS CARD */}
          <section className="roadmap-focus-card">
            <div className="roadmap-sidebar-heading">
              <div>
                <span className="roadmap-label">CURRENT FOCUS</span>
                <h3>This week</h3>
              </div>
              <Target size={17} />
            </div>

            {(() => {
              const goals = activeRoadmap?.focusGoals || [];
              const doneCount = goals.filter((g) => g.done).length;
              const focusPct = goals.length > 0 ? Math.round((doneCount / goals.length) * 100) : 0;

              return (
                <>
                  <div className="roadmap-focus-progress">
                    <div>
                      <strong>
                        {doneCount} / {goals.length}
                      </strong>
                      <span>learning goals</span>
                    </div>

                    <div className="roadmap-focus-bar">
                      <span style={{ width: `${focusPct}%`, transition: "width 0.3s ease" }} />
                    </div>
                  </div>

                  <div className="roadmap-focus-list">
                    {goals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`roadmap-focus-item ${
                          goal.done ? "roadmap-focus-item--done" : ""
                        }`}
                        style={{ cursor: "pointer", justifyContent: "space-between" }}
                      >
                        <div
                          style={{ display: "flex", alignItems: "center", gap: "8px" }}
                          onClick={() => toggleFocusGoal(goal.id)}
                        >
                          {goal.done ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                          <span
                            style={{
                              textDecoration: goal.done ? "line-through" : "none",
                            }}
                          >
                            {goal.text}
                          </span>
                        </div>

                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: "2px",
                          }}
                          onClick={() => deleteFocusGoal(goal.id)}
                          title="Delete goal"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add goal inline form */}
                  <form
                    onSubmit={handleAddGoalSubmit}
                    style={{ marginTop: "12px", display: "flex", gap: "6px" }}
                  >
                    <input
                      type="text"
                      placeholder="Add weekly goal..."
                      value={newGoalText}
                      onChange={(e) => setNewGoalText(e.target.value)}
                      style={{
                        flex: 1,
                        background: "var(--bg-soft)",
                        border: "1px solid var(--border)",
                        borderRadius: "7px",
                        padding: "4px 8px",
                        fontSize: "9px",
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
                        borderRadius: "7px",
                        padding: "0 8px",
                        fontSize: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <Plus size={13} />
                    </button>
                  </form>
                </>
              );
            })()}
          </section>

          {/* ROADMAP INFO CARD */}
          <section className="roadmap-info-card">
            <div className="roadmap-sidebar-heading">
              <div>
                <span className="roadmap-label">ROADMAP</span>
                <h3>Your journey</h3>
              </div>
            </div>

            <div className="roadmap-info-list">
              <div>
                <span>Started</span>
                <strong>{activeRoadmap?.startDate || "Aug 12, 2026"}</strong>
              </div>

              <div>
                <span>Est. completion</span>
                <strong>{activeRoadmap?.estCompletion || "Dec 2026"}</strong>
              </div>

              <div>
                <span>Learning pace</span>
                <strong>{activeRoadmap?.pace || "5h / week"}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* =====================================================
          MODALS & DRAWERS
          ===================================================== */}

      {/* AI ASSISTANT MODAL */}
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
                placeholder="Ask AI anything about your roadmap..."
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

      {/* ADD MILESTONE MODAL */}
      {showAddModal && (
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
          <form
            onSubmit={handleAddMilestoneSubmit}
            style={{
              width: "90%",
              maxWidth: "450px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "15px" }}>Add New Milestone</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Advanced Neural Networks"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "11px",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Description
              </label>
              <textarea
                rows="3"
                placeholder="Describe what you will master..."
                value={newMilestoneDesc}
                onChange={(e) => setNewMilestoneDesc(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "11px",
                  color: "var(--text-primary)",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <div>
                <label style={{ fontSize: "9px", color: "var(--text-muted)" }}>Lessons</label>
                <input
                  type="number"
                  min="1"
                  value={newMilestoneLessons}
                  onChange={(e) => setNewMilestoneLessons(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--bg-soft)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "6px",
                    fontSize: "11px",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "9px", color: "var(--text-muted)" }}>Hours</label>
                <input
                  type="number"
                  min="1"
                  value={newMilestoneHours}
                  onChange={(e) => setNewMilestoneHours(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--bg-soft)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "6px",
                    fontSize: "11px",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "9px", color: "var(--text-muted)" }}>Projects</label>
                <input
                  type="number"
                  min="0"
                  value={newMilestoneProjects}
                  onChange={(e) => setNewMilestoneProjects(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--bg-soft)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "6px",
                    fontSize: "11px",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: "10px",
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "9px",
                padding: "10px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Add Milestone
            </button>
          </form>
        </div>
      )}

      {/* EDIT MILESTONE MODAL */}
      {editingMilestone && (
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
          <form
            onSubmit={handleEditMilestoneSubmit}
            style={{
              width: "90%",
              maxWidth: "450px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "15px" }}>Edit Milestone</h3>
              <button
                type="button"
                onClick={() => setEditingMilestone(null)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Title
              </label>
              <input
                type="text"
                required
                value={editingMilestone.title}
                onChange={(e) =>
                  setEditingMilestone({ ...editingMilestone, title: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "11px",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Description
              </label>
              <textarea
                rows="3"
                value={editingMilestone.description}
                onChange={(e) =>
                  setEditingMilestone({ ...editingMilestone, description: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "11px",
                  color: "var(--text-primary)",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <div>
                <label style={{ fontSize: "9px", color: "var(--text-muted)" }}>Lessons</label>
                <input
                  type="number"
                  value={editingMilestone.lessonsCount}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      lessonsCount: Number(e.target.value),
                    })
                  }
                  style={{
                    width: "100%",
                    background: "var(--bg-soft)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "6px",
                    fontSize: "11px",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "9px", color: "var(--text-muted)" }}>Hours</label>
                <input
                  type="number"
                  value={editingMilestone.hours}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      hours: Number(e.target.value),
                    })
                  }
                  style={{
                    width: "100%",
                    background: "var(--bg-soft)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "6px",
                    fontSize: "11px",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "9px", color: "var(--text-muted)" }}>Projects</label>
                <input
                  type="number"
                  value={editingMilestone.projectsCount}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      projectsCount: Number(e.target.value),
                    })
                  }
                  style={{
                    width: "100%",
                    background: "var(--bg-soft)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "6px",
                    fontSize: "11px",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: "10px",
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "9px",
                padding: "10px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* CREATE NEW ROADMAP MODAL */}
      {showCreateRoadmapModal && (
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
          <form
            onSubmit={handleCreateRoadmapSubmit}
            style={{
              width: "90%",
              maxWidth: "450px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "15px" }}>Create Custom Roadmap</h3>
              <button
                type="button"
                onClick={() => setShowCreateRoadmapModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Roadmap Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cybersecurity Specialist"
                value={newRoadmapTitle}
                onChange={(e) => setNewRoadmapTitle(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "11px",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Subtitle / Description
              </label>
              <input
                type="text"
                placeholder="Network security, ethical hacking, threat analysis..."
                value={newRoadmapSub}
                onChange={(e) => setNewRoadmapSub(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "11px",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "10px",
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "9px",
                padding: "10px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Create & Activate Roadmap
            </button>
          </form>
        </div>
      )}

      {/* SETTINGS / RESET MODAL */}
      {showSettingsModal && (
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
              maxWidth: "400px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "15px" }}>Roadmap Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Manage your active roadmap configurations or reset all milestones and goals back to initial defaults.
            </p>

            <button
              onClick={() => {
                resetToDefaults();
                setShowSettingsModal(false);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "9px",
                padding: "10px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} />
              Reset All Roadmaps to Default
            </button>
          </div>
        </div>
      )}

      {/* INTERACTIVE LEARNING MODAL */}
      {activeLearningMilestone && (
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
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="roadmap-label">MILESTONE LESSONS</span>
                <h3 style={{ margin: "4px 0 0", fontSize: "16px" }}>
                  {activeLearningMilestone.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLearningMilestone(null)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: "11px", color: "var(--text-secondary)" }}>
              {activeLearningMilestone.description}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {Array.from({ length: activeLearningMilestone.lessonsCount || 5 }).map((_, idx) => {
                const lessonNum = idx + 1;
                const pctPerLesson = 100 / (activeLearningMilestone.lessonsCount || 5);
                const isLessonDone =
                  (activeLearningMilestone.progress || 0) >= lessonNum * pctPerLesson - 1;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      const newProgress = Math.round(lessonNum * pctPerLesson);
                      updateMilestoneProgress(
                        activeLearningMilestone.id,
                        isLessonDone ? Math.round((lessonNum - 1) * pctPerLesson) : newProgress
                      );
                      // Update local ref
                      setActiveLearningMilestone((prev) => ({
                        ...prev,
                        progress: isLessonDone
                          ? Math.round((lessonNum - 1) * pctPerLesson)
                          : newProgress,
                      }));
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      background: isLessonDone ? "rgba(66, 194, 159, 0.08)" : "var(--bg-soft)",
                      border: "1px solid",
                      borderColor: isLessonDone ? "rgba(66, 194, 159, 0.2)" : "var(--border)",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "11px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {isLessonDone ? (
                        <CheckCircle2 size={16} color="#39b38f" />
                      ) : (
                        <Circle size={16} color="var(--text-muted)" />
                      )}
                      <span style={{ fontWeight: isLessonDone ? "600" : "400" }}>
                        Lesson {lessonNum}: Core Concepts & Exercises
                      </span>
                    </div>

                    <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                      {isLessonDone ? "Completed" : "Start"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "600" }}>
                Overall Progress: {activeLearningMilestone.progress || 0}%
              </span>
              <button
                onClick={() => {
                  setMilestoneStatus(activeLearningMilestone.id, "completed");
                  setActiveLearningMilestone(null);
                }}
                style={{
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "9px",
                  padding: "8px 14px",
                  fontSize: "11px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Mark Milestone Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roadmap;
