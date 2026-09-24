import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Landmark, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stepper } from "./Stepper";
import { Step1Eligibility } from "./Step1Eligibility";
import { Step2Anagrafica } from "./Step2Anagrafica";
import { Step3Spesa } from "./Step3Spesa";
import { Step4Documenti } from "./Step4Documenti";
import { Step5Dashboard } from "./Step5Dashboard";
import { useVoucherState } from "./useVoucherState";
import {
  DOCUMENTS,
  ELIGIBILITY_ITEMS,
  computeFinance,
  generateCodicePratica,
  validateAnagrafica,
  validateFornitore,
  type Answer,
  type DocumentKey,
  type EligibilityKey,
  type StoredFile,
  type VoucherState,
} from "@/lib/voucher/model";

export function VoucherWizard() {
  const { state, setState, update, reset } = useVoucherState();
  const [touched, setTouched] = useState(false);

  const finance = computeFinance(state.spesa);
  const anagraficaErrors = useMemo(() => validateAnagrafica(state), [state]);
  const fornitoreErrors = useMemo(() => validateFornitore(state), [state]);
  const eligibilityOk = ELIGIBILITY_ITEMS.every((item) => state.eligibility[item.key] === "si");
  const documentiOk = DOCUMENTS.every((doc) => !doc.required || Boolean(state.documenti[doc.key]));

  const canAdvance =
    (state.step === 1 && eligibilityOk) ||
    (state.step === 2 && Object.keys(anagraficaErrors).length === 0) ||
    (state.step === 3 && Object.keys(fornitoreErrors).length === 0 && finance.valida) ||
    (state.step === 4 && documentiOk);

  const goNext = () => {
    setTouched(true);
    if (!canAdvance) return;
    setTouched(false);
    setState((current) => ({
      ...current,
      step: Math.min(current.step + 1, 5),
      codicePratica:
        current.step === 4 && !current.codicePratica ? generateCodicePratica() : current.codicePratica,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setTouched(false);
    update({ step: Math.max(state.step - 1, 1) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const patchAzienda = (patch: Partial<VoucherState["azienda"]>) =>
    setState((current) => ({ ...current, azienda: { ...current.azienda, ...patch } }));

  const patchRappresentante = (patch: Partial<VoucherState["rappresentante"]>) =>
    setState((current) => ({ ...current, rappresentante: { ...current.rappresentante, ...patch } }));

  const patchFornitore = (patch: Partial<VoucherState["fornitore"]>) =>
    setState((current) => ({ ...current, fornitore: { ...current.fornitore, ...patch } }));

  const setEligibility = (key: EligibilityKey, value: Answer) =>
    setState((current) => ({ ...current, eligibility: { ...current.eligibility, [key]: value } }));

  const setDocumento = (key: DocumentKey, file: StoredFile | null) =>
    setState((current) => {
      const documenti = { ...current.documenti };
      if (file) documenti[key] = file;
      else delete documenti[key];
      return { ...current, documenti };
    });

  const toggleChecklist = (index: number) =>
    setState((current) => ({
      ...current,
      checklist: current.checklist.includes(index)
        ? current.checklist.filter((item) => item !== index)
        : [...current.checklist, index],
    }));

  const blockMessage =
    state.step === 1
      ? "Completa positivamente tutti i requisiti di eleggibilità per procedere."
      : state.step === 2
        ? "Correggi i campi segnalati in rosso per procedere allo step successivo."
        : state.step === 3
          ? finance.valida
            ? "Completa i dati del fornitore e seleziona almeno un intervento."
            : "La spesa imponibile deve essere almeno di 4.000,00 € al netto di IVA."
          : "Carica tutti i documenti obbligatori del fascicolo.";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-brand text-brand-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-foreground/10">
              <Landmark className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-foreground/60">
                MIMIT · Invitalia
              </p>
              <h1 className="text-lg font-semibold leading-tight sm:text-xl">
                Voucher Cloud &amp; Cybersecurity
              </h1>
              <p className="text-xs text-brand-foreground/70">
                Preparazione e validazione della domanda di contributo a fondo perduto
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-brand-foreground/10 px-3 py-1.5 text-[11px] font-medium sm:flex">
              <ShieldCheck className="size-3.5" />
              Dati salvati sul tuo dispositivo
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-brand-foreground/80 hover:bg-brand-foreground/10 hover:text-brand-foreground"
            >
              <RotateCcw className="size-4" />
              Azzera
            </Button>
          </div>
        </div>
      </header>

      <Stepper current={state.step} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {state.step === 1 ? (
          <Step1Eligibility state={state} onChange={setEligibility} showBlock={touched} />
        ) : null}
        {state.step === 2 ? (
          <Step2Anagrafica
            state={state}
            errors={touched ? anagraficaErrors : {}}
            onAzienda={patchAzienda}
            onRappresentante={patchRappresentante}
          />
        ) : null}
        {state.step === 3 ? (
          <Step3Spesa
            state={state}
            errors={touched ? fornitoreErrors : {}}
            onFornitore={patchFornitore}
            onSpesa={(value) => update({ spesa: value })}
          />
        ) : null}
        {state.step === 4 ? <Step4Documenti state={state} onFile={setDocumento} /> : null}
        {state.step === 5 ? (
          <Step5Dashboard state={state} onToggleChecklist={toggleChecklist} />
        ) : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={state.step === 1}
            className="sm:w-auto"
          >
            <ArrowLeft className="size-4" />
            Indietro
          </Button>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {state.step < 5 && !canAdvance ? (
              <p className="text-xs text-muted-foreground sm:text-right">{blockMessage}</p>
            ) : null}
            {state.step < 5 ? (
              <Button type="button" onClick={goNext}>
                {state.step === 4 ? "Genera cruscotto operativo" : "Avanti"}
                <ArrowRight className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs leading-relaxed text-muted-foreground sm:px-6">
          Piattaforma privata di supporto tecnico alla compilazione. Nessuna credenziale SPID/CIE viene
          richiesta o conservata. La domanda va finalizzata dal legale rappresentante sul portale
          ufficiale MIMIT/Invitalia.
        </div>
      </footer>
    </div>
  );
}
