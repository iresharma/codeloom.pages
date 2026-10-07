"use client";

import { MOTHER_REPO, PRODUCT_LIST } from "@codeloom/config";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { SiteFooter } from "../chrome/footer";
import { SiteNav } from "../chrome/site-nav";
import { Code } from "../components/code";
import { Reveal } from "../magic/reveal";

const steps: { n: string; title: string; body: string; code?: string; lang?: string }[] = [
  {
    n: "01",
    title: "Clone it",
    body: "Grab the umbrella repo with its submodules — the cloud controller, the engine it builds its sandbox from, and the web client all come down as one checkout.",
    lang: "bash",
    code: `git clone --recurse-submodules https://github.com/iresharma/codeloom.git
cd codeloom`,
  },
  {
    n: "02",
    title: "Create a GitHub OAuth app",
    body: "This is how you sign in, and how the agent clones your repos and opens PRs as you. In GitHub → Settings → Developer settings → OAuth Apps, point the callback at the controller. Sign-in asks for read:user and repo.",
    lang: "bash",
    code: `# New OAuth App → Authorization callback URL:
http://localhost:8000/auth/github/callback`,
  },
  {
    n: "03",
    title: "Run it",
    body: "One script starts both pieces. The first run creates the controller's venv, installs the web client, writes .env files from the examples, and builds the sandbox images — Docker is the one hard dependency, and that first build is the slow part. Fill in the keys it just wrote, then run it again.",
    lang: "bash",
    code: `./scripts/run
# first run: venv, npm install, sandbox images, .env / .env.local scaffolded

# edit workspace/cloud-controller/.env:
#   GITHUB_CLIENT_ID=...   GITHUB_CLIENT_SECRET=...
#   OPENROUTER_API_KEY=...            # optional: TYPESAFE_API_KEY

./scripts/run
#   web client        http://localhost:3000
#   cloud controller  http://localhost:8000`,
  },
  {
    n: "04",
    title: "Sign in and pick a repo",
    body: "Open the web client URL the script printed, sign in with GitHub, and register one of your repositories. The controller reads its language and picks the matching sandbox image. Open it and start a session — a Docker sandbox boots, clones your repo, and starts the engine, with the transcript streaming live in the browser.",
  },
  {
    n: "05",
    title: "Ask for a change, then open a PR",
    body: "Hand the agent a task in the composer and watch the orchestrator, its sub-agents, the diffs, and the cost as it works. When the writer finishes, tell it to open a PR — it writes the title and body from the run's facts and opens it on your repo with your grant. Settle is your call; nothing is pushed until you say so.",
    lang: "http",
    code: `you> fix the flaky auth test in tests/auth_test.py
you> open a PR
→ opened #128 — "Stabilize auth test: await token before asserting"
  github.com/you/your-repo/pull/128`,
  },
];

export function TryYourselfLanding() {
  const reduce = useReducedMotion();

  return (
    <div className="theme-engine min-h-screen bg-[#0c1014] text-[#d5dde3]">
      <SiteNav active="try" />

      <main className="mx-auto max-w-5xl px-5 md:px-8 xl:max-w-6xl">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#ff5c33] uppercase"
          >
            Try it yourself
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            From clone to a pull request on your repo.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 max-w-2xl text-[14px] leading-6 text-[#7a848c]"
          >
            Run CodeLoom's cloud controller and web client on your own machine with one script, sign in with GitHub,
            pick a repo, and watch an agent make a change and open a PR — live in the browser. You bring Docker, a
            GitHub OAuth app, and an OpenRouter key. Settle is always your call; nothing is pushed until you say so.
          </motion.p>
        </section>

        <section className="py-10">
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {steps.map((step) => (
              <Reveal key={step.n}>
                <li className="grid gap-3 py-6 md:grid-cols-[3rem_1fr] md:gap-6">
                  <span className="font-mono text-[18px] text-[#ff5c33]/80">{step.n}</span>
                  <div>
                    <p className="font-mono text-[15px] font-bold text-[#d5dde3]">{step.title}</p>
                    <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#7a848c]">{step.body}</p>
                    {step.code ? (
                      <Code lang={step.lang ?? "bash"} code={step.code} className="mt-3 max-w-2xl" />
                    ) : null}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="border-t border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Want the bare-metal version?</p>
          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#7a848c]">
            Skip Docker and the OAuth app entirely: run just the{" "}
            <a href="/engine" className="text-[#ff5c33] underline underline-offset-4">engine</a> against a local
            checkout (<code className="text-[#d5dde3]">python app.py /your/repo</code>) and drive it from the terminal —
            the <a href="/clients" className="text-[#ff5c33] underline underline-offset-4">TUI</a> or the bundled REPL.
            Same orchestrator, same funnel, same settle. The{" "}
            <a href="/cloud-controller" className="text-[#ff5c33] underline underline-offset-4">cloud controller</a> is
            what wraps it in sandboxes and a browser.
          </p>
          <a
            href="/engine"
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-[12px] text-[#d5dde3] hover:text-[#ff5c33]"
          >
            How the engine works
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </section>
      </main>

      <SiteFooter product={{ ...PRODUCT_LIST[0], github: MOTHER_REPO }} />
    </div>
  );
}
