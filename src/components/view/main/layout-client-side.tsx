'use client';

import SuccessAlert from '@/components/common/success-alert';
import { useAlertStore } from '@/stores/alert-store';

const LayoutClientSide = () => {
  const isSuccessAlertOpen = useAlertStore((state) => state.isOpen);
  return <>{isSuccessAlertOpen && <SuccessAlert />}</>;
};

export default LayoutClientSide;
