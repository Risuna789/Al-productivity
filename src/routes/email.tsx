import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Wand2 } from "lucide-react";
import { AppShell, PageHeader, AiDisclaimer } from "@/components/app-shell";
import { AiOutput, LoadingShimmer } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Lumen AI" },
      { name: "description", content: "Generate professional emails tuned to tone and audience." },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Enthusiastic", "Formal"];

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const submit = async () => {
    if (!purpose.trim() || !audience.trim()) {
      toast.error("Purpose and audience are required");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fn({ data: { purpose, audience, tone, keyPoints } });
      setResult(res.text);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the email — we'll write a clean, on-tone draft."
      />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              placeholder="e.g. Request a 15-min intro call with a potential client"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="audience">Audience</Label>
            <Input
              id="audience"
              placeholder="e.g. VP of Engineering at a Series B fintech"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="kp">Key points (optional)</Label>
            <Textarea
              id="kp"
              rows={4}
              placeholder="Bullet points or details to include"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
            />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full" style={{ background: "var(--gradient-primary)" }}>
            <Wand2 className="h-4 w-4" />
            {loading ? "Generating…" : "Generate Email"}
          </Button>
          <AiDisclaimer />
        </div>

        <div>
          {loading && <LoadingShimmer label="Drafting your email…" />}
          {!loading && result && <AiOutput text={result} />}
          {!loading && !result && (
            <div className="rounded-2xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
              Your generated email will appear here.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
