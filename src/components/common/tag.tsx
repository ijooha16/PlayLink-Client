import React, { ReactNode } from 'react';

const Tag = ({
  children,
  onClick,
  selected,
}: {
  children: ReactNode;
  onClick: () => void;
  selected: boolean;
}) => {
  return (
    <div
      className={`rounded-full ${selected ? 'bg-primary-700 text-white' : 'bg-gray-100'} whitespace-nowrap px-3 py-1`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Tag;
