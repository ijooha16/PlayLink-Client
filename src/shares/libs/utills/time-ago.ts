export function timeAgo(iso: string) {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);

  if (diffSec < 0 || diffSec < 5) return '방금 전';

  if (diffSec < 60) return `${diffSec}초 전`;

  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}분 전`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;

  const day = Math.floor(hour / 24);
  if (day < 30) return `${day}일 전`;

  const month = Math.floor(day / 30);
  if (month < 12) return `${month}개월 전`;

  const year = Math.floor(month / 12);
  return `${year}년 전`;
}
