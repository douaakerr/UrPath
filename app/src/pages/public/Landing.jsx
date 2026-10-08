import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  Layers3,
  Play,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import { getDomainImage, getLearningImage } from "../../utils/learningImages";
import "../../style/landing.css";

const domains = [
  { name: "Artificial Intelligence", domain: "Technology", text: "From Python and mathematics to machine learning and real projects." },
  { name: "Web Development", domain: "Technology", text: "Build real interfaces, APIs and full-stack applications step by step." },
  { name: "Korean", domain: "Languages", text: "Build a language routine around vocabulary, grammar and conversation." },
  { name: "UI/UX Design", domain: "Design", text: "Move from user research to wireframes, prototypes and polished products." },
];

const steps = [
  { number: "01", title: "Choose a goal", text: "Tell UrPath what you want to learn and where you want to go.", icon: Compass },
  { number: "02", title: "Find your level", text: "Start from what you already know instead of repeating the basics.", icon: Target },
  { number: "03", title: "Get your roadmap", text: "See the subjects and skills that connect your goal into one clear path.", icon: Layers3 },
  { number: "04", title: "Learn and grow", text: "Use courses, quizzes, projects, progress and Focus to keep moving.", icon: Sparkles },
];

const tools = [
  { icon: BookOpen, title: "Courses", text: "Structured lessons connected to your own learning path." },
  { icon: Brain, title: "Ask UrPath", text: "Get help when you are stuck and keep your context." },
  { icon: BarChart3, title: "Progress", text: "See what you have learned and how your consistency changes." },
  { icon: Timer, title: "Focus Mode", text: "Put distractions away and give one learning session your attention." },
];

const reveal = {
  hidden: { opacity: 0, y: 42 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -55 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const slideRight = {
  hidden: { opacity: 0, x: 55 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({ children, className = "", variant = reveal, delay = 0 }) {
  return (
    <motion.div className={className} variants={variant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ delay }}>
      {children}
    </motion.div>
  );
}

function Landing() {
  const pageRef = useRef(null);

  return (
    <main ref={pageRef} className="landing">
      <Navbar />

      <section className="landing__hero">
        <div className="landing__hero-grid">
          <motion.div
            className="landing__hero-copy"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="landing__eyebrow">A CLEARER WAY TO LEARN</p>
            <h1>
              You know what you want to learn.
              <span>UrPath shows you what comes next.</span>
            </h1>
            <p className="landing__lead">
              Build a learning path around your goal, your level and the way you actually learn.
              Then keep moving, one step at a time.
            </p>
            <div className="landing__actions">
              <Link to="/register" className="landing__primary">Build my path <ArrowRight size={17} /></Link>
              <a href="#how-it-works" className="landing__secondary">See how it works</a>
            </div>
          </motion.div>

          <motion.div
            className="landing__hero-visual"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="landing__hero-photo">
              <img src={getLearningImage("Technology", "Artificial Intelligence")} alt="Artificial Intelligence learning" />
              <div className="landing__hero-photo-shade" />
              <div className="landing__hero-photo-copy">
                <span>YOUR NEXT PATH</span>
                <strong>Artificial Intelligence</strong>
                <small>Python → ML → Deep Learning → Projects</small>
              </div>
            </div>
            <div className="landing__hero-note landing__hero-note--top">
              <span>01</span>
              <strong>Start somewhere.</strong>
            </div>
            <div className="landing__hero-note landing__hero-note--bottom">
              <CheckCircle2 size={16} />
              <span>Clear steps. Real progress.</span>
            </div>
          </motion.div>
        </div>
        <div className="landing__scroll-cue"><span>SCROLL TO EXPLORE</span><i /></div>
      </section>

      <section id="who-we-are" className="landing__intro">
        <Reveal className="landing__section-heading">
          <p className="landing__eyebrow">WHO WE ARE</p>
          <h2>Learning should feel like a path, not a pile of tabs.</h2>
          <p>UrPath brings the pieces together: a goal, a starting point, a roadmap, learning material, practice and progress.</p>
        </Reveal>
      </section>

      <section className="landing__domains">
        <Reveal className="landing__section-heading" variant={slideLeft}>
          <p className="landing__eyebrow">ONE APP. MANY DIRECTIONS.</p>
          <h2>Whatever you want to learn, start with a path.</h2>
        </Reveal>

        <div className="landing__domain-list">
          {domains.map((item, index) => (
            <Reveal key={item.name} className="landing__domain-card" variant={index % 2 === 0 ? slideLeft : slideRight} delay={index * 0.04}>
              <div className="landing__domain-image">
                <img src={item.domain === "Languages" ? getDomainImage("Languages") : getLearningImage(item.domain, item.name)} alt="" loading="lazy" />
              </div>
              <div className="landing__domain-content">
                <span>{item.domain}</span>
                <h3>{item.name}</h3>
                <p>{item.text}</p>
                <ArrowRight size={17} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="landing__how">
        <Reveal className="landing__section-heading">
          <p className="landing__eyebrow">HOW URPATH WORKS</p>
          <h2>From “I want to learn this” to “I know what to do next.”</h2>
        </Reveal>

        <div className="landing__steps">
          {steps.map(({ number, title, text, icon: Icon }, index) => (
            <Reveal key={number} className="landing__step" delay={index * 0.08}>
              <div className="landing__step-number">{number}</div>
              <div className="landing__step-icon"><Icon size={19} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="why-urpath" className="landing__roadmap">
        <div className="landing__roadmap-copy">
          <Reveal variant={slideLeft}>
            <p className="landing__eyebrow">YOUR ROADMAP</p>
            <h2>Stop asking what to study next.</h2>
            <p>UrPath turns your goal into connected topics and skills, so you can see the bigger picture without losing the next small step.</p>
            <Link to="/register" className="landing__text-link">Create my roadmap <ArrowRight size={16} /></Link>
          </Reveal>
        </div>

        <Reveal className="landing__roadmap-board" variant={slideRight}>
          <div className="landing__roadmap-title">
            <span>PATH / 01</span>
            <strong>Artificial Intelligence</strong>
          </div>
          <div className="landing__roadmap-line" />
          {["Python", "Mathematics", "Machine Learning", "Deep Learning", "Projects"].map((topic, index) => (
            <motion.div
              className="landing__roadmap-node"
              key={topic}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: index * 0.12, duration: 0.45 }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{topic}</strong>
              {index < 4 && <i />}
            </motion.div>
          ))}
        </Reveal>
      </section>

      <section className="landing__ecosystem">
        <Reveal className="landing__section-heading">
          <p className="landing__eyebrow">MORE THAN A COURSE LIST</p>
          <h2>Everything around the learning path matters.</h2>
        </Reveal>

        <div className="landing__tool-grid">
          {tools.map(({ icon: Icon, title, text }, index) => (
            <Reveal className="landing__tool" key={title} variant={index % 2 === 0 ? slideLeft : slideRight} delay={index * 0.05}>
              <div className="landing__tool-icon"><Icon size={19} /></div>
              <div><h3>{title}</h3><p>{text}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="landing__progress">
        <div className="landing__progress-copy">
          <Reveal variant={slideLeft}>
            <p className="landing__eyebrow">SEE THE CHANGE</p>
            <h2>Small steps become visible progress.</h2>
            <p>Keep track of your learning across subjects and see the work building over time.</p>
          </Reveal>
        </div>

        <Reveal className="landing__progress-board" variant={slideRight}>
          <div className="landing__progress-top">
            <div><span>THIS MONTH</span><strong>+14%</strong></div>
            <BarChart3 size={22} />
          </div>
          <div className="landing__bars">
            {[["Artificial Intelligence", 78], ["Python", 84], ["Machine Learning", 57]].map(([label, value], index) => (
              <div className="landing__bar" key={label}>
                <div><span>{label}</span><strong>{value}%</strong></div>
                <div className="landing__bar-track">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: value + "%" }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 1, delay: index * 0.15 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="landing__progress-footer"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div>
        </Reveal>
      </section>

      <section className="landing__focus">
        <video className="landing__focus-video" autoPlay muted loop playsInline preload="metadata">
          <source src="/src/assets/video/forest_wind.mp4" type="video/mp4" />
        </video>
        <div className="landing__focus-overlay" />
        <Reveal className="landing__focus-content">
          <p className="landing__eyebrow">WHEN IT IS TIME TO FOCUS</p>
          <h2>Put the noise away. Stay with one thing.</h2>
          <p>Enter a calm study session with simple timers and music options designed to keep the attention on learning.</p>
          <Link to="/register" className="landing__focus-button"><Play size={16} fill="currentColor" /> Enter Focus Mode</Link>
        </Reveal>
      </section>

      <section className="landing__final">
        <Reveal>
          <p className="landing__eyebrow">DEVELOP YOURSELF. BUILD YOUR PATH.</p>
          <h2>You do not need the whole journey figured out.</h2>
          <p>Just the next step.</p>
          <Link to="/register" className="landing__primary">Start my journey <ArrowRight size={17} /></Link>
        </Reveal>
      </section>

      <footer className="landing__footer">
        <span>UrPath</span>
        <span>Learn · Build · Grow</span>
      </footer>
    </main>
  );
}

export default Landing;
