'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
      <p className="text-gray-600 mb-6">구현되지 않은 페이지입니다</p>
      <div className="space-x-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}