export const applyMatch = async ({
  join_message,
  token,
  matchId,
}: {
  join_message: string | null;
  token: string | null;
  matchId: number;
}) => {
  const response = await fetch(`/api/match/apply-match?matchId=${matchId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token!,
    },
    body: JSON.stringify({ join_message }),
  });

  if (!response.ok) {
    throw new Error('Failed to apply match');
  }
  return response.json();
};

export const approveMatch = async ({
  token,
  matchId,
  applicantId,
}: {
  token: string | null;
  matchId: number;
  applicantId: number;
}) => {
  const response = await fetch(`/api/match/match-join?matchId=${matchId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token!,
    },
    body: JSON.stringify({ targetId: applicantId, action: 1 }),
  });

  if (!response.ok) {
    throw new Error('Failed to join match');
  }
  return response.json();
};

export const rejectMatch = async ({
  token,
  matchId,
  applicantId,
}: {
  token: string | null;
  matchId: number;
  applicantId: number;
}) => {
  const response = await fetch(`/api/match/match-join?matchId=${matchId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token!,
    },
    body: JSON.stringify({ targetId: applicantId, action: -1 }),
  });

  if (!response.ok) {
    throw new Error('Failed to reject match');
  }
  return response.json();
};
