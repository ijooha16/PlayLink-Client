const MatchButton = ({
  type,
  onClick,
}: {
  type: '수락' | '거절' | '취소' | '상세';
  onClick?: () => void;
}) => {
  const buttonStyle = {
    수락: 'bg-primary-700 text-white border-primary-700',
    거절: 'bg-gray-50 text-gray-400 border-gray-300',
    취소: 'bg-white text-gray-400 border-gray-300',
    상세: 'bg-white border-gray-300',
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
      className={`${buttonStyle[type]} rounded-lg !border px-3 py-2 text-sm font-semibold [border-style:solid]`}
    >
      {buttonText[type]}
    </button>
  );
};

export default MatchButton;
