"use client";

import * as React from "react";
import {
  EMAIL_BONUS_CREDITS,
  type FunnelState,
} from "@/features/funnel/lib/constants";
import {
  consumeCredits,
  grantBonusCredits,
  loadFunnelState,
  saveFunnelState,
} from "@/features/funnel/lib/funnel-storage";

export interface UseFunnelCreditsResult {
  state: FunnelState;
  creditsRemaining: number;
  leadEmail: string | null;
  isGateOpen: boolean;
  openGate: () => void;
  closeGate: () => void;
  /** Returns how many credits were actually consumed. */
  tryConsume: (count: number) => number;
  unlockWithEmail: (email: string, bonus?: number) => void;
  hydrated: boolean;
}

export function useFunnelCredits(): UseFunnelCreditsResult {
  const [state, setState] = React.useState<FunnelState>(() =>
    loadFunnelState()
  );
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const [isGateOpen, setIsGateOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const loaded = loadFunnelState();
    setState(loaded);
    stateRef.current = loaded;
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    saveFunnelState(state);
  }, [state, hydrated]);

  const tryConsume = React.useCallback((count: number) => {
    if (count <= 0) return 0;
    const prev = stateRef.current;
    const consumed = Math.min(count, prev.creditsRemaining);
    if (consumed === 0) return 0;
    const next = consumeCredits(prev, consumed);
    stateRef.current = next;
    setState(next);
    return consumed;
  }, []);

  const unlockWithEmail = React.useCallback(
    (email: string, bonus = EMAIL_BONUS_CREDITS) => {
      const next = grantBonusCredits(stateRef.current, email, bonus);
      stateRef.current = next;
      setState(next);
      setIsGateOpen(false);
    },
    []
  );

  return {
    state,
    creditsRemaining: state.creditsRemaining,
    leadEmail: state.leadEmail,
    isGateOpen,
    openGate: () => setIsGateOpen(true),
    closeGate: () => setIsGateOpen(false),
    tryConsume,
    unlockWithEmail,
    hydrated,
  };
}
