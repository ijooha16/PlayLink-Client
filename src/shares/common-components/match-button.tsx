const MatchButton = ({
  type,
  onClick,
}: {
  type: '수락' | '거절' | '취소' | '상세';
  onClick?: () => void;
}) => {
  const buttonStyle = {
    수락: 'bg-primary text-white border-primary',
    거절: 'bg-gray-50 border-gray-500',
    취소: 'bg-white border-gray-400',
    상세: 'bg-white border-gray-400',
  };

  const buttonText = {
    수락: '매칭 수락',
    거절: '매칭 거절',
    취소: '매칭 취소',
    상세: '상세 보기',
  };

  return (
    <button
      onClick={onClick}
      className={`${buttonStyle[type]} rounded-lg px-3 py-2 text-sm font-semibold`}
    >
      {buttonText[type]}
    </button>
  );
};

export default MatchButton;
