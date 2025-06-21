type SportButtonProps = {
  sport: string;
  icon: string;
};

const SportButton = ({ sport, icon }: SportButtonProps) => {
  return (
    <div key={sport} className='relative'>
      <input
        type='checkbox'
        value={sport}
        id={`sport-${idx}`}
        {...register('favoriteSports')}
        onChange={() => toggle(sport)}
        checked={selected.includes(sport)}
        className='peer hidden'
      />
      <label
        htmlFor={`sport-${idx}`}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-full border bg-gray-100 p-3 text-sm text-gray-600 transition-all peer-checked:bg-blue-500 peer-checked:text-white`}
      >
        <span className='text-xl'>🎯</span>
        {sport}
      </label>
    </div>
  );
};

export default SportButton;
