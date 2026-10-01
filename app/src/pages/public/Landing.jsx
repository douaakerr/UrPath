import { ArrowRight, Check, Map, Sparkles, Timer } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useRef } from "react";
import ParticleRoute from "./ParticleRoute";
import "../../style/landing.css";

const milestones = [
  {
    number: "01",
    title: "Choose a direction.",
    text: "Start with what you want to learn. You do not need to know the whole route.",
  },
  {
    number: "02",
    title: "Climb one step at a time.",
    text: "Your roadmap turns a big goal into focused skills, tasks, practice, and progress.",
  },
  {
    number: "03",
    title: "Reach your summit.",
    text: "Keep learning, track your progress, and always have a clear next step.",
  },
];

const features = [
  { icon: Map, title: "A path made for you", text: "Turn a learning goal into a clear sequence of milestones and tasks." },
  { icon: Timer, title: "Learn with focus", text: "Use focused sessions, daily progress, quizzes and courses without losing your place." },
  { icon: Sparkles, title: "Ask when you're stuck", text: "Get help from UrPath AI while keeping your learning journey in one workspace." },
];

function Landing() {
  const pageRef = useRef(null);

  return (
    <main ref={pageRef} className="landing">
      <div className="landing__canvas">
        <ParticleRoute scrollRoot={pageRef} />
      </div>

      <nav className="landing__nav">
        <Link to="/" className="landing__brand">
          <span>U</span>
          <strong>UrPath</strong>
        </Link>
        <div className="landing__nav-actions">
          <Link to="/login" className="landing__login">Log in</Link>
          <Link to="/register" className="landing__signup">Start your path</Link>
        </div>
      </nav>

      <section className="landing__hero">
        <motion.div
          className="landing__hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="landing__eyebrow">DEVELOP YOURSELF. BUILD YOUR PATH.</p>
          <h1>Stop wondering what to learn next.</h1>
          <p className="landing__lead">
            UrPath turns your goal into a practical learning journey you can actually follow,
            one step at a time.
          </p>
          <div className="landing__actions">
            <Link to="/register" className="landing__primary">
              Build my path <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="landing__secondary">I already have an account</Link>
          </div>
          <div className="landing__checks">
            {["Personalized roadmap", "Progress tracking", "Courses and quizzes"].map((item) => (
              <span key={item}><Check size={14} />{item}</span>
            ))}
          </div>
        </motion.div>

        <div className="landing__mountain-caption" aria-hidden="true">
          <span>YOUR PATH</span>
          <strong>SUMMIT</strong>
        </div>
      </section>

      <section className="landing__story">
        <div className="landing__story-intro">
          <p className="landing__eyebrow">THE JOURNEY</p>
          <h2>Every scroll takes you one step closer.</h2>
          <p>
            The route is part of the story. Watch the particles leave the starting point,
            follow the trail, and gather at the summit as you move through UrPath.
          </p>
        </div>

        <div className="landing__milestones">
          {milestones.map((item, index) => (
            <motion.article
              className="landing__milestone"
              key={item.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.65, delay: index * 0.06 }}
            >
              <span>{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="landing__features">
        {features.map(({ icon: Icon, title, text }) => (
          <motion.article
            className="landing__feature"
            key={title}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
          >
            <div className="landing__feature-icon"><Icon size={19} /></div>
            <h2>{title}</h2>
            <p>{text}</p>
          </motion.article>
        ))}
      </section>

      <section className="landing__cta">
        <p className="landing__eyebrow">YOUR SUMMIT IS AHEAD</p>
        <h2>You don't need to know the whole path.</h2>
        <p>Just choose where you want to go.</p>
        <Link to="/register" className="landing__primary">
          Start building <ArrowRight size={17} />
        </Link>
      </section>

      <footer className="landing__footer">
        <span>UrPath</span>
        <span>Learn. Build. Grow.</span>
      </footer>
    </main>
  );
}

export default Landing;
