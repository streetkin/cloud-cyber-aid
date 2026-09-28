import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { AppShell } from "@/components/aimimit/AppShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { FAQ } from "@/lib/aimimit/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ rapide — AI MIMIT" },
      { name: "description", content: "Risposte pronte alle domande dei clienti sul Voucher Cloud e Cybersecurity MIMIT." },
      { property: "og:title", content: "FAQ rapide — AI MIMIT" },
      { property: "og:description", content: "Risposte pronte da dare al telefono sul Voucher Cloud e Cybersecurity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FaqPage,
});

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function FaqPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("tutte");

  const groups = useMemo(() => {
    const words = norm(query).split(/\s+/).filter(Boolean);
    return FAQ.filter((c) => cat === "tutte" || c.id === cat)
      .map((c) => ({
        ...c,
        items: c.items.filter((f) => {
          const hay = norm(`${f.q} ${f.a} ${f.tags ?? ""}`);
          return words.every((w) => hay.includes(w));
        }),
      }))
      .filter((c) => c.items.length > 0);
  }, [query, cat]);

  const total = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-3xl space-y-3 px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca: spesa minima, fornitore, rimborso…"
                className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-9 text-base outline-none focus:border-primary"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} aria-label="Cancella ricerca" className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-muted-foreground">
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {[{ id: "tutte", label: "Tutte" }, ...FAQ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    cat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground/80",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6 px-4 py-4">
          {total === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nessuna risposta trovata. Prova con un'altra parola o chiedi ad AI MIMIT.
            </p>
          ) : null}
          {groups.map((g) => (
            <section key={g.id}>
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{g.label}</h2>
              <Accordion type="multiple" className="rounded-lg border border-border bg-card px-3">
                {g.items.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="py-3 text-left text-[15px] font-medium">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-relaxed text-foreground/85">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
          <p className="pb-6 text-center text-xs text-muted-foreground">
            Risposte basate sulla guida Voucher 2026 e sui manuali MIMIT. L'esito finale dipende sempre dall'istruttoria del Ministero.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
