/**
 * 스포츠 관련 헬퍼 함수
 */

export interface Sport {
  sports_id: number;
  sports_name: string;
  category_id?: number;
}

/**
 * 스포츠 ID로 스포츠 정보 찾기
 */
export const getSportById = (
  sports: Sport[] | undefined,
  sportsId: number | undefined
): Sport | undefined => {
  if (!sports || !sportsId) return undefined;
  return sports.find((sport) => sport.sports_id === sportsId);
};

/**
 * 스포츠 ID로 스포츠 이름 가져오기
 */
export const getSportName = (
  sports: Sport[] | undefined,
  sportsId: number | undefined
): string => {
  const sport = getSportById(sports, sportsId);
  return sport?.sports_name || '';
};

/**
 * API 응답에서 스포츠 목록 추출
 */
export const extractSportsFromResponse = (data: any): Sport[] => {
  return data?.data?.data?.sports || [];
};
