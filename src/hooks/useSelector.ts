import { useState } from 'react';

const useSelector = () => {
  const [selectorValue, setSelectorValue] = useState('선택');

  const handleGetSelectorValueData = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;

    setSelectorValue(value);
  };

  return {
    selectorValue,
    handleGetSelectorValueData,
  };
};

export default useSelector;
