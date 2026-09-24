import { useCallback, useEffect, useState } from "react";
import { createInitialState, type VoucherState } from "@/lib/voucher/model";

const STORAGE_KEY = "voucher-cloud-cyber-mimit-v1";

export function useVoucherState() {
  const [state, setState] = useState<VoucherState>(() => createInitialState());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<VoucherState>;
        setState((current) => ({ ...current, ...parsed }));
      }
    } catch {
      /* stato locale non leggibile: si riparte dai valori iniziali */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota superata o storage non disponibile */
    }
  }, [state, loaded]);

  const update = useCallback((patch: Partial<VoucherState>) => {
    setState((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState());
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* niente da rimuovere */
    }
  }, []);

  return { state, setState, update, reset, loaded };
}
