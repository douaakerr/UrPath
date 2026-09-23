import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, CircleHelp } from "lucide-react";
import { Link, useParams } from "react-router";
import { getQuizById, submitQuiz } from "../../services/quizService";
import "../../style/progress.css";

function QuizDetails() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getQuizById(quizId)
      .then((response) => {
        const next = response?.quiz || response?.data?.quiz;
        setQuiz(next);
        if (next?.status === "completed") setResult(next.result);
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load quiz."))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleSubmit = async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await submitQuiz(quizId, { answers });
      setResult(response?.result || response?.data?.result);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main className="progress-page"><div className="progress-state">Loading quiz...</div></main>;
  if (error && !quiz) return <main className="progress-page"><div className="progress-state progress-state--error">{error}</div></main>;
  if (!quiz) return null;

  return (
    <main className="progress-page">
      <Link to="/quizzes" className="quiz-back"><ArrowLeft size={16}/> Quizzes</Link>
      <header className="progress-header"><div><span className="progress-eyebrow">WEEK {quiz.weekNumber}</span><h1>{quiz.title}</h1><p>{quiz.description}</p></div></header>
      {result && <section className="quiz-result"><CheckCircle2 size={28}/><div><strong>{result.percentage}%</strong><span>{result.correct} / {result.total} correct · {result.passed ? "Passed" : "Keep practicing"}</span></div></section>}
      <section className="quiz-question-list">
        {quiz.questions?.map((question, index) => (
          <article className="quiz-question" key={question._id}>
            <h2><span>{index + 1}</span>{question.question}</h2>
            <div className="quiz-options">
              {question.options?.map((option, optionIndex) => (
                <label key={optionIndex} className={answers[question._id] === option ? "quiz-option quiz-option--selected" : "quiz-option"}>
                  <input type="radio" name={question._id} value={option} checked={answers[question._id] === option} onChange={() => setAnswers((current) => ({...current, [question._id]: option}))} disabled={Boolean(result)}/>
                  {option}
                </label>
              ))}
            </div>
          </article>
        ))}
      </section>
      {!result && <button className="quiz-submit" onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit quiz"}</button>}
      {error && <p className="progress-inline-error">{error}</p>}
    </main>
  );
}
export default QuizDetails;
