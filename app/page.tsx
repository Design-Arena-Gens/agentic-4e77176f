"use client";

import { FormEvent, useMemo, useState } from "react";

type AgentFormState = {
  topic: string;
  audience: string;
  goal: string;
  duration: string;
  tone: string;
  callToAction: string;
  language: string;
};

type ScriptBeat = {
  timestamp: string;
  narration: string;
  onScreen: string;
  emphasis: string;
};

type ShotPlan = {
  label: string;
  description: string;
  duration: string;
  notes: string;
};

type AgentProduct = {
  title: string;
  hook: string;
  summary: string;
  script: ScriptBeat[];
  shotPlan: ShotPlan[];
  callToAction: string;
  caption: string;
  hashtags: string[];
  broll: string[];
  soundDesign: string[];
  tips: string[];
  productionNotes: string;
};

const defaultForm: AgentFormState = {
  topic: "3 AI automations that save content creators 10 hours a week",
  audience: "ambitious solo creators and micro businesses that already post on TikTok or YouTube",
  goal: "drive newsletter sign-ups by showcasing quick wins and expertise",
  duration: "55 seconds",
  tone: "high-energy, trustworthy, story-driven",
  callToAction: "Invite viewers to download a free workflow template linked in bio",
  language: "English"
};

function classNames(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

export default function HomePage() {
  const [form, setForm] = useState<AgentFormState>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AgentProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const hasResult = !!result;

  const compiledScript = useMemo(() => {
    if (!result) {
      return "";
    }

    const beats = result.script
      .map((beat) => `${beat.timestamp} — ${beat.narration} [On-screen: ${beat.onScreen}]`)
      .join("\n");

    const shots = result.shotPlan
      .map(
        (scene) =>
          `${scene.label} (${scene.duration}): ${scene.description}${scene.notes ? ` — ${scene.notes}` : ""}`
      )
      .join("\n");

    return [
      `Title: ${result.title}`,
      `Hook: ${result.hook}`,
      "",
      "Script Beats:",
      beats,
      "",
      "Shot Plan:",
      shots,
      "",
      `CTA: ${result.callToAction}`,
      "",
      `Caption: ${result.caption}`,
      `Hashtags: ${result.hashtags.join(" ")}`
    ].join("\n");
  }, [result]);

  const copyToClipboard = async (text: string) => {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Copied to clipboard");
      setTimeout(() => setCopyMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setCopyMessage("Copy failed. Try manually.");
      setTimeout(() => setCopyMessage(null), 3000);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to generate plan");
      }

      const payload: AgentProduct = await response.json();
      setResult(payload);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid-bg">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-12 px-6 pb-24 pt-24 lg:px-12">
        <header className="grid gap-8 text-center lg:grid-cols-[2fr,1fr] lg:items-center lg:text-left">
          <div className="space-y-5">
            <div className="inline-flex items-center justify-center gap-3 rounded-full bg-brand-500/10 px-4 py-2 text-sm tracking-wide text-brand-100 ring-1 ring-brand-400/20 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]"></span>
              Agent: Shorts Architect
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Generate production-ready YouTube Shorts with an autonomous AI creative director.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              Feed the agent a topic and intent. It crafts a punchy hook, beat-by-beat script, shot list, B-roll
              guidance, and caption bundle ready to post in under a minute.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <div className="glass rounded-xl px-4 py-3 text-sm text-slate-200">
                ⚡ Beat pacing optimized for 9:16 framing
              </div>
              <div className="glass rounded-xl px-4 py-3 text-sm text-slate-200">
                🎯 Narrative tuned to your target audience
              </div>
              <div className="glass rounded-xl px-4 py-3 text-sm text-slate-200">
                🎬 Multi-track shot and B-roll planner
              </div>
            </div>
          </div>
          <div className="glass rounded-3xl border border-brand-400/40 bg-brand-500/10 p-6 text-left shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-100/70">
              Agent Objectives
            </p>
            <ul className="mt-4 space-y-4 text-sm text-brand-50">
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-300 shadow-[0_0_10px_rgba(102,126,255,0.7)]"></span>
                Craft momentum-driven narrative beats for shorts.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-300 shadow-[0_0_10px_rgba(102,126,255,0.7)]"></span>
                Align tone, pacing, and CTA with growth goals.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-300 shadow-[0_0_10px_rgba(102,126,255,0.7)]"></span>
                Output ready-to-shoot shot plans and caption stack.
              </li>
            </ul>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr,1fr]">
          <form
            onSubmit={handleSubmit}
            className="glass rounded-3xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Creative Brief</h2>
              <button
                type="button"
                className="text-sm text-brand-200 underline underline-offset-4 transition hover:text-brand-100"
                onClick={() => setForm(defaultForm)}
              >
                Reset brief
              </button>
            </div>
            <div className="mt-8 space-y-6">
              <label className="block space-y-2">
                <span className="text-sm font-medium uppercase tracking-wide text-slate-300">Topic</span>
                <textarea
                  value={form.topic}
                  onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
                  required
                  rows={3}
                  placeholder="What should the short be about?"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium uppercase tracking-wide text-slate-300">Audience</span>
                <textarea
                  value={form.audience}
                  onChange={(event) => setForm((prev) => ({ ...prev, audience: event.target.value }))}
                  required
                  rows={2}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
                  placeholder="Who should this hook resonate with?"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium uppercase tracking-wide text-slate-300">
                  Growth Objective
                </span>
                <textarea
                  value={form.goal}
                  onChange={(event) => setForm((prev) => ({ ...prev, goal: event.target.value }))}
                  required
                  rows={2}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
                  placeholder="What business outcome should the short accomplish?"
                />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium uppercase tracking-wide text-slate-300">Duration</span>
                  <select
                    value={form.duration}
                    onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
                  >
                    <option value="45 seconds">45 seconds</option>
                    <option value="55 seconds">55 seconds</option>
                    <option value="60 seconds">60 seconds</option>
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium uppercase tracking-wide text-slate-300">Language</span>
                  <input
                    value={form.language}
                    onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value }))}
                    required
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
                    placeholder="English, Spanish, etc."
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium uppercase tracking-wide text-slate-300">
                  Tone & Visual Style
                </span>
                <textarea
                  value={form.tone}
                  onChange={(event) => setForm((prev) => ({ ...prev, tone: event.target.value }))}
                  required
                  rows={2}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
                  placeholder="Energetic, cinematic, comedic, punchy editing, etc."
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium uppercase tracking-wide text-slate-300">
                  Call To Action
                </span>
                <textarea
                  value={form.callToAction}
                  onChange={(event) => setForm((prev) => ({ ...prev, callToAction: event.target.value }))}
                  required
                  rows={2}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
                  placeholder="What should viewers do after watching?"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={classNames(
                "mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-500 px-6 py-4 text-lg font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-brand-300/60 focus:ring-offset-2 focus:ring-offset-slate-950 hover:bg-brand-400",
                isSubmitting && "cursor-not-allowed opacity-70"
              )}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent"></span>
                  Synthesizing plan…
                </>
              ) : (
                <>Generate short blueprint</>
              )}
            </button>
            {error && (
              <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}
          </form>

          <div
            className={classNames(
              "glass relative flex min-h-[540px] flex-col rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 text-left shadow-2xl transition",
              hasResult ? "opacity-100" : "opacity-90"
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Agent Output</h2>
              {hasResult && (
                <button
                  onClick={() => copyToClipboard(compiledScript)}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand-100 transition hover:bg-brand-400/20"
                >
                  Copy package
                </button>
              )}
            </div>

            {!hasResult && (
              <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-slate-700/60 bg-slate-900/40 p-10 text-center text-slate-400">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-700/50 bg-slate-900/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-10 w-10 text-brand-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3.75 6.75h16.5M3.75 9.75h16.5m-12 3h7.5m-7.5 3h7.5M5.25 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25V6.75"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Your short blueprint will appear here</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    The agent will output script beats, shot plan, B-roll cues, sonic palette, and caption stack.
                  </p>
                </div>
              </div>
            )}

            {hasResult && result && (
              <div className="mt-6 flex-1 space-y-6 overflow-y-auto pr-2">
                <section className="space-y-3 rounded-2xl border border-brand-400/30 bg-brand-500/10 px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{result.title}</h3>
                      <p className="text-sm text-brand-50/90">{result.summary}</p>
                    </div>
                    <span className="rounded-full border border-brand-400/50 bg-brand-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-50">
                      Hook
                    </span>
                  </div>
                  <p className="text-base text-brand-50">{result.hook}</p>
                </section>

                <section className="space-y-4 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Beat-by-beat Script</h3>
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      Pacing windows & on-screen plan
                    </span>
                  </div>
                  <div className="space-y-4">
                    {result.script.map((beat) => (
                      <article
                        key={`${beat.timestamp}-${beat.narration.slice(0, 12)}`}
                        className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-brand-200">
                            {beat.timestamp}
                          </span>
                          <span className="rounded-full border border-brand-400/20 bg-brand-500/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-100">
                            {beat.emphasis}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-100">{beat.narration}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          Visual Direction: <span className="text-slate-200">{beat.onScreen}</span>
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="space-y-4 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Shot & Motion Plan</h3>
                    <span className="text-xs uppercase tracking-wide text-slate-400">Camera / motion cues</span>
                  </div>
                  <div className="space-y-4">
                    {result.shotPlan.map((shot) => (
                      <article
                        key={`${shot.label}-${shot.duration}`}
                        className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-white">{shot.label}</span>
                          <span className="rounded-full border border-slate-700/60 bg-slate-800 px-2 py-1 text-xs uppercase tracking-wide text-slate-300">
                            {shot.duration}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-200">{shot.description}</p>
                        {shot.notes && (
                          <p className="mt-2 text-xs text-slate-400">
                            Notes: <span className="text-slate-200">{shot.notes}</span>
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </section>

                <section className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">B-Roll & Asset Cues</h3>
                    <span className="text-xs uppercase tracking-wide text-slate-400">Visual overlays</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {result.broll.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-brand-300"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">Sonic Palette</h3>
                    <span className="text-xs uppercase tracking-wide text-slate-400">Sound design prompts</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {result.soundDesign.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-emerald-300"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">Caption Stack</h3>
                    <span className="text-xs uppercase tracking-wide text-slate-400">Platform-ready</span>
                  </div>
                  <p className="text-sm text-slate-200">{result.caption}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Hashtags:{" "}
                    <span className="text-slate-200">
                      {result.hashtags.map((tag) => `#${tag.replace(/^#/, "")}`).join(" ")}
                    </span>
                  </p>
                </section>

                <section className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">CTA & Delivery Notes</h3>
                    <span className="text-xs uppercase tracking-wide text-slate-400">Performance levers</span>
                  </div>
                  <p className="text-sm text-slate-200">{result.callToAction}</p>
                  <div className="space-y-2 pt-2 text-sm text-slate-200">
                    {result.tips.map((tip, index) => (
                      <p key={`${tip}-${index}`} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-sky-300"></span>
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    Production Notes: <span className="text-slate-200">{result.productionNotes}</span>
                  </p>
                </section>
              </div>
            )}

            {copyMessage && (
              <div className="absolute bottom-8 right-8 rounded-full border border-brand-400/40 bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-100 shadow-lg">
                {copyMessage}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
