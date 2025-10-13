import { PLAYLINK_AUTH } from '@/constant/cookie';
import { NextResponse } from 'next/server';

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * NextResponse에 인증 토큰 쿠키를 설정합니다
 */
export function setAuthCookie<T>(
  response: NextResponse<T>,
  token: string,
  options?: Partial<CookieOptions>
): NextResponse<T> {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24시간
    path: '/',
    sameSite: 'lax',
  };

  response.cookies.set(PLAYLINK_AUTH, token, {
    ...defaultOptions,
    ...options,
  });

  return response;
}

/**
 * NextResponse에서 인증 토큰 쿠키를 삭제합니다
 */
export function clearAuthCookie<T>(response: NextResponse<T>): NextResponse<T> {
  response.cookies.set(PLAYLINK_AUTH, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}

/**
 * NextResponse에 임시 쿠키를 설정합니다 (OAuth state 등)
 */
export function setTempCookie<T>(
  response: NextResponse<T>,
  name: string,
  value: string,
  maxAge: number = 60 * 10 // 기본 10분
): NextResponse<T> {
  response.cookies.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  });

  return response;
}

/**
 * NextResponse에서 쿠키를 삭제합니다
 */
export function deleteCookie<T>(
  response: NextResponse<T>,
  name: string
): NextResponse<T> {
  response.cookies.delete(name);
  return response;
}
