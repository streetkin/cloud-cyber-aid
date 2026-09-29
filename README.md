# Voucher Wizard

Crea una single-page application (SPA) completa, reattiva e moderna per la preparazione e validazione della domanda di contributo a fondo perduto per il bando MIMIT "Voucher Cloud & Cybersecurity" gestito da Invitalia. 



L'interfaccia deve avere un design istituzionale ma moderno (ispirato ai design system governativi europei: palette ardesia scuro #0f172a, blu istituzionale #1d4ed8, verde smeraldo #059669 per i successi, bianco e grigi neutri; font pulito Sans-Serif, componenti shadcn/ui, icone Lucide-React).



L'applicazione deve essere autonoma: salva lo stato sia in React state che in localStorage (così se l'utente ricarica la pagina non perde nulla). Se Supabase è configurato, salva anche una copia del record finale nella tabella `domande_voucher`.



L'app si articola in un Wizard a 5 Step lineari con indicatore di avanzamento (Progress Bar numerata in alto):



---



### STEP 1: VERIFICA DI ELEGGIBILITÀ (GATE BLINDATO)

Form di pre-screening con toggle/checkbox obbligatori. Se anche solo uno dei punti è negativo o non spuntato, blocca l'avanzamento allo Step 2 e mostra un banner di allerta rosso scuro con la motivazione esatta:

1. "L'impresa è costituita, attiva e iscritta al Registro delle Imprese (oppure è lavoratore autonomo/professionista regolarmente iscritto agli ordini o alla gestione separata INPS)?" (Sì/No)

2. "L'impresa/professionista rientra nei parametri dimensionali di Micro, Piccola o Media Impresa (PMI) ai sensi della raccomandazione 2003/361/CE?" (Sì/No)

3. "L'impresa ha sede legale e/o operativa attiva sul territorio nazionale italiano?" (Sì/No)

4. "L'impresa è in regola con il versamento dei contributi previdenziali e assistenziali (DURC regolare) e non si trova in stato di liquidazione o procedura concorsuale?" (Sì/No)

5. "L'impresa dispone di capienza sufficiente nel plafond 'De Minimis' (massimo 300.000 € di aiuti ricevuti negli ultimi 3 anni fiscali)?" (Sì/No)

6. "I servizi o prodotti acquistati provengono da uno dei soggetti regolarmente iscritti all'Elenco Ufficiale Fornitori Abilitati MIMIT?" (Sì/No)



---



### STEP 2: ANAGRAFICA AZIENDALE E LEGALE RAPPRESENTANTE

Campi con form validation rigorosa (con messaggi di errore contestuali sotto il singolo campo):

**Dati Azienda / Professionista:**

- Ragione Sociale / Nome e Cognome Professionista (Testo obbligatorio)

- Tipologia: Radio button [Micro Impresa | Piccola Impresa | Media Impresa | Lavoratore Autonomo/Libero Professionista]

- Codice Fiscale (16 caratteri o 11 cifre, validazione pattern)

- Partita IVA (11 cifre, validazione numerica)

- Indirizzo PEC Aziendale (Validazione email formale, con avviso: "Deve essere iscritta su INI-PEC")

- Codice ATECO 2007 primario (Formato numerico standard, es. 62.01.00)

- Indirizzo Sede Legale (Via, Civico, CAP, Comune, Provincia)



**Dati Legale Rappresentante / Richiedente:**

- Nome e Cognome

- Codice Fiscale personale (16 caratteri alfanumerici)

- Telefono cellulare di contatto

- Email ordinaria di riferimento



---



### STEP 3: PIANO DI SPESA, FORNITORE E CALCOLO VOUCHER

**Dati del Fornitore:**

- Nome / Ragione Sociale del Fornitore (con disclaimer: "Attenzione: deve comparire nell'elenco ufficiale approvato con D.D. MIMIT")

- Partita IVA del Fornitore (11 cifre)

- Tipologia Intervento (Checkbox multiple ammesse):

  * [ ] Adozione/potenziamento di soluzioni Cloud Computing (IaaS, PaaS, SaaS)

  * [ ] Adozione/potenziamento di sistemi e servizi di Cyber Security (firewall avanzati, endpoint security, backup immutabile, vulnerability assessment, ecc.)



**Motore Finanziario (Logica di calcolo matematico in tempo reale):**

- Input: "Totale Spesa Preventivata (al netto di IVA) in €"

- Vincoli e Regole del bando MIMIT da applicare automaticamente:

  * Se Spesa Totale < 4.000,00 €: Mostra alert arancione/rosso: "Spesa minima ammissibile non raggiunta. Il bando richiede un investimento minimo di 4.000,00 € al netto di IVA." e disabilita il tasto avanti.

  * Formula Voucher: 50% della spesa imponibile (`Spesa * 0.50`).

  * Tetto massimo agevolazione: 20.000,00 €. Se il 50% calcolato supera 20.000,00 €, fissa il voucher a 20.000,00 € esatti.

- Card di Riepilogo Finanziario Dinamico:

  * Box 1: Spesa Imponibile Ammissibile (€)

  * Box 2: Contributo a Fondo Perduto Concedibile (50%, max 20k €) - Evidenziato in verde scuro

  * Box 3: Quota a carico dell'Impresa (€)

  * Box 4: Alert IVA: "L'IVA è esclusa dal calcolo dell'agevolazione e resta a totale carico dell'impresa beneficiaria."



---



### STEP 4: CARICAMENTO DOCUMENTI DEL FASCICOLO

Zona di upload drag-and-drop con anteprima del nome file, dimensione e stato caricamento (PDF, max 10MB per file):

1. Preventivo dettagliato o proposta contrattuale rilasciata dal Fornitore Abilitato MIMIT (Obbligatorio)

2. Visura Camerale recente aggiornata (massimo 6 mesi) o Certificato di iscrizione all'albo/gestione separata (Obbligatorio)

3. Copia Fronte/Retro Documento d'Identità del Legale Rappresentante in corso di validità (Obbligatorio)

4. (Opzionale) Modello DSAN regolarità DURC / dichiarazione de minimis pregressi



---



### STEP 5: DASHBOARD OPERATIVA "CHEAT-SHEET COPIA-INCOLLA PER INVITALIA"

Questa è la schermata finale fondamentale. Quando l'utente completa il flusso, l'applicazione deve fornire un cruscotto operativo strutturato per azzerare i tempi di inserimento sul portale Invitalia:



1. **Tabella Copia-Rapida dei Dati:**

   Ogni dato inserito deve comparire in un blocco ordinato con un pulsante accanto "Copia" che al click copia la stringa nella clipboard di sistema e mostra per 2 secondi "Copiato! ✓":

   - Ragione Sociale

   - Partita IVA

   - Codice Fiscale

   - Indirizzo PEC

   - Codice ATECO primario

   - P.IVA Fornitore MIMIT

   - Importo Spesa Imponibile (€)

   - Importo Agevolazione Richiesta (€)



2. **Pulsante di Download "Fascicolo Domanda (ZIP o PDF Summary)":**

   Permette di scaricare un riassunto completo in formato leggibile di tutte le risposte inserite, con timestamp e codice univoco di pratica autogenerato (es. VOUCHER-CS-2026-XXXX).



3. **Box Interattivo "Guida Operativa all'Invio su Invitalia (Checklist finale)":**

   Guida passo-passo a schede con checkbox di spunta per l'utente:

   - [ ] Passo 1: Collegati al portale ufficiale `servizi.invitalia.it` ed effettua l'accesso esclusivamente con SPID/CIE del Legale Rappresentante.

   - [ ] Passo 2: Seleziona la misura "Voucher Cloud e Cyber Security" e apri la compilazione guidata.

   - [ ] Passo 3: Incolla nei campi richiesti i valori presenti nella tabella "Copia-Rapida" qui sopra e carica il file del preventivo.

   - [ ] Passo 4: Scarica il PDF finale riassuntivo generato automaticamente dalla piattaforma Invitalia.

   - [ ] Passo 5: Firma digitalmente il PDF con il tuo software di firma (Dike, ArubaSign, Namirial) in modalità CAdES (generando il file con estensione finale `.pdf.p7m`).

   - [ ] Passo 6: Ricarica il file `.p7m` sul portale Invitalia e premi "Conferma e Invia". Conserva la ricevuta telematica rilasciata con codice di protocollo.



4. **Avvertenza Legale Finale (Footer):**

   "Nota di conformità: Questo strumento è una piattaforma privata di supporto e pre-compilazione tecnica. Non raccoglie credenziali SPID né sostituisce la presentazione formale della domanda, che deve essere finalizzata dal legale rappresentante della società beneficiaria sul portale ufficiale MIMIT/Invitalia tramite la propria identità digitale."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cloud-cyber-aid.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e96e3aec-1062-42d0-b7e6-3461074e7169).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
