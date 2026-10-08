import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowRight, BarChart3, BookOpen, Brain, CheckCircle2,
  Compass, GraduationCap, Layers3, Mountain, Play, Sparkles, Target, Timer,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";
import Navbar from "../../components/layout/Navbar";
import { getDomainImage } from "../../utils/learningImages";
import mountainsLight from "../../assets/image/mountains_light.png";
import mountainsDark from "../../assets/image/mountains_dark.png";
import "../../style/landing.css";

const slides = [
  {
    eyebrow: "YOUR NEXT CHAPTER STARTS HERE",
    title: "You want to learn something new.",
    accent: "But where do you even start?",
    text: "Too many tutorials. Too many roadmaps. No clear next step. UrPath helps you turn that lost feeling into a plan you can actually follow.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=88",
    label: "EVERY SUMMIT STARTS WITH A FIRST STEP",
    color: "sage",
  },
  {
    eyebrow: "YOUR GOAL. YOUR PACE.",
    title: "You do not need to know the whole way.",
    accent: "Just the next step.",
    text: "Whether it is AI, design, languages, business or something completely different, UrPath helps you find your starting point and build from there.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=88",
    label: "MANY DIRECTIONS. ONE PLACE TO BEGIN.",
    color: "coral",
  },
  {
    eyebrow: "FROM CURIOSITY TO CAPABILITY",
    title: "Make your ambition",
    accent: "a path you can follow.",
    text: "Get a roadmap, learn through focused courses, practice what you know and see your progress grow — one small win at a time.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=88",
    label: "YOUR SUMMIT IS CLOSER THAN IT FEELS",
    color: "lavender",
  },
];

const domains = [
  { name: "Technology", detail: "AI, web development, data science, cybersecurity and more.", color: "mint" },
  { name: "Design & creative", detail: "UI/UX, illustration, photography, animation and creative work.", color: "peach" },
  { name: "Languages", detail: "Build a routine for English, French, Korean, Japanese and more.", color: "lilac" },
  { name: "Business & science", detail: "Explore finance, marketing, mathematics, biology and beyond.", color: "butter" },
];

const steps = [
  { number: "01", title: "Tell us your goal", text: "Choose the skill you want to learn, even if you are not sure how to begin.", icon: Compass, color: "mint" },
  { number: "02", title: "Find your starting point", text: "Share your level so your path can start where you are — not at page one by default.", icon: Target, color: "peach" },
  { number: "03", title: "Follow your trail", text: "Get a roadmap that breaks a big ambition into clear topics and smaller milestones.", icon: Mountain, color: "lilac" },
  { number: "04", title: "Learn, practice, repeat", text: "Use lessons, videos, quizzes and projects to turn knowledge into real skills.", icon: GraduationCap, color: "butter" },
];

const features = [
  { icon: Layers3, title: "A roadmap that makes sense", text: "Know what to study first, what comes after it and how the pieces connect.", color: "mint" },
  { icon: BookOpen, title: "Courses with direction", text: "Keep lessons connected to your goal, with learning resources to help you go deeper.", color: "peach" },
  { icon: Brain, title: "Ask UrPath", text: "Get explanations when a concept feels confusing and keep moving instead of getting stuck.", color: "lilac" },
  { icon: CheckCircle2, title: "Practice that sticks", text: "Use quizzes and projects to check your understanding and put new skills to work.", color: "butter" },
  { icon: BarChart3, title: "Progress you can see", text: "Follow your consistency and celebrate the small wins that add up over time.", color: "coral" },
  { icon: Timer, title: "Focus on one thing", text: "Use Focus Mode to set a session, reduce distractions and give your goal real time.", color: "sky" },
];

const reveal = {
  hidden: { opacity: 0, y: 38 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({ children, className = "", delay = 0, ...props }) {
  return (
    <motion.div
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.16 }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function Landing() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="landing">
      <Navbar />

      <section className={`landing__hero landing__hero--${slide.color}`}>
        <div className="landing__hero-background" aria-hidden="true">
          <AnimatePresence mode="sync">
            <motion.img
              key={slide.image}
              src={slide.image}
              alt=""
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1 }, scale: { duration: 7, ease: "linear" } }}
            />
          </AnimatePresence>
        </div>
        <div className="landing__hero-shade" />
        <div className="landing__hero-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              className="landing__hero-copy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <p className="landing__eyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}<span>{slide.accent}</span></h1>
              <p className="landing__hero-lead">{slide.text}</p>
              <div className="landing__hero-actions">
                <Link to="/register" className="landing__primary">Build my path <ArrowRight size={17} /></Link>
                <a href="#how-it-works" className="landing__hero-secondary"><Play size={14} fill="currentColor" /> See how it works</a>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="landing__hero-bottom">
            <span className="landing__hero-caption"><Mountain size={16} /> {slide.label}</span>
            <div className="landing__slide-controls" aria-label="Hero slides">
              {slides.map((item, index) => (
                <button
                  type="button"
                  key={item.eyebrow}
                  className={index === activeSlide ? "is-active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                  aria-pressed={index === activeSlide}
                ><span /></button>
              ))}
              <span className="landing__slide-count">0{activeSlide + 1} / 0{slides.length}</span>
            </div>
          </div>
          <a className="landing__scroll-cue" href="#the-problem"><span>SCROLL TO FIND YOUR PATH</span><ArrowDown size={15} /></a>
        </div>
      </section>

      <section id="the-problem" className="landing__problem landing__section-wrap">
        <Reveal className="landing__problem-copy">
          <p className="landing__eyebrow">SOUND FAMILIAR?</p>
          <h2>You are ready to grow.<br /><em>You just feel lost.</em></h2>
          <p>You save tutorials. Open ten tabs. Start one course, then find another one that promises to be better. You keep asking yourself: <strong>What should I learn first? What comes next? Am I making progress?</strong></p>
          <p>You do not need more noise. You need a path that helps you move forward.</p>
        </Reveal>
        <Reveal className="landing__lost-notes" delay={0.12}>
          <div className="landing__note landing__note--pink"><span>01 / THE START</span><strong>“I don't know where to begin.”</strong></div>
          <div className="landing__note landing__note--yellow"><span>02 / THE MIDDLE</span><strong>“What should I learn next?”</strong></div>
          <div className="landing__note landing__note--green"><span>03 / THE DOUBT</span><strong>“Am I getting any better?”</strong></div>
          <div className="landing__note-stamp"><Compass size={23} /><span>LET'S FIND YOUR WAY</span></div>
        </Reveal>
      </section>

      <section className="landing__mountain">
        <img className="landing__mountain-light" src={mountainsLight} alt="" />
        <img className="landing__mountain-dark" src={mountainsDark} alt="" />
        <div className="landing__mountain-shade" />
        <Reveal className="landing__mountain-copy">
          <p className="landing__eyebrow">EVERY GOAL HAS A SUMMIT</p>
          <h2>Your goal is the summit.<br /><span>Your roadmap is the trail.</span></h2>
          <p>You do not climb a mountain in one jump. You take one step, reach one marker, learn what the next stretch needs — and keep going. UrPath brings that same clarity to learning.</p>
          <Link to="/register" className="landing__mountain-link">Find your first step <ArrowRight size={17} /></Link>
        </Reveal>
        <div className="landing__summit-label"><Mountain size={18} /><span>YOUR GOAL</span><strong>THE SUMMIT</strong></div>
        <div className="landing__trail-label"><span>ONE STEP AT A TIME</span><i /></div>
      </section>

      <section id="domains" className="landing__domains landing__section-wrap">
        <Reveal className="landing__section-heading">
          <p className="landing__eyebrow">ONE PATH, YOUR DIRECTION</p>
          <h2>Whatever you want to learn,<br /><em>you can start here.</em></h2>
          <p>UrPath is not just for coding. Pick a curiosity, a career goal or a skill you have wanted to build. Your journey starts with you.</p>
        </Reveal>
        <div className="landing__domain-grid">
          {domains.map((item, index) => (
            <Reveal className={`landing__domain-card landing__tone--${item.color}`} key={item.name} delay={index * 0.06}>
              <div className="landing__domain-photo"><img src={getDomainImage(item.name === "Design & creative" ? "Arts & Creative" : item.name === "Business & science" ? "Business" : item.name)} alt="" loading="lazy" /></div>
              <div className="landing__domain-body"><span>0{index + 1} / EXPLORE</span><h3>{item.name}</h3><p>{item.detail}</p><ArrowRight size={18} /></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="landing__how landing__section-wrap">
        <Reveal className="landing__section-heading">
          <p className="landing__eyebrow">HOW URPATH WORKS</p>
          <h2>From “I want to learn this”<br /><em>to “I know what to do next.”</em></h2>
        </Reveal>
        <div className="landing__steps">
          {steps.map(({ number, title, text, icon: Icon, color }, index) => (
            <Reveal className={`landing__step landing__tone--${color}`} key={number} delay={index * 0.07}>
              <span className="landing__step-number">{number}</span>
              <div className="landing__step-icon"><Icon size={21} /></div>
              <h3>{title}</h3><p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="features" className="landing__features landing__section-wrap">
        <Reveal className="landing__section-heading">
          <p className="landing__eyebrow">YOUR LEARNING TOOLKIT</p>
          <h2>More than a list of lessons.<br /><em>Support for the whole journey.</em></h2>
        </Reveal>
        <div className="landing__feature-grid">
          {features.map(({ icon: Icon, title, text, color }, index) => (
            <Reveal className={`landing__feature landing__tone--${color}`} key={title} delay={index * 0.045}>
              <div className="landing__feature-icon"><Icon size={21} /></div>
              <span className="landing__feature-number">0{index + 1}</span>
              <h3>{title}</h3><p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="why-urpath" className="landing__roadmap">
        <div className="landing__roadmap-copy">
          <Reveal>
            <p className="landing__eyebrow">SEE YOUR NEXT STEPS</p>
            <h2>Big goals.<br /><em>Clear milestones.</em></h2>
            <p>Instead of wondering what comes next, see the topics that build on each other. Learn the foundations, move into deeper concepts and use projects to connect it all.</p>
            <Link to="/register" className="landing__text-link">Build my roadmap <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
        <Reveal className="landing__roadmap-board">
          <div className="landing__roadmap-title"><span>YOUR TRAIL / EXAMPLE</span><strong>Artificial Intelligence</strong></div>
          <div className="landing__trail">
            {[
              ["01", "Python foundations", "Get comfortable with the tools"],
              ["02", "Math for ML", "Understand the building blocks"],
              ["03", "Machine learning", "Train your first models"],
              ["04", "Deep learning", "Explore neural networks"],
              ["05", "Build a project", "Put your skills into practice"],
            ].map(([number, title, text], index) => (
              <motion.div className={`landing__trail-step landing__trail-step--${index + 1}`} key={number} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.35 }} transition={{ delay: index * 0.08, duration: 0.4 }}>
                <span>{number}</span><div><strong>{title}</strong><small>{text}</small></div>{index === 4 && <CheckCircle2 size={18} />}
              </motion.div>
            ))}
          </div>
          <div className="landing__roadmap-foot"><Sparkles size={15} /> Your path adapts to your goal and starting point.</div>
        </Reveal>
      </section>

      <section className="landing__closing">
        <div className="landing__closing-image"><img src="https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1600&q=85" alt="Mountain summit above the clouds" loading="lazy" /></div>
        <div className="landing__closing-shade" />
        <Reveal className="landing__closing-copy">
          <p className="landing__eyebrow">YOU DON'T HAVE TO FIGURE IT ALL OUT TODAY</p>
          <h2>Every summit begins<br />with a first step.</h2>
          <p>Bring your curiosity. UrPath will help you find a direction, understand what comes next and keep going.</p>
          <Link to="/register" className="landing__primary">Let's build your path <ArrowRight size={17} /></Link>
        </Reveal>
      </section>

      <footer className="landing__footer">
        <Link to="/" className="landing__footer-brand"><span className="navbar__brand-mark"><Mountain size={18} /></span><strong>UrPath</strong></Link>
        <span>Develop yourself. Build your path.</span>
        <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to summit ↑</a>
      </footer>
    </main>
  );
}

export default Landing;
