import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startRecording, type Recording } from "@/lib/aimimit/recorder";

type Props = { disabled?: boolean; onTranscript: (text: string, seconds: number) => void };

const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

export function CallRecorder({ disabled, onTranscript }: Props) {
  const [phase, setPhase] = useState<"idle" | "recording" | "transcribing">("idle");
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [progress, setProgress] = useState("");
  const rec = useRef<Recording | null>(null);

  useEffect(() => {
    if (phase !== "recording") return;
    const started = Date.now();
    const id = window.setInterval(() => {
      setSeconds(Math.floor((Date.now() - started) / 1000));
      setLevel(rec.current?.level() ?? 0);
    }, 200);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => () => rec.current?.cancel(), []);

  const start = async () => {
    try {
      rec.current = await startRecording();
      setSeconds(0);
      setPhase("recording");
    } catch {
      toast.error("Non riesco ad accedere al microfono. Consenti l'accesso dal browser e riprova.");
    }
  };

  const stop = async () => {
    const current = rec.current;
    if (!current) return;
    const duration = seconds;
    setPhase("transcribing");
    try {
      const files = await current.stop();
      const parts: string[] = [];
      for (const [i, file] of files.entries()) {
        setProgress(files.length > 1 ? `parte ${i + 1} di ${files.length}` : "");
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/transcribe", { method: "POST", body: form });
        const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Trascrizione non riuscita.");
        if (data.text) parts.push(data.text);
      }
      const text = parts.join("\n").trim();
      if (!text) throw new Error("Non ho sentito parlare nessuno: controlla il vivavoce e riprova.");
      onTranscript(text, duration);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Trascrizione non riuscita.");
    } finally {
      rec.current = null;
      setPhase("idle");
      setProgress("");
    }
  };

  const cancel = () => {
    rec.current?.cancel();
    rec.current = null;
    setPhase("idle");
  };

  if (phase === "recording") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-danger/40 bg-danger-soft px-3 py-2">
        <span className="relative flex size-3">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-60" />
          <span className="relative inline-flex size-3 rounded-full bg-danger" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-danger">Registrazione in corso · {fmt(seconds)}</p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-danger/15">
            <div className="h-full bg-danger transition-all" style={{ width: `${Math.min(level * 140, 100)}%` }} />
          </div>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={cancel} aria-label="Annulla registrazione">
          <X className="size-4" />
        </Button>
        <Button type="button" size="sm" onClick={stop} className="bg-danger text-danger-foreground hover:bg-danger/90">
          <Square className="size-3.5 fill-current" />
          Termina e analizza
        </Button>
      </div>
    );
  }

  if (phase === "transcribing") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        Trascrivo la chiamata {progress}…
      </div>
    );
  }

  return (
    <Button type="button" variant="outline" onClick={start} disabled={disabled} className="w-full sm:w-auto">
      <Mic className="size-4 text-danger" />
      Registra chiamata (vivavoce)
    </Button>
  );
}
