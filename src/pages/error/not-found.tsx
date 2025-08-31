import Button from '@components/button/button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex-col-center bg-white px-[2.4rem] text-center">
      <h1 className="mb-4 font-extrabold text-[5.5rem] text-gray-800">404</h1>
      <p className="heading2-700 mb-2 text-gray-600">페이지를 찾을 수 없어요</p>
      <p className="body2-600 mb-6 text-gray-400">
        요청하신 페이지가 존재하지 않거나, 이동되었어요.
      </p>
      <Button
        onClick={() => navigate('/')}
        className="body3-500 cursor-pointer rounded-full bg-gray-900 px-[1.5rem] py-[0.7rem] text-gray-50 transition hover:bg-gray-800"
      >
        홈으로 돌아가기
      </Button>
    </div>
  );
}
