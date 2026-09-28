import { useEffect, useState } from "react";
import type { UIMessage } from "ai";
import { toast } from "sonner";
import { PhoneCall } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { CallRecorder } from "./CallRecorder";
import { updateThread } from "@/lib/aimimit/threads";
import logo from "@/assets/ai-mimit-logo.png";

const TRANSCRIPT_PREFIX = "[TRASCRIZIONE CHIAMATA]";

type Props = { threadId: string; initialMessages: UIMessage[]; title: string };

export function ChatWindow({ threadId, initialMessages, title }: Props) {
  const [messages, setMessages] = useState<UIMessage[]>(initialMessages);
  const status = "ready" as string;
  const [reporting, setReporting] = useState(false);
  const busy = status === "submitted" || status === "streaming" || reporting;

  useEffect(() => {
    if (status === "streaming" || status === "submitted") return;
    if (messages.length === 0 && initialMessages.length === 0) return;
    const patch: { messages: UIMessage[]; title?: string } = { messages };
    if (title === "Nuovo cliente") {
      const first = messages.find((m) => m.role === "user");
      const text = first?.parts.find((p) => p.type === "text");
      if (text && text.type === "text") {
        const clean = text.text.replace(TRANSCRIPT_PREFIX, "Chiamata:").replace(/\s+/g, " ").trim();
        patch.title = clean.slice(0, 48) + (clean.length > 48 ? "…" : "");
      }
    }
    updateThread(threadId, patch);
  }, [messages, status, threadId, title, initialMessages.length]);


  const onTranscript = async (text: string, seconds: number) => {
    const min = Math.max(1, Math.round(seconds / 60));
    const full = `${TRANSCRIPT_PREFIX} Durata circa ${min} min, registrata il ${new Date().toLocaleString("it-IT")}.\n\n${text}`;
    const userMsg: UIMessage = { id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: full }] };
    const base = [...messages, userMsg];
    setMessages(base);
    setReporting(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: full }),
      });
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error ?? "Report non riuscito.");
      setMessages([
        ...base,
        { id: crypto.randomUUID(), role: "assistant", parts: [{ type: "text", text: data.text }] },
      ]);
    } catch (e) {
      toast.error(`${e instanceof Error ? e.message : "Report non riuscito."} La trascrizione è comunque salvata.`);
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-10 text-center">
              <img src={logo} alt="AI MIMIT" className="size-20" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Ciao, sono AI MIMIT</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Registra la chiamata con il cliente in vivavoce: alla fine ti preparo trascrizione divisa per voce e report completo sul bando.
                </p>
              </div>
            </div>
          ) : null}

          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent
                className={
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent p-0 text-foreground"
                }
              >
                {message.parts.map((part, i) => {
                  if (part.type !== "text") return null;
                  if (message.role === "user" && part.text.startsWith(TRANSCRIPT_PREFIX)) {
                    const body = part.text.slice(TRANSCRIPT_PREFIX.length).trim();
                    return (
                      <details key={i} className="text-sm">
                        <summary className="flex cursor-pointer items-center gap-2 font-semibold">
                          <PhoneCall className="size-4" /> Trascrizione chiamata (clicca per leggere)
                        </summary>
                        <div className="mt-2 space-y-1.5">
                          {body.split("\n").filter(Boolean).map((line, j) => {
                            const m = /^(Consulente|Cliente)( \(\?\))?:\s*(.*)$/.exec(line);
                            if (!m) return <p key={j} className="opacity-90">{line}</p>;
                            const isClient = m[1] === "Cliente";
                            return (
                              <p key={j} className={isClient ? "rounded bg-primary-foreground/15 px-2 py-1" : "px-2"}>
                                <span className="font-semibold">{isClient ? "Cliente" : "Tu"}{m[2] ?? ""}: </span>
                                {m[3]}
                              </p>
                            );
                          })}
                        </div>
                      </details>
                    );
                  }
                  return message.role === "user" ? (
                    <p key={i} className="whitespace-pre-wrap">{part.text}</p>
                  ) : (
                    <MessageResponse key={i}>{part.text}</MessageResponse>
                  );
                })}
              </MessageContent>
            </Message>
          ))}

          {busy && messages.at(-1)?.role === "user" ? (
            <Shimmer className="text-sm">Sto preparando il report della chiamata…</Shimmer>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background">
        <div className="mx-auto w-full max-w-3xl space-y-2 px-4 py-3">
          <CallRecorder disabled={busy} onTranscript={onTranscript} />
        </div>
      </div>
    </div>
  );
}
