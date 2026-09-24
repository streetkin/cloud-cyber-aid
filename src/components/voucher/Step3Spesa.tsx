import { AlertTriangle, Calculator, Info, Percent, Server, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Field, SectionTitle } from "./Field";
import { cn } from "@/lib/utils";
import {
  INTERVENTIONS,
  SPESA_MINIMA,
  TETTO_VOUCHER,
  computeFinance,
  euro,
  type FieldErrors,
  type InterventionKey,
  type VoucherState,
} from "@/lib/voucher/model";

type Props = {
  state: VoucherState;
  errors: FieldErrors;
  onFornitore: (patch: Partial<VoucherState["fornitore"]>) => void;
  onSpesa: (value: string) => void;
};

export function Step3Spesa({ state, errors, onFornitore, onSpesa }: Props) {
  const finance = computeFinance(state.spesa);

  const toggleIntervento = (key: InterventionKey) => {
    const active = state.fornitore.interventi.includes(key);
    onFornitore({
      interventi: active
        ? state.fornitore.interventi.filter((item) => item !== key)
        : [...state.fornitore.interventi, key],
    });
  };

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Step 3 di 5">Piano di spesa, fornitore e calcolo voucher</SectionTitle>

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="size-4 text-primary" />
            Dati del fornitore
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          <Field
            id="fornitoreNome"
            label="Nome / ragione sociale del fornitore"
            value={state.fornitore.ragioneSociale}
            onChange={(v) => onFornitore({ ragioneSociale: v })}
            error={errors["fornitoreNome"]}
            hint="Attenzione: deve comparire nell'elenco ufficiale approvato con D.D. MIMIT"
          />
          <Field
            id="fornitorePiva"
            label="Partita IVA del fornitore"
            value={state.fornitore.partitaIva}
            onChange={(v) => onFornitore({ partitaIva: v.replace(/\D/g, "") })}
            error={errors["fornitorePiva"]}
            maxLength={11}
            inputMode="numeric"
            hint="11 cifre numeriche"
          />

          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
              Tipologia intervento (selezione multipla ammessa)
            </Label>
            <div className="grid gap-2">
              {INTERVENTIONS.map((item) => {
                const active = state.fornitore.interventi.includes(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleIntervento(item.key)}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-left text-sm transition-colors",
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-foreground/80 hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-px flex size-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/50",
                      )}
                    >
                      {active ? "✓" : ""}
                    </span>
                    <span className="leading-relaxed">{item.label}</span>
                  </button>
                );
              })}
            </div>
            {errors["interventi"] ? (
              <p className="text-xs font-medium text-danger">{errors["interventi"]}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="size-4 text-primary" />
            Motore finanziario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <Field
            id="spesa"
            className="max-w-sm"
            label="Totale spesa preventivata (al netto di IVA) in €"
            value={state.spesa}
            onChange={onSpesa}
            inputMode="decimal"
            placeholder="12.000,00"
            hint={`Investimento minimo ${euro(SPESA_MINIMA)} — contributo 50% fino a ${euro(TETTO_VOUCHER)}`}
          />

          {finance.sottoSoglia ? (
            <div className="flex items-start gap-3 rounded-lg border border-danger/40 bg-danger-soft p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" />
              <p className="text-sm font-medium text-danger">
                Spesa minima ammissibile non raggiunta. Il bando richiede un investimento minimo di
                4.000,00 € al netto di IVA.
              </p>
            </div>
          ) : null}

          {finance.tettoRaggiunto && finance.valida ? (
            <div className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning-soft p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-warning-foreground" />
              <p className="text-sm font-medium text-warning-foreground">
                Il 50% della spesa supera il massimale: il contributo è stato fissato al tetto di
                20.000,00 €. L'eccedenza resta a carico dell'impresa.
              </p>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Spesa imponibile ammissibile
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
                {euro(finance.spesa)}
              </p>
            </div>
            <div className="rounded-lg border border-success/40 bg-success-soft p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-success">
                <Percent className="size-3.5" />
                Contributo a fondo perduto
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-success">
                {euro(finance.voucher)}
              </p>
              <p className="mt-1 text-[11px] text-success/80">50% della spesa, massimo 20.000,00 €</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Wallet className="size-3.5" />
                Quota a carico dell'impresa
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
                {euro(finance.quotaImpresa)}
              </p>
            </div>
            <div className="rounded-lg border border-warning/50 bg-warning-soft p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-warning-foreground">
                Avviso IVA
              </p>
              <p className="mt-2 text-xs leading-relaxed text-warning-foreground">
                L'IVA è esclusa dal calcolo dell'agevolazione e resta a totale carico dell'impresa
                beneficiaria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
