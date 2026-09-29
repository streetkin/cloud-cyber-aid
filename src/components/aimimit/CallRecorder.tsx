import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { Loader2, Mic } from "lucide-react";
import { LiveCopilot } from "./LiveCopilot";
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
      let text = parts.join("\n").trim();
      if (!text) throw new Error("Non ho sentito parlare nessuno: controlla il vivavoce e riprova.");
      setProgress("· separo le voci consulente / cliente");
      try {
        const res = await fetch("/api/diarize", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = (await res.json().catch(() => ({}))) as { text?: string };
        if (res.ok && data.text) text = data.text;
        else toast.warning("Non sono riuscito a separare le voci: ti mostro il testo unico.");
      } catch {
        toast.warning("Non sono riuscito a separare le voci: ti mostro il testo unico.");
      }
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
    const bar = (
      <div className="flex items-center gap-3 rounded-lg border border-danger/40 bg-danger-soft px-3 py-2">
        <p className="flex-1 text-sm font-semibold text-danger">Registrazione in corso · {fmt(seconds)}</p>
        <Button type="button" size="sm" variant="ghost" onClick={cancel}>Annulla</Button>
        <Button type="button" size="sm" onClick={stop} className="bg-danger text-danger-foreground hover:bg-danger/90">
          Termina e analizza
        </Button>
      </div>
    );
    return (
      <SafeBoundary fallback={bar}>
        <LiveCopilot seconds={fmt(seconds)} level={level} onCancel={cancel} onStop={stop} />
      </SafeBoundary>
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

class SafeBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("Copilota live non disponibile", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
