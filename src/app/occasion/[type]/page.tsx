import { OCCASION_OPTIONS } from "@/utils/occasion";
import { OccasionFormClient } from "./client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return OCCASION_OPTIONS.map((occasion) => ({
    type: occasion.type,
  }));
}

export default async function OccasionFormPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  return <OccasionFormClient type={type} />;
}
