import { useMemo, useState } from "react";
import { Check, Flag, LockKeyhole, Play, Sparkles } from "lucide-react";
import "../../style/mountain-roadmap.css";

const WIDTH = 1100;
const HEIGHT = 1450;

const getPoint = (index, total) => {
  const top = 190;
  const bottom = 1260;
  const gap = total > 1 ? (bottom - top) / (total - 1) : 0;
  const y = bottom - index * gap;
  const patterns = [
    { x: 190, yOffset: 0 },
    { x: 720, yOffset: 0 },
    { x: 355, yOffset: 0 },
    { x: 820, yOffset: 0 },
    { x: 275, yOffset: 0 },
    { x: 650, yOffset: 0 },
    { x: 445, yOffset: 0 },
    { x: 760, yOffset: 0 },
  ];
  const point = patterns[index % patterns.length];
  return { x: point.x, y: y + point.yOffset };
};

const buildCurve = (points) => {
  if (!points.length) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1];
    const current = points[i];
    const bend = Math.min(150, Math.abs(current.x - previous.x) * 0.42);
    const direction = current.x > previous.x ? 1 : -1;
    d += ` C ${previous.x + bend * direction} ${previous.y - 70}, ${current.x - bend * direction} ${current.y + 70}, ${current.x} ${current.y}`;
  }
  return d;
};

function MountainBackground() {
  return (
    <g className="mountain-art" aria-hidden="true">
      <circle className="sun-glow" cx="850" cy="220" r="115" />
      <circle className="mountain-moon" cx="850" cy="220" r="47" />

      <path className="cloud cloud-one" d="M90 300 C120 270 155 280 170 305 C195 275 250 290 255 325 C210 338 140 340 92 325Z" />
      <path className="cloud cloud-two" d="M735 470 C765 440 805 450 818 475 C845 445 895 460 900 495 C850 505 790 505 738 495Z" />

      <path className="mountain-back" d="M0 1270 L130 1010 245 1125 405 820 555 1080 720 790 900 1070 1035 920 1100 1040 1100 1450 0 1450Z" />
      <path className="mountain-mid" d="M0 1450 L160 1170 300 1240 470 930 600 1150 770 900 925 1190 1040 1080 1100 1220 1100 1450Z" />
      <path className="mountain-front" d="M0 1450 L170 1300 320 1340 505 1110 650 1300 805 1190 980 1330 1100 1250 1100 1450Z" />

      <path className="snow-cap" d="M405 820 L455 905 L480 870 L505 930 L555 1080 L500 1025 L470 1045 L438 965 L400 940 L370 985 L350 945Z" />
      <path className="snow-cap snow-cap-small" d="M720 790 L760 855 L790 820 L820 885 L860 970 L805 930 L775 945 L750 900 L715 915 L690 875Z" />

      <g className="pine pine-a"><path d="M120 1160 l28 -65 28 65z M128 1130 l20 -58 20 58z" /><rect x="144" y="1160" width="8" height="32" /></g>
      <g className="pine pine-b"><path d="M915 1130 l34 -82 34 82z M922 1090 l27 -68 27 68z" /><rect x="945" y="1130" width="9" height="34" /></g>
      <g className="pine pine-c"><path d="M1030 1190 l26 -62 26 62z M1036 1160 l20 -52 20 52z" /><rect x="1052" y="1190" width="8" height="28" /></g>

      <g className="mountain-stars">
        <circle cx="105" cy="170" r="2" /><circle cx="220" cy="245" r="1.7" /><circle cx="410" cy="130" r="1.5" />
        <circle cx="620" cy="190" r="2" /><circle cx="965" cy="125" r="1.7" /><circle cx="1000" cy="320" r="1.5" />
        <circle cx="590" cy="410" r="1.5" /><circle cx="130" cy="470" r="1.4" />
      </g>

      <path className="mountain-birds" d="M95 380 q12 -10 24 0 q12 -10 24 0 M820 610 q10 -8 20 0 q10 -8 20 0" />
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
      <circle className="milestone-halo" cx={point.x} cy={point.y} r={current ? 38 : 31} />
      <circle className="milestone-ring" cx={point.x} cy={point.y} r={current ? 27 : 23} />
      <circle className="milestone-core" cx={point.x} cy={point.y} r={current ? 19 : 16} />
      <foreignObject x={point.x - 14} y={point.y - 14} width="28" height="28">
        <div className="milestone-icon">
          {completed ? <Check size={16} /> : locked ? <LockKeyhole size={14} /> : current ? <Play size={12} fill="currentColor" /> : <span>{milestone.number || index + 1}</span>}
        </div>
      </foreignObject>
      <foreignObject x={index % 2 ? point.x - 330 : point.x + 45} y={point.y - 58} width="280" height="116">
        <div className="milestone-label">
          <span>{completed ? "SUMMIT CHECKPOINT" : current ? "● YOU ARE HERE" : locked ? "LOCKED CHECKPOINT" : "NEXT CHECKPOINT"}</span>
          <strong>{milestone.title}</strong>
          {current && <small>{milestone.progress || 0}% complete · keep climbing</small>}
          {!current && !locked && <small>{milestone.lessonsCount || 0} lessons · {milestone.hours || 0}h</small>}
        </div>
      </foreignObject>
    </g>
  );
}

function RoadmapFlow({ roadmap, onMilestoneClick }) {
  const [selected, setSelected] = useState(null);
  const milestones = roadmap?.milestones || [];

  const points = useMemo(
    () => milestones.map((_, index) => getPoint(index, milestones.length)),
    [milestones.length]
  );
  const path = useMemo(() => buildCurve(points), [points]);
  const completedCount = milestones.filter((item) => item.status === "completed").length;
  const currentIndex = Math.max(0, milestones.findIndex((item) => item.status === "current"));
  const progressIndex = completedCount > 0 ? Math.min(completedCount, points.length - 1) : currentIndex;
  const progressPoint = points[progressIndex];
  const progressPercent = milestones.length
    ? Math.round((completedCount / milestones.length) * 100)
    : 0;

  if (!roadmap) {
    return (
      <div className="mountain-roadmap mountain-roadmap--empty">
        <Sparkles size={22} />
        <h2>Your journey is waiting.</h2>
        <p>Create a learning path to begin your climb.</p>
      </div>
    );
  }

  const handleMilestoneClick = (milestone) => {
    setSelected(milestone);
    onMilestoneClick?.(milestone);
  };

  return (
    <div className="mountain-roadmap">
      <div className="mountain-roadmap__header">
        <div>
          <span>THE CLIMB</span>
          <h2>{roadmap.title}</h2>
          <p>Every checkpoint is a skill. Complete the work below and watch your path move toward the summit.</p>
        </div>
        <div className="mountain-roadmap__progress">
          <strong>{progressPercent}%</strong>
          <small>climbed</small>
        </div>
      </div>

      <div className="mountain-stage">
        <div className="stage-vignette" />
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="mountain-svg" aria-label="Learning journey mountain">
          <defs>
            <linearGradient id="mountainSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--mountain-sky-top)" />
              <stop offset="0.58" stopColor="var(--mountain-sky-mid)" />
              <stop offset="1" stopColor="var(--mountain-sky-bottom)" />
            </linearGradient>
            <linearGradient id="trailGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="var(--trail-active)" />
              <stop offset="1" stopColor="var(--trail-highlight)" />
            </linearGradient>
            <linearGradient id="snowGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--mountain-snow)" />
              <stop offset="1" stopColor="transparent" />
            </linearGradient>
          </defs>

          <rect width={WIDTH} height={HEIGHT} rx="30" fill="url(#mountainSky)" />
          <MountainBackground />

          <g className="trail-layer">
            <path d={path} className="trail-shadow" />
            <path d={path} className="trail-base" />
            <path d={path} className="trail-progress" />
          </g>

          <g className="summit">
            <path d="M455 170 L550 42 L645 170Z" className="summit-peak" />
            <path d="M510 105 L550 42 L590 105 L550 88Z" className="summit-snow" />
            <path d="M550 42 L590 105 L550 88 L510 105Z" className="summit-shadow" />
            <line x1="655" y1="105" x2="655" y2="45" className="summit-flag-pole" />
            <path d="M655 46 Q690 58 720 45 L720 78 Q688 90 655 76Z" className="summit-flag" />
            <foreignObject x="400" y="180" width="300" height="80">
              <div className="summit-copy"><span>YOUR SUMMIT</span><strong>{roadmap.title}</strong></div>
            </foreignObject>
          </g>

          {milestones.map((milestone, index) => (
            <Milestone
              key={milestone.id}
              milestone={milestone}
              point={points[index]}
              index={index}
              onClick={handleMilestoneClick}
            />
          ))}

          {progressPoint && (
            <g className="journey-marker-group">
              <circle className="journey-marker-pulse" cx={progressPoint.x} cy={progressPoint.y} r="24" />
              <circle className="journey-marker" cx={progressPoint.x} cy={progressPoint.y} r="8" />
            </g>
          )}

          <g className="start-marker">
            <circle cx="155" cy="1320" r="23" />
            <path d="M155 1308 v24 M143 1320 h24" />
            <foreignObject x="65" y="1350" width="180" height="45">
              <div>START YOUR CLIMB</div>
            </foreignObject>
          </g>
        </svg>
      </div>

      {selected && (
        <div className="mountain-detail">
          <div>
            <span>{selected.number || "CHECKPOINT"}</span>
            <h3>{selected.title}</h3>
            <p>{selected.description || "Keep climbing. Complete this checkpoint to move farther up your path."}</p>
          </div>
          <button type="button" onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default RoadmapFlow;
