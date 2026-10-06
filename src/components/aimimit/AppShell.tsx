import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Mail, Menu, MessageSquare, PanelLeftClose, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createThread, deleteThread, loadThreads, type Thread } from "@/lib/aimimit/threads";
import logo from "@/assets/ai-mimit-logo.png";

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  useEffect(() => {
    const sync = () => setThreads(loadThreads());
    sync();
    window.addEventListener("ai-mimit-threads", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ai-mimit-threads", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return threads;
}

export function AppShell({ activeId, children }: { activeId?: string; children: ReactNode }) {
  const threads = useThreads();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("ai-mimit-sidebar") === "closed");
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const toggleDesktop = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem("ai-mimit-sidebar", value ? "closed" : "open");
  };

  const newClient = () => {
    const t = createThread();
    setOpen(false);
    void navigate({ to: "/cliente/$threadId", params: { threadId: t.id } });
  };

  const remove = (id: string) => {
    if (!window.confirm("Eliminare questa conversazione e la sua analisi?")) return;
    deleteThread(id);
    if (id === activeId) {
      const next = loadThreads()[0] ?? createThread();
      void navigate({ to: "/cliente/$threadId", params: { threadId: next.id } });
    }
  };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col bg-brand text-brand-foreground">
      <div className="flex items-center gap-3 px-4 py-5">
        <img src={logo} alt="" className="size-10 rounded-md bg-brand-foreground p-1" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-foreground/60">
            Conflavoro AI
          </p>
          <p className="text-lg font-semibold leading-tight">AI MIMIT</p>
        </div>
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : toggleDesktop(true))}
          aria-label="Chiudi menu"
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-md text-brand-foreground/70 hover:bg-brand-foreground/10 hover:text-brand-foreground"
        >
          {open ? <X className="size-5" /> : <PanelLeftClose className="size-5" />}
        </button>
      </div>
      <div className="space-y-2 px-3">
        <Link
          to="/faq"
          onClick={() => setOpen(false)}
          className="flex h-11 items-center gap-2 rounded-md bg-success px-3 text-sm font-semibold text-success-foreground"
          activeProps={{ className: "ring-2 ring-brand-foreground/60" }}
        >
          <BookOpen className="size-4" /> FAQ rapide per il telefono
        </Link>
        <Link
          to="/email"
          onClick={() => setOpen(false)}
          className="flex h-11 items-center gap-2 rounded-md border border-brand-foreground/30 px-3 text-sm font-semibold text-brand-foreground"
          activeProps={{ className: "ring-2 ring-brand-foreground/60" }}
        >
          <Mail className="size-4" /> Email già pronte
        </Link>
        <Button type="button" onClick={newClient} className="w-full">
          <Plus className="size-4" /> Nuovo cliente
        </Button>
      </div>
      <p className="px-4 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-foreground/50">
        Clienti
      </p>
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        {threads.map((t) => (
          <div
            key={t.id}
            className={cn(
              "group flex items-center rounded-md",
              t.id === activeId ? "bg-brand-foreground/15" : "hover:bg-brand-foreground/10",
            )}
          >
            <Link
              to="/cliente/$threadId"
              params={{ threadId: t.id }}
              onClick={() => setOpen(false)}
              className="min-w-0 flex-1 px-3 py-2"
            >
              <p className="truncate text-sm font-medium">{t.title}</p>
              <p className="text-[11px] text-brand-foreground/50">
                {new Date(t.updatedAt).toLocaleDateString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </Link>
            <button
              type="button"
              onClick={() => remove(t.id)}
              aria-label="Elimina conversazione"
              className="mr-1 cursor-pointer rounded p-1.5 text-brand-foreground/50 opacity-0 transition hover:text-brand-foreground group-hover:opacity-100"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </nav>
      <p className="border-t border-brand-foreground/10 px-4 py-3 text-[11px] leading-relaxed text-brand-foreground/50">
        Chat e trascrizioni restano salvate solo su questo browser. Informa sempre il cliente prima di
        registrare la chiamata.
      </p>
    </aside>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {collapsed ? null : <div className="hidden md:flex">{sidebar}</div>}
      {open ? (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="h-full">{sidebar}</div>
          <button type="button" aria-label="Chiudi menu" className="flex-1 bg-foreground/40" onClick={() => setOpen(false)} />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className={cn("flex items-center gap-2 border-b border-border px-3 py-2", !collapsed && "md:hidden")}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => (window.innerWidth >= 768 ? toggleDesktop(false) : setOpen(true))}
            aria-label="Apri menu"
          >
            <Menu className="size-5" />
          </Button>
          <span className="flex-1 font-semibold">AI MIMIT</span>
          <Link
            to="/"
            className="flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium"
            activeOptions={{ exact: true }}
          >
            <MessageSquare className="size-4" /> Chat
          </Link>
          <Link to="/faq" className="flex h-9 items-center gap-1.5 rounded-md bg-success px-3 text-sm font-semibold text-success-foreground">
            <BookOpen className="size-4" /> FAQ
          </Link>
        </header>
        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
