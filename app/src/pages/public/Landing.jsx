import { ArrowRight, Check, Map, Sparkles, Timer } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useRef } from "react";
import ParticleRoute from "./ParticleRoute";
import "../../style/landing.css";

const features = [
  { icon: Map, title: "A path made for you", text: "Turn a learning goal into a clear sequence of milestones and tasks." },
  { icon: Timer, title: "Learn with focus", text: "Stay on track with focused sessions, progress, quizzes and courses." },
  { icon: Sparkles, title: "Help when you're stuck", text: "Get support without losing the context of the journey you're building." },
];

function Landing() {
  const pageRef = useRef(null);

  return (
    <main ref={pageRef} className="landing">
      <div className="landing__canvas">
        <ParticleRoute scrollRoot={pageRef} />
      </div>

      <nav className="landing__nav">
        <Link to="/" className="landing__brand"><span>U</span><strong>UrPath</strong></Link>
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
          <p className="landing__eyebrow">YOU WANT TO LEARN. BUT WHERE DO YOU START?</p>
          <h1>So many things to learn. No idea what comes next.</h1>
          <p className="landing__lead">
            AI. Web development. Korean. Data science. Cybersecurity. You can learn anything,
            but starting without a path can make everything feel like a dead end.
          </p>
          <div className="landing__actions">
            <Link to="/register" className="landing__primary">Find my path <ArrowRight size={17} /></Link>
            <Link to="/login" className="landing__secondary">I already have an account</Link>
          </div>
        </motion.div>
        <div className="landing__scene-label landing__scene-label--lost">
          <span>TOO MANY DIRECTIONS</span>
          <strong>?</strong>
        </div>
      </section>

      <section className="landing__turn">
        <div className="landing__turn-copy">
          <p className="landing__eyebrow">THEN YOU FIND A DIFFERENT WAY</p>
          <h2>You don't need to know the whole journey.</h2>
          <p>UrPath is here to help you turn a goal into a path you can actually follow.</p>
        </div>
        <div className="landing__choice">
          <span>FROM</span>
          <strong>LOST</strong>
          <ArrowRight size={20} />
          <span>TO</span>
          <strong>YOUR PATH</strong>
        </div>
      </section>

      <section className="landing__paths">
        <div className="landing__paths-heading">
          <p className="landing__eyebrow">TWO WAYS FORWARD</p>
          <h2>One keeps you guessing.<br />One shows you the way.</h2>
        </div>
        <div className="landing__path-label landing__path-label--messy">
          <span>THE UNKNOWN</span>
          <strong>Where am I going?</strong>
          <small>More tabs. More ideas. No clear finish.</small>
        </div>
        <div className="landing__path-label landing__path-label--clear">
          <span>URPATH</span>
          <strong>A road to your summit.</strong>
          <small>Learn → practice → build → grow → achieve.</small>
        </div>
      </section>

      <section className="landing__walk">
        <div className="landing__walk-copy">
          <p className="landing__eyebrow">NOW, WE WALK</p>
          <h2>One step. Then the next.</h2>
          <p>
            Scroll to move along the road. Your path gets clearer as you learn,
            practice, build, and grow.
          </p>
        </div>
        <div className="landing__steps">
          {["LEARN", "PRACTICE", "BUILD", "GROW"].map((step, index) => (
            <motion.div
              className="landing__step"
              key={step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <span>0{index + 1}</span>
              <strong>{step}</strong>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="landing__summit">
        <div className="landing__summit-copy">
          <p className="landing__eyebrow">YOU MADE IT</p>
          <h2>Learn. Grow. Achieve what you want with your path.</h2>
          <p>The finish line is not the end of learning. It is proof that you kept moving.</p>
          <Link to="/register" className="landing__primary">Build my path <ArrowRight size={17} /></Link>
        </div>
        <div className="landing__achievement">
          <span>SUMMIT REACHED</span>
          <strong>🏁</strong>
          <small>YOUR GOAL</small>
        </div>
      </section>

      <section className="landing__features">
        {features.map(({ icon: Icon, title, text }) => (
          <motion.article className="landing__feature" key={title} whileHover={{ y: -5 }}>
            <div className="landing__feature-icon"><Icon size={19} /></div>
            <h2>{title}</h2>
            <p>{text}</p>
          </motion.article>
        ))}
      </section>

      <section className="landing__final">
        <p className="landing__eyebrow">DEVELOP YOURSELF. BUILD YOUR PATH.</p>
        <h2>UrPath is here for your learning journey.</h2>
        <Link to="/register" className="landing__primary">Start my journey <ArrowRight size={17} /></Link>
      </section>

      <footer className="landing__footer">
        <span>UrPath</span>
        <span>Learn. Build. Grow.</span>
      </footer>
    </main>
  );
}

export default Landing;
