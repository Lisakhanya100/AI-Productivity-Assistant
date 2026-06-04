import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Sparkles } from "lucide-react";

import { ToolShell, AIDisclaimer } from "@/components/ToolShell";
import { OutputCard } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { streamAI } from "@/lib/ai-stream";
import { toast } from "sonner";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workspace AI" },
      {
        name: "description",
        content:
          "Break any goal into a prioritized, estimated task plan with milestones.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!goal.trim()) {
      toast.error("Describe your goal first.");
      return;
    }
    setLoading(true);
    setOutput("");
    const userMsg = `Goal: ${goal}
Deadline: ${deadline || "(none specified)"}
Context: ${context || "(none)"}

Create a structured task plan.`;
    await streamAI({
      tool: "tasks",
      messages: [{ role: "user", content: userMsg }],
      onDelta: (c) => setOutput((p) => p + c),
      onError: (m) => toast.error(m),
    });
    setLoading(false);
  };

  return (
    <ToolShell
      title="AI Task Planner"
      description="Tell us your goal. We'll break it into milestones, tasks, and effort estimates."
      icon={<ListChecks className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-semibold">Goal</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="goal">What do you want to achieve?</Label>
              <Input
                id="goal"
                placeholder="e.g. Launch internal employee onboarding portal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Target date (optional)</Label>
              <Input
                id="deadline"
                placeholder="e.g. End of Q3"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ctx">Constraints / context</Label>
              <Textarea
                id="ctx"
                rows={6}
                placeholder="Team size, tools, dependencies, anything important…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <Button
              onClick={generate}
              disabled={loading}
              className="gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Planning…" : "Generate plan"}
            </Button>
          </div>
        </div>

        <div>
          <OutputCard
            value={output}
            onChange={setOutput}
            onRegenerate={generate}
            isLoading={loading}
            placeholder="Your task plan with milestones and checkboxes will appear here."
          />
          <AIDisclaimer />
        </div>
      </div>
    </ToolShell>
  );
}
