import { MatchType } from '@/features/play-link/types/match/match';

export const getMatches = async (): Promise<{
  errCode: number;
  data: MatchType[];
}> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/playlink/match`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};

export const getMatchDetail = async (matchId: string | string[]) => {
  const response = await fetch(
    `/api/match/get-match-detail?matchId=${matchId}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};

export const searchMatch = async ({
  keyword,
  type,
}: {
  keyword: string;
  type: string;
}) => {
  const response = await fetch(
    `/api/match/get-searched-match?keyword=${keyword}&type=${type}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};
