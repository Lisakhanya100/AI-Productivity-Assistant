import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { ToolShell, AIDisclaimer } from "@/components/ToolShell";
import { OutputCard } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { streamAI } from "@/lib/ai-stream";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workspace AI" },
      {
        name: "description",
        content:
          "Get balanced, structured briefings on any work-related topic in seconds.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("balanced");
  const [questions, setQuestions] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic to research.");
      return;
    }
    setLoading(true);
    setOutput("");
    const userMsg = `Topic: ${topic}
Depth: ${depth}
Specific questions to address: ${questions || "(none)"}

Produce a structured briefing.`;
    await streamAI({
      tool: "research",
      messages: [{ role: "user", content: userMsg }],
      onDelta: (c) => setOutput((p) => p + c),
      onError: (m) => toast.error(m),
    });
    setLoading(false);
  };

  return (
    <ToolShell
      title="AI Research Assistant"
      description="Get a fast, balanced briefing on any topic — perfect for prep, learning, or quick context."
      icon={<Sparkles className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-semibold">Topic</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">What should we research?</Label>
              <Input
                id="topic"
                placeholder="e.g. Best practices for async standups in distributed teams"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">Quick overview</SelectItem>
                  <SelectItem value="balanced">Balanced briefing</SelectItem>
                  <SelectItem value="deep">Deep dive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="q">Specific questions (optional)</Label>
              <Textarea
                id="q"
                rows={5}
                placeholder="e.g. What tools work best for 3 timezones? How do you measure effectiveness?"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>
            <Button
              onClick={generate}
              disabled={loading}
              className="gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Researching…" : "Generate briefing"}
            </Button>
          </div>
        </div>

        <div>
          <OutputCard
            value={output}
            onChange={setOutput}
            onRegenerate={generate}
            isLoading={loading}
            placeholder="Your research briefing will appear here."
          />
          <AIDisclaimer />
        </div>
      </div>
    </ToolShell>
  );
}
