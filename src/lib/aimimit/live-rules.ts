export type TipTone = "yellow" | "orange" | "blue" | "green" | "purple";

export type LiveRule = { id: string; tone: TipTone; badge: string; title: string; hint: string; say: string; match: RegExp };

export const LIVE_RULES: LiveRule[] = [
  {
    id: "prezzi",
    tone: "yellow",
    badge: "💰 REGOLA PREZZI",
    title: "Il cliente chiede prezzi o costi",
    hint: "Non comunicare cifre.",
    say: "La quantificazione ufficiale la elabora la nostra Presidenza con i codici ministeriali per garantire il 50% a fondo perduto.",
    match: /\b(prezz\w*|cost\w*|quanto (viene|costa|si paga|pago|spendo)|tariff\w*|preventiv\w*)\b/i,
  },
  {
    id: "hardware",
    tone: "orange",
    badge: "⚠️ ATTENZIONE HARDWARE",
    title: "Si parla di hardware",
    hint: "Il voucher MIMIT non copre hardware generico.",
    say: "Il bando copre al 50% il software, l'AI e i connettori; l'hardware nuovo lo scarica al 100% fiscalmente lo studio.",
    match: /\b(hardware|pc|computer|portatil\w*|notebook|fotocamer\w*|telecamer\w*|macchinar\w*|stampant\w*|server fisic\w*|tablet)\b/i,
  },
  {
    id: "cumulo",
    tone: "blue",
    badge: "💡 CUMULABILITÀ BANDO",
    title: "Ha già fatto altri bandi",
    hint: "I bandi sono cumulabili.",
    say: "Ottimo! Il MIMIT è cumulabile fino a 300.000€ nel triennio (De Minimis) e copre questo nuovo progetto.",
    match: /\b(camera di commercio|altr[io] (bando|bandi|voucher|contribut\w*)|già (fatto|preso|avuto) (un |il )?(bando|voucher|contribut\w*)|voucher digitali|de minimis)\b/i,
  },
  {
    id: "rimborso",
    tone: "green",
    badge: "💶 MECCANISMO RIMBORSO",
    title: "Chiede quando arrivano i soldi",
    hint: "Non è sconto in fattura.",
    say: "Funziona a rimborso: sostiene la spesa con bonifico e il Ministero rimborsa il 50% a fondo perduto.",
    match: /\b(sconto in fattura|sconto|arrivano subito|subito i soldi|anticip\w*|quando (arrivano|pagano|rimborsano)|soldi)\b/i,
  },
  {
    id: "requisiti",
    tone: "purple",
    badge: "📋 REQUISITI MINISTERIALI",
    title: "Requisiti / DURC / connessione",
    hint: "Ricordagli i requisiti tecnici.",
    say: "Servono almeno 30 Mbps, SPID e Firma Digitale (.p7m) per la domanda del 20 Ottobre.",
    match: /\b(durc|requisit\w*|velocità|internet|connession\w*|fibra|mega|mbps|spid|firma digitale)\b/i,
  },
];

export const TONE_CLASS: Record<TipTone, string> = {
  yellow: "border-tip-yellow bg-tip-yellow/10 [--tip:var(--color-tip-yellow)]",
  orange: "border-tip-orange bg-tip-orange/10 [--tip:var(--color-tip-orange)]",
  blue: "border-tip-blue bg-tip-blue/10 [--tip:var(--color-tip-blue)]",
  green: "border-tip-green bg-tip-green/10 [--tip:var(--color-tip-green)]",
  purple: "border-tip-purple bg-tip-purple/10 [--tip:var(--color-tip-purple)]",
};
