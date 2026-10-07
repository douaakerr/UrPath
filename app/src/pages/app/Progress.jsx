import { useEffect, useMemo, useState } from "react";
import { Activity, BookOpen, CheckCircle2, Clock3, ListChecks, Trophy } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getProgress } from "../../services/progressService";
import { getLearningLogs, getTodayLearningLogs } from "../../services/learningLogService";
import "../../style/progress.css";

function Progress() {
  const [progress, setProgress] = useState([]);
  const [logs, setLogs] = useState([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProgress(), getLearningLogs(), getTodayLearningLogs()])
      .then(([progressResponse, logsResponse, todayResponse]) => {
        setProgress(progressResponse?.progress || progressResponse?.data?.progress || []);
        setLogs(logsResponse?.learningLogs || logsResponse?.data?.learningLogs || []);
        setToday(todayResponse?.learningLogs ? todayResponse : todayResponse?.data || todayResponse);
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load progress."))
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => progress.reduce((acc, item) => ({
    tasks: acc.tasks + (item.completedTasks || 0),
    lessons: acc.lessons + (item.completedLessons || 0),
    quizzes: acc.quizzes + (item.completedQuizzes || 0),
    projects: acc.projects + (item.completedProjects || 0),
  }), { tasks: 0, lessons: 0, quizzes: 0, projects: 0 }), [progress]);

  const chartData = useMemo(() => [
    { name: "Tasks", value: totals.tasks },
    { name: "Lessons", value: totals.lessons },
    { name: "Quizzes", value: totals.quizzes },
    { name: "Projects", value: totals.projects },
  ], [totals]);

  if (loading) return <main className="progress-page"><div className="progress-state">Loading your progress...</div></main>;
  if (error) return <main className="progress-page"><div className="progress-state progress-state--error">{error}</div></main>;

  return (
    <main className="progress-page">
      <header className="progress-header">
        <div>
          <span className="progress-eyebrow">YOUR JOURNEY</span>
          <h1>Progress</h1>
          <p>See what you have completed and how consistently you are learning.</p>
        </div>
      </header>

      <section className="progress-stats">
        <div><ListChecks size={20} /><strong>{totals.tasks}</strong><span>Tasks completed</span></div>
        <div><BookOpen size={20} /><strong>{totals.lessons}</strong><span>Lessons completed</span></div>
        <div><Trophy size={20} /><strong>{totals.quizzes}</strong><span>Quizzes completed</span></div>
        <div><CheckCircle2 size={20} /><strong>{totals.projects}</strong><span>Projects completed</span></div>
      </section>

      <section className="progress-grid">
        <div className="progress-panel">
          <div className="progress-panel__heading">
            <h2>Roadmap progress</h2>
            <span>{progress.length} path{progress.length === 1 ? "" : "s"}</span>
          </div>

          {progress.length === 0 ? (
            <p className="progress-muted">Start a roadmap to see progress here.</p>
          ) : progress.map((item) => {
            const roadmap = item.roadmap || {};
            return (
              <div className="roadmap-progress" key={item._id}>
                <div className="roadmap-progress__top">
                  <div>
                    <strong>{roadmap.goal || roadmap.title || "Learning path"}</strong>
                    <span>{roadmap.domain || ""}</span>
                  </div>
                  <b>{item.percentage || 0}%</b>
                </div>
                <div className="progress-track"><span style={{ width: `${item.percentage || 0}%` }} /></div>
                <small>{item.currentTask || "Keep going — your next step will appear here."}</small>
              </div>
            );
          })}
        </div>

        <div className="progress-panel today-panel">
          <div className="progress-panel__heading"><h2>Today</h2><Activity size={18} /></div>
          <div className="today-number">{today?.totalMinutes || 0}<small> min</small></div>
          <p>learning time</p>
          <div className="today-points">
            <span><Trophy size={16} /> {today?.totalPoints || 0} points</span>
            <span><Clock3 size={16} /> {today?.count || 0} logs</span>
          </div>
        </div>
      </section>

      <section className="progress-panel progress-chart-panel">
        <div className="progress-panel__heading">
          <div>
            <h2>Work completed</h2>
            <span>Across your learning path</span>
          </div>
        </div>
        <div className="progress-chart">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#dce8f5" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#6f8196", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--chart-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#e8f3ff" }}
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--text-primary)",
                }}
              />
              <Bar dataKey="value" fill="#5ca9ff" radius={[5, 5, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="progress-panel logs-panel">
        <div className="progress-panel__heading"><h2>Learning history</h2><span>{logs.length} entries</span></div>
        {logs.length === 0 ? (
          <p className="progress-muted">Your learning logs will appear here.</p>
        ) : (
          <div className="logs-list">
            {logs.slice(0, 12).map((log) => (
              <article className="log-row" key={log._id}>
                <div><strong>{log.title}</strong><p>{log.learned}</p></div>
                <div className="log-meta"><span>{log.minutesSpent} min</span><span>+{log.points} pts</span></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Progress;
