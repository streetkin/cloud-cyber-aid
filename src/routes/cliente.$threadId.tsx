import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/aimimit/AppShell";
import { ChatWindow } from "@/components/aimimit/ChatWindow";
import { loadThreads, updateThread, type Thread } from "@/lib/aimimit/threads";

export const Route = createFileRoute("/cliente/$threadId")({
  head: () => ({
    meta: [
      { title: "Cliente — AI MIMIT" },
      { name: "description", content: "Conversazione con AI MIMIT per un cliente del Voucher Cloud e Cybersecurity." },
      { property: "og:title", content: "Cliente — AI MIMIT" },
      { property: "og:description", content: "Analisi chiamata e supporto alla domanda Voucher Cloud e Cybersecurity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    let found = loadThreads().find((t) => t.id === threadId);
    if (!found) {
      updateThread(threadId, {});
      found = loadThreads().find((t) => t.id === threadId);
    }
    setThread(found ?? null);
  }, [threadId]);

  return (
    <AppShell activeId={threadId}>
      {thread && thread.id === threadId ? (
        <ChatWindow key={threadId} threadId={threadId} initialMessages={thread.messages} title={thread.title} />
      ) : null}
    </AppShell>
  );
}
