'use client';

import SuccessAlert from '@/components/common-components/success-alert';
import { useAlertStore } from '@/shares/stores/alert-store';

const LayoutClientSide = () => {
  const isSuccessAlertOpen = useAlertStore((state) => state.isOpen);
  return <>{isSuccessAlertOpen && <SuccessAlert />}</>;
};

export default LayoutClientSide;
