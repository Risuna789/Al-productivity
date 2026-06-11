import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, User, Sparkles } from "lucide-react";
import { AppShell, PageHeader, AiDisclaimer } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Lumen AI" },
      { name: "description", content: "Conversational AI assistant for your work." },
    ],
  }),
  component: ChatPage,
});

const transport = new DefaultChatTransport({ api: "/api/chat" });

function ChatPage() {
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <AppShell>
      <PageHeader
        icon={MessageSquare}
        title="AI Chat"
        description="Ask anything — drafts, ideas, explanations, code."
      />
      <div className="flex flex-col h-[calc(100vh-145px)] md:h-[calc(100vh-89px)]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-dashed bg-card/40 p-10 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">How can I help today?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try: "Draft a follow-up email to a hiring manager" or "Explain RAG in two paragraphs".
                </p>
              </div>
            )}
            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={cn("flex gap-3", isUser && "flex-row-reverse")}>
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
                  )}>
                    {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border shadow-[var(--shadow-soft)]",
                  )}>
                    {isUser ? (
                      <p className="text-sm whitespace-pre-wrap">{text}</p>
                    ) : (
                      <div className="ai-prose"><ReactMarkdown>{text || "…"}</ReactMarkdown></div>
                    )}
                  </div>
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border bg-card px-4 py-3 shadow-[var(--shadow-soft)]">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "120ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "240ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t bg-card/60 px-6 py-4">
          <form onSubmit={send} className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-[var(--shadow-soft)] focus-within:ring-2 focus-within:ring-ring">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Send a message…"
                rows={1}
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none max-h-40"
              />
              <Button type="submit" disabled={busy || !input.trim()} size="icon" style={{ background: "var(--gradient-primary)" }}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <AiDisclaimer />
          </form>
        </div>
      </div>
    </AppShell>
  );
}
