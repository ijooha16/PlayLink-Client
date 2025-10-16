export const parseKoreanAddress = (raw: string) => {
  const s = raw.replace(/\s+/g, ' ').trim();
  const parts = s.split(' ').filter(Boolean);

  const endsWithAny = (t: string, suffixes: string[]) =>
    suffixes.some((suf) => t.endsWith(suf));

  // 1) dong: 뒤에서부터 '동|읍|면'
  const dongIdx = [...parts]
    .reverse()
    .findIndex((t) => endsWithAny(t, ['동', '읍', '면']));
  const dIdx = dongIdx >= 0 ? parts.length - 1 - dongIdx : -1;
  const dong = dIdx >= 0 ? parts[dIdx] : '';

  // 2) gu: dong 앞에서 '구|군'
  let gIdx = -1;
  for (let i = dIdx >= 0 ? dIdx - 1 : parts.length - 1; i >= 0; i--) {
    if (endsWithAny(parts[i], ['구', '군'])) {
      gIdx = i;
      break;
    }
  }
  const gu = gIdx >= 0 ? parts[gIdx] : '';

  // 3) si:
  // - 최상위가 '도|특별자치도'면, 그 다음에 나오는 '시|군'을 si로
  // - 아니면 첫 토큰을 si로(예: 서울특별시)
  let si = '';
  if (endsWithAny(parts[0], ['특별자치도', '도'])) {
    let sIdx = -1;
    for (let i = 1; i < parts.length; i++) {
      if (endsWithAny(parts[i], ['시', '군'])) {
        sIdx = i;
        break;
      }
    }
    si = sIdx >= 0 ? parts[sIdx] : (parts[1] ?? parts[0]); // fallback
  } else {
    si = parts[0] ?? '';
  }

  // full 라벨은 si gu dong 까지만
  const full = [si, gu, dong].filter(Boolean).join(' ');

  return { full, si, gu, dong };
};
