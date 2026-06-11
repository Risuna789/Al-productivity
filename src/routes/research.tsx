import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { AppShell, PageHeader, AiDisclaimer } from "@/components/app-shell";
import { AiOutput, LoadingShimmer } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { researchTopic } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Lumen AI" },
      { name: "description", content: "Get structured insights and briefings on any topic." },
    ],
  }),
  component: ResearchPage,
});

const SUGGESTIONS = [
  "Retrieval-augmented generation (RAG)",
  "European AI Act overview",
  "Product-led growth playbook",
  "Vector databases compared",
];

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const submit = async (t?: string) => {
    const q = (t ?? topic).trim();
    if (q.length < 2) {
      toast.error("Enter a topic");
      return;
    }
    if (t) setTopic(t);
    setLoading(true);
    setResult("");
    try {
      const res = await fn({ data: { topic: q } });
      setResult(res.text);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Research failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={Sparkles}
        title="AI Research Assistant"
        description="Briefings with insights, considerations, and next steps."
      />
      <div className="p-6 space-y-6">
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Topic or question</Label>
            <div className="flex gap-2">
              <Input
                id="topic"
                placeholder="e.g. Best practices for onboarding B2B SaaS users"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              <Button onClick={() => submit()} disabled={loading} style={{ background: "var(--gradient-primary)" }}>
                <Wand2 className="h-4 w-4" />
                Research
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                disabled={loading}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
          <AiDisclaimer />
        </div>

        {loading && <LoadingShimmer label="Researching and structuring insights…" />}
        {!loading && result && <AiOutput text={result} />}
        {!loading && !result && (
          <div className="rounded-2xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
            Your briefing will appear here.
          </div>
        )}
      </div>
    </AppShell>
  );
}
