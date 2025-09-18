import { ReactNode } from 'react';

const AuthLayoutContainer = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <div className='gap-s-24 flex flex-col'>
      <h1 className='text-title-01 whitespace-pre-line font-semibold'>
        {title}
      </h1>
      {children}
    </div>
  );
};

export default AuthLayoutContainer;
