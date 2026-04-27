"use client";

import { OccasionMessageRecord, OccasionType } from "@/types/occasion";
import { sortByLatest } from "@/utils/occasion";

const OCCASION_STORAGE_KEY = "my-occasion-messages";

export function readOccasionMessages(): OccasionMessageRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(OCCASION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OccasionMessageRecord[];
    if (!Array.isArray(parsed)) return [];
    return sortByLatest(parsed);
  } catch {
    return [];
  }
}

export function writeOccasionMessages(data: OccasionMessageRecord[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OCCASION_STORAGE_KEY, JSON.stringify(sortByLatest(data)));
}

export function readOccasionMessageByType(
  type: OccasionType,
): OccasionMessageRecord | null {
  const records = readOccasionMessages();
  return records.find((item) => item.type === type) ?? null;
}
