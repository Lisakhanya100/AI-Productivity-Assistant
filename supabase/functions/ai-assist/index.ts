// AI assistant edge function – proxies to Lovable AI Gateway with streaming.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Tool = "email" | "meeting" | "tasks" | "research" | "chat";

const SYSTEM_PROMPTS: Record<Tool, string> = {
  email:
    "You are an expert business writing assistant. Generate a clear, professional email based on the user's brief. Match the requested tone. Include a subject line as the first line in the format 'Subject: ...'. Then a blank line, then the email body with greeting, paragraphs, and a sign-off. Keep it concise.",
  meeting:
    "You are an expert meeting analyst. Summarize the provided meeting notes/transcript into clean Markdown with the sections: **Summary** (3-5 sentences), **Key Decisions**, **Action Items** (with owner and due date when available), and **Open Questions**. Be specific and skip filler.",
  tasks:
    "You are an AI project planner. Given a goal, break it into a concrete, prioritized task plan in Markdown. Include: **Goal**, **Milestones**, and a **Task List** with checkboxes (- [ ]) grouped by milestone. Each task should include an estimated effort (S/M/L) and suggested order. Be realistic and actionable.",
  research:
    "You are an AI research assistant. Provide a well-structured Markdown briefing on the user's topic with: **Overview**, **Key Concepts**, **Recent Developments / Context**, **Notable Examples**, and **Further Reading suggestions** (general categories, not fabricated URLs). Be balanced, cite uncertainty where appropriate, and avoid inventing specific statistics.",
  chat:
    "You are a helpful, friendly AI workplace productivity assistant. Be concise, accurate, and pragmatic. Use Markdown when helpful. If a request is unclear, ask one focused clarifying question.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tool, messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const system =
      SYSTEM_PROMPTS[(tool as Tool) ?? "chat"] ?? SYSTEM_PROMPTS.chat;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: system }, ...messages],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              "AI credits exhausted. Add credits to your Lovable workspace to continue.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assist error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
