import { useEffect, useRef, useState } from "react";
import { Check, Copy, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LIVE_RULES, TONE_CLASS, type LiveRule } from "@/lib/aimimit/live-rules";
import { liveSpeechSupported, startLiveSpeech } from "@/lib/aimimit/live-speech";
import { cn } from "@/lib/utils";

type Props = { seconds: string; level: number; onCancel: () => void; onStop: () => void };
type Tip = { rule: LiveRule; at: string; quote: string };

function TipCard({ tip }: { tip: Tip }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(tip.rule.say).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={cn("animate-fade-in rounded-lg border-l-4 border p-3 shadow-sm", TONE_CLASS[tip.rule.tone])}>
      <div className="flex items-center justify-between gap-2">
        <span className="rounded bg-[var(--tip)] px-2 py-0.5 text-[11px] font-bold text-background">{tip.rule.badge}</span>
        <span className="text-[11px] text-muted-foreground">{tip.at}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">{tip.rule.hint}</p>
      <p className="mt-1 text-sm text-foreground">
        Di': <span className="font-medium">"{tip.rule.say}"</span>
      </p>
      <p className="mt-1 line-clamp-1 text-xs italic text-muted-foreground">Sentito: "{tip.quote}"</p>
      <Button type="button" size="sm" variant="outline" className="mt-2 h-7" onClick={copy}>
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copiato! ✓" : "Copia suggerimento"}
      </Button>
    </div>
  );
}

export function LiveCopilot({ seconds, level, onCancel, onStop }: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [interim, setInterim] = useState("");
  const [tips, setTips] = useState<Tip[]>([]);
  const fired = useRef(new Set<string>());
  const feedEnd = useRef<HTMLDivElement>(null);
  const supported = liveSpeechSupported();

  useEffect(() => {
    if (!supported) return;
    return startLiveSpeech(
      (text) => {
        setLines((l) => [...l, text]);
        for (const rule of LIVE_RULES) {
          if (fired.current.has(rule.id) || !rule.match.test(text)) continue;
          fired.current.add(rule.id);
          const at = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
          setTips((t) => [{ rule, at, quote: text }, ...t]);
        }
      },
      setInterim,
    );
  }, [supported]);

  useEffect(() => feedEnd.current?.scrollIntoView({ block: "end" }), [lines, interim]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-danger/40 bg-danger-soft px-4 py-2">
        <span className="relative flex size-3 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-60" />
          <span className="relative inline-flex size-3 rounded-full bg-danger" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-danger">Registrazione in corso · {seconds}</p>
          <div className="mt-1 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-danger/15">
            <div className="h-full bg-danger transition-all" style={{ width: `${Math.min(level * 140, 100)}%` }} />
          </div>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel} aria-label="Annulla registrazione">
          <X className="size-4" />
        </Button>
        <Button type="button" size="sm" onClick={onStop} className="bg-danger text-danger-foreground hover:bg-danger/90">
          <Square className="size-3.5 fill-current" /> Termina e analizza
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[1fr_1fr] md:grid-cols-[3fr_2fr] md:grid-rows-1">
        <section className="flex min-h-0 flex-col border-b border-border md:border-b-0 md:border-r">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold text-foreground">
            Trascrizione live <span className="font-normal text-muted-foreground">· divisione Raffaele / Cliente nel report finale</span>
          </h2>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
            {!supported ? (
              <p className="text-muted-foreground">
                Questo browser non supporta il testo live (usa Chrome o Edge). La registrazione continua comunque e a fine chiamata avrai trascrizione e report.
              </p>
            ) : lines.length === 0 && !interim ? (
              <p className="text-muted-foreground">In ascolto… il testo comparirà qui mentre parlate.</p>
            ) : null}
            {lines.map((l, i) => (
              <p key={i} className="text-foreground">{l}</p>
            ))}
            {interim ? <p className="italic text-muted-foreground">{interim}</p> : null}
            <div ref={feedEnd} />
          </div>
        </section>
        <aside className="flex min-h-0 flex-col bg-muted/30">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold text-foreground">🧠 Suggerimenti Strategici & Alert Live</h2>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
            {tips.length === 0 ? (
              <p className="text-sm text-muted-foreground">I suggerimenti compaiono qui quando il cliente parla di prezzi, hardware, altri bandi, rimborso o requisiti.</p>
            ) : (
              tips.map((t) => <TipCard key={t.rule.id} tip={t} />)
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
