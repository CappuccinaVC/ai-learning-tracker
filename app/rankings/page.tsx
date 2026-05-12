import { RankingsTabs } from "@/components/rankings/rankings-tabs";
import { getRankingsPayload } from "@/lib/data/rankings";

export const revalidate = 86400;

export default async function RankingsPage() {
  const payload = await getRankingsPayload();
  return <RankingsTabs payload={payload} />;
}
