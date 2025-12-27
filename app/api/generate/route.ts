import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({
  topic: z.string().min(4),
  audience: z.string().min(4),
  goal: z.string().min(4),
  duration: z.string().min(2),
  tone: z.string().min(2),
  callToAction: z.string().min(2),
  language: z.string().min(2)
});

const agentResponseSchema = z.object({
  title: z.string(),
  hook: z.string(),
  summary: z.string(),
  script: z
    .array(
      z.object({
        timestamp: z.string(),
        narration: z.string(),
        onScreen: z.string(),
        emphasis: z.string()
      })
    )
    .min(5),
  shotPlan: z
    .array(
      z.object({
        label: z.string(),
        description: z.string(),
        duration: z.string(),
        notes: z.string().optional().default("")
      })
    )
    .min(5),
  callToAction: z.string(),
  caption: z.string(),
  hashtags: z.array(z.string()).min(6).max(12),
  broll: z.array(z.string()).min(5),
  soundDesign: z.array(z.string()).min(3),
  tips: z.array(z.string()).min(3),
  productionNotes: z.string()
});

const SYSTEM_PROMPT = `You are Shorts Architect, an autonomous creative director who designs high-impact YouTube Shorts (9:16, max 60 seconds). 
You merge storytelling, pacing, and visual direction into production-ready blueprints.

Guidelines:
- Hook the first 2 seconds with a tension-packed opener.
- Keep narration concise and time-stamped in <= 60s.
- Each beat must include narration, on-screen visual direction, and emphasize the pacing/energy.
- Provide a separate shot plan describing camera framing, motion, and overlays.
- B-roll ideas must be specific assets or overlays that reinforce the beat.
- Sound design includes music style, SFX accents, and mix notes.
- Tips should focus on editing rhythm, motion graphics, or delivery technique.
- Adopt the requested tone, audience, goal, and CTA precisely.
- Output ONLY valid JSON that matches the supplied schema. Do not include Markdown.`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const json = await request.json();
  const parsed = requestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { topic, audience, goal, duration, tone, callToAction, language } = parsed.data;

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: SYSTEM_PROMPT }]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Brief:
Topic: ${topic}
Target audience: ${audience}
Primary goal: ${goal}
Desired duration: ${duration}
Tone & visual style: ${tone}
Call to action: ${callToAction}
Language: ${language}

Deliver an executable blueprint for a single YouTube Short that can be filmed today.`
            }
          ]
        }
      ],
      max_output_tokens: 1400,
      temperature: 0.9
    });

    const output = response.output_text;

    if (!output) {
      throw new Error("No content returned from model.");
    }

    const structured = agentResponseSchema.parse(JSON.parse(output));

    return NextResponse.json(structured, { status: 200 });
  } catch (error) {
    console.error("[generate-agent]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to synthesize a short blueprint. Please retry."
      },
      { status: 500 }
    );
  }
}
