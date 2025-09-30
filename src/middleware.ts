import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PLAYLINK_AUTH } from './constant/cookie';
import { PATHS } from './constant/paths';
// 인증이 필요한 경로
const protectedPaths = ['/authorized'];

// 인증 후 접근 불가 경로 (로그인/회원가입 등)
const authPaths = ['/anonymous/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 쿠키에서 토큰 확인 (PLAYLINK_AUTH)
  const token = request.cookies.get(PLAYLINK_AUTH)?.value;

  // console.log('Middleware Debug:', {
  //   pathname,
  //   hasToken: !!token,
  //   tokenValue: token ? `${token.substring(0, 20)}...` : 'none',
  //   isProtectedPath: protectedPaths.some(path => pathname.startsWith(path))
  // });

  // 보호된 경로 접근 시 인증 확인
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      console.log(
        'Redirecting to splash - no token for protected path:',
        pathname
      );
      const url = request.nextUrl.clone();
      url.pathname = PATHS.SPLASH;
      return NextResponse.redirect(url);
    }
  }

  // 이미 로그인한 사용자가 auth 페이지 접근 시
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (pathname.startsWith('/anonymous/auth/sign-up')) {
      return NextResponse.next();
    }
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = PATHS.MY_PAGE;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
