import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Mail, Search, X } from "lucide-react";
import { AppShell } from "@/components/aimimit/AppShell";
import { READY_EMAILS, emailFull } from "@/lib/aimimit/emails";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email già pronte — AI MIMIT" },
      { name: "description", content: "Modelli di email pronti da copiare e inviare ai clienti sul Voucher Cloud & Cybersecurity MIMIT." },
      { property: "og:title", content: "Email già pronte — AI MIMIT" },
      { property: "og:description", content: "Modelli di email pronti da copiare e inviare ai clienti sul Voucher MIMIT." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EmailPage,
});

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function EmailPage() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const emails = useMemo(() => {
    const words = norm(query).split(/\s+/).filter(Boolean);
    return READY_EMAILS.filter((e) => {
      const hay = norm(`${e.label} ${e.hint} ${e.subject} ${e.body}`);
      return words.every((w) => hay.includes(w));
    });
  }, [query]);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(id);
    window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
  };

  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-3xl space-y-2 px-4 py-3">
            <h1 className="text-lg font-semibold">Email già pronte</h1>
            <p className="text-xs text-muted-foreground">
              Copia, sostituisci le parti tra [parentesi] e invia. Solo numeri pubblici del bando,
              mai il prezzo del progetto.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca: lancio, meet, impegnato, documenti…"
                className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-9 text-base outline-none focus:border-primary"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Cancella ricerca"
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-muted-foreground"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
          {emails.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Nessuna email trovata.</p>
          ) : null}
          {emails.map((e) => (
            <section key={e.id} className="rounded-lg border border-border bg-card">
              <div className="flex items-start gap-3 border-b border-border px-4 py-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-semibold leading-tight">{e.label}</h2>
                  <p className="text-xs text-muted-foreground">{e.hint}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void copy(e.id, emailFull(e))}
                  className={cn(
                    "flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors",
                    copied === e.id
                      ? "bg-success text-success-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {copied === e.id ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied === e.id ? "Copiata" : "Copia email"}
                </button>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Oggetto</p>
                <p className="mb-3 text-sm font-medium">{e.subject}</p>
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground/85">
                  {e.body}
                </pre>
                <button
                  type="button"
                  onClick={() => void copy(e.id + "-body", e.body)}
                  className="mt-3 cursor-pointer text-xs font-medium text-primary underline-offset-2 hover:underline"
                >
                  {copied === e.id + "-body" ? "Testo copiato" : "Copia solo il testo (senza oggetto)"}
                </button>
              </div>
            </section>
          ))}
          <p className="pb-6 text-center text-xs text-muted-foreground">
            Informazioni dalla pagina ufficiale del bando MIMIT. Le date e i limiti vanno verificati
            prima di ogni invio importante.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
