export type Faq = { q: string; a: string; tags?: string };
export type FaqCategory = { id: string; label: string; items: Faq[] };

export const FAQ: FaqCategory[] = [
  {
    id: "base",
    label: "Il bando in breve",
    items: [
      { q: "Quanto mi danno?", a: "Il 50% delle spese ammissibili, a fondo perduto, fino a un massimo di 20.000 € per richiedente. L'IVA non è finanziata.", tags: "contributo percentuale soldi importo" },
      { q: "Qual è la spesa minima?", a: "Il piano deve essere di almeno 4.000 € al netto di IVA. Con 4.000 € il contributo è 2.000 €.", tags: "minimo" },
      { q: "Qual è la spesa oltre la quale non conviene salire?", a: "40.000 €: a quel punto il 50% è già 20.000 €, cioè il massimo. Oltre, il contributo resta 20.000 €.", tags: "massimo tetto" },
      { q: "È un prestito? Devo restituire qualcosa?", a: "No, è un contributo a fondo perduto: non si restituisce, purché si rispettino le regole del bando e si rendicontino correttamente le spese.", tags: "fondo perduto" },
      { q: "Quante domande posso presentare?", a: "Una sola domanda per richiedente.", tags: "" },
      { q: "Quanti soldi ci sono in totale?", a: "150 milioni di euro, con una quota riservata al Mezzogiorno. Le domande sono valutate in ordine di arrivo: lo sportello può chiudere prima se finiscono i fondi.", tags: "dotazione risorse sud" },
      { q: "Mi garantite che lo prendo?", a: "No: l'ammissione dipende dall'istruttoria del Ministero e dai fondi disponibili. Noi riduciamo il rischio verificando prima requisiti, progetto e preventivo.", tags: "garanzia sicuro" },
    ],
  },
  {
    id: "date",
    label: "Date e scadenze",
    items: [
      { q: "Quando si può fare la domanda?", a: "Compilazione dal 20 ottobre 2026 ore 12:00; invio dal 10 novembre 2026 ore 12:00; chiusura prevista il 20 gennaio 2027 ore 12:00.", tags: "apertura quando data" },
      { q: "Se precompilo ho già prenotato il posto?", a: "No. La precompilazione non vale come invio: conta solo la trasmissione formale, e l'ordine è cronologico. Conviene essere pronti per il 10 novembre.", tags: "precompilazione prenotare" },
      { q: "Può chiudere prima?", a: "Sì, se le risorse si esauriscono lo sportello chiude in anticipo rispetto al 20 gennaio 2027.", tags: "chiusura anticipata" },
      { q: "Entro quando devo realizzare il progetto?", a: "Con acquisto diretto entro 12 mesi dalla concessione. Con abbonamento il contratto deve durare almeno 24 mesi (sono agevolati i primi 24).", tags: "tempi durata" },
    ],
  },
  {
    id: "requisiti",
    label: "Chi può partecipare",
    items: [
      { q: "Chi può partecipare?", a: "PMI con sede legale o unità locale in Italia, e lavoratori autonomi/professionisti con partita IVA e domicilio fiscale in Italia, attivi e in regola.", tags: "requisiti beneficiari" },
      { q: "Sono un libero professionista, posso?", a: "Sì, se hai partita IVA e domicilio fiscale in Italia e sei in regola con gli obblighi del bando.", tags: "autonomo partita iva freelance" },
      { q: "Serve una connessione internet particolare?", a: "Sì: un contratto di connettività con almeno 30 Mbps in download. Serve il contratto o un documento che lo dimostri.", tags: "30 mbps fibra adsl" },
      { q: "Devo avere il DURC regolare?", a: "Sì, serve la regolarità contributiva e nessuna causa di esclusione (es. liquidazione o procedure concorsuali).", tags: "durc contributi" },
      { q: "Cos'è il de minimis e mi riguarda?", a: "È il limite agli aiuti pubblici che un'impresa può ricevere (in genere 300.000 € in 3 anni). Bisogna verificare quanto hai già ricevuto: lo controlliamo nel Registro Nazionale Aiuti.", tags: "deminimis aiuti" },
      { q: "Serve l'assicurazione catastrofale?", a: "Sì, quando è obbligatoria per l'impresa: la copertura contro eventi catastrofali fa parte dei requisiti.", tags: "polizza assicurazione" },
      { q: "Cosa mi serve per accedere?", a: "SPID, CIE o CNS del legale rappresentante (o di un delegato), una PEC attiva e la firma digitale.", tags: "spid pec firma" },
      { q: "Non ho la firma digitale, come faccio?", a: "Va richiesta prima dell'apertura a un ente certificatore (es. Aruba, InfoCert, Namirial): senza firma digitale non si può inviare la domanda.", tags: "firma" },
    ],
  },
  {
    id: "spese",
    label: "Cosa si può finanziare",
    items: [
      { q: "Cosa posso comprare con il voucher?", a: "Soluzioni di cybersecurity (hardware e software), servizi cloud IaaS e PaaS, software SaaS (CRM, ERP, gestionali, HR, e-commerce, collaborazione, anche con AI) e servizi di configurazione/migrazione collegati.", tags: "ammissibili spese" },
      { q: "Un CRM o un gestionale in cloud va bene?", a: "Sì, i software SaaS come CRM, ERP e gestionali sono ammissibili, se sono nuovi o migliorano in modo sostanziale quello che hai già.", tags: "crm erp saas software" },
      { q: "Posso rinnovare il software che uso già?", a: "No: il semplice rinnovo, l'aggiornamento di versione o l'aumento delle licenze non sono finanziabili. Serve un miglioramento concreto.", tags: "rinnovo licenze" },
      { q: "Posso comprare computer o PC?", a: "No, l'hardware generico non è ammesso. È ammesso l'hardware di sicurezza (es. firewall).", tags: "pc computer hardware" },
      { q: "La formazione o la consulenza è finanziabile?", a: "Solo se direttamente legata all'implementazione tecnica. I servizi di configurazione, migrazione e integrazione non possono superare il 30% del piano.", tags: "30% consulenza" },
      { q: "Posso comprare adesso e poi chiedere il voucher?", a: "No: le spese sostenute prima dell'invio della domanda non sono ammissibili. Non firmare e non pagare nulla prima.", tags: "prima spese pregresse" },
      { q: "Posso scegliere qualsiasi fornitore?", a: "No, solo fornitori accreditati allo sportello MIMIT, con prodotti e codici registrati.", tags: "fornitore accreditato" },
      { q: "Acquisto o abbonamento?", a: "Entrambi: acquisto diretto (da completare in 12 mesi), abbonamento di almeno 24 mesi, o una combinazione.", tags: "abbonamento" },
    ],
  },
  {
    id: "soldi",
    label: "Pagamenti e rimborso",
    items: [
      { q: "I soldi me li danno subito?", a: "No, il voucher è un rimborso: prima paghi le spese, poi le rendiconti e ricevi il contributo. Devi poter anticipare i costi.", tags: "anticipo erogazione" },
      { q: "Quando ricevo il rimborso?", a: "La richiesta si presenta non prima di 3 mesi dalla concessione, in una o due tranche; la prima richiede almeno il 50% della spesa sostenuta.", tags: "tranche rendicontazione" },
      { q: "L'IVA la recupero?", a: "L'IVA è esclusa dal contributo e resta a carico dell'impresa.", tags: "iva" },
      { q: "Cosa devo conservare?", a: "Contratti, fatture e prove di pagamento, servono per la rendicontazione.", tags: "fatture documenti" },
    ],
  },
  {
    id: "domanda",
    label: "Come si presenta la domanda",
    items: [
      { q: "Come funziona la procedura?", a: "1) Verifica requisiti; 2) definizione obiettivo digitale; 3) progetto e preventivo con codici prodotto; 4) raccolta documenti e accesso alla piattaforma Invitalia; 5) compilazione, firma digitale e invio con ricevuta.", tags: "passi procedura" },
      { q: "Dove si presenta?", a: "Nell'Area Riservata di Invitalia, accedendo con SPID, CIE o CNS, scegliendo la misura Voucher Cloud e Cybersecurity e cliccando 'Presenta la domanda'.", tags: "invitalia portale" },
      { q: "Può farla qualcun altro per me?", a: "Sì, il legale rappresentante può creare una delega dalla sezione 'Anagrafica e deleghe', firmarla digitalmente (.p7m) e caricarla.", tags: "delega consulente" },
      { q: "Quali sezioni si compilano?", a: "Impresa proponente, Rappresentante legale, Firmatario, Referente della domanda, sezioni del progetto, poi Invio: controlli finali, download del format, firma digitale, allegati e invio.", tags: "sezioni compilazione" },
      { q: "I dati della mia azienda sono sbagliati sulla piattaforma", a: "Per le imprese iscritte i dati arrivano dal Registro Imprese: se sono errati va contattata la Camera di Commercio.", tags: "registro imprese errore" },
      { q: "Cosa ricevo dopo l'invio?", a: "Una ricevuta con numero di protocollo e data di invio: va conservata.", tags: "ricevuta protocollo" },
      { q: "Se devo modificare dopo aver generato la domanda?", a: "Si clicca 'Modifica dati', si correggono le sezioni, si rigenera il format, lo si rifirma e si ricaricano tutti gli allegati.", tags: "modifica" },
    ],
  },
  {
    id: "documenti",
    label: "Documenti da preparare",
    items: [
      { q: "Quali documenti devo preparare?", a: "Visura o dati dell'attività; SPID/CIE, PEC e firma digitale; contratto internet ≥ 30 Mbps; quadro aiuti de minimis; descrizione della situazione attuale; preventivo tecnico con codici; dichiarazioni richieste.", tags: "checklist" },
      { q: "Cosa deve contenere il preventivo?", a: "Voci, quantità, durata, codici dei prodotti/servizi, costi e descrizione del miglioramento, distinguendo prodotto, servizio e attività tecniche.", tags: "preventivo" },
      { q: "Cosa devo raccontare del progetto?", a: "Come lavorate oggi (strumenti, criticità), cosa volete introdurre, per quali processi e quali vantaggi concreti vi aspettate.", tags: "progetto tecnico" },
    ],
  },
];
