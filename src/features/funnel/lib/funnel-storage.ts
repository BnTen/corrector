import {
  defaultFunnelState,
  FUNNEL_STORAGE_KEY,
  GUEST_FREE_CREDITS,
  type FunnelState,
} from "@/features/funnel/lib/constants";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadFunnelState(): FunnelState {
  if (!canUseStorage()) return defaultFunnelState();

  try {
    const raw = localStorage.getItem(FUNNEL_STORAGE_KEY);
    if (!raw) return defaultFunnelState();
    const parsed = JSON.parse(raw) as Partial<FunnelState>;
    return {
      ...defaultFunnelState(),
      ...parsed,
      creditsRemaining:
        typeof parsed.creditsRemaining === "number"
          ? Math.max(0, parsed.creditsRemaining)
          : GUEST_FREE_CREDITS,
      correctionsUsed:
        typeof parsed.correctionsUsed === "number"
          ? Math.max(0, parsed.correctionsUsed)
          : 0,
      leadEmail:
        typeof parsed.leadEmail === "string" && parsed.leadEmail.includes("@")
          ? parsed.leadEmail
          : null,
      unlockedAt:
        typeof parsed.unlockedAt === "number" ? parsed.unlockedAt : null,
    };
  } catch {
    return defaultFunnelState();
  }
}

export function saveFunnelState(state: FunnelState): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function consumeCredits(
  state: FunnelState,
  count: number
): FunnelState {
  if (count <= 0) return state;
  const used = Math.min(count, state.creditsRemaining);
  return {
    ...state,
    creditsRemaining: Math.max(0, state.creditsRemaining - used),
    correctionsUsed: state.correctionsUsed + used,
  };
}

export function grantBonusCredits(
  state: FunnelState,
  email: string,
  bonus: number
): FunnelState {
  return {
    ...state,
    leadEmail: email.trim().toLowerCase(),
    creditsRemaining: state.creditsRemaining + bonus,
    unlockedAt: Date.now(),
  };
}
