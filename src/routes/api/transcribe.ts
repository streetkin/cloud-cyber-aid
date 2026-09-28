import { createFileRoute } from "@tanstack/react-router";
import { createParser } from "eventsource-parser";

const MAX_BYTES = 24 * 1024 * 1024;

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const form = await request.formData().catch(() => null);
        const file = form?.get("file");
        if (!(file instanceof File) || !file.size) {
          return Response.json({ error: "Registrazione vuota" }, { status: 400 });
        }
        if (file.size > MAX_BYTES) return Response.json({ error: "Audio troppo grande" }, { status: 400 });

        // Percorso preferito: chiave OpenRouter dell'utente (billing diretto, indipendente dai crediti Lovable)
        const openRouterKey = process.env["OPENROUTER_API_KEY"];
        if (openRouterKey) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const ext = (file.name.split(".").pop() ?? "wav").toLowerCase();
          const orRes = await fetch("https://openrouter.ai/api/v1/audio/transcriptions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3.5-transcribe",
              language: "it",
              input_audio: { data: buffer.toString("base64"), format: ext },
            }),
            signal: request.signal,
          });
          if (!orRes.ok) {
            const detail = await orRes.text().catch(() => "");
            console.error(`OpenRouter transcription failed [${orRes.status}]: ${detail}`);
            const message =
              orRes.status === 401
                ? "Chiave OpenRouter non valida: controlla la chiave salvata."
                : orRes.status === 402
                  ? "Credito OpenRouter esaurito: ricarica il tuo account OpenRouter."
                  : orRes.status === 429
                    ? "Troppe richieste: riprova tra poco."
                    : "Trascrizione non riuscita, riprova tra poco.";
            return Response.json({ error: message }, { status: orRes.status || 500 });
          }
          const orData = (await orRes.json().catch(() => null)) as { text?: string } | null;
          const text = orData?.text?.trim();
          if (!text) return Response.json({ error: "Trascrizione vuota" }, { status: 502 });
          return Response.json({ text });
        }

        // Fallback: gateway Lovable (crediti workspace)
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "Configurazione AI mancante" }, { status: 500 });

        const upstreamForm = new FormData();
        upstreamForm.append("model", "google/gemini-3.5-transcribe");
        upstreamForm.append("file", file, file.name || "chiamata.wav");
        upstreamForm.append("response_format", "json");
        upstreamForm.append("stream", "true");
        upstreamForm.append("language", "it");

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "X-Lovable-AIG-SDK": "fetch" },
          body: upstreamForm,
          signal: request.signal,
        });
        if (!upstream.ok || !upstream.body) {
          const message =
            upstream.status === 403
              ? "Limite di spesa AI del workspace raggiunto: un amministratore deve aumentarlo."
              : upstream.status === 402
              ? "Crediti AI esauriti: ricarica i crediti del workspace."
              : upstream.status === 429
                ? "Troppe richieste: riprova tra poco."
                : `Trascrizione non riuscita (${upstream.status}).`;
          return Response.json({ error: message }, { status: upstream.status || 500 });
        }

        let text = "";
        let finalText: string | null = null;
        let streamError: string | null = null;
        const parser = createParser({
          onEvent(event) {
            if (!event.data || event.data === "[DONE]") return;
            try {
              const data = JSON.parse(event.data) as { type?: string; delta?: string; text?: string; error?: { message?: string } };
              if (data.type === "transcript.text.delta" && data.delta) text += data.delta;
              else if (data.type === "transcript.text.done" && typeof data.text === "string") finalText = data.text;
              else if (data.error) streamError = data.error.message ?? "Errore di trascrizione";
            } catch {
              /* frame non JSON ignorato */
            }
          },
        });
        const reader = upstream.body.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          parser.feed(value);
        }
        if (streamError) return Response.json({ error: streamError }, { status: 502 });
        return Response.json({ text: (finalText ?? text).trim() });
      },
    },
  },
});
