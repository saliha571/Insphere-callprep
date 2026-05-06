const KEY = "insphere:done-calls";

export function getDoneCalls(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function markCallDone(id: string): void {
  const current = getDoneCalls();
  localStorage.setItem(KEY, JSON.stringify([...new Set([...current, id])]));
}

export function unmarkCallDone(id: string): void {
  const current = getDoneCalls();
  localStorage.setItem(KEY, JSON.stringify(current.filter((c) => c !== id)));
}
