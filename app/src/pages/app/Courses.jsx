import { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock3, Layers3, Search } from "lucide-react";
import { Link } from "react-router";
import { getCourses } from "../../services/courseService";
import "../../style/courses.css";

function normalizeCourses(response) {
  if (Array.isArray(response)) return response;
  return response?.courses || response?.data?.courses || response?.data || [];
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getCourses()
      .then((response) => {
        if (mounted) setCourses(normalizeCourses(response));
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || "Unable to load your courses.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return courses;

    return courses.filter((course) =>
      [course.title, course.description, course.domain, course.subdomain]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [courses, query]);

  return (
    <main className="courses-page">
      <header className="courses-header">
        <div>
          <span className="courses-eyebrow">YOUR LEARNING LIBRARY</span>
          <h1>Courses</h1>
          <p>Continue the lessons connected to your learning path.</p>
        </div>

        <label className="courses-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses..."
            aria-label="Search courses"
          />
        </label>
      </header>

      {loading && <div className="courses-state">Loading your courses...</div>}
      {error && !loading && <div className="courses-state courses-state--error">{error}</div>}

      {!loading && !error && filteredCourses.length === 0 && (
        <section className="courses-empty">
          <div className="courses-empty__icon"><BookOpen size={28} /></div>
          <h2>{courses.length ? "No matching courses" : "Your library is empty"}</h2>
          <p>
            {courses.length
              ? "Try another search."
              : "Courses created from your roadmap will appear here."}
          </p>
          {!courses.length && <Link to="/roadmap" className="courses-button">Open roadmap</Link>}
        </section>
      )}

      {!loading && !error && filteredCourses.length > 0 && (
        <section className="course-grid">
          {filteredCourses.map((course) => {
            const lessons = Array.isArray(course.lessons) ? course.lessons : [];
            const completed = lessons.filter((lesson) => lesson.completed).length;
            const percentage =
              Number.isFinite(course.progressPercentage)
                ? course.progressPercentage
                : lessons.length
                  ? Math.round((completed / lessons.length) * 100)
                  : 0;

            return (
              <Link to={`/courses/${course._id}`} className="course-card" key={course._id}>
                <div className="course-card__top">
                  <span className="course-card__domain">{course.domain || "Learning path"}</span>
                  <span className="course-card__level">{course.level || "beginner"}</span>
                </div>

                <h2>{course.title}</h2>
                <p>{course.description || "A focused learning course from your UrPath path."}</p>

                <div className="course-card__meta">
                  <span><Layers3 size={15} /> {lessons.length} lesson{lessons.length === 1 ? "" : "s"}</span>
                  <span><Clock3 size={15} /> {course.weekNumber ? `Week ${course.weekNumber}` : "Self-paced"}</span>
                </div>

                <div className="course-card__progress">
                  <div className="course-card__progress-label">
                    <span>Progress</span>
                    <strong>{percentage}%</strong>
                  </div>
                  <div className="course-card__progress-track">
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default Courses;
