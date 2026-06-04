import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";

import { ToolShell, AIDisclaimer } from "@/components/ToolShell";
import { OutputCard } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workspace AI" },
      {
        name: "description",
        content:
          "Generate polished, professional emails from a short brief with adjustable tone.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("professional");
  const [brief, setBrief] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!brief.trim()) {
      toast.error("Please describe what the email should say.");
      return;
    }
    setLoading(true);
    setOutput("");
    const userMsg = `Write an email with the following details.
Recipient: ${recipient || "(unspecified)"}
Subject hint: ${subject || "(let AI decide)"}
Tone: ${tone}
Goal / message: ${brief}`;
    await streamAI({
      tool: "email",
      messages: [{ role: "user", content: userMsg }],
      onDelta: (c) => setOutput((p) => p + c),
      onError: (m) => toast.error(m),
    });
    setLoading(false);
  };

  return (
    <ToolShell
      title="Smart Email Generator"
      description="Describe what you need to say. We'll draft a clear, on-tone email you can edit."
      icon={<Mail className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-semibold">Brief</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Sarah, hiring manager at Acme"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject hint (optional)</Label>
              <Input
                id="subject"
                placeholder="e.g. Follow up on Q3 proposal"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="concise">Concise & direct</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="apologetic">Apologetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brief">What do you want to say?</Label>
              <Textarea
                id="brief"
                rows={6}
                placeholder="e.g. Thank her for the meeting, recap the 3 next steps, propose a call next Tuesday."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
            </div>
            <Button
              onClick={generate}
              disabled={loading}
              className="gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Generating…" : "Generate email"}
            </Button>
          </div>
        </div>

        <div>
          <OutputCard
            value={output}
            onChange={setOutput}
            onRegenerate={generate}
            isLoading={loading}
            placeholder="Your generated email will appear here. Edit freely before copying."
          />
          <AIDisclaimer />
        </div>
      </div>
    </ToolShell>
  );
}
