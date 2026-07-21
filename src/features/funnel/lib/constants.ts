export const FUNNEL_STORAGE_KEY = "tc-funnel-v1";
export const GUEST_FREE_CREDITS = 2;
export const EMAIL_BONUS_CREDITS = 30;
export const LEAD_COOKIE_NAME = "tc_lead";

export interface FunnelState {
  creditsRemaining: number;
  correctionsUsed: number;
  leadEmail: string | null;
  unlockedAt: number | null;
}

export function defaultFunnelState(): FunnelState {
  return {
    creditsRemaining: GUEST_FREE_CREDITS,
    correctionsUsed: 0,
    leadEmail: null,
    unlockedAt: null,
  };
}
