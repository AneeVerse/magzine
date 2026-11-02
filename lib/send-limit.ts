import "server-only";
// A bounded per-process guard for duplicate submits. For multi-instance hosting,
// enforce the same cooldown in a shared gateway or durable store.
const reservations = new Map<string, number>();
const COOLDOWN = 60_000;
export function reserveSend(
  key: string,
  now = Date.now(),
):
  | { allowed: true; release: () => void }
  | { allowed: false; retryAfter: number } {
  const expiry = reservations.get(key);
  if (expiry && expiry > now)
    return { allowed: false, retryAfter: Math.ceil((expiry - now) / 1000) };
  for (const [entry, until] of reservations)
    if (until <= now) reservations.delete(entry);
  if (reservations.size >= 2000) return { allowed: false, retryAfter: 60 };
  reservations.set(key, now + COOLDOWN);
  return {
    allowed: true,
    release: () => {
      reservations.delete(key);
    },
  };
}
