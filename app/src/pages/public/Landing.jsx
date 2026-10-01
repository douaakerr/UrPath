import { ArrowRight, Check, Compass, Route, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useRef } from "react";
import ParticleRoute from "./ParticleRoute";
import "../../style/landing.css";

const milestones = [
  {
    number: "01",
    title: "Start with a direction.",
    text: "Tell UrPath what you want to become. You don't need the whole plan yet.",
  },
  {
    number: "02",
    title: "Find the next step.",
    text: "Turn a goal into a practical sequence of skills, milestones, and focused work.",
  },
  {
    number: "03",
    title: "Keep moving.",
    text: "Learn, practice, track your progress, and always know where your path goes next.",
  },
];

const features = [
  { icon: Route, title: "A path made for you", text: "Your goal becomes a structured learning journey instead of a pile of bookmarks." },
  { icon: Compass, title: "Know what's next", text: "Clear milestones keep the next action visible without overwhelming you." },
  { icon: Sparkles, title: "Learn with support", text: "Courses, quizzes, progress, and AI help stay connected to your journey." },
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
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="landing__eyebrow">DEVELOP YOURSELF. BUILD YOUR PATH.</p>
          <h1>Stop wondering what to learn next.</h1>
          <p className="landing__lead">
            Start with a goal. UrPath turns it into a learning journey you can actually follow,
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

        <div className="landing__hero-route">
          <span className="landing__route-label landing__route-label--start">START</span>
          <span className="landing__route-label landing__route-label--goal">YOUR GOAL</span>
        </div>
      </section>

      <section className="landing__story">
        <div className="landing__story-intro">
          <p className="landing__eyebrow">THE JOURNEY</p>
          <h2>Your path becomes clearer as you move.</h2>
          <p>
            The route stays with you while you scroll. Each section is another point on the journey,
            so the animation is part of the story — not decoration sitting behind it.
          </p>
        </div>

        <div className="landing__milestones">
          {milestones.map((item, index) => (
            <motion.article
              className="landing__milestone"
              key={item.number}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.7, delay: index * 0.06 }}
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
        <p className="landing__eyebrow">YOUR NEXT STEP</p>
        <h2>You don't need to know the whole path.</h2>
        <p>Just choose where you want to go.</p>
        <Link to="/register" className="landing__primary">Start building <ArrowRight size={17} /></Link>
      </section>

      <footer className="landing__footer">
        <span>UrPath</span>
        <span>Learn. Build. Grow.</span>
      </footer>
    </main>
  );
}

export default Landing;
