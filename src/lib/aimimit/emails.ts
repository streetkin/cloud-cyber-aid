export type ReadyEmail = {
  id: string;
  label: string;
  hint: string;
  subject: string;
  body: string;
};

const LINK =
  "https://www.mimit.gov.it/it/incentivi/sostegno-alla-domanda-di-servizi-di-cloud-computing-e-cyber-security";

const SIGN = `[TUO NOME] — Conflavoro AI
[TELEFONO] · [EMAIL]`;

export const READY_EMAILS: ReadyEmail[] = [
  {
    id: "lancio",
    label: "Prima della call: presentami e spiega il voucher",
    hint: "Contatto assegnato via email, non sa ancora nulla del bando: scrivigli prima di chiamarlo.",
    subject: "Voucher Cloud & Cybersecurity — la call di oggi alle [ORA]",
    body: `Gentile [NOME],
sono [TUO NOME] di Conflavoro AI e la contatto perché la sua attività può accedere al Voucher
Cloud & Cybersecurity, il contributo del Ministero delle Imprese e del Made in Italy.

DI COSA SI TRATTA
Il Ministero rimborsa il 50% della spesa (fino a 20.000 €) a chi introduce servizi cloud,
sicurezza informatica e software in abbonamento nella propria attività. È un fondo perduto:
non è un finanziamento e non è uno sconto in fattura. Le domande si presentano su Invitalia,
in ordine di arrivo, con risorse a esaurimento.

LA TELEFONATA DI OGGI
Oggi alle [ORA] la chiamo io: servono circa 10 minuti per spiegarle in parole semplici come
funziona e capire se la sua attività rientra. Se non le interessa chiudiamo lì, senza impegno,
e non la disturbo oltre.

Le chiedo solo due risposte pronte, nessun documento:
1. quali software o strumenti digitali usate oggi;
2. cosa vorrebbe migliorare o aggiungere nella sua attività entro il prossimo anno.

Partita IVA e PEC le abbiamo già noi, quindi non deve preparare nulla di burocratico.

Nel frattempo può leggere i dettagli sulla pagina ufficiale del bando:
${LINK}

A dopo,
${SIGN}`,
  },
  {
    id: "meet",
    label: "Dopo la call: conferma il meet e cosa preparare",
    hint: "Call fatta e colloquio su Meet fissato: scrivigli subito dopo, prima della riunione.",
    subject: "Ci vediamo su Meet il [GIORNO] alle [ORA] — prepari queste quattro cose",
    body: `Gentile [NOME],
grazie per la telefonata di prima. Le confermo il colloquio su Meet di [GIORNO] alle [ORA]:
il link le arriva qualche minuto prima da me.

Mi raccomando, prepari solo queste quattro cose — bastano due minuti, nessun documento:
1. quali software usate oggi e dove tenete i dati;
2. cosa vorrebbe migliorare o aggiungere entro il prossimo anno;
3. un budget indicativo che ha in mente per il progetto (il piano minimo agevolabile è 4.000 €);
4. se ha già un preventivo o un fornitore individuato: lo verifichiamo noi nell'elenco MIMIT.

DI COSA PARLEREMO
Le mostro come si imposta il progetto per il Voucher Cloud & Cybersecurity. Il fondo perduto del
MIMIT copre il 50% della spesa per servizi cloud, sicurezza informatica e software in
abbonamento, fino a 20.000 €: le dico quali voci sono ammesse, quali no e quanto vale
indicativamente il suo caso.

Pagina ufficiale del bando:
${LINK}

Se l'orario non va più, mi risponda e sposto senza problemi.

A presto,
${SIGN}`,
  },
  {
    id: "recall",
    label: "Cliente impegnato → fissiamo la call",
    hint: "Il caso tipico: l'hai chiamato, era occupato e ti ha chiesto una email.",
    subject: "Voucher Cloud & Cybersecurity — quando ci sentiamo?",
    body: `Gentile [NOME],
sono [TUO NOME] di Conflavoro AI: l'ho chiamata poco fa e mi ha chiesto di scriverle via email.

Il Voucher Cloud & Cybersecurity del MIMIT finanzia al 50% l'introduzione di servizi cloud e di
sicurezza informatica nella sua attività: la domanda si precompila dal 20 ottobre e si invia dal
10 novembre 2026. Le risorse sono a esaurimento, quindi conviene arrivare preparati.

Per capire se ne ha diritto e che progetto ha senso per lei servono circa 10 minuti di telefonata.
Mi risponde indicando il giorno e l'ora in cui preferisce essere richiamato: la chiamo io.

Nel frattempo può leggere i dettagli sulla pagina ufficiale del bando:
${LINK}

Cordiali saluti,
${SIGN}`,
  },
  {
    id: "spiegazione",
    label: "Spiegazione del voucher",
    hint: "Per chi chiede «come funziona?» e vuole tutto per iscritto.",
    subject: "Come funziona il Voucher Cloud & Cybersecurity",
    body: `Gentile [NOME],
come promesso le riepilogo in breve come funziona il voucher.

COS'È
È un contributo a fondo perduto del MIMIT che copre il 50% della spesa per introdurre servizi
cloud, sicurezza informatica e software nella sua attività. Il massimo è 20.000 €, il piano di
spesa minimo è 4.000 € (IVA a carico suo). Una sola domanda per soggetto.

COSA È AMMESSO
Sicurezza informatica (protezione dati, backup, controllo accessi, continuità operativa),
infrastrutture e piattaforme cloud, software in abbonamento (gestionale, CRM, fatturazione,
produttività, e-commerce) e i servizi di configurazione e migrazione collegati al progetto.
NON è ammesso: hardware generico, semplice rinnovo o ampliamento di servizi che già usa,
formazione e spese sostenute prima di inviare la domanda.

COME SI OTTIENE
Le domande si presentano su piattaforma Invitalia: precompilazione dalle 12:00 del 20 ottobre 2026,
invio dalle 12:00 del 10 novembre 2026 fino alle 12:00 del 20 gennaio 2027. L'ordine di valutazione
è cronologico e le risorse (150 milioni) possono finire prima: chi arriva pronto ha un vantaggio.

REQUISITI PRINCIPALI
Attività attiva, dimensione PMI o libero professionista con partita IVA, sede in Italia,
connessione internet da almeno 30 Mbps, posizione contributiva regolare (DURC), aiuti "de minimis"
nei limiti, PEC e identità digitale (SPID o CIE) e firma digitale.

IMPORTANTE
Non è uno sconto in fattura: lei sostiene la spesa e il Ministero rimborsa il 50% in seguito.
Il fornitore dei servizi deve essere tra quelli iscritti all'elenco ufficiale del MIMIT:
verifichiamo noi che lo sia.

Pagina ufficiale con bando, date e manuale:
${LINK}

Se mi dice quando ha 10 minuti liberi, la richiamo io e impostiamo insieme il progetto.

Cordiali saluti,
${SIGN}`,
  },
  {
    id: "documenti",
    label: "Richiesta documenti e informazioni",
    hint: "Quando il cliente è interessato e vuoi raccogliere tutto in una volta.",
    subject: "Voucher Cloud & Cybersecurity — cosa mi serve da lei",
    body: `Gentile [NOME],
per preparare la domanda senza perdite di tempo, le chiedo di raccogliermi queste informazioni.
Può anche solo rispondermi per email, oppure passarle al nostro primo colloquio.

1. Dati attività: denominazione, sede, partita IVA e codice ATECO (o visura recente).
2. Accesso digitale: PEC attiva, SPID o CIE del titolare, firma digitale.
3. Connessione: contratto internet che indichi la velocità in download (serve almeno 30 Mbps).
4. Aiuti pubblici ricevuti negli ultimi 3 anni (quadro "de minimis").
5. Situazione digitale attuale: quali software usa, dove sono i dati, cosa oggi non funziona.
6. Cosa vorrebbe migliorare o aggiungere entro il prossimo anno.
7. Budget indicativo che ha in mente per il progetto (il piano minimo agevolabile è 4.000 €
   oltre IVA).
8. Se ha già un preventivo o un fornitore individuato, me lo giri: verifico che sia nell'elenco
   ufficiale MIMIT.

Con queste informazioni le preparo una proposta di progetto con i codici dei servizi ammissibili.

Cordiali saluti,
${SIGN}`,
  },
  {
    id: "riepilogo",
    label: "Riepilogo dopo la telefonata",
    hint: "Subito dopo la call: così ha tutto per iscritto e conferma i dati.",
    subject: "Riepilogo della nostra call — Voucher Cloud & Cybersecurity",
    body: `Gentile [NOME],
grazie per il tempo di prima. Le lascio il riepilogo così ha tutto per iscritto.

EMERSO DALLA CHIAMATA
- Attività: [SETTORE], [FORMA GIURIDICA]
- Esigenza: [COSA VUOLE MIGLIORARE]
- Soluzione ipotizzata: [SERVIZI CLOUD / SICUREZZA / SOFTWARE]
- Documenti e dati da verificare: [ELENCO BREVE]

PROSSIMI PASSI
1. Lei mi conferma i dati e i documenti indicati.
2. Noi prepariamo il progetto tecnico con i servizi ammissibili e le relative voci di spesa.
3. Precompilazione della domanda su Invitalia dal 20 ottobre 2026 e invio dal 10 novembre 2026.

Pagina ufficiale del bando:
${LINK}

Se qualche punto non è corretto, mi risponda con le correzioni: aggiorno tutto io.

Cordiali saluti,
${SIGN}`,
  },
  {
    id: "date",
    label: "Promemoria date",
    hint: "A settembre/ottobre: apre la precompilazione, non vale come invio.",
    subject: "Voucher Cloud & Cybersecurity — il 20 ottobre apre la precompilazione",
    body: `Gentile [NOME],
le ricordo le date dello sportello MIMIT, perché le domande sono valutate in ordine di arrivo
e le risorse possono terminare prima del previsto:
- dalle 12:00 del 20 ottobre 2026: apre la precompilazione della domanda;
- dalle 12:00 del 10 novembre 2026: apre l'invio delle domande;
- entro le 12:00 del 20 gennaio 2027: chiusura dello sportello.

La precompilazione non vale come invio: la domanda conta solo dopo la trasmissione formale.
Se ha già i documenti pronti, possiamo caricarla nei primi giorni: mi risponda con un "sì"
e le fisso la call.

Pagina ufficiale:
${LINK}

Cordiali saluti,
${SIGN}`,
  },
  {
    id: "sollecito",
    label: "Sollecito gentile",
    hint: "Se non ha risposto: gentile, con via d'uscita per entrambi.",
    subject: "Solo un promemoria — Voucher Cloud & Cybersecurity",
    body: `Gentile [NOME],
immagino siano settimane piene. Le scrivo solo perché le domande del voucher si presentano in
ordine cronologico e chi arriva pronto parte avanti: il 20 ottobre apre la precompilazione.

Se il progetto non le interessa più, mi risponda anche solo "non ora": non la disturbo oltre.
Se invece vuole procedere, mi indichi un momento per 10 minuti di telefonata.

Cordiali saluti,
${SIGN}`,
  },
  {
    id: "conferma",
    label: "Conferma appuntamento",
    hint: "Dopo che ha scelto giorno e ora della call.",
    subject: "Conferma call — [GIORNO] alle [ORA]",
    body: `Gentile [NOME],
le confermo la nostra telefonata di [GIORNO] alle [ORA].
Prepari solo due minuti per dirmi: chi ha la partita IVA e la PEC, che software usate oggi
e cosa vorrebbe migliorare. Al resto pensiamo noi.

Se l'orario non va più, mi risponda e sposto senza problemi.

Cordiali saluti,
${SIGN}`,
  },
];

export const emailFull = (e: ReadyEmail) => `Oggetto: ${e.subject}\n\n${e.body}`;
