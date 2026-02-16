const STORAGE_PREFIX = "threadify:draft:";

export interface DraftData {
  content: string;
  updatedAt: number;
}

export function getDraft(platformSlug: string): DraftData | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${platformSlug}`);
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

export function setDraft(platformSlug: string, data: DraftData): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${platformSlug}`, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function deleteDraft(platformSlug: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${platformSlug}`);
  } catch {
    // ignore
  }
}
