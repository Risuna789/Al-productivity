import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Sparkles, MessageSquare, ArrowRight, Cpu } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen AI — Your AI productivity workspace" },
      { name: "description", content: "Generate emails, summarize meetings, plan tasks, research topics, and chat — all powered by AI." },
      { property: "og:title", content: "Lumen AI — AI productivity workspace" },
      { property: "og:description", content: "Generate emails, summarize meetings, plan tasks, research topics, and chat — all powered by AI." },
    ],
  }),
  component: Overview,
});

const features = [
  { to: "/email", title: "Smart Email Generator", desc: "Draft emails tuned to tone and audience.", icon: Mail, color: "from-blue-500 to-indigo-500" },
  { to: "/meeting", title: "Meeting Notes Summarizer", desc: "Key points, actions, and deadlines.", icon: FileText, color: "from-violet-500 to-purple-500" },
  { to: "/planner", title: "AI Task Planner", desc: "Prioritize and schedule your work.", icon: ListChecks, color: "from-cyan-500 to-sky-500" },
  { to: "/research", title: "Research Assistant", desc: "Briefings, insights, and next steps.", icon: Sparkles, color: "from-fuchsia-500 to-pink-500" },
  { to: "/chat", title: "AI Chatbot", desc: "Conversational assistant for anything.", icon: MessageSquare, color: "from-emerald-500 to-teal-500" },
] as const;

function Overview() {
  return (
    <AppShell>
      <PageHeader
        icon={Cpu}
        title="Welcome to your AI workspace"
        description="Five focused tools that turn raw input into polished, professional output."
      />
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border bg-gradient-to-br from-accent/40 to-card p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h2 className="text-base font-semibold">Built with structured prompt engineering</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                Every tool uses a dedicated system prompt and output template to produce clear, professional results.
                AI-generated content may require human review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
