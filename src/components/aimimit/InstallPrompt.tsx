import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/ai-mimit-logo.png";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const KEY = "ai-mimit-install-dismissed";

export function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone || window.self !== window.top) return;
    const dismissed = Number(localStorage.getItem(KEY) || 0);
    if (Date.now() - dismissed < 3 * 24 * 3600 * 1000) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let t: number | undefined;
    if (isIos) {
      setIos(true);
      t = window.setTimeout(() => setShow(true), 1500);
    }
    const onInstalled = () => setShow(false);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (t) clearTimeout(t);
    };
  }, []);

  if (!show) return null;

  const close = () => {
    localStorage.setItem(KEY, String(Date.now()));
    setShow(false);
  };
  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice;
    setEvt(null);
    setShow(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg">
      <div className="flex items-start gap-3">
        <img src={logo} alt="" className="size-12 rounded-lg" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Installa AI MIMIT</p>
          {ios ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Tocca <Share className="inline size-4 align-text-bottom" /> <b>Condividi</b> e poi{" "}
              <b>Aggiungi alla schermata Home</b>.
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Aprila dal telefono come un'app, con un tocco dall'icona.
            </p>
          )}
        </div>
        <button type="button" onClick={close} aria-label="Chiudi" className="rounded p-1 text-muted-foreground">
          <X className="size-4" />
        </button>
      </div>
      {!ios && evt ? (
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={close}>Non ora</Button>
          <Button onClick={install}>
            <Download className="size-4" /> Installa
          </Button>
        </div>
      ) : null}
    </div>
  );
}
