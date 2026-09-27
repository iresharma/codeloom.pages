"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import {
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "../lib/utils";

// Same palette the engine pages already use.
export const FLOW_COLORS = {
  text: "#d5dde3",
  muted: "#7a848c",
  line: "rgba(255,255,255,0.32)",
  accent: "#ff5c33",
  success: "#34d399",
  warn: "#f2c14e",
  danger: "#f87171",
  panel: "#0a0d10",
} as const;

export type FlowTone = "default" | "muted" | "accent" | "active" | "success" | "warn" | "danger" | "ghost";

type Side = "t" | "r" | "b" | "l";
const SIDES: Record<Side, Position> = { t: Position.Top, r: Position.Right, b: Position.Bottom, l: Position.Left };

export type StepData = {
  label: string;
  sub?: string;
  tag?: string;
  icon?: ComponentType<{ className?: string }>;
  tone?: FlowTone;
  width?: number;
  align?: "center" | "left";
};

export type StepNode = Node<StepData, "step">;
export type LaneNode = Node<{ label: string; width?: number }, "lane">;
export type FlowNode = StepNode | LaneNode;

const toneBox: Record<FlowTone, string> = {
  default: "border-white/20 bg-[#0c1014]",
  muted: "border-white/10 bg-[#0c1014] opacity-40",
  ghost: "border-dashed border-white/15 bg-transparent",
  accent: "border-[#ff5c33]/70 bg-[#ff5c33]/[0.08]",
  active: "border-[#d5dde3] bg-white/[0.08]",
  success: "border-[#34d399]/60 bg-[#34d399]/[0.08]",
  warn: "border-[#f2c14e]/60 bg-[#f2c14e]/[0.08]",
  danger: "border-[#f87171]/70 bg-[#f87171]/10",
};

const toneText: Record<FlowTone, string> = {
  default: "text-[#d5dde3]",
  muted: "text-[#7a848c]",
  ghost: "text-[#7a848c]",
  accent: "text-[#ff5c33]",
  active: "text-[#d5dde3]",
  success: "text-[#34d399]",
  warn: "text-[#f2c14e]",
  danger: "text-[#f87171]",
};

function Handles() {
  // Every side is both a source and a target; edges pick sides by id.
  return (
    <>
      {(Object.keys(SIDES) as Side[]).map((side) => (
        <span key={side}>
          <Handle id={`${side}-s`} type="source" position={SIDES[side]} isConnectable={false} className="!pointer-events-none !opacity-0" />
          <Handle id={`${side}-t`} type="target" position={SIDES[side]} isConnectable={false} className="!pointer-events-none !opacity-0" />
        </span>
      ))}
    </>
  );
}

function StepNodeView({ data, selected }: NodeProps<StepNode>) {
  const reduce = useReducedMotion();
  const tone = data.tone ?? "default";
  const Icon = data.icon;
  return (
    <div
      style={{ width: data.width ?? 168 }}
      className={cn(
        "relative border px-3 py-2.5 font-mono transition-[border-color,background-color,opacity] duration-300",
        toneBox[tone],
        selected && "ring-1 ring-[#ff5c33] ring-offset-2 ring-offset-[#0c1014]",
      )}
    >
      {tone === "active" && !reduce ? (
        <motion.span
          className="pointer-events-none absolute inset-0 border border-[#d5dde3]"
          animate={{ opacity: [0.7, 0], scale: [1, 1.08] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
        />
      ) : null}
      <Handles />
      <div className={cn("flex items-center gap-2", data.align !== "left" && "justify-center")}>
        {Icon ? <Icon className={cn("size-3.5 shrink-0", toneText[tone])} /> : null}
        <span className={cn("text-[12px] leading-5", toneText[tone])}>{data.label}</span>
        {data.tag ? (
          <span className="ml-auto border border-white/10 px-1 text-[9.5px] uppercase tracking-[0.08em] text-[#7a848c]">
            {data.tag}
          </span>
        ) : null}
      </div>
      {data.sub ? (
        <p className={cn("mt-1 text-[10.5px] leading-4 text-[#7a848c]", data.align !== "left" && "text-center")}>
          {data.sub}
        </p>
      ) : null}
    </div>
  );
}

function LaneNodeView({ data }: NodeProps<LaneNode>) {
  return (
    <div
      style={{ width: data.width ?? 168 }}
      className="pointer-events-none text-center font-mono text-[10px] tracking-[0.2em] text-[#7a848c] uppercase"
    >
      {data.label}
    </div>
  );
}

const nodeTypes = { step: StepNodeView, lane: LaneNodeView };

export function step(
  id: string,
  x: number,
  y: number,
  data: StepData,
  opts: { selectable?: boolean } = {},
): StepNode {
  return { id, type: "step", position: { x, y }, data, selectable: opts.selectable ?? true, draggable: false };
}

export function lane(id: string, x: number, y: number, label: string, width?: number): LaneNode {
  return { id, type: "lane", position: { x, y }, data: { label, width }, selectable: false, draggable: false };
}

export type EdgeTone = "default" | "accent" | "success" | "warn" | "danger" | "muted";

const edgeColor: Record<EdgeTone, string> = {
  default: FLOW_COLORS.line,
  muted: "rgba(255,255,255,0.1)",
  accent: FLOW_COLORS.accent,
  success: FLOW_COLORS.success,
  warn: FLOW_COLORS.warn,
  danger: FLOW_COLORS.danger,
};

export function link(
  source: string,
  target: string,
  opts: {
    from?: Side;
    to?: Side;
    label?: string;
    tone?: EdgeTone;
    animated?: boolean;
    dashed?: boolean;
    curve?: "step" | "bezier" | "straight";
    id?: string;
  } = {},
): Edge {
  const tone = opts.tone ?? "default";
  const color = edgeColor[tone];
  return {
    id: opts.id ?? `${source}->${target}`,
    source,
    target,
    sourceHandle: `${opts.from ?? "b"}-s`,
    targetHandle: `${opts.to ?? "t"}-t`,
    type: opts.curve === "bezier" ? "default" : opts.curve === "straight" ? "straight" : "smoothstep",
    animated: opts.animated,
    label: opts.label,
    data: { tone },
    style: { stroke: color, strokeWidth: tone === "default" || tone === "muted" ? 1 : 1.5, strokeDasharray: opts.dashed ? "4 4" : undefined },
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
    labelStyle: { fill: tone === "default" || tone === "muted" ? FLOW_COLORS.muted : color, fontFamily: "var(--font-mono)", fontSize: 10.5 },
    labelBgStyle: { fill: "#080b0e" },
    labelBgPadding: [4, 2],
    focusable: false,
  };
}

/** Dims edges that don't touch `focusId`, so a selected node's paths stand out. */
function focusEdges(edges: Edge[], focusId: string | null): Edge[] {
  if (!focusId) return edges;
  return edges.map((edge) => {
    const touches = edge.source === focusId || edge.target === focusId;
    if (touches) return edge;
    return { ...edge, style: { ...edge.style, opacity: 0.45 }, labelStyle: { ...edge.labelStyle, opacity: 0.5 } };
  });
}

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return fine;
}

function AutoFit({ padding, deps }: { padding: number; deps: unknown }) {
  const flow = useReactFlow();
  const box = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = box.current?.closest(".react-flow");
    if (!el) return;
    const fit = () => void flow.fitView({ padding, duration: 0 });
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [flow, padding]);
  useEffect(() => {
    void flow.fitView({ padding, duration: 200 });
  }, [flow, padding, deps]);
  return <div ref={box} className="hidden" />;
}

type CanvasProps = {
  nodes: FlowNode[];
  edges: Edge[];
  /** Tailwind height classes; the canvas needs an explicit height. */
  heightClass?: string;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  padding?: number;
  ariaLabel: string;
  className?: string;
  /** Refits when this changes (e.g. a scenario switch that moves nodes). */
  layoutKey?: unknown;
  hint?: string;
  /** Narrowest the drawing gets; below it the frame scrolls sideways instead of shrinking the text. */
  minWidth?: number;
};

function Canvas({
  nodes,
  edges,
  heightClass = "h-[420px]",
  selectedId = null,
  onSelect,
  padding = 0.15,
  ariaLabel,
  className,
  layoutKey,
  hint,
  minWidth = 0,
}: CanvasProps) {
  const fine = useFinePointer();
  const [mounted, setMounted] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    // A drawing wider than a phone starts centred, not pinned to its left edge.
    const el = frame.current;
    if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [mounted]);

  const shownNodes = useMemo(
    () => nodes.map((node) => ({ ...node, selected: node.id === selectedId })),
    [nodes, selectedId],
  );
  const shownEdges = useMemo(() => focusEdges(edges, selectedId), [edges, selectedId]);

  return (
    <div
      ref={frame}
      role="figure"
      aria-label={ariaLabel}
      className={cn("engine-flow relative w-full overflow-x-auto overscroll-x-contain bg-[#080b0e]", heightClass, className)}
    >
      <div className="relative h-full" style={{ minWidth }}>
      {mounted ? (
        <ReactFlow
          nodes={shownNodes}
          edges={shownEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding }}
          minZoom={0.3}
          maxZoom={1.75}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={Boolean(onSelect)}
          panOnDrag={fine}
          zoomOnScroll={false}
          zoomOnPinch
          zoomOnDoubleClick={false}
          panOnScroll={false}
          preventScrolling={false}
          onNodeClick={(_, node) => {
            if (!onSelect || node.type === "lane") return;
            onSelect(node.id === selectedId ? null : node.id);
          }}
          onPaneClick={() => onSelect?.(null)}
          proOptions={{ hideAttribution: false }}
          colorMode="dark"
        >
          <AutoFit padding={padding} deps={layoutKey} />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      ) : null}
      {hint ? (
        <p className="pointer-events-none absolute top-3 left-4 font-mono text-[10px] tracking-[0.15em] text-[#7a848c]/70 uppercase">
          {hint}
        </p>
      ) : null}
      </div>
    </div>
  );
}

export function FlowCanvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
}

/** A detail panel under a canvas: shows the selected node's text, or a prompt. */
export function FlowDetail({
  title,
  body,
  empty = "Tap a node for details.",
}: {
  title?: string | null;
  body?: React.ReactNode;
  empty?: string;
}) {
  return (
    <div className="min-h-[5.5rem] border-t border-white/10 px-5 py-4 md:px-6">
      {title ? (
        <motion.div key={title} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <p className="font-mono text-[12px] font-bold text-[#d5dde3]">{title}</p>
          <div className="mt-1.5 text-[13px] leading-6 text-[#7a848c]">{body}</div>
        </motion.div>
      ) : (
        <p className="font-mono text-[11px] tracking-[0.1em] text-[#7a848c]/70 uppercase">{empty}</p>
      )}
    </div>
  );
}
