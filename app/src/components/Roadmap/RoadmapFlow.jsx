import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function MapNode({ data }) {
  return (
    <div
      className={`learning-map-node learning-map-node--${data.type} ${
        data.status ? `is-${data.status}` : ""
      }`}
    >
      <Handle type="target" position={Position.Top} />

      {data.completed && (
        <span className="learning-map-node__check">✓</span>
      )}

      <span className="learning-map-node__label">
        {data.label}
      </span>

      <h3>{data.title}</h3>

      {data.progress !== undefined && (
        <div className="learning-map-node__progress">
          <span style={{ width: `${data.progress}%` }} />
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  learning: MapNode,
};

function RoadmapFlowContent({ roadmap }) {
  const { setCenter } = useReactFlow();

  const nodes = useMemo(() => {
    if (!roadmap) return [];

    return [
      {
        id: "goal",
        type: "learning",
        position: { x: 420, y: 40 },
        data: {
          type: "goal",
          label: "YOUR GOAL",
          title: roadmap.title,
        },
      },

      {
        id: "frontend",
        type: "learning",
        position: { x: 100, y: 220 },
        data: {
          type: "domain",
          label: "DOMAIN",
          title: "Frontend",
          status: "completed",
          completed: true,
        },
      },

      {
        id: "backend",
        type: "learning",
        position: { x: 420, y: 220 },
        data: {
          type: "domain",
          label: "DOMAIN",
          title: "Backend",
          status: "current",
        },
      },

      {
        id: "database",
        type: "learning",
        position: { x: 740, y: 220 },
        data: {
          type: "domain",
          label: "DOMAIN",
          title: "Database",
        },
      },

      {
        id: "react",
        type: "learning",
        position: { x: 20, y: 400 },
        data: {
          type: "topic",
          label: "TOPIC",
          title: "React",
          completed: true,
        },
      },

      {
        id: "css",
        type: "learning",
        position: { x: 230, y: 400 },
        data: {
          type: "topic",
          label: "TOPIC",
          title: "CSS",
          completed: true,
        },
      },

      {
        id: "express",
        type: "learning",
        position: { x: 420, y: 400 },
        data: {
          type: "topic",
          label: "TOPIC",
          title: "Express.js",
          status: "current",
          progress: 65,
        },
      },

      {
        id: "mongodb",
        type: "learning",
        position: { x: 700, y: 400 },
        data: {
          type: "topic",
          label: "TOPIC",
          title: "MongoDB",
          progress: 30,
        },
      },
    ];
  }, [roadmap]);

  const edges = useMemo(
    () => [
      {
        id: "goal-frontend",
        source: "goal",
        target: "frontend",
        type: "smoothstep",
      },
      {
        id: "goal-backend",
        source: "goal",
        target: "backend",
        type: "smoothstep",
      },
      {
        id: "goal-database",
        source: "goal",
        target: "database",
        type: "smoothstep",
      },
      {
        id: "frontend-react",
        source: "frontend",
        target: "react",
        type: "smoothstep",
      },
      {
        id: "frontend-css",
        source: "frontend",
        target: "css",
        type: "smoothstep",
      },
      {
        id: "backend-express",
        source: "backend",
        target: "express",
        type: "smoothstep",
      },
      {
        id: "database-mongodb",
        source: "database",
        target: "mongodb",
        type: "smoothstep",
      },
    ],
    []
  );

  const handleNodeClick = useCallback(
    (_, node) => {
      setCenter(
        node.position.x + 90,
        node.position.y + 45,
        {
          zoom: node.data.type === "goal" ? 1.1 : 1.5,
          duration: 700,
        }
      );
    },
    [setCenter]
  );

  return (
    <div className="learning-map">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.5}
        maxZoom={2.2}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
      >
        <Background gap={32} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

function RoadmapFlow({ roadmap }) {
  return (
    <ReactFlowProvider>
      <RoadmapFlowContent roadmap={roadmap} />
    </ReactFlowProvider>
  );
}

export default RoadmapFlow;