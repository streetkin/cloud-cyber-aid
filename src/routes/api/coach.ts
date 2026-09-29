import { createFileRoute } from "@tanstack/react-router";
import { AI_MIMIT_SYSTEM_PROMPT } from "@/lib/ai/knowledge.server";

const COACH = `Sei il COPILOTA LIVE del consulente (Raffaele) durante una telefonata in corso con un cliente per il Voucher Cloud & Cybersecurity MIMIT.
Ricevi la trascrizione parziale (senza distinzione certa di chi parla: deducila dal senso) e la checklist attuale.
Rispondi SOLO con JSON valido, senza testo attorno, in italiano, con questa forma:
{"ask":["domanda breve da fare ORA al cliente", "..."],"propose":["proposta di ampliamento progetto coerente col bando, con il beneficio per il cliente"],"checklist":[{"item":"punto da chiarire","status":"ok"|"todo"|"na","note":"cosa è emerso, breve"}]}
Regole:
- "ask": massimo 2 domande, le più utili adesso, formulate come le direbbe Raffaele. Non chiedere cose già dette. Salta domande non pertinenti al profilo (es. se è SRL non chiedere se è libero professionista).
- "propose": massimo 2, solo spese ammissibili dal bando (cloud, cybersecurity, backup, software/SaaS, consulenza collegata), mai hardware generico. Vuoto se non c'è un aggancio naturale.
- "checklist": 6-10 punti essenziali per la domanda e il report: forma giuridica, settore/ATECO, sede operativa in Italia, PEC, firma digitale, SPID/CIE, DURC regolare, aiuti de minimis ultimi 3 anni, esigenze e soluzioni desiderate, budget indicativo (almeno 4.000 € netto IVA), tempistiche. Aggiorna gli stati in base a quanto sentito; "na" se non si applica.
- Frasi brevissime: Raffaele le legge al volo mentre parla.`;

export const Route = createFileRoute("/api/coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as { text?: string; checklist?: unknown };
        if (!body.text?.trim()) return Response.json({ error: "Testo mancante" }, { status: 400 });
        const key = process.env["OPENROUTER_API_KEY"];
        if (!key) return Response.json({ error: "Chiave OpenRouter mancante." }, { status: 500 });
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: `${COACH}\n\nCONOSCENZA DEL BANDO:\n${AI_MIMIT_SYSTEM_PROMPT}` },
              {
                role: "user",
                content: `CHECKLIST ATTUALE:\n${JSON.stringify(body.checklist ?? [])}\n\nTRASCRIZIONE FINORA:\n${body.text.slice(-6000)}`,
              },
            ],
          }),
          signal: request.signal,
        });
        if (!res.ok) {
          console.error(`OpenRouter coach failed [${res.status}]: ${await res.text().catch(() => "")}`);
          return Response.json({ error: "Copilota non disponibile" }, { status: res.status || 500 });
        }
        const data = (await res.json().catch(() => null)) as { choices?: Array<{ message?: { content?: string } }> } | null;
        const raw = data?.choices?.[0]?.message?.content ?? "";
        const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
        try {
          return Response.json(JSON.parse(json));
        } catch {
          return Response.json({ error: "Risposta non valida" }, { status: 502 });
        }
      },
    },
  },
});
