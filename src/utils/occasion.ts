import { OccasionMessageRecord, OccasionOption } from "@/types/occasion";

export const OCCASION_OPTIONS: OccasionOption[] = [
  { type: "wedding", label: "Wedding", image: "/cards/wedding.jpg" },
  { type: "engagement", label: "Engagement", image: "/cards/engagement.jpg" },
  { type: "walima", label: "Walima", image: "/cards/walima.jpg" },
  { type: "birthday", label: "Birthday", image: "/cards/birthday.jpg" },
  { type: "anniversary", label: "Anniversary", image: "/cards/anniversary.jpg" },
  {
    type: "educational-success",
    label: "Educational Success",
    image: "/cards/educational-success.jpg",
  },
  { type: "get-well-soon", label: "Get well soon", image: "/cards/get-well-soon.jpg" },
  { type: "condolences", label: "Condolences", image: "/cards/condolences.jpg" },
];

const OCCASION_TYPE_ALIASES: Record<string, string> = {
  condolonces: "condolences",
};

function normalizeOccasionType(type: string) {
  return type.trim().toLowerCase().replace(/\s+/g, "-");
}

export function getOccasion(type: string | null | undefined): OccasionOption | null {
  if (!type) return null;
  const normalizedType = normalizeOccasionType(type);
  const resolvedType = OCCASION_TYPE_ALIASES[normalizedType] ?? normalizedType;
  return OCCASION_OPTIONS.find((item) => item.type === resolvedType) ?? null;
}

export function formatOccasionTemplate({
  toName,
  senderName,
  occasionLabel,
  occasionType,
  customMessage,
}: {
  toName: string;
  senderName: string;
  occasionLabel: string;
  occasionType?: string;
  customMessage?: string;
}): string {
  const safeTo = toName.trim() || "Friend";
  const safeSender = senderName.trim() || "Your Well Wisher";
  const openingLine =
    occasionType === "condolences"
      ? `Sending heartfelt condolences on this difficult loss.`
      : occasionType === "get-well-soon"
        ? `Wishing you a speedy recovery.`
      : `Wishing you a wonderful ${occasionLabel}...`;
  const lines = [
    `Dear ${safeTo},`,
    openingLine,
  ];

  const body = customMessage?.trim();
  if (body) lines.push(body);

  lines.push("Best regards,", safeSender);
  return lines.join("\n");
}

export function occasionWhatsappUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function occasionEmailUrl(message: string): string {
  return `mailto:?subject=${encodeURIComponent("Occasion Message")}&body=${encodeURIComponent(message)}`;
}

export function sortByLatest(records: OccasionMessageRecord[]): OccasionMessageRecord[] {
  return [...records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
