export type OccasionType =
  | "wedding"
  | "engagement"
  | "walima"
  | "birthday"
  | "anniversary"
  | "educational-success"
  | "get-well-soon"
  | "condolences";

export interface OccasionOption {
  type: OccasionType;
  label: string;
  image: string;
}

export interface OccasionMessageRecord {
  id: string;
  type: OccasionType;
  toName: string;
  senderName: string;
  phoneNumber: string;
  emailAddress: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}
