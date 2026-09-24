import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "./Field";
import { cn } from "@/lib/utils";
import { ELIGIBILITY_ITEMS, type Answer, type EligibilityKey, type VoucherState } from "@/lib/voucher/model";

type Props = {
  state: VoucherState;
  onChange: (key: EligibilityKey, value: Answer) => void;
  showBlock: boolean;
};

export function Step1Eligibility({ state, onChange, showBlock }: Props) {
  const blockers = ELIGIBILITY_ITEMS.filter((item) => state.eligibility[item.key] !== "si");

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Step 1 di 5">Verifica di eleggibilità</SectionTitle>
      <p className="max-w-3xl text-sm text-muted-foreground">
        Tutti i requisiti devono risultare soddisfatti. Una sola risposta negativa o mancante blocca la
        prosecuzione della pratica: il bando MIMIT non ammette deroghe su questi presupposti.
      </p>

      {showBlock && blockers.length > 0 ? (
        <div className="rounded-lg border border-danger/40 bg-danger-soft p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-danger" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-danger">
                Avanzamento bloccato: requisiti di ammissibilità non soddisfatti
              </p>
              <ul className="space-y-1.5 text-sm text-danger/90">
                {blockers.map((item) => (
                  <li key={item.key}>
                    •{" "}
                    {state.eligibility[item.key] === null
                      ? `Risposta mancante al requisito "${item.label.slice(0, 60)}…" — selezionare Sì o No.`
                      : item.fail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {blockers.length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg border border-success/40 bg-success-soft p-4">
          <ShieldCheck className="size-5 shrink-0 text-success" />
          <p className="text-sm font-medium text-success">
            Pre-screening superato: il soggetto risulta potenzialmente ammissibile al voucher.
          </p>
        </div>
      ) : null}

      <div className="space-y-3">
        {ELIGIBILITY_ITEMS.map((item, index) => {
          const value = state.eligibility[item.key];
          return (
            <Card key={item.key} className="border-border shadow-none">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
                <Label className="flex gap-3 text-sm font-normal leading-relaxed text-foreground">
                  <span className="mt-px font-semibold text-primary">{index + 1}.</span>
                  <span>{item.label}</span>
                </Label>
                <div className="flex shrink-0 gap-2 self-start">
                  {(["si", "no"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onChange(item.key, option)}
                      className={cn(
                        "h-9 min-w-16 cursor-pointer rounded-md border px-4 text-sm font-semibold transition-colors",
                        value === option
                          ? option === "si"
                            ? "border-success bg-success text-success-foreground"
                            : "border-danger bg-danger text-danger-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary",
                      )}
                    >
                      {option === "si" ? "Sì" : "No"}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
