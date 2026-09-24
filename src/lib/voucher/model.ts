export type Answer = "si" | "no" | null;

export const ELIGIBILITY_ITEMS = [
  {
    key: "registro",
    label:
      "L'impresa è costituita, attiva e iscritta al Registro delle Imprese (oppure è lavoratore autonomo/professionista regolarmente iscritto agli ordini o alla gestione separata INPS)?",
    fail: "Requisito soggettivo non soddisfatto: è indispensabile l'iscrizione attiva al Registro delle Imprese o, per i professionisti, all'ordine competente o alla gestione separata INPS.",
  },
  {
    key: "pmi",
    label:
      "L'impresa/professionista rientra nei parametri dimensionali di Micro, Piccola o Media Impresa (PMI) ai sensi della raccomandazione 2003/361/CE?",
    fail: "Dimensione d'impresa non ammissibile: il bando è riservato alle PMI secondo la raccomandazione 2003/361/CE.",
  },
  {
    key: "sede",
    label: "L'impresa ha sede legale e/o operativa attiva sul territorio nazionale italiano?",
    fail: "Localizzazione non ammissibile: è richiesta una sede legale e/o operativa attiva in Italia.",
  },
  {
    key: "durc",
    label:
      "L'impresa è in regola con il versamento dei contributi previdenziali e assistenziali (DURC regolare) e non si trova in stato di liquidazione o procedura concorsuale?",
    fail: "Regolarità contributiva/stato d'impresa non conforme: DURC irregolare o procedura concorsuale in corso escludono dall'agevolazione.",
  },
  {
    key: "deminimis",
    label:
      "L'impresa dispone di capienza sufficiente nel plafond 'De Minimis' (massimo 300.000 € di aiuti ricevuti negli ultimi 3 anni fiscali)?",
    fail: "Plafond De Minimis esaurito: il contributo non è concedibile oltre il massimale di 300.000 € nei 3 esercizi finanziari.",
  },
  {
    key: "fornitore",
    label:
      "I servizi o prodotti acquistati provengono da uno dei soggetti regolarmente iscritti all'Elenco Ufficiale Fornitori Abilitati MIMIT?",
    fail: "Fornitore non ammissibile: le spese sono agevolabili solo se sostenute verso fornitori iscritti all'Elenco Ufficiale MIMIT.",
  },
] as const;

export type EligibilityKey = (typeof ELIGIBILITY_ITEMS)[number]["key"];

export const INTERVENTIONS = [
  {
    key: "cloud",
    label: "Adozione/potenziamento di soluzioni Cloud Computing (IaaS, PaaS, SaaS)",
  },
  {
    key: "cyber",
    label:
      "Adozione/potenziamento di sistemi e servizi di Cyber Security (firewall avanzati, endpoint security, backup immutabile, vulnerability assessment, ecc.)",
  },
] as const;

export type InterventionKey = (typeof INTERVENTIONS)[number]["key"];

export const DOCUMENTS = [
  {
    key: "preventivo",
    label: "Preventivo dettagliato o proposta contrattuale del Fornitore Abilitato MIMIT",
    required: true,
  },
  {
    key: "visura",
    label:
      "Visura Camerale aggiornata (max 6 mesi) o certificato di iscrizione all'albo / gestione separata",
    required: true,
  },
  {
    key: "identita",
    label: "Copia fronte/retro del documento d'identità del Legale Rappresentante in corso di validità",
    required: true,
  },
  {
    key: "dsan",
    label: "Modello DSAN regolarità DURC / dichiarazione de minimis pregressi",
    required: false,
  },
] as const;

export type DocumentKey = (typeof DOCUMENTS)[number]["key"];

export type StoredFile = { name: string; size: number; type: string; uploadedAt: string };

export type VoucherState = {
  step: number;
  eligibility: Record<EligibilityKey, Answer>;
  azienda: {
    ragioneSociale: string;
    tipologia: string;
    codiceFiscale: string;
    partitaIva: string;
    pec: string;
    ateco: string;
    via: string;
    civico: string;
    cap: string;
    comune: string;
    provincia: string;
  };
  rappresentante: {
    nomeCognome: string;
    codiceFiscale: string;
    telefono: string;
    email: string;
  };
  fornitore: {
    ragioneSociale: string;
    partitaIva: string;
    interventi: InterventionKey[];
  };
  spesa: string;
  documenti: Partial<Record<DocumentKey, StoredFile>>;
  checklist: number[];
  codicePratica: string;
};

export const SPESA_MINIMA = 4000;
export const TETTO_VOUCHER = 20000;

export const createInitialState = (): VoucherState => ({
  step: 1,
  eligibility: {
    registro: null,
    pmi: null,
    sede: null,
    durc: null,
    deminimis: null,
    fornitore: null,
  },
  azienda: {
    ragioneSociale: "",
    tipologia: "",
    codiceFiscale: "",
    partitaIva: "",
    pec: "",
    ateco: "",
    via: "",
    civico: "",
    cap: "",
    comune: "",
    provincia: "",
  },
  rappresentante: { nomeCognome: "", codiceFiscale: "", telefono: "", email: "" },
  fornitore: { ragioneSociale: "", partitaIva: "", interventi: [] },
  spesa: "",
  documenti: {},
  checklist: [],
  codicePratica: "",
});

export const parseSpesa = (raw: string): number => {
  const normalized = raw.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
};

export const computeFinance = (raw: string) => {
  const spesa = parseSpesa(raw);
  const teorico = spesa * 0.5;
  const voucher = spesa >= SPESA_MINIMA ? Math.min(teorico, TETTO_VOUCHER) : 0;
  return {
    spesa,
    voucher,
    quotaImpresa: Math.max(spesa - voucher, 0),
    sottoSoglia: spesa > 0 && spesa < SPESA_MINIMA,
    tettoRaggiunto: teorico > TETTO_VOUCHER,
    valida: spesa >= SPESA_MINIMA,
  };
};

export const euro = (value: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value);

export const generateCodicePratica = () => {
  const suffix = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  return `VOUCHER-CS-${new Date().getFullYear()}-${suffix.padEnd(4, "0")}`;
};

export const TIPOLOGIE = [
  "Micro Impresa",
  "Piccola Impresa",
  "Media Impresa",
  "Lavoratore Autonomo / Libero Professionista",
] as const;

const CF_PERSONA = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i;

export type FieldErrors = Record<string, string>;

export const validateAnagrafica = (state: VoucherState): FieldErrors => {
  const e: FieldErrors = {};
  const a = state.azienda;
  const r = state.rappresentante;
  if (a.ragioneSociale.trim().length < 2)
    e.ragioneSociale = "Indicare la ragione sociale o il nome e cognome del professionista.";
  if (!a.tipologia) e.tipologia = "Selezionare la tipologia di soggetto richiedente.";
  if (!(/^\d{11}$/.test(a.codiceFiscale.trim()) || CF_PERSONA.test(a.codiceFiscale.trim())))
    e.codiceFiscaleAz = "Il codice fiscale deve essere di 16 caratteri alfanumerici o 11 cifre.";
  if (!/^\d{11}$/.test(a.partitaIva.trim()))
    e.partitaIva = "La partita IVA deve essere composta esattamente da 11 cifre numeriche.";
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(a.pec.trim()))
    e.pec = "Inserire un indirizzo PEC formalmente valido (es. impresa@pec.it).";
  if (!/^\d{2}\.\d{2}(\.\d{2})?$/.test(a.ateco.trim()))
    e.ateco = "Formato ATECO 2007 non valido. Esempio corretto: 62.01.00";
  if (a.via.trim().length < 2) e.via = "Indicare la via della sede legale.";
  if (!a.civico.trim()) e.civico = "Indicare il numero civico.";
  if (!/^\d{5}$/.test(a.cap.trim())) e.cap = "Il CAP deve essere composto da 5 cifre.";
  if (a.comune.trim().length < 2) e.comune = "Indicare il comune della sede legale.";
  if (!/^[A-Za-z]{2}$/.test(a.provincia.trim()))
    e.provincia = "Indicare la provincia con 2 lettere (es. MI).";
  if (r.nomeCognome.trim().length < 3)
    e.nomeCognome = "Indicare nome e cognome del legale rappresentante.";
  if (!CF_PERSONA.test(r.codiceFiscale.trim()))
    e.cfRappresentante = "Codice fiscale personale non valido: 16 caratteri alfanumerici.";
  if (!/^(\+39)?\s?3\d{8,9}$/.test(r.telefono.replace(/[\s.-]/g, "")))
    e.telefono = "Inserire un numero di cellulare italiano valido (es. 3331234567).";
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(r.email.trim()))
    e.email = "Inserire un indirizzo email ordinario valido.";
  return e;
};

export const validateFornitore = (state: VoucherState): FieldErrors => {
  const e: FieldErrors = {};
  if (state.fornitore.ragioneSociale.trim().length < 2)
    e.fornitoreNome = "Indicare il nome o la ragione sociale del fornitore abilitato.";
  if (!/^\d{11}$/.test(state.fornitore.partitaIva.trim()))
    e.fornitorePiva = "La partita IVA del fornitore deve essere di 11 cifre numeriche.";
  if (state.fornitore.interventi.length === 0)
    e.interventi = "Selezionare almeno una tipologia di intervento ammissibile.";
  return e;
};

export const CHECKLIST_STEPS = [
  "Collegati al portale ufficiale servizi.invitalia.it ed effettua l'accesso esclusivamente con SPID/CIE del Legale Rappresentante.",
  'Seleziona la misura "Voucher Cloud e Cyber Security" e apri la compilazione guidata.',
  'Incolla nei campi richiesti i valori presenti nella tabella "Copia-Rapida" qui sopra e carica il file del preventivo.',
  "Scarica il PDF finale riassuntivo generato automaticamente dalla piattaforma Invitalia.",
  "Firma digitalmente il PDF con il tuo software di firma (Dike, ArubaSign, Namirial) in modalità CAdES, generando il file con estensione finale .pdf.p7m.",
  'Ricarica il file .p7m sul portale Invitalia e premi "Conferma e Invia". Conserva la ricevuta telematica con codice di protocollo.',
] as const;
