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
} from "lucide-react";

import "../../style/dashboard.css";

function Dashboard() {
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

        <button className="dashboard-ai-button">
          <Sparkles size={17} />
          Ask AI
          <ArrowUpRight size={16} />
        </button>
      </header>

      {/* Stats */}
      <section className="dashboard-stats">
        <article className="stat-card stat-card--progress">
          <div className="stat-card__top">
            <div className="stat-icon">
              <TrendingUp size={18} />
            </div>

            <span className="stat-label">OVERALL PROGRESS</span>
          </div>

          <div className="stat-card__value">
            <strong>68</strong>
            <span>%</span>
          </div>

          <div className="progress-bar">
            <span style={{ width: "68%" }} />
          </div>

          <p>+8% from last week</p>
        </article>

        <article className="stat-card">
          <div className="stat-card__top">
            <div className="stat-icon">
              <Flame size={18} />
            </div>

            <span className="stat-label">CURRENT STREAK</span>
          </div>

          <div className="stat-card__value">
            <strong>12</strong>
            <span>days</span>
          </div>

          <p>You're building a habit.</p>
        </article>

        <article className="stat-card">
          <div className="stat-card__top">
            <div className="stat-icon">
              <Target size={18} />
            </div>

            <span className="stat-label">THIS WEEK</span>
          </div>

          <div className="stat-card__value">
            <strong>7</strong>
            <span>/ 10</span>
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
            <strong>14</strong>
            <span>h</span>
          </div>

          <p>This week</p>
        </article>
      </section>

      {/* Main grid */}
      <section className="dashboard-grid">
        {/* Roadmap */}
        <article className="dashboard-panel dashboard-roadmap">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">YOUR PATH</span>
              <h2>Learning roadmap</h2>
            </div>

            <button className="panel-action">
              View roadmap
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="roadmap-preview">
            <div className="roadmap-line" />

            <div className="roadmap-node roadmap-node--complete">
              <div className="roadmap-node__dot">
                <CheckCircle2 size={15} />
              </div>

              <div>
                <span>COMPLETED</span>
                <strong>Python Fundamentals</strong>
              </div>
            </div>

            <div className="roadmap-node roadmap-node--complete">
              <div className="roadmap-node__dot">
                <CheckCircle2 size={15} />
              </div>

              <div>
                <span>COMPLETED</span>
                <strong>Data Analysis</strong>
              </div>
            </div>

            <div className="roadmap-node roadmap-node--current">
              <div className="roadmap-node__dot">
                <span />
              </div>

              <div>
                <span>IN PROGRESS</span>
                <strong>Machine Learning</strong>

                <div className="node-progress">
                  <span style={{ width: "64%" }} />
                </div>

                <small>64% complete</small>
              </div>
            </div>

            <div className="roadmap-node roadmap-node--locked">
              <div className="roadmap-node__dot" />

              <div>
                <span>UP NEXT</span>
                <strong>Deep Learning</strong>
              </div>
            </div>
          </div>
        </article>

        {/* Continue */}
        <article className="dashboard-panel continue-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">KEEP GOING</span>
              <h2>Continue learning</h2>
            </div>

            <button className="icon-button">
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="course-preview">
            <div className="course-preview__visual">
              <BookOpen size={27} />
            </div>

            <div className="course-preview__content">
              <span>COURSE</span>
              <h3>Machine Learning Foundations</h3>

              <div className="course-progress">
                <div>
                  <span>64% complete</span>
                  <span>8 / 12 lessons</span>
                </div>

                <div className="progress-bar">
                  <span style={{ width: "64%" }} />
                </div>
              </div>
            </div>
          </div>

          <button className="continue-button">
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

            <button className="panel-action">
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
                <span>COURSE</span>
                <strong>ML — Decision Trees</strong>
                <small>Tomorrow · 1 hour</small>
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
                <small>In 3 days · Deadline</small>
              </div>
            </div>

            <div className="upcoming-item">
              <div className="upcoming-date">
                <span>SEP</span>
                <strong>08</strong>
              </div>

              <div>
                <span>LEARNING</span>
                <strong>Deep Learning Module</strong>
                <small>Next week</small>
              </div>
            </div>
          </div>
        </article>

        {/* Projects */}
        <article className="dashboard-panel projects-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">BUILD SOMETHING</span>
              <h2>Active projects</h2>
            </div>

            <button className="panel-action">
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
          <p>
            Progress doesn't need to be perfect. It just needs to keep moving.
          </p>
        </div>

        <CalendarDays size={20} />
      </section>
    </div>
  );
}

export default Dashboard;