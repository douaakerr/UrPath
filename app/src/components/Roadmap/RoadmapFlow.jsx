import {
  BookOpen,
  Check,
  ChevronRight,
  Circle,
  FolderKanban,
  PlayCircle,
  Trophy,
} from "lucide-react";
import { useMemo } from "react";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../../style/roadmap.css";

function getTaskIcon(type) {
  if (type === "project") return <FolderKanban size={15} />;
  if (type === "quiz") return <Trophy size={15} />;
  return <BookOpen size={15} />;
}

function RoadmapNode({ data }) {
  return (
    <button
      type="button"
      className={`roadmap-node roadmap-node--${data.status || "upcoming"}`}
      onClick={data.onClick}
    >
      <Handle type="target" position={Position.Top} className="roadmap-handle" />
      <div className="roadmap-node__number">{data.number}</div>
      <div className="roadmap-node__body">
        <span>{data.label}</span>
        <strong>{data.title}</strong>
        {data.topics?.length > 0 && (
          <div className="roadmap-node__topics">
            {data.topics.slice(0, 3).map((topic, index) => (
              <em key={`${topic}-${index}`}>{topic}</em>
            ))}
            {data.topics.length > 3 && <em>+{data.topics.length - 3}</em>}
          </div>
        )}
        <div className="roadmap-node__footer">
          <span>{data.progress}% complete</span>
          <ChevronRight size={14} />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="roadmap-handle" />
    </button>
  );
}

const nodeTypes = { roadmap: RoadmapNode };

function RoadmapFlow({
  roadmap,
  courses = [],
  generatingTaskId,
  onTaskAction,
}) {
  const milestones = roadmap?.milestones || [];

  const nodes = useMemo(
    () =>
      milestones.map((milestone, index) => {
        const tasks = milestone.tasks || [];
        const firstTask = tasks.find((task) => !task.completed) || tasks[0];

        return {
          id: String(milestone.id || `milestone-${index}`),
          type: "roadmap",
          position: {
            x: index % 2 === 0 ? 90 : 410,
            y: index * 190 + 30,
          },
          data: {
            number: String(milestone.weekNumber || index + 1).padStart(2, "0"),
            label: `WEEK ${milestone.weekNumber || index + 1}`,
            title: milestone.title,
            topics: milestone.topics || [],
            progress: milestone.progress || 0,
            status: milestone.status || "upcoming",
            onClick: () =>
              firstTask &&
              onTaskAction?.({
                task: firstTask,
                milestone,
                course: courses.find(
                  (item) => String(item.taskId) === String(firstTask._id),
                ),
              }),
          },
        };
      }),
    [milestones, courses, onTaskAction],
  );

  const edges = useMemo(
    () =>
      milestones.slice(0, -1).map((milestone, index) => ({
        id: `edge-${index}`,
        source: String(milestone.id || `milestone-${index}`),
        target: String(
          milestones[index + 1]?.id || `milestone-${index + 1}`,
        ),
        type: "smoothstep",
        animated: milestones[index + 1]?.status === "current",
        className: "roadmap-edge",
      })),
    [milestones],
  );

  if (!roadmap || milestones.length === 0) {
    return (
      <div className="roadmap-empty">
        <h2>No roadmap yet</h2>
        <p>Complete your learning assessment to create your path.</p>
      </div>
    );
  }

  return (
    <div className="roadmap-flow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnDoubleClick={false}
        minZoom={0.55}
        maxZoom={1.25}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={28} size={1} className="roadmap-flow__background" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export default RoadmapFlow;
