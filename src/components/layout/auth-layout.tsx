import { ReactNode } from 'react';

const AuthLayoutContainer = ({
  children,
  title,
  content = '',
}: {
  children: ReactNode;
  title: string;
  content?: string;
}) => {
  return (
    <div className='flex flex-col'>
      <h1 className='text-title-01 whitespace-pre-line font-semibold'>
        {title}
      </h1>
      {content && <p className='text-body-02 pt-s-4 text-text-netural whitespace-pre-line font-regular'>{content}</p>}
      <div className="mt-s-24">

      {children}
      </div>
    </div>
  );
};

export default AuthLayoutContainer;
