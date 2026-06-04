import { ReactNode } from "react";

export function ToolShell({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant">
          {icon}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function AIDisclaimer() {
  return (
    <p className="mt-4 text-xs text-muted-foreground">
      AI-generated content can be inaccurate or biased. Review and edit
      outputs before using them in real workplace decisions or communications.
    </p>
  );
}
