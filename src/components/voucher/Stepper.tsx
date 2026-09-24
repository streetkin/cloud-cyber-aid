import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Eleggibilità",
  "Anagrafica",
  "Piano di spesa",
  "Documenti",
  "Cruscotto invio",
] as const;

export function Stepper({ current }: { current: number }) {
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <ol className="flex items-start gap-1 sm:gap-2">
          {STEPS.map((label, index) => {
            const step = index + 1;
            const done = step < current;
            const active = step === current;
            return (
              <li key={label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-center gap-1">
                  <span
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      index === 0 ? "bg-transparent" : done || active ? "bg-primary" : "bg-border",
                    )}
                  />
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                      done && "border-success bg-success text-success-foreground",
                      active && "border-primary bg-primary text-primary-foreground",
                      !done && !active && "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-4" /> : step}
                  </span>
                  <span
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      index === STEPS.length - 1
                        ? "bg-transparent"
                        : done
                          ? "bg-primary"
                          : "bg-border",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-center text-[11px] leading-tight sm:text-xs",
                    active ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
