import { useReducedMotion } from "motion/react";
import { motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  Compass,
  Flag,
  Layers3,
  ListChecks,
  Route,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
import Navbar from "../../components/layout/Navbar";
import "../../style/landing.css";

const steps = [
  { number: "01", icon: Compass, title: "Choose your direction", text: "Tell UrPath what you want to learn, why it matters, and how much time you have." },
  { number: "02", icon: Target, title: "Find your starting point", text: "A short assessment helps establish what you already know and where to begin." },
  { number: "03", icon: Route, title: "Follow your path", text: "Move through a structured roadmap, practise what you learn, and see your progress." },
];

const features = [
  { icon: Layers3, number: "01", title: "A roadmap that makes sense", text: "See how topics connect, what to learn first, and what your next step should be." },
  { icon: BookOpen, number: "02", title: "Learning in one place", text: "Bring courses, useful resources, practice, and projects into a more focused routine." },
  { icon: BrainCircuit, number: "03", title: "Help when you get stuck", text: "Ask UrPath about difficult concepts and keep moving instead of losing your momentum." },
  { icon: ListChecks, number: "04", title: "Practice that checks understanding", text: "Use assessments and quizzes to identify gaps and reinforce what you have learned." },
  { icon: TrendingUp, number: "05", title: "Progress you can reflect on", text: "Review your learning activity and milestones so your effort is easier to recognise." },
  { icon: Timer, number: "06", title: "Time to focus", text: "Use Focus Mode to set aside a session for the skill you are working toward." },
];

const paths = ["Technology & AI", "Design & creativity", "Languages", "Business", "Science & maths", "And more"];

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProductPreview() {
  return (
    <div className="lp-product" aria-label="Illustrative UrPath roadmap preview">
      <div className="lp-product__top">
        <div className="lp-product__brand"><span className="lp-product__mark">U</span><span>your learning space</span></div>
        <span className="lp-product__status"><i /> YOUR ROADMAP</span>
      </div>
      <div className="lp-product__intro">
        <span className="lp-product__eyebrow">A PATH BUILT AROUND YOU</span>
        <h2>Learn Artificial Intelligence</h2>
        <p>One step at a time. Your example roadmap.</p>
      </div>
      <div className="lp-product__progress">
        <div><span>YOUR LEARNING PATH</span><strong>Clear steps, connected skills</strong></div>
        <div className="lp-product__progress-track"><span /></div>
      </div>
      <div className="lp-product__steps">
        <div className="lp-product__step is-done">
          <span className="lp-product__node"><Check size={14} /></span>
          <div><small>THE FOUNDATION</small><strong>Python fundamentals</strong><p>Build confidence with the basics</p></div>
          <CheckCircle2 className="lp-product__check" size={17} />
        </div>
        <div className="lp-product__step is-current">
          <span className="lp-product__node">02</span>
          <div><small>YOUR CURRENT STEP</small><strong>Math for machine learning</strong><p>Connect the ideas behind the models</p></div>
          <ArrowDownRight className="lp-product__step-arrow" size={17} />
        </div>
        <div className="lp-product__step">
          <span className="lp-product__node">03</span>
          <div><small>NEXT UP</small><strong>Machine learning</strong><p>Explore models and how they learn</p></div>
        </div>
      </div>
      <div className="lp-product__bottom"><span><Sparkles size={15} /> Your goal sets the direction</span><span>EXAMPLE PREVIEW</span></div>
    </div>
  );
}

function Landing() {
  return (
    <main className="landing">
      <Navbar />

      <section className="lp-hero" id="top">
        <div className="lp-hero__backdrop" />
        <div className="lp-hero__grain" />
        <div className="lp-hero__content">
          <Reveal className="lp-hero__copy">
            <p className="lp-eyebrow lp-eyebrow--light"><span /> A CLEARER WAY TO LEARN</p>
            <h1>Turn what you want to learn into <em>a path you can follow.</em></h1>
            <p className="lp-hero__lead">Less jumping between tutorials. Less wondering what comes next. More direction, practice, and progress — built around your goal.</p>
            <div className="lp-hero__actions">
              <Link to="/register" className="lp-button lp-button--primary">Build my learning path <ArrowRight size={17} /></Link>
              <a href="#how-it-works" className="lp-button lp-button--text">See how it works <ArrowDownRight size={17} /></a>
            </div>
            <div className="lp-hero__trust"><span><Check size={14} /> Start from your level</span><span><Check size={14} /> Learn at your pace</span></div>
          </Reveal>
          <Reveal className="lp-hero__preview" delay={0.12}>
            <ProductPreview />
            <div className="lp-floating-note"><span><Flag size={17} /></span><div><small>KEEP YOUR GOAL IN SIGHT</small><strong>One clear next step.</strong></div></div>
          </Reveal>
        </div>
        <a className="lp-scroll" href="#why-urpath"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={15} /></a>
        <div className="lp-hero__index"><span>01</span><i /> A PERSONAL LEARNING GUIDE</div>
      </section>

      <section className="lp-problem" id="why-urpath">
        <Reveal className="lp-problem__title">
          <p className="lp-eyebrow"><span /> THE PROBLEM ISN'T YOUR AMBITION</p>
          <h2>It's knowing <em>what to do next.</em></h2>
        </Reveal>
        <Reveal className="lp-problem__body" delay={0.08}>
          <p>You have a goal. You find tutorials, save courses, and start learning — but the next step is not always obvious. Some topics depend on others. Some resources repeat the same things. Progress can start to feel scattered.</p>
          <p className="lp-problem__answer"><Sparkles size={18} /> UrPath gives your effort a structure, so you can spend less time figuring out where to start and more time learning.</p>
        </Reveal>
      </section>

      <section className="lp-how" id="how-it-works">
        <div className="lp-section-head">
          <Reveal>
            <p className="lp-eyebrow"><span /> A SIMPLE STARTING POINT</p>
            <h2>Big goal.<br /><em>Clear next steps.</em></h2>
          </Reveal>
          <Reveal className="lp-section-head__aside" delay={0.08}>
            <p>You do not need to plan every step yourself. Start with what you want to achieve; UrPath helps shape the journey.</p>
          </Reveal>
        </div>
        <div className="lp-steps">
          {steps.map(({ number, icon: Icon, title, text }, index) => (
            <Reveal className="lp-step" key={number} delay={index * 0.07}>
              <div className="lp-step__top"><span>{number}</span><Icon size={21} strokeWidth={1.7} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="lp-step__line"><span /></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="lp-roadmap">
        <div className="lp-roadmap__visual">
          <div className="lp-roadmap__image" />
          <div className="lp-roadmap__quote"><span>“</span><p>You don't have to see the whole way. Just the next step.</p><small>THE URPATH APPROACH</small></div>
        </div>
        <Reveal className="lp-roadmap__copy">
          <p className="lp-eyebrow"><span /> YOUR GOAL, MADE PRACTICAL</p>
          <h2>A roadmap that gives learning <em>direction.</em></h2>
          <p>Instead of treating learning as a pile of disconnected lessons, UrPath organises your journey into topics and milestones that build on each other.</p>
          <ul>
            <li><CheckCircle2 size={17} /> Know what to focus on first</li>
            <li><CheckCircle2 size={17} /> Understand what comes after</li>
            <li><CheckCircle2 size={17} /> Return and pick up where you left off</li>
          </ul>
          <Link to="/register" className="lp-inline-link">Create your roadmap <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      <section className="lp-features" id="features">
        <div className="lp-section-head">
          <Reveal>
            <p className="lp-eyebrow"><span /> TOOLS THAT WORK TOGETHER</p>
            <h2>Everything has a place<br /><em>in your learning journey.</em></h2>
          </Reveal>
          <Reveal className="lp-section-head__aside" delay={0.08}>
            <p>One connected routine for planning, learning, practising, and reflecting — without losing sight of why you started.</p>
          </Reveal>
        </div>
        <div className="lp-feature-grid">
          {features.map(({ icon: Icon, number, title, text }, index) => (
            <Reveal className="lp-feature" key={number} delay={(index % 3) * 0.06}>
              <div className="lp-feature__meta"><span>{number}</span><Icon size={21} strokeWidth={1.7} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="lp-feature__corner"><ArrowUpRightIcon /></span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="lp-domains" id="explore">
        <Reveal className="lp-domains__intro">
          <p className="lp-eyebrow lp-eyebrow--light"><span /> YOUR INTEREST SETS THE DIRECTION</p>
          <h2>One path at a time.<br /><em>Whatever you want to learn.</em></h2>
          <p>From technical skills to creative interests, build a learning journey around the subject that matters to you.</p>
        </Reveal>
        <div className="lp-domain-list">
          {paths.map((path, index) => <div className="lp-domain-pill" key={path}><span>0{index + 1}</span><strong>{path}</strong><ArrowRight size={17} /></div>)}
        </div>
      </section>

      <section className="lp-final">
        <div className="lp-final__content">
          <Reveal>
            <p className="lp-eyebrow"><span /> YOU CAN START SMALL</p>
            <h2>You bring the goal.<br /><em>We'll help map the way.</em></h2>
            <p>Choose what you want to learn, set your pace, and take the first step with UrPath.</p>
            <Link to="/register" className="lp-button lp-button--primary">Start building your path <ArrowRight size={17} /></Link>
          </Reveal>
        </div>
        <div className="lp-final__mark" aria-hidden="true"><Route size={120} strokeWidth={0.7} /></div>
      </section>

      <footer className="lp-footer">
        <Link to="/" className="lp-footer__brand"><span>U</span> UrPath</Link>
        <p>Develop yourself. Build your path.</p>
        <div><a href="#why-urpath">Why UrPath</a><a href="#how-it-works">How it works</a><a href="#features">Features</a><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}

function ArrowUpRightIcon() {
  return <ArrowDownRight size={16} />;
}

export default Landing;
