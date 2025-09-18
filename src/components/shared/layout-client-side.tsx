'use client';

import SuccessAlert from '@/components/feedback/success-alert';
import { useAlertStore } from '@/store/alert-store';

const LayoutClientSide = () => {
  const isSuccessAlertOpen = useAlertStore((state) => state.isOpen);
  return <>{isSuccessAlertOpen && <SuccessAlert />}</>;
};

export default LayoutClientSide;
