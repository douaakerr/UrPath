import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Code2,
  Palette,
  Sparkles,
  Languages as LanguagesIcon,
  Briefcase,
  FlaskConical,
  HeartPulse,
  Building2,
  GraduationCap,
  Shapes,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Clock,
  Gauge,
  BookOpen,
  Video,
  Code,
  Layers,
  FileCheck2,
  CheckCircle2,
  Plus,
  Compass,
} from "lucide-react";
import { getLearningDomains } from "../../services/learningDomainService";
import { useOnboardingStore } from "../../stores/onboardingStore";
import "../../style/setUpLearning.css";

// Dynamic Icon Mapping
const getDomainIcon = (name) => {
  const norm = (name || "").toLowerCase();
  if (norm.includes("tech") || norm.includes("program")) return Code2;
  if (norm.includes("design")) return Palette;
  if (norm.includes("art") || norm.includes("creative")) return Sparkles;
  if (norm.includes("language")) return LanguagesIcon;
  if (norm.includes("business") || norm.includes("manage")) return Briefcase;
  if (norm.includes("science") || norm.includes("math")) return FlaskConical;
  if (norm.includes("health") || norm.includes("wellness")) return HeartPulse;
  if (norm.includes("arch")) return Building2;
  if (norm.includes("edu") || norm.includes("teach")) return GraduationCap;
  return Shapes;
};

// Supported Languages with country flag classes (from flag-icons package)
const SUPPORTED_LANGUAGES = [
  { id: "english", name: "English", native: "English", flagCode: "gb", desc: "Global communication, business & technical fluency" },
  { id: "french", name: "French", native: "Français", flagCode: "fr", desc: "Grammar, conversation, literature & professional fluency" },
  { id: "spanish", name: "Spanish", native: "Español", flagCode: "es", desc: "Grammar, vocabulary & colloquial fluency" },
  { id: "german", name: "German", native: "Deutsch", flagCode: "de", desc: "Grammar precision, technical & daily conversation" },
  { id: "korean", name: "Korean", native: "한국어", flagCode: "kr", desc: "Hangul, honorifics, daily vocabulary & media comprehension" },
  { id: "japanese", name: "Japanese", native: "日本語", flagCode: "jp", desc: "Hiragana, Katakana, Kanji & conversational fluency" },
];

// Meaningful Learning Goals
const GOAL_OPTIONS = [
  { id: "scratch", emoji: "🚀", title: "Learn from scratch", desc: "Start from the very beginning and build a strong, solid foundation" },
  { id: "improve", emoji: "📈", title: "Improve my existing skills", desc: "Level up beyond the basics and master deeper principles & nuances" },
  { id: "projects", emoji: "🛠️", title: "Build real-world projects", desc: "Hands-on application and crafting portfolio-ready creations" },
  { id: "career", emoji: "💼", title: "Prepare for a career & become job-ready", desc: "Master industry workflows, standard practices & interview readiness" },
  { id: "exam", emoji: "🎓", title: "Prepare for an exam or certification", desc: "Structured syllabus geared toward credentials and tests" },
  { id: "explore", emoji: "🧭", title: "Explore the subject", desc: "Casual curiosity, personal interest & discovering possibilities" },
  { id: "custom", emoji: "✍️", title: "Custom personal goal", desc: "Define your own specific milestone or project ambition" },
];

// Experience Levels
const EXPERIENCE_LEVELS = [
  { id: "complete_beginner", label: "Complete beginner" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "not_sure", label: "I'm not sure" },
];

// Learning Paces
const PACES = [
  { id: "relaxed", label: "Relaxed", sub: "Gentle milestones" },
  { id: "balanced", label: "Balanced", sub: "Steady weekly progress" },
  { id: "intensive", label: "Intensive", sub: "Fast-track immersion" },
];

// Available Time commitments
const TIME_OPTIONS = [
  { id: "under_3", label: "< 3 hours / week" },
  { id: "3_5", label: "3–5 hours / week" },
  { id: "5_10", label: "5–10 hours / week" },
  { id: "10_plus", label: "10+ hours / week" },
];

// Preferred Learning Styles
const STYLES = [
  { id: "video", label: "Video Lessons", icon: Video },
  { id: "reading", label: "Reading & Docs", icon: BookOpen },
  { id: "practice", label: "Practice & Exercises", icon: Code },
  { id: "projects", label: "Real Projects", icon: Layers },
  { id: "mixed", label: "Mixed Media", icon: Sparkles },
];

// Suggestions for "Other" custom domain
const OTHER_SUGGESTIONS = [
  "3D character animation for games",
  "Public speaking & rhetoric",
  "Japanese calligraphy & ink wash",
  "How to start a photography business",
  "Robotics & Embedded Systems",
  "Creative Writing & Fiction",
  "Music Production & Mixing",
  "Bioinformatics fundamentals",
];

export default function SetUpLearning() {
  const navigate = useNavigate();
  const location = useLocation();

  // Store
  const {
    currentStep,
    selectedDomain,
    selectedSubdomain,
    customSubdomain,
    customLearningSubject,
    selectedLanguage,
    customLanguage,
    goal,
    customGoal,
    experienceLevel,
    learningPace,
    availableTime,
    learningPreferences,
    setStep,
    nextStep,
    prevStep,
    setSelectedDomain,
    setSelectedSubdomain,
    setCustomSubdomain,
    setCustomLearningSubject,
    setSelectedLanguage,
    setCustomLanguage,
    setGoal,
    setCustomGoal,
    setExperienceLevel,
    setLearningPace,
    setAvailableTime,
    toggleLearningPreference,
    resetOnboarding,
  } = useOnboardingStore();

  // API State for domains
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ready confirmation modal
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  useEffect(() => {
    if (location.state?.newRoadmap) {
      resetOnboarding();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state, resetOnboarding]);

  // Fetch domains from backend
  const loadDomains = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLearningDomains();
      if (res && res.success && Array.isArray(res.domains)) {
        setDomains(res.domains);
        // Refresh reference in store if domain is already picked
        if (selectedDomain) {
          const fresh = res.domains.find((d) => d._id === selectedDomain._id || d.name === selectedDomain.name);
          if (fresh) setSelectedDomain(fresh);
        }
      } else {
        setDomains([]);
      }
    } catch (err) {
      console.error("Error loading learning domains:", err);
      setError(err.response?.data?.message || err.message || "Failed to load domains from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDomains();
  }, []);

  const isLanguagesDomain = selectedDomain?.name?.toLowerCase() === "languages";
  const isOtherDomain = selectedDomain?.name?.toLowerCase() === "other";
  const isOtherSubdomain = selectedSubdomain?.name === "__other__";

  // Step 1: Pick domain
  const handleDomainPick = (domain) => {
    setSelectedDomain(domain);
    nextStep();
  };

  // Step 2: Pick subdomain
  const handleSubdomainPick = (sub) => {
    setSelectedSubdomain(sub);
    // If user picked the "Other" card, don't auto-advance — they need to type
    if (sub.name !== "__other__") {
      nextStep();
    }
  };

  // Step 2: Continue from custom subdomain
  const handleCustomSubdomainContinue = () => {
    if (!customSubdomain.trim()) return;
    nextStep();
  };

  // Step 2: Pick language
  const handleLanguagePick = (lang) => {
    setSelectedLanguage(lang.name);
    nextStep();
  };

  // Step 2: Pick Other subject
  const handleCustomSubjectContinue = () => {
    if (!customLearningSubject.trim()) return;
    nextStep();
  };

  // Step 3: Pick Goal
  const handleGoalPick = (goalObj) => {
    setGoal(goalObj.id);
    if (goalObj.id !== "custom") {
      nextStep();
    }
  };

  // Step 4: Continue from preferences
  const handlePreferencesContinue = () => {
    nextStep();
  };

  // Step 5: Start Assessment
  const handleStartAssessment = () => {
    navigate("/assessment");
  };

  // Check if current step allows next
  const canGoNextFromStep = () => {
    if (currentStep === 1) return Boolean(selectedDomain);
    if (currentStep === 2) {
      if (isLanguagesDomain) return Boolean(selectedLanguage === "another" ? customLanguage.trim() : selectedLanguage);
      if (isOtherDomain) return Boolean(customLearningSubject.trim());
      if (isOtherSubdomain) return Boolean(customSubdomain.trim());
      return Boolean(selectedSubdomain);
    }
    if (currentStep === 3) {
      if (goal === "custom") return Boolean(customGoal.trim());
      return Boolean(goal);
    }
    if (currentStep === 4) return Boolean(experienceLevel && learningPace && availableTime);
    return true;
  };

  // Helper for human-readable focus summary
  const getFocusSummary = () => {
    if (isLanguagesDomain) return selectedLanguage === "another" ? customLanguage || "Custom Language" : selectedLanguage;
    if (isOtherDomain) return customLearningSubject || "Custom Topic";
    if (isOtherSubdomain) return customSubdomain || "Custom Focus Area";
    return selectedSubdomain?.name || "Not selected";
  };

  // Sort domains: put "Other" always at the end
  const sortedDomains = [...domains].sort((a, b) => {
    const aIsOther = a.name?.toLowerCase() === "other";
    const bIsOther = b.name?.toLowerCase() === "other";
    if (aIsOther && !bIsOther) return 1;
    if (!aIsOther && bIsOther) return -1;
    return 0;
  });

  const getGoalSummary = () => {
    if (goal === "custom") return customGoal || "Custom Goal";
    const found = GOAL_OPTIONS.find((g) => g.id === goal);
    return found ? found.title : "Not selected";
  };

  return (
    <div className="wizard-page">
      {/* TOP NAVIGATION & PROGRESS STEPPER */}
      <nav className="wizard-nav" aria-label="Setup Progress">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {currentStep > 1 && (
            <button
              className="wizard-back-btn"
              onClick={prevStep}
              title="Return to previous step"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          )}

          <div className="wizard-stepper">
            {[
              { num: "01", label: "Choose your path", step: 1 },
              { num: "02", label: "Focus", step: 2 },
              { num: "03", label: "Goal", step: 3 },
              { num: "04", label: "Preferences", step: 4 },
              { num: "05", label: "Assessment", step: 5 },
            ].map((st, idx, arr) => {
              const isActive = currentStep === st.step;
              const isCompleted = currentStep > st.step;

              return (
                <div key={st.num} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    className={`wizard-step-node ${isActive ? "wizard-step-node--active" : ""} ${isCompleted ? "wizard-step-node--completed wizard-step-node--clickable" : ""}`}
                    onClick={() => isCompleted && setStep(st.step)}
                    disabled={!isCompleted && !isActive}
                    title={isCompleted ? `Return to ${st.label}` : st.label}
                  >
                    <span className="wizard-step-number">
                      {isCompleted ? <Check size={13} strokeWidth={3} /> : st.num}
                    </span>
                    <span className="wizard-step-label">{st.label}</span>
                  </button>

                  {idx < arr.length - 1 && (
                    <div className={`wizard-step-divider ${currentStep > st.step ? "wizard-step-divider--filled" : ""}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="wizard-reset-btn"
          onClick={resetOnboarding}
          title="Reset choices and start over"
        >
          <RotateCcw size={12} />
          <span>Start over</span>
        </button>
      </nav>

      {/* ========================================================
          STEP 1: CHOOSE YOUR PATH (DOMAINS)
          ======================================================== */}
      {currentStep === 1 && (
        <section className="wizard-stage" key="step-1">
          <header className="wizard-heading">
            <div className="wizard-eyebrow">
              <Sparkles size={14} />
              <span>STEP 01 OF 05</span>
            </div>
            <h1 className="wizard-title">
              What do you want to <span>learn?</span>
            </h1>
            <p className="wizard-subtitle">
              Choose your broad domain to begin shaping your journey. UrPath supports all fields of knowledge.
            </p>
          </header>

          {/* Loading State */}
          {loading && (
            <div className="setup-skeleton-grid">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="setup-skeleton-card" />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="setup-status-card">
              <div className="setup-status-icon setup-status-icon--error">
                <AlertCircle size={28} />
              </div>
              <h3>Unable to load learning domains</h3>
              <p>{error}</p>
              <button className="setup-btn-retry" onClick={loadDomains}>
                <RotateCcw size={14} />
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && domains.length === 0 && (
            <div className="setup-status-card">
              <div className="setup-status-icon">
                <Layers size={28} />
              </div>
              <h3>No domains found</h3>
              <p>The system did not return any active domains from the database.</p>
              <button className="setup-btn-retry" onClick={loadDomains}>
                <RotateCcw size={14} />
                Refresh
              </button>
            </div>
          )}

          {/* Domains Grid */}
          {!loading && !error && domains.length > 0 && (
            <div className="domain-grid">
              {sortedDomains.map((domain) => {
                const Icon = getDomainIcon(domain.name);
                const isSelected = selectedDomain?._id === domain._id;
                const catSlug = domain.name.toLowerCase();
                const subCount = domain.subdomains?.length || 0;

                return (
                  <div
                    key={domain._id}
                    id={`domain-card-${catSlug.replace(/[^a-z0-9]/g, "-")}`}
                    className={`domain-card ${isSelected ? "domain-card--selected" : ""}`}
                    data-category={catSlug}
                    onClick={() => handleDomainPick(domain)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDomainPick(domain);
                      }
                    }}
                  >
                    <div className="domain-top">
                      <div className="domain-icon-wrap">
                        <Icon size={22} strokeWidth={2} />
                      </div>
                      {isSelected && (
                        <div className="domain-check-badge">
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <h3 className="domain-title">{domain.name}</h3>
                    <p className="domain-desc">
                      {domain.description || "Comprehensive learning path with tailored milestones."}
                    </p>

                    <div className="domain-footer">
                      <span>
                        {subCount > 0 ? `${subCount} focus areas` : "Custom AI path"}
                      </span>
                      <span>{isSelected ? "Selected ✓" : "Choose →"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ========================================================
          STEP 2: FOCUS AREA (SUBDOMAINS, LANGUAGES, OR OTHER)
          ======================================================== */}
      {currentStep === 2 && (
        <section className="wizard-stage" key="step-2">
          <header className="wizard-heading">
            <div className="wizard-eyebrow">
              <Sparkles size={14} />
              <span>STEP 02 OF 05 · {selectedDomain?.name?.toUpperCase()}</span>
            </div>
            <h1 className="wizard-title">
              What do you want to <span>focus on?</span>
            </h1>
            <p className="wizard-subtitle">
              {isLanguagesDomain
                ? "Select your target language for personalized vocabulary, grammar, and fluency milestones."
                : isOtherDomain
                ? "Tell UrPath about your specific learning goal. Our AI will analyze and structure a custom path."
                : `Choose a specialized area within ${selectedDomain?.name} to structure your roadmap.`}
            </p>
            <div className="wizard-badge-crumb">
              <span>Domain:</span>
              <strong>{selectedDomain?.name}</strong>
            </div>
          </header>

          {/* Languages Special Experience */}
          {isLanguagesDomain && (
            <>
              <div className="languages-grid">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.name;

                  return (
                    <div
                      key={lang.id}
                      id={`lang-card-${lang.id}`}
                      className={`language-card ${isSelected ? "language-card--selected" : ""}`}
                      onClick={() => handleLanguagePick(lang)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleLanguagePick(lang);
                        }
                      }}
                    >
                      <div className="language-flag-box">
                        <span className={`fi fi-${lang.flagCode}`} />
                      </div>
                      <h4 className="language-name">{lang.name}</h4>
                      <p className="language-native">{lang.native}</p>
                    </div>
                  );
                })}

                {/* Another Language Card */}
                <div
                  className={`language-card language-card--custom ${selectedLanguage === "another" ? "language-card--selected" : ""}`}
                  onClick={() => setSelectedLanguage("another")}
                >
                  <div className="language-flag-box" style={{ background: "rgba(92, 169, 255, 0.1)" }}>
                    <LanguagesIcon size={24} color="var(--color-primary)" />
                  </div>
                  <h4 className="language-name">Another Language</h4>
                  <p className="language-native">Learn any world language with AI adaptation</p>

                  {selectedLanguage === "another" && (
                    <div style={{ width: "100%", marginTop: "10px" }} onClick={(e) => e.stopPropagation()}>
                      <input
                        className="language-custom-input"
                        type="text"
                        placeholder="e.g. Italian, Arabic, Portuguese, Mandarin..."
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="wizard-btn-continue"
                        style={{ width: "100%", marginTop: "12px", justifyContent: "center" }}
                        disabled={!customLanguage.trim()}
                        onClick={nextStep}
                      >
                        Continue with {customLanguage || "Language"} →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Other Domain Special Experience */}
          {isOtherDomain && (
            <div className="custom-subject-container">
              <div className="custom-subject-header">
                <Compass size={22} color="var(--accent-other)" />
                <h3>Custom Learning Ambition</h3>
              </div>
              <p className="custom-subject-desc">
                UrPath is universally adaptive. Describe what you want to achieve, and our roadmap intelligence will classify the skills, prerequisites, and milestones.
              </p>

              <label htmlFor="custom-subject-field" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                What skill or topic would you like to master?
              </label>

              <input
                id="custom-subject-field"
                className="custom-subject-input"
                type="text"
                placeholder="e.g. 3D character animation for games, Public speaking, Drone cinematography..."
                value={customLearningSubject}
                onChange={(e) => setCustomLearningSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customLearningSubject.trim()) {
                    handleCustomSubjectContinue();
                  }
                }}
                autoFocus
              />

              <span className="custom-suggestions-label">Popular custom inspiration:</span>
              <div className="custom-suggestions-chips">
                {OTHER_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    className="custom-suggestion-chip"
                    onClick={() => setCustomLearningSubject(sug)}
                  >
                    + {sug}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="wizard-btn-continue"
                  disabled={!customLearningSubject.trim()}
                  onClick={handleCustomSubjectContinue}
                >
                  <span>Continue to Goal</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Normal Domain Subdomains Grid */}
          {!isLanguagesDomain && !isOtherDomain && (
            <>
              <div className="subdomain-grid">
                {selectedDomain?.subdomains?.map((sub) => {
                  const isSelected = selectedSubdomain?.name === sub.name;

                  return (
                    <div
                      key={sub._id || sub.name}
                      id={`subdomain-card-${sub.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      className={`subdomain-card ${isSelected ? "subdomain-card--selected" : ""}`}
                      onClick={() => handleSubdomainPick(sub)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSubdomainPick(sub);
                        }
                      }}
                    >
                      <div className="subdomain-indicator">
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>

                      <div className="subdomain-content">
                        <h4 className="subdomain-name">{sub.name}</h4>
                        {sub.description && <p className="subdomain-desc">{sub.description}</p>}
                      </div>
                    </div>
                  );
                })}

                {/* OTHER / Custom subdomain card — always last */}
                <div
                  id="subdomain-card-other"
                  className={`subdomain-card subdomain-card--other ${isOtherSubdomain ? "subdomain-card--selected" : ""}`}
                  onClick={() => handleSubdomainPick({ name: "__other__", description: "Define a custom focus area" })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSubdomainPick({ name: "__other__", description: "Define a custom focus area" });
                    }
                  }}
                >
                  <div className="subdomain-indicator subdomain-indicator--other">
                    {isOtherSubdomain ? <Check size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={3} />}
                  </div>

                  <div className="subdomain-content">
                    <h4 className="subdomain-name">Other / Custom</h4>
                    <p className="subdomain-desc">Can't find your area? Describe it and UrPath's AI will create a custom path.</p>
                  </div>
                </div>
              </div>

              {/* Custom subdomain input (shown when "Other" is selected) */}
              {isOtherSubdomain && (
                <div className="custom-subject-container" style={{ marginTop: "24px" }}>
                  <div className="custom-subject-header">
                    <Compass size={22} color="var(--color-primary)" />
                    <h3>Custom Focus Area</h3>
                  </div>
                  <p className="custom-subject-desc">
                    Tell us what specific area within <strong>{selectedDomain?.name}</strong> you want to explore. UrPath's AI will structure a roadmap around it.
                  </p>

                  <label htmlFor="custom-subdomain-field" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                    What focus area would you like to learn?
                  </label>

                  <input
                    id="custom-subdomain-field"
                    className="custom-subject-input"
                    type="text"
                    placeholder={`e.g. Robotics, Embedded Systems, Game Physics...`}
                    value={customSubdomain}
                    onChange={(e) => setCustomSubdomain(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customSubdomain.trim()) {
                        handleCustomSubdomainContinue();
                      }
                    }}
                    autoFocus
                  />

                  <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                    <button
                      className="wizard-btn-continue"
                      disabled={!customSubdomain.trim()}
                      onClick={handleCustomSubdomainContinue}
                    >
                      <span>Continue to Goal</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* ========================================================
          STEP 3: GOAL
          ======================================================== */}
      {currentStep === 3 && (
        <section className="wizard-stage" key="step-3">
          <header className="wizard-heading">
            <div className="wizard-eyebrow">
              <Sparkles size={14} />
              <span>STEP 03 OF 05 · DEFINING YOUR TARGET</span>
            </div>
            <h1 className="wizard-title">
              What is your <span>goal?</span>
            </h1>
            <p className="wizard-subtitle">
              Your goal helps us calibrate assessment questions, project recommendations, and milestone depth.
            </p>
            <div className="wizard-badge-crumb">
              <span>Focus:</span>
              <strong>{getFocusSummary()}</strong>
            </div>
          </header>

          <div className="goal-grid">
            {GOAL_OPTIONS.map((g) => {
              const isSelected = goal === g.id;

              return (
                <div
                  key={g.id}
                  id={`goal-card-${g.id}`}
                  className={`goal-card ${isSelected ? "goal-card--selected" : ""}`}
                  onClick={() => handleGoalPick(g)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleGoalPick(g);
                    }
                  }}
                >
                  <div className="goal-icon-box">{g.emoji}</div>
                  <div>
                    <h4 className="goal-title">{g.title}</h4>
                    <p className="goal-desc">{g.desc}</p>
                  </div>
                </div>
              );
            })}

            {/* Custom Goal Input Box if custom chosen */}
            {goal === "custom" && (
              <div className="goal-custom-box">
                <label htmlFor="custom-goal-field" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Describe your specific personal goal:
                </label>
                <input
                  id="custom-goal-field"
                  className="goal-custom-input"
                  type="text"
                  placeholder="e.g. Build an AI-driven SaaS app within 4 months..."
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customGoal.trim()) nextStep();
                  }}
                  autoFocus
                />
                <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="wizard-btn-continue"
                    disabled={!customGoal.trim()}
                    onClick={nextStep}
                  >
                    <span>Continue to Preferences</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          STEP 4: PREFERENCES (EXPERIENCE, PACE, TIME, STYLES)
          ======================================================== */}
      {currentStep === 4 && (
        <section className="wizard-stage" key="step-4">
          <header className="wizard-heading">
            <div className="wizard-eyebrow">
              <Sparkles size={14} />
              <span>STEP 04 OF 05 · PERSONALIZING PACE</span>
            </div>
            <h1 className="wizard-title">
              How do you prefer to <span>learn?</span>
            </h1>
            <p className="wizard-subtitle">
              We personalize your roadmap velocity, resource formats, and realistic timelines based on your answers.
            </p>
          </header>

          <div className="preferences-container">
            {/* 1. Experience Level */}
            <div className="preference-block">
              <div className="preference-label">
                <Gauge size={16} color="var(--color-primary)" />
                <span>1. What is your current experience level in this area?</span>
              </div>
              <div className="preference-pills">
                {EXPERIENCE_LEVELS.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    className={`preference-pill ${experienceLevel === exp.id ? "preference-pill--selected" : ""}`}
                    onClick={() => setExperienceLevel(exp.id)}
                  >
                    {experienceLevel === exp.id && <Check size={13} strokeWidth={3} />}
                    <span>{exp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Learning Pace */}
            <div className="preference-block">
              <div className="preference-label">
                <Clock size={16} color="var(--color-primary)" />
                <span>2. What learning pace fits your lifestyle?</span>
              </div>
              <div className="preference-pills">
                {PACES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`preference-pill ${learningPace === p.id ? "preference-pill--selected" : ""}`}
                    onClick={() => setLearningPace(p.id)}
                  >
                    {learningPace === p.id && <Check size={13} strokeWidth={3} />}
                    <strong>{p.label}</strong>
                    <span style={{ opacity: 0.8, fontSize: "11px" }}>({p.sub})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Available Time */}
            <div className="preference-block">
              <div className="preference-label">
                <Clock size={16} color="var(--color-primary)" />
                <span>3. How much time can you dedicate per week?</span>
              </div>
              <div className="preference-pills">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`preference-pill ${availableTime === t.id ? "preference-pill--selected" : ""}`}
                    onClick={() => setAvailableTime(t.id)}
                  >
                    {availableTime === t.id && <Check size={13} strokeWidth={3} />}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Preferred Learning Styles (Multiple) */}
            <div className="preference-block">
              <div className="preference-label">
                <BookOpen size={16} color="var(--color-primary)" />
                <span>4. Preferred learning styles (Select all that apply):</span>
              </div>
              <div className="preference-pills">
                {STYLES.map((st) => {
                  const isSelected = learningPreferences.includes(st.id);
                  const Icon = st.icon;

                  return (
                    <button
                      key={st.id}
                      type="button"
                      className={`preference-pill ${isSelected ? "preference-pill--selected" : ""}`}
                      onClick={() => toggleLearningPreference(st.id)}
                    >
                      <Icon size={14} />
                      <span>{st.label}</span>
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <button
                className="wizard-btn-continue"
                onClick={handlePreferencesContinue}
              >
                <span>Continue to Summary</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          STEP 5: READY / ASSESSMENT PREPARATION
          ======================================================== */}
      {currentStep === 5 && (
        <section className="wizard-stage" key="step-5">
          <header className="wizard-heading">
            <div className="wizard-eyebrow">
              <Sparkles size={14} />
              <span>STEP 05 OF 05 · CALIBRATION READY</span>
            </div>
            <h1 className="wizard-title">
              Your personalized path is <span>ready.</span>
            </h1>
            <p className="wizard-subtitle">
              Review your learning foundation below. When you're ready, click <strong>Start Assessment</strong> to calibrate your personalized curriculum.
            </p>
          </header>

          <div className="summary-container">
            <article className="summary-card">
              <div className="summary-card__header">
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    CALIBRATED PROFILE
                  </span>
                  <h3 style={{ margin: "4px 0 0 0", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Learning Path Blueprint
                  </h3>
                </div>

                <div className="summary-badge-ready">
                  <CheckCircle2 size={14} />
                  <span>Ready for Assessment</span>
                </div>
              </div>

              <div className="summary-items-grid">
                <div className="summary-item">
                  <span className="summary-item__label">Learning Area</span>
                  <span className="summary-item__val">{selectedDomain?.name}</span>
                  <span className="summary-item__sub">Focus: {getFocusSummary()}</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item__label">Primary Goal</span>
                  <span className="summary-item__val">{getGoalSummary()}</span>
                  <span className="summary-item__sub">Target milestone</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item__label">Experience Level</span>
                  <span className="summary-item__val" style={{ textTransform: "capitalize" }}>
                    {experienceLevel.replace("_", " ")}
                  </span>
                  <span className="summary-item__sub">Baseline skill</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item__label">Pace & Commitment</span>
                  <span className="summary-item__val" style={{ textTransform: "capitalize" }}>
                    {learningPace} Pace
                  </span>
                  <span className="summary-item__sub">
                    {TIME_OPTIONS.find((t) => t.id === availableTime)?.label || "Flexible"}
                  </span>
                </div>

                <div className="summary-item" style={{ gridColumn: "1 / -1" }}>
                  <span className="summary-item__label">Preferred Content Formats</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                    {learningPreferences.map((pref) => {
                      const st = STYLES.find((s) => s.id === pref);
                      return (
                        <span key={pref} className="custom-suggestion-chip" style={{ cursor: "default" }}>
                          {st?.label || pref}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>

            {/* AI Engine Calibration Banner */}
            <div className="summary-ai-banner">
              <Sparkles size={22} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p>
                  <strong>What happens next?</strong> UrPath's AI assessment engine will generate a concise diagnostic evaluation based on <strong>{getFocusSummary()}</strong>. Your answers will pinpoint knowledge gaps and formulate your custom milestones.
                </p>
              </div>
            </div>

            {/* Final CTA Buttons */}
            <div className="summary-cta-wrap">
              <button
                type="button"
                className="btn-edit-choices"
                onClick={() => setStep(1)}
              >
                <span>Edit choices</span>
              </button>

              <button
                type="button"
                id="start-assessment-cta"
                className="btn-start-assessment"
                onClick={handleStartAssessment}
              >
                <FileCheck2 size={18} />
                <span>Start assessment</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Assessment Started Feedback Modal */}
          {assessmentStarted && (
            <div className="setup-toast-notice" style={{ maxWidth: "420px", bottom: "40px", right: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-primary)", fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>
                <CheckCircle2 size={18} />
                <span>Path Setup Saved!</span>
              </div>
              <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.45" }}>
                All selections for <strong>{getFocusSummary()}</strong> have been staged in the onboarding store. The AI-generated assessment system will be plugged in as the next feature checkpoint!
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="wizard-btn-continue"
                  style={{ padding: "8px 16px", fontSize: "12px" }}
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </button>
                <button
                  className="wizard-back-btn"
                  style={{ padding: "8px 16px", fontSize: "12px" }}
                  onClick={() => setAssessmentStarted(false)}
                >
                  Review Summary
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
