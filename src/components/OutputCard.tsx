import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function OutputCard({
  value,
  onChange,
  onRegenerate,
  isLoading,
  placeholder = "Your AI output will appear here. You can edit it freely before copying.",
  minHeight = "min-h-[360px]",
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  minHeight?: string;
}) {
  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-success" />
          <h3 className="text-sm font-medium">
            {isLoading ? "Generating…" : "Editable Output"}
          </h3>
        </div>
        <div className="flex gap-1">
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isLoading}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Regenerate
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={copy} disabled={!value}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${minHeight} resize-y rounded-none border-0 bg-transparent font-mono text-sm leading-relaxed focus-visible:ring-0`}
      />
    </div>
  );
}
