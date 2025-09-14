'use client';

import { EMAIL_LIST } from '@/constant/email-list';

type PropsType = {
  selectorValue: string;
  onChange: () => void;
};

export default function EmailOption(props: PropsType) {
  return (
    <select
      onChange={props.onChange}
      value={props.selectorValue}
      className='text-gray-70 ml-2 box-border h-10 rounded-lg border border-gray-300 px-2'
    >
      {EMAIL_LIST.map((data) => {
        return (
          <option key={data.id} value={data.id} defaultValue={data.id}>
            {data.value}
          </option>
        );
      })}
    </select>
  );
}
