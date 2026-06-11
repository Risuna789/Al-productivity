import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Wand2 } from "lucide-react";
import { AppShell, PageHeader, AiDisclaimer } from "@/components/app-shell";
import { AiOutput, LoadingShimmer } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/meeting")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Lumen AI" },
      { name: "description", content: "Turn raw meeting notes into key points, action items, and decisions." },
    ],
  }),
  component: MeetingPage,
});

const SAMPLE = `Standup — Oct 14
- Sarah: shipped the new onboarding flow; 12% lift in activation. Will write postmortem by Friday.
- Marcus: stuck on auth bug; needs help from infra. Deadline next Wed.
- Decision: pause v2 dashboard work until Q1.
- Risk: customer X churn risk — Sarah to call them Thursday.
- Action: Marcus + Priya pair on auth bug tomorrow.`;

function MeetingPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const submit = async () => {
    if (notes.trim().length < 10) {
      toast.error("Add some meeting notes first");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fn({ data: { notes } });
      setResult(res.text);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Summarization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript — get a structured summary."
      />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes">Notes / transcript</Label>
              <button
                onClick={() => setNotes(SAMPLE)}
                className="text-xs text-primary hover:underline"
              >
                Try a sample
              </button>
            </div>
            <Textarea
              id="notes"
              rows={14}
              placeholder="Paste meeting notes or a transcript…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full" style={{ background: "var(--gradient-primary)" }}>
            <Wand2 className="h-4 w-4" />
            {loading ? "Summarizing…" : "Summarize"}
          </Button>
          <AiDisclaimer />
        </div>

        <div>
          {loading && <LoadingShimmer label="Reading notes and extracting actions…" />}
          {!loading && result && <AiOutput text={result} />}
          {!loading && !result && (
            <div className="rounded-2xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
              Your structured summary will appear here.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
