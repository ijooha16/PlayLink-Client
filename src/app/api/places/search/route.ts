import { withApiHandler } from '@/utills/api-handler';

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY!;

export const GET = withApiHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const sizeParam = searchParams.get('size');
  const pageParam = searchParams.get('page');

  const size = (() => {
    const parsed = Number(sizeParam);
    if (Number.isNaN(parsed) || parsed <= 0) return 15;
    return Math.min(parsed, 15);
  })();

  const page = (() => {
    const parsed = Number(pageParam);
    if (Number.isNaN(parsed) || parsed <= 0) return 1;
    return Math.min(parsed, 45);
  })();

  if (!query) {
    return { status: 'error', message: '검색어를 입력해주세요.' };
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=${size}&page=${page}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('카카오 API 호출 실패');
    }

    const data = await response.json();

    return {
      status: 'success',
      data: {
        places: data.documents || [],
        meta: data.meta ?? null,
      },
    };
  } catch (error) {
    console.error('장소 검색 오류:', error);
    return {
      status: 'error',
      message: '장소 검색 중 오류가 발생했습니다.',
    };
  }
});
