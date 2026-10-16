"use client";

import { useMemo } from "react";
import { ChevronRight, FileCode2 } from "lucide-react";
import { parseGitDiff } from "./git-diff-parser";
import { focusClass } from "./run-ui";

export function GitDiff({ patch }: { patch: string }) {
  const files = useMemo(() => parseGitDiff(patch), [patch]);
  if (!patch)
    return (
      <p className="border border-white/10 p-6 text-sm text-[#9ba6af]">
        No patch was submitted.
      </p>
    );
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <h2 className="font-mono text-[#d5dde3]">
          Submitted changes · {files.length} files
        </h2>
        <p className="font-mono">
          <span className="text-[#8ccf9f]">
            +{files.reduce((sum, file) => sum + file.additions, 0)}
          </span>
          <span className="ml-3 text-[#f28c79]">
            −{files.reduce((sum, file) => sum + file.deletions, 0)}
          </span>
        </p>
      </div>
      <div
        className="max-h-[70vh] space-y-4 overflow-auto border border-white/10 bg-[#0a0d10]"
        tabIndex={0}
        role="region"
        aria-label="Submitted Git diff"
      >
        {files.map((file, fileIndex) => (
          <details
            open
            key={`${file.path}-${fileIndex}`}
            className="group/file"
          >
            <summary
              className={`sticky top-0 z-10 flex min-h-11 cursor-pointer list-none items-center gap-3 border-y border-white/10 bg-[#13191f] px-4 py-3 font-mono text-xs ${focusClass}`}
            >
              <ChevronRight
                className="size-3 shrink-0 text-[#9ba6af] transition-transform group-open/file:rotate-90 motion-reduce:transition-none"
                aria-hidden="true"
              />
              <FileCode2
                className="size-4 shrink-0 text-[#9ba6af]"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 break-all text-[#d5dde3]">
                {file.path}
              </span>
              <span className="shrink-0 text-[#8ccf9f]">+{file.additions}</span>
              <span className="shrink-0 text-[#f28c79]">−{file.deletions}</span>
            </summary>
            <div className="overflow-x-auto">
              <table
                className="w-full border-collapse font-mono text-xs leading-6"
                aria-label={`Changes in ${file.path}`}
              >
                <thead className="sr-only">
                  <tr>
                    <th>Old line</th>
                    <th>New line</th>
                    <th>Change</th>
                    <th>Code</th>
                  </tr>
                </thead>
                <tbody>
                  {file.lines.map((line, i) => (
                    <tr
                      key={i}
                      className={
                        line.kind === "add"
                          ? "bg-[#8ccf9f]/10 text-[#b7e7c3]"
                          : line.kind === "remove"
                            ? "bg-[#f28c79]/10 text-[#f5b5a9]"
                            : line.kind === "hunk"
                              ? "bg-[#7eb5d0]/10 text-[#7eb5d0]"
                              : "text-[#aeb8c0]"
                      }
                    >
                      <td className="w-12 min-w-12 select-none border-r border-white/5 px-2 text-right align-top text-[#9ba6af]">
                        {line.oldLine}
                      </td>
                      <td className="w-12 min-w-12 select-none border-r border-white/5 px-2 text-right align-top text-[#9ba6af]">
                        {line.newLine}
                      </td>
                      <td className="w-7 min-w-7 select-none text-center align-top">
                        {line.kind === "add"
                          ? "+"
                          : line.kind === "remove"
                            ? "−"
                            : " "}
                      </td>
                      <td className="pr-4 align-top">
                        <code className="block whitespace-pre [tab-size:4]">
                          {line.text || " "}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
