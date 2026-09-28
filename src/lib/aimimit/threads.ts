import type { UIMessage } from "ai";

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "ai-mimit-threads-v1";

export const loadThreads = (): Thread[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Thread[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveThreads = (threads: Thread[]) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(threads));
  } catch {
    /* storage pieno o non disponibile */
  }
  window.dispatchEvent(new Event("ai-mimit-threads"));
};

export const newThreadId = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

export const createThread = (title = "Nuovo cliente"): Thread => {
  const thread: Thread = { id: newThreadId(), title, updatedAt: Date.now(), messages: [] };
  saveThreads([thread, ...loadThreads()]);
  return thread;
};

export const updateThread = (id: string, patch: Partial<Thread>) => {
  const threads = loadThreads();
  const exists = threads.some((t) => t.id === id);
  const base: Thread = { id, title: "Nuovo cliente", updatedAt: Date.now(), messages: [] };
  const next = exists
    ? threads.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t))
    : [{ ...base, ...patch }, ...threads];
  saveThreads(next.sort((a, b) => b.updatedAt - a.updatedAt));
};

export const deleteThread = (id: string) => saveThreads(loadThreads().filter((t) => t.id !== id));
