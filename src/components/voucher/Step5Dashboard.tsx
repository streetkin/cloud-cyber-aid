import { useState } from "react";
import { Check, ClipboardCheck, Copy, Download, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle } from "./Field";
import { cn } from "@/lib/utils";
import {
  CHECKLIST_STEPS,
  DOCUMENTS,
  ELIGIBILITY_ITEMS,
  INTERVENTIONS,
  computeFinance,
  euro,
  type VoucherState,
} from "@/lib/voucher/model";

type Props = {
  state: VoucherState;
  onToggleChecklist: (index: number) => void;
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard non disponibile */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate font-medium tabular-nums text-foreground">{value || "—"}</p>
      </div>
      <Button
        type="button"
        size="sm"
        variant={copied ? "success" : "quiet"}
        onClick={copy}
        disabled={!value}
        className="shrink-0"
      >
        {copied ? (
          <>
            <Check className="size-4" /> Copiato! ✓
          </>
        ) : (
          <>
            <Copy className="size-4" /> Copia
          </>
        )}
      </Button>
    </div>
  );
}

const buildSummary = (state: VoucherState) => {
  const finance = computeFinance(state.spesa);
  const a = state.azienda;
  const r = state.rappresentante;
  const lines = [
    "FASCICOLO DOMANDA — VOUCHER CLOUD & CYBERSECURITY (MIMIT / Invitalia)",
    `Codice pratica: ${state.codicePratica}`,
    `Generato il: ${new Date().toLocaleString("it-IT")}`,
    "",
    "1. ELEGGIBILITÀ",
    ...ELIGIBILITY_ITEMS.map(
      (item, i) => `  ${i + 1}. ${item.label}\n     Risposta: ${state.eligibility[item.key] === "si" ? "SÌ" : "NO"}`,
    ),
    "",
    "2. ANAGRAFICA",
    `  Ragione sociale: ${a.ragioneSociale}`,
    `  Tipologia: ${a.tipologia}`,
    `  Codice fiscale: ${a.codiceFiscale}`,
    `  Partita IVA: ${a.partitaIva}`,
    `  PEC: ${a.pec}`,
    `  ATECO 2007: ${a.ateco}`,
    `  Sede legale: ${a.via} ${a.civico}, ${a.cap} ${a.comune} (${a.provincia})`,
    "",
    "3. LEGALE RAPPRESENTANTE",
    `  Nome e cognome: ${r.nomeCognome}`,
    `  Codice fiscale: ${r.codiceFiscale}`,
    `  Telefono: ${r.telefono}`,
    `  Email: ${r.email}`,
    "",
    "4. FORNITORE E PIANO DI SPESA",
    `  Fornitore: ${state.fornitore.ragioneSociale}`,
    `  P.IVA fornitore: ${state.fornitore.partitaIva}`,
    `  Interventi: ${INTERVENTIONS.filter((i) => state.fornitore.interventi.includes(i.key))
      .map((i) => i.label)
      .join(" | ")}`,
    `  Spesa imponibile: ${euro(finance.spesa)}`,
    `  Contributo richiesto (50%, max 20.000 €): ${euro(finance.voucher)}`,
    `  Quota a carico impresa: ${euro(finance.quotaImpresa)}`,
    "  Nota: IVA esclusa dal calcolo e a totale carico del beneficiario.",
    "",
    "5. DOCUMENTI DEL FASCICOLO",
    ...DOCUMENTS.map((doc) => {
      const file = state.documenti[doc.key];
      return `  [${file ? "X" : " "}] ${doc.label}${file ? ` — ${file.name}` : ""}`;
    }),
    "",
    "6. CHECKLIST INVIO SU INVITALIA",
    ...CHECKLIST_STEPS.map(
      (step, i) => `  [${state.checklist.includes(i) ? "X" : " "}] Passo ${i + 1}: ${step}`,
    ),
    "",
    "Nota di conformità: strumento privato di supporto e pre-compilazione tecnica. Non raccoglie credenziali SPID né sostituisce la presentazione formale della domanda sul portale ufficiale MIMIT/Invitalia.",
  ];
  return lines.join("\n");
};

export function Step5Dashboard({ state, onToggleChecklist }: Props) {
  const finance = computeFinance(state.spesa);

  const download = () => {
    const blob = new Blob([buildSummary(state)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.codicePratica || "fascicolo-voucher"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const rows: { label: string; value: string }[] = [
    { label: "Ragione sociale", value: state.azienda.ragioneSociale },
    { label: "Partita IVA", value: state.azienda.partitaIva },
    { label: "Codice fiscale", value: state.azienda.codiceFiscale },
    { label: "Indirizzo PEC", value: state.azienda.pec },
    { label: "Codice ATECO primario", value: state.azienda.ateco },
    { label: "P.IVA fornitore MIMIT", value: state.fornitore.partitaIva },
    { label: "Importo spesa imponibile (€)", value: finance.spesa ? finance.spesa.toFixed(2) : "" },
    {
      label: "Importo agevolazione richiesta (€)",
      value: finance.voucher ? finance.voucher.toFixed(2) : "",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-brand p-5 text-brand-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-foreground/60">
            Step 5 di 5 · Cruscotto operativo
          </p>
          <h2 className="mt-1 text-xl font-semibold">Cheat-sheet copia-incolla per Invitalia</h2>
          <p className="mt-1 text-sm text-brand-foreground/70">
            Codice pratica <span className="font-mono">{state.codicePratica}</span> · contributo
            richiesto {euro(finance.voucher)}
          </p>
        </div>
        <Button type="button" variant="success" size="lg" onClick={download}>
          <Download className="size-4" />
          Scarica fascicolo domanda
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="size-4 text-primary" />
            Tabella copia-rapida dei dati
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {rows.map((row) => (
            <CopyRow key={row.label} label={row.label} value={row.value} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="size-4 text-primary" />
            Guida operativa all'invio su Invitalia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-6">
          {CHECKLIST_STEPS.map((step, index) => {
            const done = state.checklist.includes(index);
            return (
              <button
                key={step}
                type="button"
                onClick={() => onToggleChecklist(index)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-left transition-colors",
                  done
                    ? "border-success/40 bg-success-soft"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "mt-px flex size-5 shrink-0 items-center justify-center rounded border",
                    done ? "border-success bg-success text-success-foreground" : "border-muted-foreground/50",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : null}
                </span>
                <span className="space-y-0.5">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Passo {index + 1}
                  </span>
                  <span
                    className={cn(
                      "block text-sm leading-relaxed",
                      done ? "text-foreground/70 line-through" : "text-foreground",
                    )}
                  >
                    {step}
                  </span>
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <p className="rounded-lg border border-border bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Nota di conformità:</span> questo strumento è una
        piattaforma privata di supporto e pre-compilazione tecnica. Non raccoglie credenziali SPID né
        sostituisce la presentazione formale della domanda, che deve essere finalizzata dal legale
        rappresentante della società beneficiaria sul portale ufficiale MIMIT/Invitalia tramite la propria
        identità digitale.
      </p>
    </div>
  );
}
