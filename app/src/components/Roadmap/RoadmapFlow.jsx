import { useMemo, useState } from "react";
import { LockKeyhole, Check, Flag, Play } from "lucide-react";
import "../../style/mountain-roadmap.css";

const WIDTH = 1000;
const HEIGHT = 1320;

const getPoint = (index, total) => {
  const top = 150;
  const bottom = 1160;
  const gap = total > 1 ? (bottom - top) / (total - 1) : 0;
  const y = bottom - index * gap;
  const xPattern = [180, 670, 330, 720, 250, 610, 390, 690];
  return { x: xPattern[index % xPattern.length], y };
};

const buildCurve = (points) => {
  if (!points.length) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1];
    const current = points[i];
    const midY = (previous.y + current.y) / 2;
    d += ` C ${previous.x} ${midY}, ${current.x} ${midY}, ${current.x} ${current.y}`;
  }
  return d;
};

function MountainBackground() {
  return (
    <g className="mountain-art" aria-hidden="true">
      <circle className="mountain-moon" cx="805" cy="170" r="58" />
      <path className="mountain-back" d="M0 1190 L180 900 290 1040 470 720 630 1010 790 760 1000 1100 1000 1320 0 1320Z" />
      <path className="mountain-mid" d="M0 1320 L150 1060 280 1140 420 830 570 1080 730 900 860 1110 1000 950 1000 1320Z" />
      <path className="mountain-front" d="M0 1320 L190 1160 320 1210 490 1010 620 1190 770 1080 1000 1210 1000 1320Z" />
      <path className="snow-line" d="M420 830 L455 905 490 850 520 910 570 1080" />
      <g className="mountain-stars">
        <circle cx="110" cy="160" r="2" /><circle cx="220" cy="245" r="2" /><circle cx="690" cy="105" r="2" />
        <circle cx="870" cy="300" r="2" /><circle cx="770" cy="400" r="1.5" /><circle cx="130" cy="440" r="1.5" />
      </g>
      <path className="mountain-birds" d="M90 300 q12 -10 24 0 q12 -10 24 0 M770 520 q10 -8 20 0 q10 -8 20 0" />
    </g>
  );
}

function Milestone({ milestone, point, index, onClick }) {
  const status = milestone.status || "upcoming";
  const locked = status === "locked";
  const completed = status === "completed";
  const current = status === "current";

  return (
    <g
      className={`mountain-milestone mountain-milestone--${status}`}
      onClick={() => !locked && onClick?.(milestone)}
      role={!locked ? "button" : undefined}
      tabIndex={!locked ? 0 : undefined}
      onKeyDown={(event) => {
        if (!locked && (event.key === "Enter" || event.key === " ")) onClick?.(milestone);
      }}
    >
      <circle className="milestone-halo" cx={point.x} cy={point.y} r={current ? 31 : 25} />
      <circle className="milestone-ring" cx={point.x} cy={point.y} r={current ? 25 : 21} />
      <circle className="milestone-core" cx={point.x} cy={point.y} r={current ? 18 : 15} />
      <foreignObject x={point.x - 12} y={point.y - 12} width="24" height="24">
        <div className="milestone-icon">
          {completed ? <Check size={15} /> : locked ? <LockKeyhole size={13} /> : current ? <Play size={12} fill="currentColor" /> : <span>{milestone.number || index + 1}</span>}
        </div>
      </foreignObject>
      <foreignObject x={point.x + (index % 2 ? -285 : 35)} y={point.y - 48} width="250" height="100">
        <div className="milestone-label">
          <span>{completed ? "COMPLETED" : current ? "YOU ARE HERE" : locked ? "LOCKED" : "UP NEXT"}</span>
          <strong>{milestone.title}</strong>
          {current && <small>{milestone.progress || 0}% complete</small>}
        </div>
      </foreignObject>
    </g>
  );
}

function RoadmapFlow({ roadmap, onMilestoneClick }) {
  const [selected, setSelected] = useState(null);
  const milestones = roadmap?.milestones || [];

  const points = useMemo(() => milestones.map((_, index) => getPoint(index, milestones.length)), [milestones.length]);
  const path = useMemo(() => buildCurve(points), [points]);
  const completedCount = milestones.filter((item) => item.status === "completed").length;
  const currentIndex = Math.max(0, milestones.findIndex((item) => item.status === "current"));
  const progressPoint = points[currentIndex] || points[points.length - 1];

  if (!roadmap) {
    return <div className="mountain-roadmap mountain-roadmap--empty"><h2>Your journey is waiting.</h2><p>Create a learning path to begin your climb.</p></div>;
  }

  const handleMilestoneClick = (milestone) => {
    setSelected(milestone);
    onMilestoneClick?.(milestone);
  };

  return (
    <div className="mountain-roadmap">
      <div className="mountain-roadmap__header">
        <div>
          <span>YOUR JOURNEY</span>
          <h2>{roadmap.title}</h2>
          <p>{roadmap.subtitle}</p>
        </div>
        <div className="mountain-roadmap__progress"><strong>{Math.round((completedCount / Math.max(milestones.length, 1)) * 100)}%</strong><small>climbed</small></div>
      </div>

      <div className="mountain-stage">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="mountain-svg" aria-label="Learning journey mountain">
          <defs>
            <linearGradient id="mountainSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--mountain-sky-top)" /><stop offset="1" stopColor="var(--mountain-sky-bottom)" /></linearGradient>
            <linearGradient id="trailGradient" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="var(--trail-muted)" /><stop offset="1" stopColor="var(--trail-active)" /></linearGradient>
          </defs>
          <rect width={WIDTH} height={HEIGHT} rx="28" fill="url(#mountainSky)" />
          <MountainBackground />
          <g className="trail-layer">
            <path d={path} className="trail-shadow" />
            <path d={path} className="trail-base" />
            <path d={path} className="trail-progress" style={{ strokeDashoffset: currentIndex >= 0 ? `${Math.max(0, milestones.length - completedCount) * 110}` : 0 }} />
          </g>

          <g className="summit">
            <path d="M455 100 L500 35 L545 100Z" className="summit-peak" />
            <path d="M482 72 L500 35 L516 72 L500 61Z" className="summit-snow" />
            <line x1="548" y1="78" x2="548" y2="24" className="summit-flag-pole" />
            <path d="M548 25 Q575 34 594 24 L594 52 Q573 60 548 51Z" className="summit-flag" />
            <foreignObject x="400" y="105" width="200" height="80"><div className="summit-copy"><span>YOUR SUMMIT</span><strong>{roadmap.title}</strong></div></foreignObject>
          </g>

          {milestones.map((milestone, index) => <Milestone key={milestone.id} milestone={milestone} point={points[index]} index={index} onClick={handleMilestoneClick} />)}

          {progressPoint && <circle className="journey-marker" cx={progressPoint.x} cy={progressPoint.y} r="7" />}
          <g className="start-marker"><circle cx="155" cy="1210" r="20" /><foreignObject x="85" y="1235" width="150" height="45"><div>START YOUR CLIMB</div></foreignObject></g>
        </svg>
      </div>

      {selected && (
        <div className="mountain-detail">
          <div><span>{selected.number || "STEP"}</span><h3>{selected.title}</h3><p>{selected.description}</p></div>
          <button type="button" onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default RoadmapFlow;
