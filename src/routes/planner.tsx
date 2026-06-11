import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListChecks, Wand2 } from "lucide-react";
import { AppShell, PageHeader, AiDisclaimer } from "@/components/app-shell";
import { AiOutput, LoadingShimmer } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Lumen AI" },
      { name: "description", content: "Prioritize and schedule your tasks with an AI productivity coach." },
    ],
  }),
  component: PlannerPage,
});

const HORIZONS = ["Today", "Tomorrow", "This week", "Next 2 weeks"];

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("This week");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const submit = async () => {
    if (tasks.trim().length < 3) {
      toast.error("Add some tasks first");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fn({ data: { tasks, horizon } });
      setResult(res.text);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Planning failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Drop your task list — get a prioritized schedule."
      />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] space-y-4">
          <div className="space-y-1.5">
            <Label>Planning horizon</Label>
            <Select value={horizon} onValueChange={setHorizon}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {HORIZONS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tasks">Tasks</Label>
            <Textarea
              id="tasks"
              rows={12}
              placeholder={`One task per line, e.g.\n- Finish Q4 OKRs draft\n- Review 3 PRs\n- Prep board update`}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full" style={{ background: "var(--gradient-primary)" }}>
            <Wand2 className="h-4 w-4" />
            {loading ? "Planning…" : "Plan my work"}
          </Button>
          <AiDisclaimer />
        </div>

        <div>
          {loading && <LoadingShimmer label="Prioritizing and scheduling…" />}
          {!loading && result && <AiOutput text={result} />}
          {!loading && !result && (
            <div className="rounded-2xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
              Your prioritized plan will appear here.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
