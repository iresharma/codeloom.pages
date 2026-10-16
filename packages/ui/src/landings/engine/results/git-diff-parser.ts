export type DiffLine = {
  kind: "add" | "remove" | "context" | "hunk" | "meta";
  text: string;
  oldLine: number | null;
  newLine: number | null;
};
export type DiffFile = {
  path: string;
  additions: number;
  deletions: number;
  lines: DiffLine[];
};

function filePath(value: string) {
  let path = value.split("\t")[0];
  if (path.startsWith('"')) {
    try {
      path = JSON.parse(path);
    } catch {
      /* Keep Git's quoted path verbatim. */
    }
  }
  return path.replace(/^[ab]\//, "");
}

export function parseGitDiff(patch: string): DiffFile[] {
  const files: DiffFile[] = [];
  let current: DiffFile | undefined;
  let oldLine = 0,
    newLine = 0,
    inHunk = false;
  const lines = patch.split(/\r?\n/);
  if (lines.at(-1) === "") lines.pop();
  for (const raw of lines) {
    if (raw.startsWith("diff --git ")) {
      const paths = raw.slice(11).match(/(?:"(?:[^"\\]|\\.)*"|\S+)/g);
      current = {
        path: filePath(paths?.[1] ?? raw.slice(11)),
        additions: 0,
        deletions: 0,
        lines: [],
      };
      files.push(current);
      inHunk = false;
      continue;
    }
    if (!current) {
      current = {
        path: "Submitted patch",
        additions: 0,
        deletions: 0,
        lines: [],
      };
      files.push(current);
    }
    if (!inHunk && (raw.startsWith("+++ ") || raw.startsWith("--- "))) {
      const path = filePath(raw.slice(4));
      if (
        path !== "/dev/null" &&
        (raw.startsWith("+++ ") || current.path === "Submitted patch")
      )
        current.path = path;
      continue;
    }
    const hunk = raw.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      oldLine = Number(hunk[1]);
      newLine = Number(hunk[2]);
      inHunk = true;
      current.lines.push({
        kind: "hunk",
        text: raw,
        oldLine: null,
        newLine: null,
      });
    } else if (inHunk && raw.startsWith("+")) {
      current.additions++;
      current.lines.push({
        kind: "add",
        text: raw.slice(1),
        oldLine: null,
        newLine: newLine++,
      });
    } else if (inHunk && raw.startsWith("-")) {
      current.deletions++;
      current.lines.push({
        kind: "remove",
        text: raw.slice(1),
        oldLine: oldLine++,
        newLine: null,
      });
    } else if (inHunk && raw.startsWith(" ")) {
      current.lines.push({
        kind: "context",
        text: raw.slice(1),
        oldLine: oldLine++,
        newLine: newLine++,
      });
    } else {
      current.lines.push({
        kind: "meta",
        text: raw,
        oldLine: null,
        newLine: null,
      });
    }
  }
  return files;
}
