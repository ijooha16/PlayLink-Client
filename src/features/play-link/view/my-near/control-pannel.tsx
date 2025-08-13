'use client';

import { useState } from 'react';
import RangeBar from './range-bar';
import MyTown from './my-town';

const ControlPannel = () => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [town, setTown] = useState<string[]>([]);
  return (
    <div>
      <MyTown myList={town} />
      <RangeBar currentStep={step} onChange={setStep} />
    </div>
  );
};

export default ControlPannel;
