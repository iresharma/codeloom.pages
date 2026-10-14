"use client";

import { useMemo, useState, type ReactNode } from "react";
import { FlowCanvas, link, step } from "../../../components/flow";

type Agent = {
  id: string;
  profile: string;
  parent_id: string | null;
  status: string;
};

export function RecordedAgentFlow({
  agents,
  renderAgent,
}: {
  agents: Agent[];
  renderAgent: (id: string) => ReactNode;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const { nodes, edges, levels } = useMemo(() => {
    const byId = new Map(agents.map((a) => [a.id, a]));
    const depth = (id: string, seen = new Set<string>()): number => {
      const agent = byId.get(id);
      if (!agent?.parent_id || !byId.has(agent.parent_id) || seen.has(id))
        return 0;
      return 1 + depth(agent.parent_id, new Set([...seen, id]));
    };
    const rows = new Map<number, Agent[]>();
    agents.forEach((a) => {
      const d = depth(a.id);
      rows.set(d, [...(rows.get(d) ?? []), a]);
    });
    const nodes = [...rows].flatMap(([d, row]) =>
      row.map((a, i) => ({
        ...step(a.id, (i - (row.length - 1) / 2) * 160, d * 100, {
          label: a.id === "root" ? "Root controller" : a.profile,
          sub: a.status,
          width: 140,
          tone: a.id === "root" ? "accent" : "default",
          onChoose: () =>
            setSelected((current) => (current === a.id ? null : a.id)),
        }),
        focusable: false,
      })),
    );
    const edges = agents
      .filter(
        (a) => a.parent_id && byId.has(a.parent_id) && a.parent_id !== a.id,
      )
      .map((a) => link(a.parent_id!, a.id));
    return { nodes, edges, levels: rows.size };
  }, [agents]);
  return (
    <div className="border border-white/10">
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        selectedId={selected}
        onSelect={setSelected}
        heightClass={
          levels === 1 ? "h-[190px]" : levels > 3 ? "h-[500px]" : "h-[360px]"
        }
        padding={0.12}
        ariaLabel="Recorded agent parent relationships"
        hint="select an agent"
      />
      {selected ? (
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="min-h-11 px-3 text-xs text-[#7eb5d0]"
            >
              Close agent details ×
            </button>
          </div>
          {renderAgent(selected)}
        </div>
      ) : (
        <p className="border-t border-white/10 px-5 py-3 text-xs text-[#9ba6af]">
          Select an agent for its task, tools and outcome. Lines show recorded
          parents, not execution order.
        </p>
      )}
    </div>
  );
}
