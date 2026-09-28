import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/aimimit/AppShell";
import { createThread, loadThreads } from "@/lib/aimimit/threads";

const TITLE = "AI MIMIT — Assistente Voucher Cloud e Cybersecurity";
const DESCRIPTION =
  "Chatbot che registra e analizza le chiamate con i clienti e guida la domanda del Voucher MIMIT Cloud e Cybersecurity: requisiti, compilazione su Invitalia e progetto tecnico.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const thread = loadThreads()[0] ?? createThread();
    void navigate({ to: "/cliente/$threadId", params: { threadId: thread.id }, replace: true });
  }, [navigate]);
  return <AppShell>{null}</AppShell>;
}
