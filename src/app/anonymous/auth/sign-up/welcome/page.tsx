'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import { Circle, Sparkles, Welcome } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import { Easing, motion } from 'framer-motion';

const WelcomePage = () => {
  const { goToNext, currentStepTitle } = useSignUpNavigation({
    currentStep: 'welcome',
  });

  const floatingItems = [
    { Component: Sparkles, size: 20, style: { top: '-8px', left: '-8px' }, y: -10, duration: 3, ease: "linear" },
    { Component: Circle, style: { top: '20px', left: '0px' }, y: 8, duration: 3, ease: "linear" },
    { Component: Sparkles, size: 20, style: { top: '20px', right: '40px' }, y: -8, duration:3 , ease: "easeInOut" },
    { Component: Circle, style: { bottom: '80px', right: '20px' }, y: 10, duration: 3, ease: "easeInOut" }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-200px)]">
      <AuthLayoutContainer title={currentStepTitle} content='운동메이트를 찾기 위해 프로필을 완성해 주세요.'>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-[200px] h-[200px]">
            {floatingItems.map((item, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={item.style}
                animate={{ y: [0, item.y, 0] }}
                transition={{ duration: item.duration, repeat: Infinity, ease: item.ease as Easing, repeatType: "loop" }}
              >
                <item.Component size={item.size} />
              </motion.div>
            ))}
            <div className="relative">
              <Welcome width={200} height={200} />
            </div>
          </div>
        </div>

        <Button variant="default" onClick={goToNext} isFloat>
          프로필 완성하기
        </Button>
      </AuthLayoutContainer>
    </div>
  );
};

export default WelcomePage;