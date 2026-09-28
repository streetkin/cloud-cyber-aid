import { createFileRoute } from "@tanstack/react-router";
import { AI_MIMIT_SYSTEM_PROMPT } from "@/lib/ai/knowledge.server";

// Report di fine chiamata via chiave OpenRouter dell'utente (fuori dai crediti Lovable)
export const Route = createFileRoute("/api/report")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as { text?: string };
        if (!body.text?.trim()) return Response.json({ error: "Testo mancante" }, { status: 400 });
        const key = process.env["OPENROUTER_API_KEY"];
        if (!key) return Response.json({ error: "Chiave OpenRouter mancante." }, { status: 500 });
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: AI_MIMIT_SYSTEM_PROMPT },
              { role: "user", content: body.text },
            ],
          }),
          signal: request.signal,
        });
        if (!res.ok) {
          console.error(`OpenRouter report failed [${res.status}]: ${await res.text().catch(() => "")}`);
          const message =
            res.status === 401
              ? "Chiave OpenRouter non valida: controlla la chiave salvata."
              : res.status === 402
                ? "Credito OpenRouter esaurito: ricarica il tuo account OpenRouter."
                : res.status === 429
                  ? "Troppe richieste: riprova tra poco."
                  : "Report non riuscito, riprova tra poco.";
          return Response.json({ error: message }, { status: res.status || 500 });
        }
        const data = (await res.json().catch(() => null)) as
          | { choices?: Array<{ message?: { content?: string } }> }
          | null;
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (!text) return Response.json({ error: "Report vuoto, riprova." }, { status: 502 });
        return Response.json({ text });
      },
    },
  },
});
