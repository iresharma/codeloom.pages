"use client";

import { useState } from "react";
import type { RunView } from "./run-types";
import { focusClass, Payload, seconds, money, statusColor } from "./run-ui";

export function RunRequests({ run }: { run: RunView }) {
  const [selected, setSelected] = useState(0);
  const request = run.requests[selected];
  if (!request)
    return (
      <p className="border border-white/10 p-6 text-sm text-[#9ba6af]">
        No broker request records published.
      </p>
    );
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1.1fr_1fr]">
      <div className="min-w-0 border border-white/10">
        <div className="border-b border-white/10 px-4 py-3 text-xs text-[#9ba6af]">
          {run.requests.length} recorded requests · select one to inspect
        </div>
        <div
          className={`h-[34rem] overflow-auto ${focusClass}`}
          role="region"
          aria-label="Model request list"
          tabIndex={0}
        >
          <table className="w-full min-w-[490px] text-left font-mono text-xs">
            <thead className="sticky top-0 z-10 bg-[#13191f] text-[#9ba6af]">
              <tr>
                {["Request", "Model / status", "Tokens", "Cost", "Elapsed"].map(
                  (h) => (
                    <th scope="col" className="px-3 py-3 font-normal" key={h}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {run.requests.map((r, i) => (
                <tr
                  key={`${r.id}-${i}`}
                  className={`border-b border-white/5 ${selected === i ? "bg-[#ff5c33]/10" : "hover:bg-white/[0.03]"}`}
                >
                  <th scope="row" className="px-2 font-normal">
                    <button
                      type="button"
                      aria-label={`Inspect request ${i + 1}`}
                      aria-pressed={selected === i}
                      onClick={() => setSelected(i)}
                      className={`min-h-11 w-full px-2 text-[#7eb5d0] ${focusClass}`}
                    >
                      #{String(i + 1).padStart(3, "0")}
                    </button>
                  </th>
                  <td className="max-w-40 px-3 py-2">
                    <span
                      className="block truncate text-[#d5dde3]"
                      title={r.model ?? undefined}
                    >
                      {r.model?.split("/").at(-1) ?? "Not recorded"}
                    </span>
                    <span
                      className={`mt-1 block ${statusColor(r.status ?? "unknown")}`}
                    >
                      {r.status?.replaceAll("_", " ") ?? "Unknown"}
                    </span>
                  </td>
                  <td className="px-3 text-[#c3cbd1]">
                    {r.usage?.total_tokens?.toLocaleString("en-US") ?? "—"}
                  </td>
                  <td className="px-3 text-[#c3cbd1]">
                    {money(r.usage?.cost)}
                  </td>
                  <td className="px-3 text-[#c3cbd1]">
                    {seconds(r.elapsed_s)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <article
        className="min-w-0 border border-white/10 bg-white/[0.02] p-5"
        aria-label={`Request ${selected + 1} details`}
      >
        <header className="flex items-center justify-between gap-3">
          <h2 className="font-mono text-sm text-[#d5dde3]">
            Request #{String(selected + 1).padStart(3, "0")}
          </h2>
          <span
            className={`font-mono text-xs ${statusColor(request.status ?? "unknown")}`}
          >
            {request.status?.replaceAll("_", " ") ?? "Unknown"}
          </span>
        </header>
        <p className="mt-2 break-all font-mono text-xs text-[#9ba6af]">
          {request.model ?? "Model not recorded"}
        </p>
        <dl className="my-5 grid grid-cols-2 gap-4 text-xs">
          {[
            ["Provider", request.providers.join(", ") || "Not recorded"],
            ["Reasoning effort", request.reasoning_effort ?? "Not recorded"],
            ["First byte", seconds(request.first_byte_s)],
            ["Queue", seconds(request.admission_queue_s)],
            ["Messages sent", request.message_count],
            ["Tool calls returned", request.response.tool_calls.length],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[#9ba6af]">{label}</dt>
              <dd className="mt-1 break-words text-[#d5dde3]">{value}</dd>
            </div>
          ))}
        </dl>
        <Payload label="Model response" text={request.response.text} />
        {request.response.reasoning && (
          <Payload
            label="Returned reasoning"
            text={request.response.reasoning}
          />
        )}
        {request.response.tool_calls.map((c, i) => (
          <Payload
            key={`${c.id}-${i}`}
            label={`Tool call · ${c.name}`}
            text={c.arguments}
          />
        ))}
        <Payload
          label="Request metadata"
          text={JSON.stringify(
            {
              id: request.id,
              model: request.model,
              status: request.status,
              usage: request.usage,
              elapsed_s: request.elapsed_s,
              first_byte_s: request.first_byte_s,
              admission_queue_s: request.admission_queue_s,
              reasoning_effort: request.reasoning_effort,
              providers: request.providers,
            },
            null,
            2,
          )}
        />
      </article>
    </div>
  );
}
