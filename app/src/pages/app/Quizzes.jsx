import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, CircleHelp, Clock3 } from "lucide-react";
import { Link } from "react-router";
import { getQuizzes } from "../../services/quizService";
import "../../style/progress.css";

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getQuizzes()
      .then((response) => setQuizzes(response?.quizzes || response?.data?.quizzes || []))
      .catch((err) => setError(err.response?.data?.message || "Unable to load quizzes."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="progress-page">
      <header className="progress-header"><div><span className="progress-eyebrow">CHECK YOUR KNOWLEDGE</span><h1>Quizzes</h1><p>Test what you have learned along your path.</p></div></header>
      {loading && <div className="progress-state">Loading quizzes...</div>}
      {error && <div className="progress-state progress-state--error">{error}</div>}
      {!loading && !error && quizzes.length === 0 && <div className="progress-panel quiz-empty"><CircleHelp size={28}/><h2>No quizzes yet</h2><p>Quiz tasks generated for your roadmap will appear here.</p></div>}
      {!loading && !error && quizzes.length > 0 && (
        <section className="quiz-grid">{quizzes.map((quiz) => (
          <Link className="quiz-card" to={`/quizzes/${quiz._id}`} key={quiz._id}>
            <div className="quiz-card__icon">{quiz.status === "completed" ? <CheckCircle2/> : <CircleHelp/>}</div>
            <div className="quiz-card__body"><span>Week {quiz.weekNumber}</span><h2>{quiz.title}</h2><p>{quiz.description || "Knowledge check from your learning path."}</p><small><Clock3 size={14}/> {quiz.questions?.length || 0} questions</small></div>
            <ChevronRight/>
          </Link>
        ))}</section>
      )}
    </main>
  );
}
export default Quizzes;
