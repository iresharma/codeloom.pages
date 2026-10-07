"use client";

import { PRODUCTS, PRODUCT_LIST } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { SiteFooter } from "../chrome/footer";
import { SiteNav } from "../chrome/site-nav";
import { Code } from "../components/code";
import { ProductShell } from "../components/product-shell";
import { CloudControllerArchitectureFlow } from "../mocks/cloud-controller-architecture-flow";
import { Reveal } from "../magic/reveal";

const product = PRODUCTS["cloud-controller"];
const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

const pillars = [
  { n: "01", label: "provision", body: "Start a Docker sandbox, clone the target repo inside it on the image that matches its language, and boot an engine session." },
  { n: "02", label: "relay", body: "Bridge the engine's NDJSON socket to a WebSocket — fan its events out to every client and relay their commands back." },
  { n: "03", label: "remember", body: "Keep each repo's agent memory between sessions, so the next run starts with what the last one learned." },
  { n: "04", label: "settle", body: "Merge, PR, keep, or discard — still routed back to you, not decided for you." },
];

const lifecycle = [
  { k: "POST /projects/{id}/sessions", v: "Mints a session row, refreshes the GitHub grant, and schedules provisioning on a background task." },
  { k: "docker run", v: "Starts the sandbox on the image that matches the repo's language. /workspace is a bind mount; .engine is a tmpfs so the Unix socket works on Docker Desktop." },
  { k: "clone · pin · boot", v: "The entrypoint clones the repo into /workspace, switches to the toolchain version the repo declares, and boots the engine. tcp_proxy bridges its socket to :7422." },
  { k: "StartSession", v: "The controller dials the published port, sends StartSession seeded with this repo's saved memory, and waits for SnapshotReady → status: ready." },
  { k: "GET /sessions/{id}/stream", v: "A WebSocket opens. SessionBridge fans the engine's events out to every subscriber and relays commands — SubmitUserMessage, AbortAgent, settle — back down." },
  { k: "settle", v: "You merge, PR, keep, or discard. On stop the container is removed, the transcript is archived in SQLite, and the repo's memory is kept for next time." },
];

const images = [
  { tag: "python", lang: "Python", lsp: "pyright", versions: "3.11.16 · 3.12.14 · 3.13.15 · 3.14.7", pin: ".python-version · requires-python" },
  { tag: "node", lang: "JavaScript / TypeScript", lsp: "typescript-language-server", versions: "Node 20.20.2 · 22.23.3 · 24.21.0", pin: ".nvmrc · .node-version · engines.node" },
  { tag: "golang", lang: "Go", lsp: "gopls", versions: "1.24.13 · 1.25.14 · 1.26.8 · 1.27.1", pin: "go.mod" },
];

// Illustrative per-target cut of sandbox/Dockerfile — one harness, three targets.
const harness = `# harness: the engine + a Playwright Chromium, shared by every image
FROM python:3.11-slim-bookworm AS harness
WORKDIR /workspace
COPY --from=engine app.py requirements.txt /opt/codeloom.engine/
RUN pip install -r /opt/codeloom.engine/requirements.txt \\
 && playwright install --with-deps chromium`;

const dockerfiles: Record<string, string> = {
  python: `${harness}

# python: the CPython lines + pyright, selected after the clone
FROM harness AS python
ARG PYTHON_VERSIONS="3.11.16 3.12.14 3.13.15 3.14.7"
ARG PYRIGHT_VERSION=1.1.407
ENV PATH="/opt/toolchain/python/bin:/opt/lsp/bin:\${PATH}"
RUN install-python $PYTHON_VERSIONS \\
 && npm install -g --prefix /opt/lsp pyright@$PYRIGHT_VERSION`,
  node: `${harness}

# node: Node 20/22/24 + yarn, pnpm, and the TypeScript server
FROM harness AS node
ARG NODE_VERSIONS="20.20.2 22.23.3 24.21.0"
ARG TS_LANGSERVER_VERSION=4.4.1
ENV PATH="/opt/lsp/bin:\${PATH}"
RUN install-node $NODE_VERSIONS \\
 && npm install -g --prefix /opt/lsp \\
      typescript-language-server@$TS_LANGSERVER_VERSION`,
  golang: `${harness}

# golang: the Go lines + gopls
FROM harness AS golang
ARG GO_VERSIONS="1.24.13 1.25.14 1.26.8 1.27.1"
ARG GOPLS_VERSION=v0.23.0
ENV PATH="/opt/toolchain/go/bin:\${PATH}"
RUN install-go $GO_VERSIONS \\
 && go install golang.org/x/tools/gopls@$GOPLS_VERSION`,
};

const faqs = [
  {
    q: "What actually happens when I start a session?",
    a: "The controller mints a session, refreshes your GitHub token, and runs one Docker container. Inside it, the entrypoint clones your repo into /workspace, pins the toolchain the repo declares, and boots the engine; a tcp_proxy exposes the engine's Unix socket as TCP :7422. The controller dials it, sends StartSession, and flips the session to ready once the engine reports a snapshot.",
  },
  {
    q: "Does my work carry over between runs on the same repo?",
    a: "Yes. Agent memory is owned by the controller, not the container. It's seeded into the engine at StartSession and captured back from a MemoryExported event as the run changes it, keyed per repo. Start a second session on the same repo and the agent resumes with what the last one learned. It's local JSON today and swaps to object storage later behind the same interface.",
  },
  {
    q: "How does a client reach the engine?",
    a: "Only through the controller. The engine speaks newline-delimited JSON over its socket; the controller bridges that to a WebSocket at /sessions/{id}/stream. One engine connection is fanned out to every subscriber, commands are relayed back, StartSession's workspace is forced to /workspace, and unknown commands are refused. Sub-agents stay inside the one engine process — the controller just forwards their events.",
  },
  {
    q: "Where do my secrets live?",
    a: "The OpenRouter, TypeSafe and GitHub keys are passed to the sandbox as environment and are never written into the clone. The GitHub token is encrypted at rest (a Fernet key, or one derived from SESSION_SECRET) and refreshed before a sandbox starts — a grant that can't be refreshed fails the session with a sign-in error instead of a push that dies halfway through.",
  },
  {
    q: "What survives a controller restart?",
    a: "On boot the controller reattaches to sandboxes that are still running and re-opens their streams; sessions whose container is gone are marked stopped. Users, projects, sessions and a replayable transcript per ended session live in SQLite, and per-repo memory lives in the store — so a restart doesn't lose a live run or its history.",
  },
  {
    q: "Is there a fleet scheduler or a budget ceiling?",
    a: "Not yet. Today it's one sandbox per chat, provisioned on demand, with per-container CPU and memory limits. Queued runs across a fleet and budget caps are on the roadmap, not in the build — this page describes what's actually there.",
  },
  {
    q: "Can I run it myself?",
    a: "Yes. Build the three sandbox images from the engine checkout, create a GitHub OAuth app, set the keys, and start it with uvicorn. If the controller itself runs in a container, point HOST_DATA_DIR at the host path of DATA_DIR so Docker can bind-mount the session workspace.",
    code: `for rt in python node golang; do
  docker build --target "$rt" -t "codeloom-sandbox:$rt" \\
    -f sandbox/Dockerfile --build-context engine=../engine sandbox
done
uvicorn codeloom_cloud.main:app --host 0.0.0.0 --port 8000`,
  },
];

export function CloudControllerLanding() {
  const reduce = useReducedMotion();
  const [img, setImg] = useState<string>("python");

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="cloud-controller" />

      <main className="mx-auto max-w-5xl px-5 md:px-8 xl:max-w-6xl">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#38bdf8] uppercase"
          >
            Built · in development
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            The engine runs anywhere. Something has to watch it.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 max-w-2xl text-[14px] leading-6 text-[#7a848c]"
          >
            {product.description}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.4 }}
            className="mt-8"
          >
            <Code
              lang="http"
              code={`$ curl -XPOST $API/projects/$id/sessions
  201 { "id": "a1b2", "status": "provisioning" }

# a Docker sandbox boots: clone -> engine -> ready
ws $API/sessions/a1b2/stream
  <- { "type": "SnapshotReady", "workspace": "/workspace" }
  -> { "type": "SubmitUserMessage", "text": "fix the flaky auth test" }
  <- { "type": "ChatMessageDelta", ... }   # the engine, relayed`}
            />
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.4 }}
            className="mt-6 text-[13px] leading-6 text-[#7a848c]"
          >
            [*] One <strong className="text-[#d5dde3]">Docker sandbox per chat</strong> — the repo is cloned inside
            it, the engine boots there, and its keys never touch the clone.
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.26, duration: 0.4 }}
            className="mt-2 text-[13px] leading-6 text-[#7a848c]"
          >
            [*] <strong className="text-[#d5dde3]">Per-repo memory</strong> is kept by the controller and seeded into
            the next run — a returning session resumes what the last one learned.
          </motion.p>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">How it fits together.</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            The control plane holds auth, records, and one bridge per run. The engine logic never leaves the engine —
            it just boots inside a sandbox the controller owns. Tap a box.
          </p>
          <Reveal className="mt-6">
            <CloudControllerArchitectureFlow />
          </Reveal>
        </section>

        <section className="divide-y divide-white/10 border-b border-white/10">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.label} delay={i * 0.04}>
              <div className="flex items-baseline gap-4 py-5">
                <span className="font-mono text-[12px] text-[#7a848c]">{pillar.n}</span>
                <div>
                  <p className="font-mono text-[14px] font-bold text-[#d5dde3] uppercase">{pillar.label}</p>
                  <p className="mt-1 max-w-lg text-[13px] leading-6 text-[#7a848c]">{pillar.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[12px] tracking-[0.15em] text-[#38bdf8] uppercase">Session lifecycle</p>
          <p className="mt-2 font-mono text-[15px] font-bold text-[#d5dde3]">Start to settle, over one connection.</p>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {lifecycle.map((row, i) => (
              <Reveal key={row.k} delay={i * 0.03}>
                <div className="grid gap-1 py-4 md:grid-cols-[22rem_1fr] md:gap-6">
                  <code className="font-mono text-[12.5px] leading-6 text-[#38bdf8]">{row.k}</code>
                  <p className="text-[13px] leading-6 text-[#7a848c]">{row.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[12px] tracking-[0.15em] text-[#38bdf8] uppercase">Sandbox images</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            Three images, built from the engine checkout with each language's toolchain, language server, and a
            Playwright Chromium already in place. A session uses the one that matches the repo's GitHub language, then
            switches to the exact version the repo pins — a Node 20 repo never runs on Node 24. Any other language
            still starts, on the Python image, with diagnostics reported unavailable.
          </p>
          <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-[#38bdf8]/70 uppercase">
            tap a row for its Dockerfile
          </p>
          <div className="mt-4 overflow-x-auto border border-white/10">
            <table className="w-full min-w-[640px] border-collapse font-mono text-[12px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-[#7a848c]">
                  <th className="px-4 py-2.5 font-normal">image</th>
                  <th className="px-4 py-2.5 font-normal">language</th>
                  <th className="px-4 py-2.5 font-normal">language server</th>
                  <th className="px-4 py-2.5 font-normal">pinned versions</th>
                </tr>
              </thead>
              <tbody>
                {images.map((row) => {
                  const on = row.tag === img;
                  return (
                    <tr
                      key={row.tag}
                      onClick={() => setImg(row.tag)}
                      aria-selected={on}
                      className={
                        "cursor-pointer border-b border-white/10 transition-colors last:border-0 " +
                        (on ? "bg-[#38bdf8]/[0.07]" : "hover:bg-white/[0.03]")
                      }
                    >
                      <td className={on ? "px-4 py-2.5 text-[#7cd4ff]" : "px-4 py-2.5 text-[#38bdf8]"}>
                        codeloom-sandbox:{row.tag}
                      </td>
                      <td className="px-4 py-2.5 text-[#d5dde3]">{row.lang}</td>
                      <td className="px-4 py-2.5 text-[#7a848c]">{row.lsp}</td>
                      <td className="px-4 py-2.5 text-[#7a848c]">
                        {row.versions}
                        <span className="mt-0.5 block text-[10.5px] text-[#7a848c]/60">from {row.pin}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <p className="font-mono text-[11px] text-[#7a848c]">
              <span className="text-[#38bdf8]">codeloom-sandbox:{img}</span> · sample Dockerfile ·{" "}
              <span className="text-[#7a848c]/60">target built with{" "}
                <code className="text-[#7a848c]/80">docker build --target {img === "golang" ? "golang" : img}</code>
              </span>
            </p>
            <Code lang="dockerfile" code={dockerfiles[img]} className="mt-2 text-[12px]" />
          </div>
        </section>

        <section className="grid gap-x-10 gap-y-8 border-b border-white/10 py-10 md:grid-cols-2">
          <div>
            <p className="font-mono text-[13px] font-bold text-[#d5dde3]">The bridge, exactly.</p>
            <ul className="mt-3 space-y-2 text-[13px] leading-6 text-[#7a848c]">
              <li className="flex gap-2"><span className="text-[#38bdf8]">·</span>One engine connection per session, fanned out to every WebSocket subscriber.</li>
              <li className="flex gap-2"><span className="text-[#38bdf8]">·</span>Commands are relayed to the engine; StartSession's workspace is rewritten to /workspace and unknown commands are refused.</li>
              <li className="flex gap-2"><span className="text-[#38bdf8]">·</span>MemoryExported is intercepted and persisted — it never reaches the UI.</li>
              <li className="flex gap-2"><span className="text-[#38bdf8]">·</span>Lose the engine and the stream closes with an error; the session is marked, not silently dropped.</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[13px] font-bold text-[#d5dde3]">What it keeps.</p>
            <ul className="mt-3 space-y-2 text-[13px] leading-6 text-[#7a848c]">
              <li className="flex gap-2"><span className="text-[#38bdf8]">·</span><span><code className="text-[#d5dde3]">users</code> — GitHub identity and encrypted tokens.</span></li>
              <li className="flex gap-2"><span className="text-[#38bdf8]">·</span><span><code className="text-[#d5dde3]">projects</code> — the repos you register: owner/repo, default branch, detected runtime.</span></li>
              <li className="flex gap-2"><span className="text-[#38bdf8]">·</span><span><code className="text-[#d5dde3]">sessions</code> — status, container, workspace and engine id, with a replayable transcript for every ended run.</span></li>
              <li className="flex gap-2"><span className="text-[#38bdf8]">·</span><span><code className="text-[#d5dde3]">memory</code> — per-repo agent memory, owned by the controller, seeded into the next session.</span></li>
            </ul>
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Why it's separate from the engine.</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            The engine already refuses to guess about anything that mutates git — settle is always your call, and a
            run degrades cleanly with no key, no model, no judge. The cloud controller doesn't get to relax that; it
            just gives that same discipline a server to run on, instead of one laptop with a terminal open.
          </p>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[12px] tracking-[0.15em] text-[#7a848c] uppercase">FAQ</p>
          <div className="mt-4 divide-y divide-white/10">
            {faqs.map((item) => (
              <details key={item.q} className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-[14px] text-[#d5dde3]">
                  {item.q}
                  <span className="text-[#7a848c] group-open:hidden">+</span>
                  <span className="hidden text-[#7a848c] group-open:inline">−</span>
                </summary>
                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#7a848c]">{item.a}</p>
                {"code" in item && item.code ? (
                  <pre className="mt-3 max-w-2xl overflow-x-auto border border-white/10 bg-[#0a0d10] p-3 font-mono text-[12px] leading-6 text-[#d5dde3]">
                    {item.code}
                  </pre>
                ) : null}
              </details>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-x-6 gap-y-2 py-8 font-mono text-[12px] text-[#7a848c]">
          <span className="uppercase tracking-[0.1em] text-[#7a848c]/70">also from codeloom</span>
          {others.map((item) => (
            <a key={item.id} href={item.path} className="transition-colors hover:text-[#38bdf8]">
              {item.shortName.toLowerCase()}
            </a>
          ))}
        </section>
      </main>

      <SiteFooter product={product} />
    </ProductShell>
  );
}
