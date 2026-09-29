/* Trascrizione live gratuita tramite il riconoscimento vocale del browser (Chrome/Edge/Android). */
type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

export function liveSpeechSupported() {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function startLiveSpeech(onFinal: (text: string) => void, onInterim: (text: string) => void) {
  const w = window as unknown as Record<string, new () => SR>;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return () => undefined;
  let active = true;
  const rec = new Ctor();
  rec.lang = "it-IT";
  rec.continuous = true;
  rec.interimResults = true;
  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]!;
      const t = r[0].transcript.trim();
      if (!t) continue;
      if (r.isFinal) onFinal(t);
      else interim += `${t} `;
    }
    onInterim(interim.trim());
  };
  rec.onerror = (e) => {
    if (e.error === "not-allowed" || e.error === "service-not-allowed") active = false;
  };
  rec.onend = () => {
    if (active) {
      try {
        rec.start();
      } catch {
        /* già avviato */
      }
    }
  };
  try {
    rec.start();
  } catch {
    /* ignora */
  }
  return () => {
    active = false;
    try {
      rec.stop();
    } catch {
      /* ignora */
    }
  };
}
