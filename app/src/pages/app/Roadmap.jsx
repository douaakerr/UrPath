import { BookOpen, CheckCircle2, Clock3, LoaderCircle, Target, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RoadmapFlow from "../../components/Roadmap/RoadmapFlow";
import { getCourses, generateCourse } from "../../services/courseService";
import { getQuizzes, generateQuiz } from "../../services/quizService";
import { useRoadmapStore } from "../../stores/roadmapStore";
import "../../style/roadmap.css";

function Roadmap() {
  const navigate = useNavigate();
  const {
    activeRoadmapId,
    roadmaps,
    setActiveRoadmap,
    getActiveRoadmap,
    getStats,
    fetchRoadmaps,
    loading,
    error,
  } = useRoadmapStore();

  const activeRoadmap = getActiveRoadmap();
  const [courses, setCourses] = useState([]);
  const [coursesRoadmapId, setCoursesRoadmapId] = useState(null);
  const [generatingTaskId, setGeneratingTaskId] = useState(null);
  const [courseError, setCourseError] = useState("");

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  useEffect(() => {
    if (!activeRoadmap?.id) return;

    let mounted = true;
    setCourseError("");

    getCourses({ roadmapId: activeRoadmap.id })
      .then((response) => {
        if (!mounted) return;
        setCourses(response?.courses || response?.data?.courses || []);
        setCoursesRoadmapId(activeRoadmap.id);
      })
      .catch((err) => {
        if (mounted) {
          setCourseError(err.response?.data?.message || "Unable to load your courses.");
          setCoursesRoadmapId(activeRoadmap.id);
        }
      })
      .finally(() => {});

    return () => {
      mounted = false;
    };
  }, [activeRoadmap?.id]);

  const handleTaskAction = async ({ task, milestone, course }) => {
    if (!task?._id || generatingTaskId) return;

    setCourseError("");

    if (course?._id) {
      navigate(`/courses/${course._id}`);
      return;
    }

    if (task.type === "project") {
      navigate("/projects");
      return;
    }

    if (!activeRoadmap?.id) return;

    setGeneratingTaskId(task._id);

    try {
      if (task.type === "quiz") {
        const quizzesResponse = await getQuizzes();
        const quizzes =
          quizzesResponse?.quizzes ||
          quizzesResponse?.data?.quizzes ||
          [];

        const existingQuiz = quizzes.find(
          (quiz) =>
            String(quiz.taskId) === String(task._id) ||
            String(quiz.task?._id) === String(task._id),
        );

        if (existingQuiz?._id) {
          navigate(`/quizzes/${existingQuiz._id}`);
          return;
        }

        const response = await generateQuiz({
          roadmapId: activeRoadmap.id,
          weekNumber: milestone.weekNumber,
          taskId: task._id,
        });

        const generatedQuiz =
          response?.quiz ||
          response?.data?.quiz;

        if (!generatedQuiz?._id) {
          throw new Error("The generated quiz was not returned by the server.");
        }

        navigate(`/quizzes/${generatedQuiz._id}`);
        return;
      }

      const response = await generateCourse({
        roadmapId: activeRoadmap.id,
        weekNumber: milestone.weekNumber,
        taskId: task._id,
      });

      const generatedCourse = response?.course;

      if (!generatedCourse?._id) {
        throw new Error("The generated course was not returned by the server.");
      }

      setCourses((current) => {
        const exists = current.some(
          (item) => String(item._id) === String(generatedCourse._id),
        );
        return exists ? current : [...current, generatedCourse];
      });

      navigate(`/courses/${generatedCourse._id}`);
    } catch (err) {
      console.error(
        task.type === "quiz"
          ? "Quiz generation error:"
          : "Course generation error:",
        err,
      );
      setCourseError(
        err.response?.data?.message ||
          err.message ||
          (task.type === "quiz"
            ? "Unable to generate this quiz."
            : "Unable to generate this course."),
      );
    } finally {
      setGeneratingTaskId(null);
    }
  };

  if (loading && !activeRoadmap) {
    return <main className="roadmap-page"><div className="roadmap-empty">Loading your roadmap…</div></main>;
  }

  if (!activeRoadmap) {
    return <main className="roadmap-page"><div className="roadmap-empty"><Target size={22} /><h2>No roadmap found</h2><p>{error || "Complete your assessment to create your personalized learning path."}</p></div></main>;
  }

  const { total, completed, remaining, overallProgress } = getStats();
  const loadingCourses = Boolean(activeRoadmap?.id && coursesRoadmapId !== activeRoadmap.id);

  return (
    <main className="roadmap-page">
      <header className="roadmap-header">
        <div>
          <span className="roadmap-eyebrow">YOUR LEARNING PATH</span>
          <div className="roadmap-title-row">
            <div>
              <h1>{activeRoadmap.title}</h1>
              {activeRoadmap.subtitle && <p className="roadmap-subtitle">{activeRoadmap.subtitle}</p>}
            </div>

            {Object.values(roadmaps).length > 1 && (
              <select
                value={activeRoadmapId || ""}
                onChange={(event) => setActiveRoadmap(event.target.value)}
                className="roadmap-selector"
              >
                {Object.values(roadmaps).map((roadmap) => (
                  <option key={roadmap.id} value={roadmap.id}>{roadmap.title}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <button type="button" className="roadmap-open-courses" onClick={() => navigate("/courses")}>
          <BookOpen size={16} />
          My courses
          <ArrowUpRight size={14} />
        </button>
      </header>

      <section className="roadmap-summary">
        <div className="roadmap-summary__main">
          <div className="roadmap-summary__heading">
            <div>
              <span>OVERALL PROGRESS</span>
              <h2>Keep building your path.</h2>
            </div>
            <strong>{overallProgress}%</strong>
          </div>

          <div className="roadmap-summary__track">
            <span style={{ width: `${overallProgress}%` }} />
          </div>

          <div className="roadmap-summary__meta">
            <span>{completed} of {total} tasks completed</span>
            <span>{remaining} remaining</span>
          </div>
        </div>

        <div className="roadmap-summary__stats">
          <div><Target size={17} /><strong>{activeRoadmap.milestones.length}</strong><span>Weeks</span></div>
          <div><CheckCircle2 size={17} /><strong>{completed}</strong><span>Completed</span></div>
          <div><Clock3 size={17} /><strong>{remaining}</strong><span>Remaining</span></div>
        </div>
      </section>

      {courseError && <div className="roadmap-error">{courseError}</div>}

      <section className="roadmap-content">
        <div className="roadmap-content__header">
          <div>
            <span>ROADMAP</span>
            <h2>What you will learn</h2>
          </div>
          {loadingCourses && <div className="roadmap-loading"><LoaderCircle size={15} /> Loading courses</div>}
        </div>

        <RoadmapFlow
          roadmap={activeRoadmap}
          courses={courses}
          generatingTaskId={generatingTaskId}
          onTaskAction={handleTaskAction}
        />
      </section>
    </main>
  );
}

export default Roadmap;
