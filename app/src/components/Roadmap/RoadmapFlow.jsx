import {
  BookOpen,
  Check,
  ChevronRight,
  Circle,
  FolderKanban,
  PlayCircle,
  Trophy,
} from "lucide-react";
import "../../style/roadmap.css";

function getTaskIcon(type) {
  if (type === "project") return <FolderKanban size={15} />;
  if (type === "quiz") return <Trophy size={15} />;
  return <BookOpen size={15} />;
}

function RoadmapFlow({
  roadmap,
  courses = [],
  generatingTaskId,
  onTaskAction,
}) {
  const milestones = roadmap?.milestones || [];

  if (!roadmap) {
    return (
      <div className="roadmap-empty">
        <h2>No roadmap yet</h2>
        <p>Complete your learning assessment to create your path.</p>
      </div>
    );
  }

  return (
    <div className="roadmap-board">
      {milestones.map((milestone, index) => {
        const tasks = milestone.tasks || [];

        return (
          <section
            className={`roadmap-week ${milestone.status === "current" ? "roadmap-week--current" : ""} ${milestone.status === "completed" ? "roadmap-week--completed" : ""}`}
            key={milestone.id}
          >
            <div className="roadmap-week__header">
              <div className="roadmap-week__number">
                {String(milestone.weekNumber || index + 1).padStart(2, "0")}
              </div>

              <div className="roadmap-week__heading">
                <span>WEEK {milestone.weekNumber || index + 1}</span>
                <h3>{milestone.title}</h3>
                {milestone.description && <p>{milestone.description}</p>}
              </div>

              <div className="roadmap-week__progress">
                <strong>{milestone.progress || 0}%</strong>
                <div>
                  <span style={{ width: `${milestone.progress || 0}%` }} />
                </div>
              </div>
            </div>

            {milestone.topics?.length > 0 && (
              <div className="roadmap-topics">
                {milestone.topics.map((topic, topicIndex) => (
                  <span key={`${topic}-${topicIndex}`}>{topic}</span>
                ))}
              </div>
            )}

            <div className="roadmap-task-list">
              {tasks.length === 0 && (
                <p className="roadmap-no-tasks">No tasks were added to this week.</p>
              )}

              {tasks.map((task, taskIndex) => {
                const course = courses.find(
                  (item) => String(item.taskId) === String(task._id),
                );
                const completed = Boolean(task.completed);
                const generating = generatingTaskId === task._id;

                return (
                  <article
                    className={`roadmap-task ${completed ? "roadmap-task--completed" : ""}`}
                    key={task._id || `${milestone.id}-${taskIndex}`}
                  >
                    <div className="roadmap-task__status">
                      {completed ? (
                        <span className="roadmap-task__done"><Check size={14} /></span>
                      ) : (
                        <Circle size={17} />
                      )}
                    </div>

                    <div className="roadmap-task__icon">
                      {getTaskIcon(task.type)}
                    </div>

                    <div className="roadmap-task__content">
                      <div className="roadmap-task__top">
                        <span className="roadmap-task__type">{task.type || "lesson"}</span>
                        {completed && <span className="roadmap-task__completed">Completed</span>}
                      </div>
                      <h4>{task.title}</h4>
                    </div>

                    {!completed ? (
                      <button
                        type="button"
                        className="roadmap-task__action"
                        disabled={generating}
                        onClick={() => onTaskAction?.({ task, milestone, course })}
                      >
                        {generating ? (
                          "Generating..."
                        ) : course ? (
                          <>Continue <ChevronRight size={15} /></>
                        ) : task.type === "project" ? (
                          <>Open project <ChevronRight size={15} /></>
                        ) : task.type === "quiz" ? (
                          <>Open quiz <ChevronRight size={15} /></>
                        ) : (
                          <>Start course <PlayCircle size={15} /></>
                        )}
                      </button>
                    ) : (
                      <div className="roadmap-task__complete-icon"><Check size={15} /></div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default RoadmapFlow;
