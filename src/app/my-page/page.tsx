
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function MyPage() {
  const router = useRouter();

  const goToAppliedMatches = () => {
    router.push('/my-page/applied');
  };

  const goToCreatedMatches = () => {
    router.push('/my-page/created');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <button
          onClick={goToAppliedMatches}
          className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          신청한 매칭 관리
        </button>
        <button
          onClick={goToCreatedMatches}
          className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
        >
          생성한 매칭 관리
        </button>
      </div>
    </div>
  );
}
