import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Sparkles,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  Wand2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workspace AI" },
      {
        name: "description",
        content:
          "Your AI workplace productivity dashboard: email, meetings, tasks, research, and chat in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft polished emails in seconds with the right tone.",
    url: "/email",
    icon: Mail,
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into action items and decisions.",
    url: "/meeting-notes",
    icon: FileText,
  },
  {
    title: "AI Task Planner",
    description: "Break goals into prioritized, estimated tasks.",
    url: "/task-planner",
    icon: ListChecks,
  },
  {
    title: "AI Research Assistant",
    description: "Get balanced briefings on any work topic.",
    url: "/research",
    icon: Sparkles,
  },
  {
    title: "AI Chatbot",
    description: "Ask anything — a workplace assistant on demand.",
    url: "/chatbot",
    icon: MessageSquare,
  },
];

const stats = [
  { label: "AI tools", value: "5", icon: Wand2 },
  { label: "Avg response", value: "<3s", icon: Zap },
  { label: "Editable outputs", value: "100%", icon: ShieldCheck },
];

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
      <section className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-card md:p-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full gradient-primary opacity-20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Powered by Lovable AI
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Your <span className="text-gradient-primary">AI workplace</span>{" "}
            productivity assistant
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground md:text-lg">
            Write emails, summarize meetings, plan projects, research topics,
            and chat — all in one clean, modern workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-90"
            >
              Start chatting <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent"
            >
              Draft an email
            </Link>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-3 gap-3 md:max-w-md">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border bg-background/70 p-3 backdrop-blur"
            >
              <s.icon className="h-4 w-4 text-primary" />
              <div className="mt-2 font-display text-xl font-semibold">
                {s.value}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Tools
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.url}
              to={t.url}
              className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground transition group-hover:gradient-primary group-hover:text-primary-foreground">
                  <t.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">
                {t.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border bg-muted/40 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">Responsible AI usage</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              All outputs are AI-generated and may be inaccurate, incomplete,
              or biased. Always review and edit content before sending,
              publishing, or making business decisions based on it. Avoid
              sharing confidential or personal data you don't have permission
              to process.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
