export const SPORTS_LIST = [
  '축구',
  '야구',
  '농구',
  '배구',
  '테니스',
  '골프',
  '수영',
  '탁구',
  '배드민턴',
  '복싱',
  '사이클',
  '스키',
  '펜싱',
  '육상',
  '등산',
  '서핑',
  '요트',
  '투척',
  '양궁',
  '스쿠버',
  '스케이트',
  '프리스비',
  '요가',
  '체스',
  '트로피',
];

type DateFormatOption = {
  startDate: Date;
  endDate?: Date;
  days?: number;
};

export const generateDateRange = ({
  startDate,
  endDate,
  days,
}: DateFormatOption): string[] => {
  const dates: string[] = [];

  if (!endDate && typeof days !== 'number') {
    throw new Error('endDate 또는 days 중 하나는 반드시 제공되어야 합니다.');
  }

  const start = new Date(startDate);
  const totalDays =
    typeof days === 'number'
      ? days
      : Math.floor(
          (new Date(endDate!).getTime() - start.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;

  for (let i = 0; i < totalDays; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const date = String(current.getDate()).padStart(2, '0');

    dates.push(`${year}년 ${month}월 ${date}일`);
  }

  return dates;
};

export const DUMMY_PLACE = [
  '서울 체육관',
  '부산 체육관',
  '대구 체육관',
  '인천 체육관',
  '광주 체육관',
  '대전 체육관',
  '울산 체육관',
  '세종 체육관',
  '경기 체육관',
  '강원 체육관',
  '충북 체육관',
  '충남 체육관',
  '전북 체육관',
  '전남 체육관',
  '경북 체육관',
  '경남 체육관',
  '제주 체육관',
];
