import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  hint?: ReactNode;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
};

export function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  className,
  maxLength,
  inputMode,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(error && "border-danger focus-visible:ring-danger")}
      />
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="flex items-start gap-1.5 text-xs font-medium text-danger">
          <AlertCircle className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SectionTitle({ children, kicker }: { children: ReactNode; kicker?: string }) {
  return (
    <div className="space-y-1">
      {kicker ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{kicker}</p>
      ) : null}
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{children}</h2>
    </div>
  );
}
