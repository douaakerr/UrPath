import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  ExternalLink,
  FileText,
  MessageCircle,
  PlayCircle,
  Video,
  Send,
  Target,
} from "lucide-react";
import { Link, useParams } from "react-router";
import {
  completeLesson,
  getCourseById,
  getCourseProgress,
} from "../../services/courseService";
import { sendLearningChat } from "../../services/aiService";
import { useRoadmapStore } from "../../stores/roadmapStore";
import "../../style/courses.css";

function unwrap(response, key) {
  return response?.[key] || response?.data?.[key] || response?.data || response;
}


function formatInline(text) {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^\)]+\))/g;
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith("**")) parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("*")) parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    else {
      const link = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
      if (link && /^https?:\/\//i.test(link[2])) parts.push(<a key={match.index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>);
      else parts.push(token);
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function LessonMarkdown({ content = "" }) {
  const normalized = String(content)
    .replace(/\\([#*_<>])/g, "$1")
    .replace(/\\n/g, "\n")
    .replace(/[ \t]{2,}(?=\S)/g, "\n")
    .replace(/<details[^>]*>/gi, "")
    .replace(/<summary[^>]*>/gi, "")
    .replace(/<\/summary>/gi, "")
    .replace(/<\/details>/gi, "");
  const lines = normalized.split("\n");
  const blocks = [];
  let paragraph = [];
  let listItems = [];
  let listType = "";
  let tableRows = [];
  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={"p-" + blocks.length}>{formatInline(paragraph.join(" "))}</p>);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (!listItems.length) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    blocks.push(<Tag key={"list-" + blocks.length}>{listItems.map((item, index) => <li key={index}>{formatInline(item)}</li>)}</Tag>);
    listItems = [];
    listType = "";
  };
  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows.filter((row) => !/^\s*\|?\s*:?-{3,}/.test(row));
    const cells = rows.map((row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()));
    blocks.push(<div className="lesson-table-wrap" key={"table-" + blocks.length}><table className="lesson-table"><tbody>{cells.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => { const Cell = ri === 0 ? "th" : "td"; return <Cell key={ci}>{formatInline(cell)}</Cell>; })}</tr>)}</tbody></table></div>);
    tableRows = [];
  };
  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) { flushParagraph(); flushList(); flushTable(); return; }
    if (line.startsWith("|") && line.includes("|", 1)) { flushParagraph(); flushList(); tableRows.push(line); return; }
    flushTable();
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      const Tag = "h" + Math.min(heading[1].length + 2, 6);
      blocks.push(<Tag key={"h-" + blocks.length}>{formatInline(heading[2].replace(/\*\*/g, ""))}</Tag>);
      return;
    }
    const bullet = line.match(/^[-*+]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const nextType = numbered ? "ol" : "ul";
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      listItems.push((bullet || numbered)[1]);
      return;
    }
    if (/^>\s?/.test(line)) {
      flushParagraph(); flushList();
      blocks.push(<blockquote key={"q-" + blocks.length}>{formatInline(line.replace(/^>\s?/, ""))}</blockquote>);
      return;
    }
    flushList();
    paragraph.push(line.replace(/\s{2,}/g, " "));
  });
  flushParagraph(); flushList(); flushTable();
  return <div className="lesson-markdown">{blocks}</div>;
}

function CourseDetails() {
  const { courseId } = useParams();
  const fetchRoadmaps = useRoadmapStore((state) => state.fetchRoadmaps);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const loadCourse = async () => {
    const [courseResponse, progressResponse] = await Promise.all([
      getCourseById(courseId),
      getCourseProgress(courseId),
    ]);

    const nextCourse = unwrap(courseResponse, "course");
    setCourse(nextCourse);
    setProgress(unwrap(progressResponse, "progress"));
  };

  useEffect(() => {
    let mounted = true;

    Promise.all([getCourseById(courseId), getCourseProgress(courseId)])
      .then(([courseResponse, progressResponse]) => {
        if (!mounted) return;

        const nextCourse = unwrap(courseResponse, "course");
        setCourse(nextCourse);
        setProgress(unwrap(progressResponse, "progress"));

        if (nextCourse?.lessons?.length) {
          const firstIncomplete = nextCourse.lessons.find(
            (lesson) => !lesson.completed,
          );
          setActiveLessonId(
            firstIncomplete?._id || nextCourse.lessons[0]._id,
          );
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load this course.",
          );
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [courseId]);

  const lessons = useMemo(
    () =>
      [...(course?.lessons || [])].sort(
        (a, b) => (a.order || 0) - (b.order || 0),
      ),
    [course],
  );

  const activeLesson =
    lessons.find((lesson) => lesson._id === activeLessonId) ||
    lessons[0];

  const handleComplete = async () => {
    if (!activeLesson || activeLesson.completed || actionLoading) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      await completeLesson(courseId, activeLesson._id);
      await loadCourse();
      await fetchRoadmaps();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to complete this lesson.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleAskAI = async (event) => {
    event.preventDefault();

    const message = aiMessage.trim();

    if (!message || !activeLesson || aiLoading) return;

    setAiMessages((current) => [
      ...current,
      { role: "user", text: message },
    ]);
    setAiMessage("");
    setAiLoading(true);
    setAiError("");

    try {
      const response = await sendLearningChat({
        domain: course.domain,
        subdomain: course.subdomain,
        goal: course.title,
        level: course.level,
        courseTitle: course.title,
        lessonTitle: activeLesson.title,
        lessonContent: activeLesson.content,
        message,
      });

      setAiMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            response?.answer ||
            "I couldn't generate an answer.",
        },
      ]);
    } catch (err) {
      setAiError(
        err.response?.data?.message ||
          "Unable to reach UrPath AI.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="course-details-page">
        <div className="courses-state">Loading course...</div>
      </main>
    );
  }

  if (error && !course) {
    return (
      <main className="course-details-page">
        <div className="courses-state courses-state--error">
          {error}
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="course-details-page">
        <div className="courses-state">Course not found.</div>
      </main>
    );
  }

  const percentage =
    progress?.percentage ?? course.progressPercentage ?? 0;

  return (
    <main className="course-details-page">
      <Link to="/courses" className="course-back">
        <ArrowLeft size={17} />
        Courses
      </Link>

      <header className="course-hero">
        <div className="course-hero__copy">
          <span className="courses-eyebrow">
            {course.domain || "LEARNING COURSE"}
          </span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>

          <div className="course-hero__meta">
            <span>
              <Clock3 size={16} />
              Week {course.weekNumber}
            </span>
            <span>{course.level || "beginner"}</span>
            <span>{lessons.length} lessons</span>
          </div>
        </div>

        <div className="course-hero__progress">
          <strong>{percentage}%</strong>
          <span>course progress</span>
          <div className="course-card__progress-track">
            <span style={{ width: `${percentage}%` }} />
          </div>
        </div>
      </header>

      <div className="course-learning-layout">
        <aside className="lesson-list">
          <div className="lesson-list__header">
            <span>Course outline</span>
            <strong>
              {progress?.completedLessons ??
                lessons.filter((lesson) => lesson.completed).length}
              /{lessons.length}
            </strong>
          </div>

          {lessons.map((lesson, index) => (
            <button
              type="button"
              key={lesson._id}
              className={`lesson-item ${lesson._id === activeLesson?._id ? "lesson-item--active" : ""}`}
              onClick={() => {
                setActiveLessonId(lesson._id);
                setAiOpen(false);
                setAiMessages([]);
                setAiError("");
              }}
            >
              <span
                className={`lesson-item__number ${lesson.completed ? "lesson-item__number--done" : ""}`}
              >
                {lesson.completed ? <Check size={14} /> : index + 1}
              </span>

              <span>
                <strong>{lesson.title}</strong>
                <small>{lesson.estimatedMinutes || 15} min</small>
              </span>
            </button>
          ))}
        </aside>

        <article className="lesson-content">
          {activeLesson ? (
            <>
              <div className="lesson-content__header">
                <div>
                  <span className="courses-eyebrow">
                    LESSON {activeLesson.order || ""}
                  </span>
                  <h2>{activeLesson.title}</h2>
                </div>

                {activeLesson.completed && (
                  <span className="lesson-complete-badge">
                    <Check size={15} />
                    Completed
                  </span>
                )}
              </div>

              {activeLesson.summary && (
                <p className="lesson-summary">
                  {activeLesson.summary}
                </p>
              )}

              {activeLesson.objectives?.length > 0 && (
                <section className="lesson-section">
                  <div className="lesson-section__title">
                    <Target size={18} />
                    Learning objectives
                  </div>
                  <ul>
                    {activeLesson.objectives.map(
                      (objective, index) => (
                        <li key={index}>{objective}</li>
                      ),
                    )}
                  </ul>
                </section>
              )}

              <section className="lesson-section lesson-section--content">
                <div className="lesson-section__title">
                  <FileText size={18} />
                  Lesson
                </div>
                <LessonMarkdown content={activeLesson.content} />
              </section>

              {activeLesson.resources?.length > 0 && (
                <section className="lesson-section">
                  <div className="lesson-section__title">
                    <ExternalLink size={18} />
                    Resources
                  </div>

                  <div className="resource-list">
                    {activeLesson.resources.map((resource) => {
                      const content = (
                        <>
                          <span className="resource-item__icon">
                            <PlayCircle size={17} />
                          </span>
                          <span>
                            <strong>{resource.title}</strong>
                            <small>
                              {resource.provider ||
                                resource.type}
                              {resource.duration
                                ? ` · ${resource.duration} min`
                                : ""}
                            </small>
                          </span>
                          {resource.url && (
                            <ExternalLink size={15} />
                          )}
                        </>
                      );

                      if (!resource.url) {
                        return (
                          <div
                            className="resource-item resource-item--unavailable"
                            key={resource._id}
                          >
                            {content}
                          </div>
                        );
                      }

                      return (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="resource-item"
                          key={resource._id}
                        >
                          {content}
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}


              <section className="lesson-section lesson-recommendations">
                <div className="lesson-section__title">
                  <Video size={18} />
                  Keep learning
                </div>
                <p className="lesson-recommendations__intro">
                  Explore videos and trusted learning material related to this lesson.
                </p>
                <div className="lesson-recommendations__grid">
                  <a
                    className="lesson-recommendation"
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${course.domain || ""} ${course.title} ${activeLesson.title} tutorial`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="lesson-recommendation__icon"><Video size={19} /></span>
                    <span><strong>Find a lesson video</strong><small>YouTube search for this topic</small></span>
                    <ExternalLink size={14} />
                  </a>
                  <a
                    className="lesson-recommendation"
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${course.domain || ""} ${activeLesson.title} official documentation tutorial`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="lesson-recommendation__icon"><FileText size={18} /></span>
                    <span><strong>Read another explanation</strong><small>Find documentation and written guides</small></span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </section>

              <button
                type="button"
                className="course-ask-ai-button"
                onClick={() => setAiOpen((value) => !value)}
              >
                <MessageCircle size={16} />
                Ask UrPath about this lesson
              </button>

              {aiOpen && (
                <section className="course-ai-panel">
                  <div className="course-ai-panel__header">
                    <span>LEARNING ASSISTANT</span>
                    <h3>Ask about {activeLesson.title}</h3>
                  </div>

                  <div className="course-ai-panel__messages">
                    {aiMessages.length === 0 && (
                      <p>
                        Ask for an explanation, an example, a
                        clarification, or help understanding this
                        lesson.
                      </p>
                    )}

                    {aiMessages.map((item, index) => (
                      <div
                        key={index}
                        className={`course-ai-message course-ai-message--${item.role}`}
                      >
                        {item.text}
                      </div>
                    ))}

                    {aiLoading && (
                      <div className="course-ai-message course-ai-message--assistant">
                        Thinking...
                      </div>
                    )}
                  </div>

                  <form
                    className="course-ai-panel__form"
                    onSubmit={handleAskAI}
                  >
                    <textarea
                      value={aiMessage}
                      onChange={(event) =>
                        setAiMessage(event.target.value)
                      }
                      placeholder="Ask something about this lesson..."
                      rows={2}
                    />
                    <button
                      type="submit"
                      disabled={
                        aiLoading || !aiMessage.trim()
                      }
                    >
                      <Send size={16} />
                    </button>
                  </form>

                  {aiError && (
                    <p className="course-ai-error">
                      {aiError}
                    </p>
                  )}
                </section>
              )}

              <div className="lesson-actions">
                <button
                  type="button"
                  className="courses-button"
                  disabled={
                    activeLesson.completed ||
                    actionLoading
                  }
                  onClick={handleComplete}
                >
                  <Check size={17} />
                  {activeLesson.completed
                    ? "Lesson completed"
                    : actionLoading
                      ? "Saving..."
                      : "Mark as complete"}
                </button>

                {error && (
                  <span className="course-inline-error">
                    {error}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="courses-empty">
              <div className="courses-empty__icon">
                <FileText size={28} />
              </div>
              <h2>No lessons yet</h2>
              <p>
                This course exists, but lessons have not been
                added yet.
              </p>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}

export default CourseDetails;
