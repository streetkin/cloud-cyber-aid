import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createLovableAiGatewayRunIdFetch } from "@/lib/ai/run-id.server";

const PROMPT = `Ricevi la trascrizione grezza di una telefonata in vivavoce tra un CONSULENTE (che propone il Voucher Cloud e Cybersecurity MIMIT) e un CLIENTE (imprenditore o professionista).
La trascrizione non distingue le voci. Suddividila in turni di parola e attribuisci ogni turno a "Consulente" o "Cliente" in base al contenuto (chi spiega il bando e fa domande di verifica è di solito il consulente; chi descrive la propria azienda o chiede chiarimenti è il cliente).
Non riassumere e non cambiare le parole, correggi solo punteggiatura evidente.
Formato di output, una riga per turno, nient'altro:
Consulente: ...
Cliente: ...
Se un turno è davvero incerto usa "Consulente (?)" o "Cliente (?)".`;

export const Route = createFileRoute("/api/diarize")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "Configurazione AI mancante" }, { status: 500 });
        const body = (await request.json().catch(() => ({}))) as { text?: string };
        if (!body.text?.trim()) return Response.json({ error: "Testo mancante" }, { status: 400 });
        const runIdFetch = createLovableAiGatewayRunIdFetch();
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });
        try {
          const result = streamText({
            model: provider.responses("openai/gpt-6-astra"),
            system: PROMPT,
            prompt: body.text,
            abortSignal: request.signal,
            maxRetries: 0,
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "low",
                reasoningSummary: "auto",
                store: false,
                include: ["reasoning.encrypted_content"],
              },
            },
          });
          const text = (await result.text).trim();
          if (!text) return Response.json({ error: "Suddivisione non riuscita" }, { status: 502 });
          return Response.json({ text });
        } catch (error) {
          const status = (error as { statusCode?: number })?.statusCode ?? 500;
          return Response.json({ error: "Suddivisione voci non riuscita" }, { status });
        }
      },
    },
  },
});
