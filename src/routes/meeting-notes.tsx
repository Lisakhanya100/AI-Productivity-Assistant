import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";

import { ToolShell, AIDisclaimer } from "@/components/ToolShell";
import { OutputCard } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { streamAI } from "@/lib/ai-stream";
import { toast } from "sonner";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workspace AI" },
      {
        name: "description",
        content:
          "Turn meeting notes or transcripts into clean summaries with decisions and action items.",
      },
    ],
  }),
  component: MeetingPage,
});

function MeetingPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Paste meeting notes or a transcript first.");
      return;
    }
    setLoading(true);
    setOutput("");
    await streamAI({
      tool: "meeting",
      messages: [
        {
          role: "user",
          content: `Summarize these meeting notes / transcript:\n\n${notes}`,
        },
      ],
      onDelta: (c) => setOutput((p) => p + c),
      onError: (m) => toast.error(m),
    });
    setLoading(false);
  };

  return (
    <ToolShell
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript. Get a structured summary, decisions, and action items."
      icon={<FileText className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-semibold">
            Notes / transcript
          </h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Paste content</Label>
              <Textarea
                id="notes"
                rows={16}
                placeholder="Paste raw meeting notes, bullet points, or a transcript here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <Button
              onClick={generate}
              disabled={loading}
              className="gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Summarizing…" : "Summarize meeting"}
            </Button>
          </div>
        </div>

        <div>
          <OutputCard
            value={output}
            onChange={setOutput}
            onRegenerate={generate}
            isLoading={loading}
            placeholder="Your structured summary will appear here. You can edit it directly."
          />
          <AIDisclaimer />
        </div>
      </div>
    </ToolShell>
  );
}
