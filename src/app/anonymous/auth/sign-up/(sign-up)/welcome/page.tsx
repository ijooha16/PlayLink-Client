'use client';

import {
  Circle1,
  Circle2,
  Sparkle1,
  Sparkle2,
  Welcome,
} from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const WelcomePage = () => {
  const router = useRouter();

  const floatingItems = [
    { Component: Sparkle1, y: -10, duration: 3, ease: 'linear' },
    { Component: Circle1, y: 8, duration: 3, ease: 'linear' },
    { Component: Sparkle2, y: -8, duration: 3, ease: 'easeInOut' },
    { Component: Circle2, y: 10, duration: 3, ease: 'easeInOut' },
  ];

  return (
    <
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-[335px] h-[146px] relative flex items-center justify-center">
          {floatingItems.map((item, i) => (
            <motion.div
              key={i}
              className="absolute w-[335px] h-[146px]"
              animate={{ y: [0, item.y, 0] }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              <item.Component size={24} />
            </motion.div>
          ))}
          <div className="absolute w-[335px] h-[146px]">
            <Welcome size={335} />
          </div>
        </div>
      </div>
      <Button variant='default' onClick={() => router.replace('/anonymous/auth/sign-up/profile')} isFloat>
        프로필 완성하기
      </Button>
    </>
  );
};

export default WelcomePage;
