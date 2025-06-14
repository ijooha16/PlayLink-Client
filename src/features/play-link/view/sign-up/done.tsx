const Done = ({ allData }: { allData: any }) => {
  // const handleSubmitToServer = async () => {
  //   try {
  //     const result = await fetch('/api/signup', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(allData),
  //     });
  //     const resJson = await result.json();
  //     alert('가입 완료: ' + resJson.message);
  //   } catch (err) {
  //     console.error('서버 전송 실패', err);
  //   }
  // };

  return (
    <div className='space-y-4'>
      <h2>회원가입 완료</h2>
      <pre className='rounded bg-gray-100 p-4 text-xs'>
        {JSON.stringify(allData, null, 2)}
      </pre>
      <button
        // onClick={handleSubmitToServer}
        className='rounded bg-black px-4 py-2 text-white'
      >
        서버에 전송
      </button>
    </div>
  );
};

export default Done;
