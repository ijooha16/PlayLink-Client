export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    code?: string;
    error?: string;
    error_description?: string;
  }>;
}) {
  const { code, error, error_description } = await searchParams;

  if (error) {
    return <div>카카오 인증 실패: {error_description ?? error}</div>;
  }
  if (!code) {
    return <div>인가 코드가 없습니다.</div>;
  }
  console.log(code);

  return <div>인가 코드 수신 완료: {code}</div>;
}
