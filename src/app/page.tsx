import Button from '@/shares/common-components/button';
import Input from '@/shares/common-components/input';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Link href={'sign-in'}>
        <Button variant='default'>테스트 버튼</Button>
      </Link>
      <Input />
    </div>
  );
}
