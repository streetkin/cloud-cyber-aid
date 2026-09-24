import { createFileRoute } from "@tanstack/react-router";
import { VoucherWizard } from "@/components/voucher/VoucherWizard";

const TITLE = "Voucher Cloud & Cybersecurity — Preparazione domanda MIMIT/Invitalia";
const DESCRIPTION =
  "Wizard guidato in 5 step per verificare l'eleggibilità, calcolare il contributo a fondo perduto (50%, max 20.000 €) e preparare il fascicolo del bando MIMIT Voucher Cloud & Cybersecurity.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <VoucherWizard />;
}
