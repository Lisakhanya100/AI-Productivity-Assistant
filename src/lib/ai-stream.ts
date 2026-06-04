export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };
export type Tool = "email" | "meeting" | "tasks" | "research" | "chat";

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assist`;

export async function streamAI({
  tool,
  messages,
  onDelta,
  onDone,
  onError,
  signal,
}: {
  tool: Tool;
  messages: ChatMessage[];
  onDelta: (chunk: string) => void;
  onDone?: () => void;
  onError?: (msg: string) => void;
  signal?: AbortSignal;
}) {
  try {
    const resp = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ tool, messages }),
      signal,
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429) {
        onError?.("Rate limit reached. Please try again in a moment.");
      } else if (resp.status === 402) {
        onError?.("AI credits exhausted. Add credits to your Lovable workspace.");
      } else {
        onError?.("Something went wrong. Please try again.");
      }
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let done = false;

    while (!done) {
      const { done: streamDone, value } = await reader.read();
      if (streamDone) break;
      buffer += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line || line.startsWith(":")) continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") {
          done = true;
          break;
        }
        try {
          const parsed = JSON.parse(json);
          const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (delta) onDelta(delta);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone?.();
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
    console.error(e);
    onError?.("Network error. Please try again.");
  }
}
