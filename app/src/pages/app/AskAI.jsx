import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Bot, FileText, Paperclip, User, X } from "lucide-react";
import { sendLearningChat, sendPdfChat } from "../../services/aiService";
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
  const [pdfFile, setPdfFile] = useState(null);
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

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setMessages([]);
    setMessage("");
    setError("");
  };

  const choosePdf = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("PDF files must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    setPdfFile(file);
    setMessages([]);
    setError("");
  };

  const removePdf = () => {
    setPdfFile(null);
    setMessages([]);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const send = async (event) => {
    event.preventDefault();

    const text = message.trim();

    if (!text || sending) return;

    if (mode === "course" && (!selectedCourse || !selectedLesson)) return;

    if (mode === "file" && !pdfFile) {
      setError("Choose a PDF before asking a question.");
      return;
    }

    setMessages((current) => [...current, { role: "user", text }]);
    setMessage("");
    setSending(true);
    setError("");

    try {
      const response =
        mode === "file"
          ? await sendPdfChat({ file: pdfFile, message: text })
          : await sendLearningChat({
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

  const hasMessages = messages.length > 0;

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
            onClick={() => changeMode("course")}
          >
            <Bot size={16} />
            Ask about my course
          </button>

          <button
            type="button"
            className={mode === "file" ? "is-active" : ""}
            onClick={() => changeMode("file")}
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
                  <select
                    value={courseId}
                    onChange={(event) => selectCourse(event.target.value)}
                  >
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
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
                    {lessons.length ? (
                      lessons.map((lesson) => (
                        <option key={lesson._id} value={lesson._id}>
                          {lesson.title}
                        </option>
                      ))
                    ) : (
                      <option value="">No lessons available</option>
                    )}
                  </select>
                </label>

                <div className="ask-ai-context-note">
                  <span className="ask-ai-context-note__dot" />
                  UrPath will use this course and lesson as the context for
                  your question.
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
                  {!hasMessages && (
                    <div className="ask-ai-empty">
                      <Bot size={30} />
                      <h2>What do you want to understand?</h2>
                      <p>
                        Ask for an explanation, example, clarification, or
                        help with the selected lesson.
                      </p>
                    </div>
                  )}

                  {messages.map((item, index) => (
                    <div
                      className={`ask-ai-message ask-ai-message--${item.role}`}
                      key={index}
                    >
                      <span className="ask-ai-message__icon">
                        {item.role === "user" ? (
                          <User size={15} />
                        ) : (
                          <Bot size={15} />
                        )}
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
          <>
            <div className="ask-ai-file-panel">
              <div className="ask-ai-file-icon">
                <FileText size={30} />
              </div>

              <h2>Ask about a document</h2>
              <p>
                Upload a PDF and ask questions about its content, notes, or a
                specific section.
              </p>

              {pdfFile ? (
                <div className="ask-ai-selected-file">
                  <FileText size={18} />
                  <div>
                    <strong>{pdfFile.name}</strong>
                    <span>
                      {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB · PDF
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removePdf}
                    aria-label="Remove PDF"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="ask-ai-upload"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={17} />
                  Choose PDF
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                hidden
                onChange={choosePdf}
              />

              <div className="ask-ai-file-note">
                <strong>PDF ready for questions.</strong>
                <span>
                  Your PDF is sent to UrPath only when you ask a question. Text
                  is extracted on the server and used as the AI context.
                </span>
              </div>
            </div>

            <div className="ask-ai-messages ask-ai-file-messages">
              {!hasMessages && (
                <div className="ask-ai-empty">
                  <Bot size={30} />
                  <h2>
                    {pdfFile
                      ? "What do you want to know from this PDF?"
                      : "Choose a PDF to get started"}
                  </h2>
                  <p>
                    {pdfFile
                      ? "Ask for an explanation, summary, definition, or a specific section."
                      : "Select a PDF above, then your questions will use that document as context."}
                  </p>
                </div>
              )}

              {messages.map((item, index) => (
                <div
                  className={`ask-ai-message ask-ai-message--${item.role}`}
                  key={index}
                >
                  <span className="ask-ai-message__icon">
                    {item.role === "user" ? (
                      <User size={15} />
                    ) : (
                      <Bot size={15} />
                    )}
                  </span>
                  <p>{item.text}</p>
                </div>
              ))}

              {sending && <div className="ask-ai-typing">Reading the PDF…</div>}
            </div>

            <form className="ask-ai-input" onSubmit={send}>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={
                  pdfFile
                    ? "Ask something about this PDF..."
                    : "Choose a PDF first..."
                }
                rows={2}
                disabled={!pdfFile}
              />
              <button
                type="submit"
                disabled={sending || !message.trim() || !pdfFile}
                aria-label="Send question"
              >
                <ArrowUp size={18} />
              </button>
            </form>
          </>
        )}

        {error && <p className="ask-ai-error">{error}</p>}
      </section>
    </main>
  );
}

export default AskAI;
