// frontend/utils/planCheck.ts

/**
 * Returns true if the user’s subscription allows voice features.
 * Accepted plans: "pro", "enterprise"
 */
export const isVoiceAllowed = (plan: string | null | undefined): boolean => {
  return plan === 'pro' || plan === 'enterprise'
}
