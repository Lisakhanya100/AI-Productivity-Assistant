import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Trash2, User, Bot } from "lucide-react";

import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamAI, type ChatMessage } from "@/lib/ai-stream";
import { toast } from "sonner";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workspace AI" },
      {
        name: "description",
        content:
          "Chat with your AI workplace assistant. Ask anything — get clear, useful answers.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(next);
    setInput("");
    setLoading(true);

    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: acc } : m,
          );
        }
        return [...prev, { role: "assistant", content: acc }];
      });
    };

    await streamAI({
      tool: "chat",
      messages: next,
      onDelta: upsert,
      onError: (m) => toast.error(m),
    });
    setLoading(false);
  };

  return (
    <ToolShell
      title="AI Chatbot"
      description="Your always-on workplace assistant. Ask questions, brainstorm, draft, or learn."
      icon={<MessageSquare className="h-6 w-6" />}
    >
      <div className="flex h-[calc(100vh-14rem)] flex-col rounded-xl border bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-success" />
            <span className="text-sm font-medium">Live conversation</span>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessages([])}
              disabled={loading}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center text-center">
              <div className="max-w-sm">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  How can I help today?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask anything — drafting, planning, learning, troubleshooting.
                </p>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-sm gradient-primary text-primary-foreground"
                    : "rounded-bl-sm border bg-background"
                }`}
              >
                {m.content || (loading && i === messages.length - 1 ? "…" : "")}
              </div>
              {m.role === "user" && (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-t bg-background/60 p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message your assistant…  (Enter to send, Shift+Enter for newline)"
              rows={2}
              className="resize-none"
            />
            <Button
              onClick={send}
              disabled={loading || !input.trim()}
              className="gradient-primary h-[60px] text-primary-foreground shadow-elegant hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            AI responses can be inaccurate. Verify important information before
            acting on it.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
