import { useEffect, useState } from "react";
import {
  ArrowDownRight, ArrowRight, BookOpen, BrainCircuit, Check, CheckCircle2,
  ChevronLeft, ChevronRight, CircleHelp, Compass, Flag, Layers3,
  LineChart, Map, Play, Sparkles, Target, Timer, Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { Link } from "react-router";
import Navbar from "../../components/layout/Navbar";
import "../../style/landing.css";

const slides = [
  {
    eyebrow: "YOUR GOAL. YOUR STARTING POINT.",
    title: "Learn a new skill.",
    accent: "Find your way forward.",
    text: "UrPath turns the thing you want to learn into a personal plan — shaped around what you already know and what you need next.",
    image: "https://www.onrec.com/sites/onrec/directory/files/AdobeStock_235776060.jpeg",
    imageAlt: "People learning and developing new skills",
    tag: "START WHERE YOU ARE",
    number: "01",
  },
  {
    eyebrow: "A PLAN BUILT AROUND YOU",
    title: "Less guessing.",
    accent: "More meaningful progress.",
    text: "Get a clear roadmap with topics in the right order, then work through lessons, recommended resources, quizzes and projects.",
    image: "https://thumbs.dreamstime.com/z/my-learning-plan-inscription-sheet-230785692.jpg",
    imageAlt: "A written learning plan on paper",
    tag: "KNOW YOUR NEXT STEP",
    number: "02",
  },
  {
    eyebrow: "KEEP YOUR GOAL IN SIGHT",
    title: "Every step counts.",
    accent: "Make the summit yours.",
    text: "Your goal is the summit. UrPath helps you break the climb into smaller milestones and see how far you have come.",
    image: "https://thumbs.dreamstime.com/b/conquer-summit-stay-focused-mission-snowy-mountain-path-to-success-embark-visual-journey-pinnacle-achievement-401418541.jpg",
    imageAlt: "A mountain summit representing a long-term goal",
    tag: "YOUR PROGRESS, MADE VISIBLE",
    number: "03",
  },
];

const domains = [
  {
    title: "Technology",
    detail: "Web development, AI, data science, cybersecurity and software engineering.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85",
    label: "BUILD DIGITAL SKILLS",
  },
  {
    title: "Design & creative",
    detail: "UI/UX, visual design, illustration, photography and creative tools.",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=85",
    label: "MAKE IDEAS REAL",
  },
  {
    title: "Languages",
    detail: "Create a structured path for English, French, Korean and more.",
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=1000&q=85",
    label: "OPEN NEW DOORS",
  },
  {
    title: "Business & science",
    detail: "Explore mathematics, finance, marketing, biology and other fields.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
    label: "GROW YOUR KNOWLEDGE",
  },
];

const workflow = [
  { number: "01", title: "Choose a goal", text: "Pick a domain and tell UrPath what you want to be able to do.", icon: Compass },
  { number: "02", title: "Find your level", text: "Complete a short assessment so your path can account for what you already know.", icon: Target },
  { number: "03", title: "Follow your roadmap", text: "Work through ordered topics, courses and learning resources at your own pace.", icon: Map },
  { number: "04", title: "Practice and improve", text: "Test your understanding with quizzes and projects, then track your progress.", icon: Trophy },
];

const capabilities = [
  { icon: Layers3, title: "A roadmap with direction", text: "See the foundations, the next topics and the milestones that connect them." },
  { icon: BookOpen, title: "Courses and resources", text: "Study through structured lessons and discover videos or other useful resources." },
  { icon: BrainCircuit, title: "Ask UrPath", text: "Get help with confusing concepts and ask questions while you learn." },
  { icon: CheckCircle2, title: "Quizzes and projects", text: "Check what you understand and turn theory into practical work." },
  { icon: LineChart, title: "Progress analytics", text: "See learning activity and progress over time instead of relying on guesswork." },
  { icon: Timer, title: "Focus Mode", text: "Set aside a study session and give one learning goal your attention." },
];

const weeklyProgress = [
  { day: "Mon", progress: 18 },
  { day: "Tue", progress: 26 },
  { day: "Wed", progress: 24 },
  { day: "Thu", progress: 39 },
  { day: "Fri", progress: 48 },
  { day: "Sat", progress: 57 },
  { day: "Sun", progress: 68 },
];
const skillProgress = [
  { name: "Completed", value: 68 },
  { name: "Remaining", value: 32 },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.14 }}
      transition={{ delay }}
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
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const previousSlide = () => setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((current) => (current + 1) % slides.length);

  return (
    <main className="landing">
      <Navbar />

      <section className="landing__hero" aria-label="Introducing UrPath">
        <div className="landing__hero-inner">
          <div className="landing__hero-copy">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                className="landing__hero-copy-inner"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
              >
                <p className="landing__eyebrow"><span />{slide.eyebrow}</p>
                <h1>{slide.title}<em>{slide.accent}</em></h1>
                <p className="landing__hero-lead">{slide.text}</p>
                <div className="landing__hero-actions">
                  <Link to="/register" className="landing__button landing__button--primary">Build my learning path <ArrowRight size={17} /></Link>
                  <a href="#how-it-works" className="landing__button-quiet"><span><Play size={13} fill="currentColor" /></span> How UrPath works</a>
                </div>
                <div className="landing__hero-proof"><Check size={15} /><span>Personalized learning</span><i /><span>Clear next steps</span><i /><span>Progress you can track</span></div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="landing__hero-visual">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.image}
                className="landing__hero-photo-wrap"
                initial={{ opacity: 0, scale: 0.97, x: 18 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.015, x: -12 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <img className="landing__hero-photo" src={slide.image} alt={slide.imageAlt} fetchPriority="high" />
                <div className="landing__hero-photo-shade" />
                <div className="landing__photo-index"><span>{slide.number}</span><span> / 03</span></div>
                <div className="landing__photo-caption"><span>{slide.tag}</span><Flag size={18} /></div>
              </motion.div>
            </AnimatePresence>
            <motion.div className="landing__hero-float" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
              <span className="landing__float-icon"><Target size={17} /></span>
              <span><small>YOUR NEXT STEP</small><strong>One clear goal at a time</strong></span>
              <ArrowDownRight size={19} />
            </motion.div>
            <div className="landing__hero-controls">
              <div className="landing__slide-dots" aria-label="Choose a hero slide">
                {slides.map((item, index) => (
                  <button type="button" key={item.number} onClick={() => setActiveSlide(index)} className={index === activeSlide ? "is-active" : ""} aria-label={"Show slide " + (index + 1)} aria-pressed={index === activeSlide}><span /></button>
                ))}
              </div>
              <div className="landing__slide-arrows">
                <button type="button" onClick={previousSlide} aria-label="Previous slide"><ChevronLeft size={18} /></button>
                <button type="button" onClick={nextSlide} aria-label="Next slide"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </div>
        <a href="#what-is-urpath" className="landing__scroll-cue">DISCOVER URPATH <ArrowDown size={14} /></a>
      </section>

      <section id="what-is-urpath" className="landing__intro landing__wrap">
        <Reveal className="landing__intro-heading">
          <p className="landing__eyebrow"><span />WHAT IS URPATH?</p>
          <h2>A personal learning guide,<br /><em>from first step to real skill.</em></h2>
        </Reveal>
        <Reveal className="landing__intro-body" delay={0.1}>
          <p>UrPath is a learning platform that helps you turn a goal into a plan you can actually follow. Instead of jumping between random tutorials and wondering what to study next, you get a roadmap shaped around your current level.</p>
          <p>Learn with courses and recommended resources, ask questions when you get stuck, test yourself with quizzes, build projects, and follow your progress over time. <strong>You bring the goal. UrPath helps map the way.</strong></p>
          <Link to="/register" className="landing__text-link">Start building your path <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      <section className="landing__friction">
        <div className="landing__friction-image">
          <img src="https://gadflyonthewallblog.wordpress.com/wp-content/uploads/2021/09/thumbnail_screen-shot-2021-09-30-at-3.57.56-pm.jpg" alt="A learner thinking through where to begin" loading="lazy" />
          <div className="landing__friction-image-label"><CircleHelp size={17} /><span>TOO MANY OPTIONS. NO CLEAR ORDER.</span></div>
        </div>
        <Reveal className="landing__friction-copy">
          <p className="landing__eyebrow"><span />SOUND FAMILIAR?</p>
          <h2>You want to learn.<br /><em>But what comes first?</em></h2>
          <p>You save tutorials, open ten tabs, start a course and then find another one. It can be hard to tell which topics matter, what depends on what, and whether you are improving.</p>
          <div className="landing__friction-points">
            <div><span>01</span><p><strong>Find your starting point</strong><small>Begin from your level, not from assumptions.</small></p></div>
            <div><span>02</span><p><strong>Know what comes next</strong><small>Follow a sequence instead of guessing.</small></p></div>
            <div><span>03</span><p><strong>See your progress</strong><small>Make your effort visible as you keep learning.</small></p></div>
          </div>
        </Reveal>
      </section>

      <section id="how-it-works" className="landing__workflow landing__wrap">
        <Reveal className="landing__section-heading">
          <p className="landing__eyebrow"><span />HOW IT WORKS</p>
          <h2>From a big ambition<br /><em>to your next small step.</em></h2>
          <p>UrPath gives your learning a structure without making the journey feel overwhelming.</p>
        </Reveal>
        <div className="landing__workflow-grid">
          {workflow.map(({ number, title, text, icon: Icon }, index) => (
            <Reveal className="landing__workflow-step" key={number} delay={index * 0.07}>
              <div className="landing__workflow-top"><span>{number}</span><Icon size={22} /></div>
              <h3>{title}</h3><p>{text}</p>
              {index < workflow.length - 1 && <ArrowRight className="landing__workflow-arrow" size={19} />}
            </Reveal>
          ))}
        </div>
      </section>

      <section id="domains" className="landing__domains">
        <div className="landing__wrap">
          <Reveal className="landing__section-heading landing__section-heading--split">
            <div><p className="landing__eyebrow"><span />WHAT CAN YOU LEARN?</p><h2>One platform.<br /><em>Many possible paths.</em></h2></div>
            <p>UrPath is not limited to one subject. Explore a skill you need for work, a subject you are curious about, or a goal you have been putting off.</p>
          </Reveal>
          <div className="landing__domain-grid">
            {domains.map((item, index) => (
              <Reveal className="landing__domain-card" key={item.title} delay={index * 0.055}>
                <div className="landing__domain-photo"><img src={item.image} alt="" loading="lazy" /></div>
                <div className="landing__domain-copy"><span>{item.label}</span><h3>{item.title}</h3><p>{item.detail}</p><Link to="/register" aria-label={"Explore " + item.title}><ArrowRight size={18} /></Link></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className="landing__roadmap-section">
        <div className="landing__wrap landing__roadmap-layout">
          <Reveal className="landing__roadmap-copy">
            <p className="landing__eyebrow"><span />YOUR PERSONAL ROADMAP</p>
            <h2>See the route.<br /><em>Understand each step.</em></h2>
            <p>Your roadmap breaks a learning goal into connected topics and milestones. Start with foundations, move into more advanced ideas, and use projects to connect what you learn.</p>
            <ul>
              <li><CheckCircle2 size={17} /> Topics arranged in a useful order</li>
              <li><CheckCircle2 size={17} /> Smaller milestones toward your goal</li>
              <li><CheckCircle2 size={17} /> A clear next step when you return</li>
            </ul>
            <Link to="/register" className="landing__text-link">Create my roadmap <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal className="landing__roadmap-preview" delay={0.1}>
            <div className="landing__preview-top"><div><span>EXAMPLE ROADMAP</span><h3>Artificial Intelligence</h3></div><span className="landing__preview-status"><i /> LEARNING PATH</span></div>
            <div className="landing__roadmap-list">
              <div className="landing__roadmap-item is-complete"><span className="landing__roadmap-node"><Check size={15} /></span><div><small>FOUNDATION 01</small><strong>Python foundations</strong><p>Core syntax, data structures and problem solving</p></div><span className="landing__roadmap-state">DONE</span></div>
              <div className="landing__roadmap-item is-complete"><span className="landing__roadmap-node"><Check size={15} /></span><div><small>FOUNDATION 02</small><strong>Math for machine learning</strong><p>Linear algebra, probability and statistics</p></div><span className="landing__roadmap-state">DONE</span></div>
              <div className="landing__roadmap-item is-current"><span className="landing__roadmap-node">03</span><div><small>CORE SKILL</small><strong>Machine learning</strong><p>Understand models, training and evaluation</p></div><span className="landing__roadmap-state">NOW</span></div>
              <div className="landing__roadmap-item"><span className="landing__roadmap-node">04</span><div><small>GO DEEPER</small><strong>Deep learning</strong><p>Explore neural networks and practical use cases</p></div></div>
              <div className="landing__roadmap-item"><span className="landing__roadmap-node">05</span><div><small>PUT IT TO WORK</small><strong>Build a project</strong><p>Apply your knowledge to a real problem</p></div></div>
            </div>
            <div className="landing__preview-note"><Sparkles size={15} /> Example only — your roadmap is based on your chosen goal and level.</div>
          </Reveal>
        </div>
      </section>

      <section id="progress" className="landing__progress-section landing__wrap">
        <Reveal className="landing__section-heading">
          <p className="landing__eyebrow"><span />PROGRESS YOU CAN SEE</p>
          <h2>Make effort visible.<br /><em>Build momentum over time.</em></h2>
          <p>UrPath's progress area helps you reflect on learning activity and milestones. This preview uses sample values to show how progress can be visualized.</p>
        </Reveal>
        <Reveal className="landing__analytics" delay={0.08}>
          <div className="landing__analytics-head"><div><span>PROGRESS OVERVIEW</span><h3>Your learning, at a glance</h3></div><span className="landing__sample-pill">SAMPLE PREVIEW</span></div>
          <div className="landing__metric-row">
            <div className="landing__metric"><span>ROADMAP PROGRESS</span><strong>68<small>%</small></strong><em><ArrowRight size={13} /> Example milestone completion</em></div>
            <div className="landing__metric"><span>STUDY SESSIONS</span><strong>12</strong><em><Timer size={13} /> Sessions in this example</em></div>
            <div className="landing__metric"><span>ACTIVE GOALS</span><strong>3</strong><em><Target size={13} /> Learning paths in progress</em></div>
          </div>
          <div className="landing__charts">
            <div className="landing__chart-card landing__chart-card--wide">
              <div className="landing__chart-heading"><div><h4>Weekly learning progress</h4><p>Illustrative progress trend</p></div><span className="landing__chart-legend"><i /> Progress</span></div>
              <div className="landing__area-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyProgress} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="landingProgressFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#367f91" stopOpacity={0.25} /><stop offset="95%" stopColor="#367f91" stopOpacity={0.015} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="var(--land-chart-grid)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--land-chart-muted)", fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--land-chart-muted)", fontSize: 10 }} />
                    <Tooltip contentStyle={{ border: "1px solid var(--land-line)", borderRadius: 10, background: "var(--land-paper)", color: "var(--land-text)", fontSize: 12 }} formatter={(value) => [value + "%", "Progress"]} />
                    <Area type="monotone" dataKey="progress" stroke="#367f91" strokeWidth={3} fill="url(#landingProgressFill)" activeDot={{ r: 5, fill: "#c28d55", stroke: "var(--land-paper)", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="landing__chart-card landing__chart-card--completion">
              <div className="landing__chart-heading"><div><h4>Goal completion</h4><p>Sample roadmap</p></div></div>
              <div className="landing__donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={skillProgress} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="68%" outerRadius="86%" startAngle={90} endAngle={-270} paddingAngle={2} stroke="none"><Cell fill="#367f91" /><Cell fill="var(--land-chart-rest)" /></Pie></PieChart>
                </ResponsiveContainer>
                <div className="landing__donut-center"><strong>68%</strong><span>complete</span></div>
              </div>
              <div className="landing__donut-key"><span><i /> Completed</span><span><i /> Remaining</span></div>
            </div>
          </div>
          <p className="landing__analytics-foot"><CircleHelp size={14} /> These are sample visuals, not live account data.</p>
        </Reveal>
      </section>

      <section id="features" className="landing__capabilities">
        <div className="landing__wrap">
          <Reveal className="landing__section-heading">
            <p className="landing__eyebrow"><span />YOUR LEARNING TOOLKIT</p>
            <h2>Everything supports<br /><em>the same goal: your growth.</em></h2>
          </Reveal>
          <div className="landing__capability-grid">
            {capabilities.map(({ icon: Icon, title, text }, index) => (
              <Reveal className="landing__capability" key={title} delay={index * 0.045}>
                <div className="landing__capability-icon"><Icon size={20} /></div><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="landing__summit">
        <div className="landing__summit-image"><img src="https://thumbs.dreamstime.com/b/conquer-summit-stay-focused-mission-snowy-mountain-path-to-success-embark-visual-journey-pinnacle-achievement-401418541.jpg" alt="A snowy summit standing for a meaningful learning goal" loading="lazy" /><div className="landing__summit-image-shade" /><div className="landing__summit-label"><Flag size={17} /><span>YOUR SUMMIT</span><strong>The skill you set out to achieve</strong></div></div>
        <Reveal className="landing__summit-copy">
          <p className="landing__eyebrow"><span />THE IDEA BEHIND THE NAME</p>
          <h2>Your goal is the summit.<br /><em>Your roadmap is the route.</em></h2>
          <p>The mountain is a metaphor for learning, not the subject of the platform. The summit represents the skill you want to reach. Each topic is a step, each milestone is progress, and the flag marks the goal you are working toward.</p>
          <Link to="/register" className="landing__button landing__button--primary">Start your journey <ArrowRight size={17} /></Link>
        </Reveal>
      </section>

      <section className="landing__closing">
        <div className="landing__closing-image"><img src="https://www.onrec.com/sites/onrec/directory/files/AdobeStock_235776060.jpeg" alt="" loading="lazy" /></div>
        <div className="landing__closing-shade" />
        <Reveal className="landing__closing-content">
          <p className="landing__eyebrow"><span />YOU DO NOT NEED EVERY ANSWER TODAY</p>
          <h2>Start with a goal.<br /><em>Let the path take shape.</em></h2>
          <p>Whether you are learning for a career, a project or your own curiosity, UrPath helps you turn intention into consistent action.</p>
          <Link to="/register" className="landing__button landing__button--primary">Build my learning path <ArrowRight size={17} /></Link>
        </Reveal>
      </section>

      <footer className="landing__footer">
        <Link to="/" className="landing__footer-brand"><span><Flag size={16} /></span><strong>UrPath</strong></Link>
        <p>Develop yourself. Build your path.</p>
        <div><a href="#what-is-urpath">About</a><a href="#how-it-works">How it works</a><a href="#progress">Progress</a><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top ↑</a></div>
      </footer>
    </main>
  );
}

export default Landing;
