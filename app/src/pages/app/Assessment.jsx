import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, FileCheck2, LoaderCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { createAssessment, submitAssessment } from "../../services/assessmentService";
import { generateRoadmapFromAssessment } from "../../services/roadmapService";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { useRoadmapStore } from "../../stores/roadmapStore";
import "../../style/assessment.css";

function Assessment() {
  const navigate = useNavigate();
  const setGeneratedRoadmap = useRoadmapStore((state) => state.setGeneratedRoadmap);
  const {
    selectedDomain,
    selectedSubdomain,
    customSubdomain,
    customLearningSubject,
    selectedLanguage,
    customLanguage,
    goal,
    customGoal,
    experienceLevel,
  } = useOnboardingStore();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [generationAttempt, setGenerationAttempt] = useState(0);

  const domain = selectedDomain?.name || "";
  const subdomain = useMemo(() => {
    if (domain.toLowerCase() === "languages") {
      return selectedLanguage === "another" ? customLanguage : selectedLanguage;
    }
    if (domain.toLowerCase() === "other") return customLearningSubject;
    return selectedSubdomain?.name || customSubdomain;
  }, [domain, selectedLanguage, customLanguage, customLearningSubject, selectedSubdomain, customSubdomain]);

  const assessmentGoal = goal === "custom" ? customGoal : goal;
  const learnerLevel = experienceLevel === "complete_beginner" ? "beginner" : experienceLevel;

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!domain || !subdomain || !assessmentGoal) {
        setError("Your learning setup is incomplete. Please return to setup.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await createAssessment({
          domain,
          subdomain,
          goal: assessmentGoal,
          learnerLevel,
        });

        if (mounted) setAssessment(response?.assessment || response?.data?.assessment);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || "Unable to generate your assessment.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [domain, subdomain, assessmentGoal, learnerLevel, generationAttempt]);

  const questions = assessment?.questions || [];
  const question = questions[currentIndex];
  const selectedAnswer = question ? answers[question.id] : undefined;
  const isLast = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  const handleNext = () => {
    if (!selectedAnswer) return;
    if (!isLast) setCurrentIndex((value) => value + 1);
  };

  const handleSubmit = async () => {
    if (!assessment || submitting || answeredCount !== questions.length) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await submitAssessment(assessment._id, answers);
      setResult(response?.result || response?.data?.result);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit the assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!assessment?._id || roadmapLoading) return;

    setRoadmapLoading(true);
    setError("");

    try {
      const response = await generateRoadmapFromAssessment(assessment._id);
      const roadmap = response?.roadmap || response?.data?.roadmap;

      if (!roadmap?._id) {
        throw new Error("The server did not return the generated roadmap.");
      }

      setGeneratedRoadmap(roadmap);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Assessment completed, but roadmap generation failed.");
    } finally {
      setRoadmapLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="assessment-page">
        <div className="assessment-state">
          <LoaderCircle className="assessment-spinner" size={30} />
          <div className="assessment-loading-copy">
            <span className="assessment-eyebrow"><FileCheck2 size={14} /> PREPARING YOUR PATH</span>
            <h1>Building your diagnostic assessment</h1>
            <p>UrPath is generating real questions from your learning setup. This can take a moment while your knowledge base and AI are working.</p>
            <div className="assessment-loading-steps">
              <span><i /> Reading your goal</span>
              <span><i /> Checking learning knowledge</span>
              <span><i /> Generating diagnostic questions</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !assessment) {
    return (
      <main className="assessment-page">
        <div className="assessment-state assessment-state--error">
          <h2>Assessment could not start</h2>
          <p>{error}</p>
          <div className="assessment-error-actions">
            <button type="button" onClick={() => setGenerationAttempt((value) => value + 1)}>
              Try again
            </button>
            <button type="button" className="assessment-secondary-button" onClick={() => navigate("/onboarding")}>
              <ArrowLeft size={16} /> Return to setup
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!assessment || !questions.length) {
    return (
      <main className="assessment-page">
        <div className="assessment-state assessment-state--error">
          <h2>No assessment questions were returned.</h2>
          <p>The server responded, but there were no usable questions to display.</p>
          <div className="assessment-error-actions">
            <button type="button" onClick={() => setGenerationAttempt((value) => value + 1)}>Generate again</button>
            <button type="button" className="assessment-secondary-button" onClick={() => navigate("/onboarding")}><ArrowLeft size={16} /> Return to setup</button>
          </div>
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <main className="assessment-page">
        <section className="assessment-result">
          <div className="assessment-result__icon"><CheckCircle2 size={32} /></div>
          <span className="assessment-eyebrow">ASSESSMENT COMPLETE</span>
          <h1>Your starting point is ready.</h1>
          <p>
            UrPath scored your answers and can now use the result to build your personalized roadmap.
          </p>

          <div className="assessment-score">
            <strong>{result.percentage}%</strong>
            <span>{result.correct} / {result.total} correct</span>
          </div>

          <div className="assessment-level">
            <span>Detected level</span>
            <strong>{result.level}</strong>
          </div>

          {error && <p className="assessment-inline-error">{error}</p>}

          <button type="button" className="assessment-primary" onClick={handleGenerateRoadmap} disabled={roadmapLoading}>
            {roadmapLoading ? <LoaderCircle className="assessment-spinner" size={17} /> : <Sparkles size={17} />}
            {roadmapLoading ? "Building your roadmap..." : "Build my roadmap"}
            {!roadmapLoading && <ArrowRight size={16} />}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="assessment-page">
      <section className="assessment-shell">
        <header className="assessment-header">
          <button type="button" className="assessment-back" onClick={() => navigate("/onboarding")}>
            <ArrowLeft size={16} /> Setup
          </button>

          <div className="assessment-header__main">
            <span className="assessment-eyebrow"><FileCheck2 size={14} /> DIAGNOSTIC ASSESSMENT</span>
            <h1>Let’s find your starting point.</h1>
            <p>{domain} · {subdomain}</p>
          </div>

          <div className="assessment-progress">
            <span>{currentIndex + 1} / {questions.length}</span>
            <div><span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} /></div>
          </div>
        </header>

        {question && (
          <article className="assessment-question">
            <div className="assessment-question__number">QUESTION {String(currentIndex + 1).padStart(2, "0")}</div>
            <h2>{question.question}</h2>

            <div className="assessment-options">
              {question.options?.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={selectedAnswer === option ? "assessment-option assessment-option--selected" : "assessment-option"}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                >
                  <span>{option}</span>
                  {selectedAnswer === option && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>

            {error && <p className="assessment-inline-error">{error}</p>}

            <footer className="assessment-question__footer">
              <span>{answeredCount} of {questions.length} answered</span>
              {!isLast ? (
                <button type="button" className="assessment-primary" onClick={handleNext} disabled={!selectedAnswer}>
                  Next question <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" className="assessment-primary" onClick={handleSubmit} disabled={!selectedAnswer || submitting || answeredCount !== questions.length}>
                  {submitting ? "Scoring..." : "Finish assessment"} {!submitting && <CheckCircle2 size={16} />}
                </button>
              )}
            </footer>
          </article>
        )}
      </section>
    </main>
  );
}

export default Assessment;
