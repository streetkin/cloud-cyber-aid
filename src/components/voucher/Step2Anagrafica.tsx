import { Building2, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Field, SectionTitle } from "./Field";
import { cn } from "@/lib/utils";
import { TIPOLOGIE, type FieldErrors, type VoucherState } from "@/lib/voucher/model";

type Props = {
  state: VoucherState;
  errors: FieldErrors;
  onAzienda: (patch: Partial<VoucherState["azienda"]>) => void;
  onRappresentante: (patch: Partial<VoucherState["rappresentante"]>) => void;
};

export function Step2Anagrafica({ state, errors, onAzienda, onRappresentante }: Props) {
  const a = state.azienda;
  const r = state.rappresentante;

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Step 2 di 5">Anagrafica aziendale e legale rappresentante</SectionTitle>

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4 text-primary" />
            Dati azienda / professionista
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          <Field
            id="ragioneSociale"
            className="sm:col-span-2"
            label="Ragione sociale / Nome e cognome professionista"
            value={a.ragioneSociale}
            onChange={(v) => onAzienda({ ragioneSociale: v })}
            error={errors["ragioneSociale"]}
            placeholder="Esempio S.r.l."
          />

          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
              Tipologia soggetto richiedente
            </Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {TIPOLOGIE.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onAzienda({ tipologia: option })}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                    a.tipologia === option
                      ? "border-primary bg-primary/5 font-medium text-primary"
                      : "border-border bg-card text-foreground/80 hover:border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border",
                      a.tipologia === option ? "border-primary" : "border-muted-foreground/50",
                    )}
                  >
                    {a.tipologia === option ? <span className="size-2 rounded-full bg-primary" /> : null}
                  </span>
                  {option}
                </button>
              ))}
            </div>
            {errors["tipologia"] ? (
              <p className="text-xs font-medium text-danger">{errors["tipologia"]}</p>
            ) : null}
          </div>

          <Field
            id="cfAzienda"
            label="Codice fiscale"
            value={a.codiceFiscale}
            onChange={(v) => onAzienda({ codiceFiscale: v.toUpperCase() })}
            error={errors["codiceFiscaleAz"]}
            maxLength={16}
            hint="16 caratteri alfanumerici oppure 11 cifre"
          />
          <Field
            id="partitaIva"
            label="Partita IVA"
            value={a.partitaIva}
            onChange={(v) => onAzienda({ partitaIva: v.replace(/\D/g, "") })}
            error={errors["partitaIva"]}
            maxLength={11}
            inputMode="numeric"
            hint="11 cifre numeriche"
          />
          <Field
            id="pec"
            label="Indirizzo PEC aziendale"
            value={a.pec}
            onChange={(v) => onAzienda({ pec: v })}
            error={errors["pec"]}
            inputMode="email"
            hint="Deve essere iscritta su INI-PEC"
          />
          <Field
            id="ateco"
            label="Codice ATECO 2007 primario"
            value={a.ateco}
            onChange={(v) => onAzienda({ ateco: v })}
            error={errors["ateco"]}
            placeholder="62.01.00"
            hint="Formato numerico standard, es. 62.01.00"
          />

          <div className="grid gap-5 sm:col-span-2 sm:grid-cols-6">
            <Field
              id="via"
              className="sm:col-span-3"
              label="Sede legale — via"
              value={a.via}
              onChange={(v) => onAzienda({ via: v })}
              error={errors["via"]}
            />
            <Field
              id="civico"
              className="sm:col-span-1"
              label="Civico"
              value={a.civico}
              onChange={(v) => onAzienda({ civico: v })}
              error={errors["civico"]}
            />
            <Field
              id="cap"
              className="sm:col-span-2"
              label="CAP"
              value={a.cap}
              onChange={(v) => onAzienda({ cap: v.replace(/\D/g, "") })}
              error={errors["cap"]}
              maxLength={5}
              inputMode="numeric"
            />
            <Field
              id="comune"
              className="sm:col-span-4"
              label="Comune"
              value={a.comune}
              onChange={(v) => onAzienda({ comune: v })}
              error={errors["comune"]}
            />
            <Field
              id="provincia"
              className="sm:col-span-2"
              label="Provincia"
              value={a.provincia}
              onChange={(v) => onAzienda({ provincia: v.toUpperCase().slice(0, 2) })}
              error={errors["provincia"]}
              maxLength={2}
              placeholder="MI"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserRound className="size-4 text-primary" />
            Dati legale rappresentante / richiedente
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          <Field
            id="nomeCognome"
            label="Nome e cognome"
            value={r.nomeCognome}
            onChange={(v) => onRappresentante({ nomeCognome: v })}
            error={errors["nomeCognome"]}
          />
          <Field
            id="cfRappresentante"
            label="Codice fiscale personale"
            value={r.codiceFiscale}
            onChange={(v) => onRappresentante({ codiceFiscale: v.toUpperCase() })}
            error={errors["cfRappresentante"]}
            maxLength={16}
            hint="16 caratteri alfanumerici"
          />
          <Field
            id="telefono"
            label="Telefono cellulare di contatto"
            value={r.telefono}
            onChange={(v) => onRappresentante({ telefono: v })}
            error={errors["telefono"]}
            inputMode="tel"
            placeholder="3331234567"
          />
          <Field
            id="email"
            label="Email ordinaria di riferimento"
            value={r.email}
            onChange={(v) => onRappresentante({ email: v })}
            error={errors["email"]}
            inputMode="email"
          />
        </CardContent>
      </Card>
    </div>
  );
}
