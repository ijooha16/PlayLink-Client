'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import {
  Circle1,
  Circle2,
  Sparkle1,
  Sparkle2,
  Welcome,
} from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import { motion } from 'framer-motion';

const WelcomePage = () => {
  const { goToNext, currentStepTitle } = useSignUpNavigation({
    currentStep: 'welcome',
  });

  const floatingItems = [
    { Component: Sparkle1, y: -10, duration: 3, ease: 'linear' },
    { Component: Circle1, y: 8, duration: 3, ease: 'linear' },
    { Component: Sparkle2, y: -8, duration: 3, ease: 'easeInOut' },
    { Component: Circle2, y: 10, duration: 3, ease: 'easeInOut' },
  ];

  return (
    <AuthLayoutContainer
      title={currentStepTitle}
      content='운동메이트를 찾기 위해 프로필을 완성해 주세요.'
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
              <item.Component size={335} />
            </motion.div>
          ))}
          <div className="absolute">
            <Welcome width={335} height={146} />
          </div>
        </div>
      </div>
      <Button variant='default' onClick={goToNext} isFloat>
        프로필 완성하기
      </Button>
    </AuthLayoutContainer>
  );
};

export default WelcomePage;
