import { ArrowRight, Check, Map, Sparkles, Timer } from "lucide-react";
import { Link } from "react-router";
import "../../style/landing.css";

const features = [
  { icon: Map, title: "A path made for you", text: "Turn a learning goal into a clear sequence of milestones and tasks." },
  { icon: Timer, title: "Learn with focus", text: "Use focused sessions, daily progress, quizzes and courses without losing your place." },
  { icon: Sparkles, title: "Ask when you're stuck", text: "Get help from UrPath AI while keeping your learning journey in one workspace." },
];

function Landing() {
  return (
    <main className="landing">
      <nav className="landing__nav">
        <Link to="/" className="landing__brand"><span>U</span><strong>UrPath</strong></Link>
        <div className="landing__nav-actions">
          <Link to="/login" className="landing__login">Log in</Link>
          <Link to="/register" className="landing__signup">Start your path</Link>
        </div>
      </nav>

      <section className="landing__hero">
        <div className="landing__hero-copy">
          <p className="landing__eyebrow">DEVELOP YOURSELF. BUILD YOUR PATH.</p>
          <h1>Stop wondering what to learn next.</h1>
          <p className="landing__lead">
            UrPath turns your goal into a practical learning journey you can actually follow,
            one step at a time.
          </p>
          <div className="landing__actions">
            <Link to="/register" className="landing__primary">Build my path <ArrowRight size={17} /></Link>
            <Link to="/login" className="landing__secondary">I already have an account</Link>
          </div>
          <div className="landing__checks">
            {["Personalized roadmap", "Progress tracking", "Courses and quizzes"].map((item) => (
              <span key={item}><Check size={14} />{item}</span>
            ))}
          </div>
        </div>

        <div className="landing__mountain" aria-hidden="true">
          <div className="landing__sun" />
          <div className="landing__peak landing__peak--back" />
          <div className="landing__peak landing__peak--front" />
          <div className="landing__trail"><span /></div>
          <div className="landing__flag">YOUR<br />GOAL</div>
        </div>
      </section>

      <section className="landing__features">
        {features.map(({ icon: Icon, title, text }) => (
          <article className="landing__feature" key={title}>
            <div className="landing__feature-icon"><Icon size={19} /></div>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <footer className="landing__footer">
        <span>UrPath</span>
        <span>Learn. Build. Grow.</span>
      </footer>
    </main>
  );
}

export default Landing;
