import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Bot, FileText, Paperclip, User } from "lucide-react";
import { sendLearningChat } from "../../services/aiService";
import { getCourses } from "../../services/courseService";
import "../../style/ask-ai.css";

function normalizeCourses(response) {
  if (Array.isArray(response)) return response;
  return response?.courses || response?.data?.courses || response?.data || [];
}

function AskAI() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [mode, setMode] = useState("course");
  const fileInputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getCourses()
      .then((response) => {
        if (!mounted) return;
        const nextCourses = normalizeCourses(response);
        setCourses(nextCourses);

        const firstCourse = nextCourses[0];
        const firstLesson = firstCourse?.lessons?.[0];

        if (firstCourse) {
          setCourseId(firstCourse._id);
          setLessonId(firstLesson?._id || "");
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load your courses.",
          );
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => String(course._id) === String(courseId)),
    [courses, courseId],
  );

  const lessons = selectedCourse?.lessons || [];

  const selectedLesson = useMemo(
    () =>
      lessons.find((lesson) => String(lesson._id) === String(lessonId)) ||
      lessons[0],
    [lessons, lessonId],
  );

  const selectCourse = (value) => {
    setCourseId(value);
    const nextCourse = courses.find(
      (course) => String(course._id) === String(value),
    );
    setLessonId(nextCourse?.lessons?.[0]?._id || "");
    setMessages([]);
    setError("");
  };

  const selectLesson = (value) => {
    setLessonId(value);
    setMessages([]);
    setError("");
  };

  const send = async (event) => {
    event.preventDefault();

    const text = message.trim();

    if (!text || sending || mode !== "course" || !selectedCourse || !selectedLesson) return;

    setMessages((current) => [...current, { role: "user", text }]);
    setMessage("");
    setSending(true);
    setError("");

    try {
      const response = await sendLearningChat({
        domain: selectedCourse.domain,
        subdomain: selectedCourse.subdomain,
        goal: selectedCourse.title,
        level: selectedCourse.level,
        courseTitle: selectedCourse.title,
        lessonTitle: selectedLesson.title,
        lessonContent: selectedLesson.content || "",
        message: text,
      });

      const answer = response?.answer || response?.data?.answer;

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: answer || "I couldn't generate an answer.",
        },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reach the learning assistant.",
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <main className="ask-ai-page">
        <div className="ask-ai-card">
          <div className="ask-ai-empty">
            <Bot size={30} />
            <h2>Loading your courses...</h2>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ask-ai-page">
      <header className="ask-ai-header">
        <span>LEARNING ASSISTANT</span>
        <h1>Ask UrPath</h1>
        <p>Choose what you want UrPath to understand before you ask.</p>
      </header>

      <section className="ask-ai-card">
        <div className="ask-ai-modebar">
          <button
            type="button"
            className={mode === "course" ? "is-active" : ""}
            onClick={() => { setMode("course"); setError(""); }}
          >
            <Bot size={16} />
            Ask about my course
          </button>
          <button
            type="button"
            className={mode === "file" ? "is-active" : ""}
            onClick={() => { setMode("file"); setMessages([]); setError(""); }}
          >
            <FileText size={16} />
            Ask about a PDF
          </button>
        </div>

        {mode === "course" ? (
          <>
            {courses.length > 0 ? (
              <div className="ask-ai-context">
                <label>
                  <span>Course</span>
                  <select value={courseId} onChange={(event) => selectCourse(event.target.value)}>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Lesson</span>
                  <select
                    value={selectedLesson?._id || ""}
                    onChange={(event) => selectLesson(event.target.value)}
                    disabled={!lessons.length}
                  >
                    {lessons.length ? lessons.map((lesson) => (
                      <option key={lesson._id} value={lesson._id}>{lesson.title}</option>
                    )) : (
                      <option value="">No lessons available</option>
                    )}
                  </select>
                </label>

                <div className="ask-ai-context-note">
                  <span className="ask-ai-context-note__dot" />
                  UrPath will use this course and lesson as the context for your question.
                </div>
              </div>
            ) : (
              <div className="ask-ai-empty">
                <Bot size={30} />
                <h2>No course yet</h2>
                <p>Create a course from your roadmap before using Ask UrPath.</p>
              </div>
            )}

        {selectedLesson && (
          <>
            <div className="ask-ai-messages">
              {messages.length === 0 && (
                <div className="ask-ai-empty">
                  <Bot size={30} />
                  <h2>What do you want to understand?</h2>
                  <p>
                    Ask for an explanation, example, clarification, or help
                    with the selected lesson.
                  </p>
                </div>
              )}

              {messages.map((item, index) => (
                <div
                  className={`ask-ai-message ask-ai-message--${item.role}`}
                  key={index}
                >
                  <span className="ask-ai-message__icon">
                    {item.role === "user" ? <User size={15} /> : <Bot size={15} />}
                  </span>
                  <p>{item.text}</p>
                </div>
              ))}

              {sending && <div className="ask-ai-typing">Thinking…</div>}
            </div>

            <form className="ask-ai-input" onSubmit={send}>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask about this lesson..."
                rows={2}
              />
              <button
                type="submit"
                disabled={sending || !message.trim()}
                aria-label="Send question"
              >
                <ArrowUp size={18} />
              </button>
            </form>
          </>
        )}

        </>
        ) : (
          <div className="ask-ai-file-panel">
            <div className="ask-ai-file-icon"><FileText size={30} /></div>
            <h2>Ask about a document</h2>
            <p>Upload a PDF and ask questions about its content, notes, or a specific section.</p>
            <button
              type="button"
              className="ask-ai-upload"
              onClick={() => fileInputRef.current?.click()}
              disabled
            >
              <Paperclip size={17} />
              Choose PDF
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              hidden
              disabled
            />
            <div className="ask-ai-file-note">
              <strong>PDF analysis is the next AI step.</strong>
              <span>The current learning-chat API only understands course/lesson context, so this UI is prepared without pretending PDF analysis is already connected.</span>
            </div>
          </div>
        )}

        {error && <p className="ask-ai-error">{error}</p>}
      </section>
    </main>
  );
}

export default AskAI;
