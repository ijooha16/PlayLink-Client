'use client';

import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  SignUpStep1,
  SignUpStep2,
  SignUpStep3,
} from '../../types/sign-up/sign-up-schema';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Done from './done';
import { useRouter, useSearchParams } from 'next/navigation';
const steps = ['step1', 'step2', 'step3', 'done'] as const;
type Step = (typeof steps)[number];

const SignUpFunnel = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentQueryStep = searchParams.get('step') as Step | null;
  const [step, setStep] = useState<Step>(currentQueryStep || 'step1');

  const moveToStep = (newStep: Step) => {
    router.push(`?step=${newStep}`);
    setStep(newStep);
  };

  const [step1Data, setStep1Data] = useState<SignUpStep1>();
  const [step2Data, setStep2Data] = useState<SignUpStep2>();
  const [step3Data, setStep3Data] = useState<SignUpStep3>();

  useLayoutEffect(() => {
    setStep('step3');
    router.replace('?step=step3');
  }, []);

  useEffect(() => {
    if (currentQueryStep && currentQueryStep !== step) {
      setStep(currentQueryStep);
    }
  }, [currentQueryStep]);

  const mergedData = useMemo(
    () => ({
      ...step1Data,
      ...step2Data,
      ...step3Data,
    }),
    [step1Data, step2Data, step3Data]
  );

  return (
    <div className='mx-auto max-w-md'>
      {step === 'step1' && (
        <Step1
          onNext={(data) => {
            setStep1Data(data);
            moveToStep('step2');
          }}
          defaultValues={step1Data}
        />
      )}

      {step === 'step2' && (
        <Step2
          onNext={(data) => {
            setStep2Data(data);
            moveToStep('step3');
          }}
          defaultValues={step2Data}
        />
      )}

      {step === 'step3' && (
        <Step3
          onNext={(data) => {
            setStep3Data(data);
            moveToStep('done');
          }}
          defaultValues={step3Data}
        />
      )}

      {step === 'done' && <Done allData={mergedData} />}
    </div>
  );
};

export default SignUpFunnel;
