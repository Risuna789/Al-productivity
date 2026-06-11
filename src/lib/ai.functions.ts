import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "./ai-gateway.server";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(DEFAULT_MODEL);
}

// --- Email Generator ---
const EmailInput = z.object({
  purpose: z.string().min(1),
  audience: z.string().min(1),
  tone: z.string().min(1),
  keyPoints: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are an expert email writer. Produce a clear, professional email that fits the requested audience and tone.
Output rules:
- Begin with a single line: "Subject: <subject>"
- Then a blank line, then the email body.
- Use natural paragraphs. No markdown headings, no bullet asterisks unless truly needed.
- Keep it concise (under 220 words unless purpose requires more).
- Do NOT add commentary, do NOT explain your choices.`;
    const prompt = `Purpose: ${data.purpose}
Audience: ${data.audience}
Tone: ${data.tone}
Key points to include: ${data.keyPoints || "(none specified — infer reasonable content)"}`;
    const { text } = await generateText({ model: getModel(), system, prompt });
    return { text };
  });

// --- Meeting Notes Summarizer ---
const NotesInput = z.object({ notes: z.string().min(10) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are a meeting analyst. Read raw meeting notes / transcript and produce a structured executive summary.
Output strictly in this markdown structure (omit a section only if truly empty):

## Summary
A 2-3 sentence overview.

## Key Points
- Point 1
- Point 2

## Action Items
- [Owner if known] Action — Deadline if mentioned

## Decisions
- Decision 1

## Risks / Open Questions
- Item 1

Be concise, factual, and never invent details.`;
    const { text } = await generateText({ model: getModel(), system, prompt: data.notes });
    return { text };
  });

// --- Task Planner ---
const TasksInput = z.object({
  tasks: z.string().min(1),
  horizon: z.string().min(1),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TasksInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are an executive productivity coach. Given a list of tasks and a planning horizon, produce a prioritized, scheduled plan.
Output as markdown:

## Priority Ranking
Use Eisenhower-style reasoning. Number tasks 1..N with a brief reason.

## Schedule (${"${horizon}"})
A realistic time-blocked plan. Use a markdown table with columns: When | Task | Focus (Deep / Shallow) | Notes.

## Tips
2-4 short tips to execute the plan.

Be specific and realistic. Group small tasks. Protect deep-work time.`;
    const prompt = `Planning horizon: ${data.horizon}

Tasks:
${data.tasks}`;
    const { text } = await generateText({
      model: getModel(),
      system: system.replace("${horizon}", data.horizon),
      prompt,
    });
    return { text };
  });

// --- Research Assistant ---
const ResearchInput = z.object({ topic: z.string().min(2) });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are a senior research analyst. Provide a structured briefing on the requested topic using your training knowledge. Be precise and avoid speculation; flag uncertainty explicitly.

Output as markdown:

## Overview
A clear 3-5 sentence definition / framing.

## Key Insights
- 4-6 substantive bullets

## Important Considerations
- Trade-offs, caveats, common misconceptions

## Suggested Next Steps
- Concrete things the reader can do or investigate

Do not fabricate statistics, citations, or URLs. If you don't know recent data, say so.`;
    const { text } = await generateText({ model: getModel(), system, prompt: data.topic });
    return { text };
  });
