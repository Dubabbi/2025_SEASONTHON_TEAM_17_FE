import Diary3D from '@assets/icons/3d-diary.svg?react';
import { PrimaryCTA } from '@components/button/cta-button';
import { cn } from '@libs/cn';
import { useNavigate } from 'react-router-dom';

type Props = {
  title?: string;
  subtitle?: string;
  className?: string;
  gradientClass?: string;
  onClick?: () => void;
};

export default function Banner({
  title = '오늘의 감정 일기 작성하기',
  subtitle = '간편하게 내 감정을 기록해봐요',
  className = '',
  gradientClass = 'bg-gradient-bgd3',
  onClick,
}: Props) {
  const navigate = useNavigate();
  const handleClick = onClick ?? (() => navigate('/diary/create'));

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-b-[30px]',
        'px-[2.5rem] py-[3rem]',
        gradientClass,
        'flex-col-center gap-[1.2rem] bg-cover bg-no-repeat',
        className,
      )}
    >
      <div aria-hidden className="linear-layer">
        <div className="linear" />
      </div>
      <div className="w-full flex-col gap-[0.6rem] text-left">
        <h2 className="heading1-700 text-gray-900">{title}</h2>
        <p className="body2-500 text-primary-500">{subtitle}</p>
      </div>

      <Diary3D className="h-[20rem] w-[20rem]" />
      <PrimaryCTA
        className="heading2-700"
        onClick={handleClick}
        aria-label="오늘의 감정 일기 작성하기"
      >
        오늘의 감정 일기 작성하기
      </PrimaryCTA>
    </section>
  );
}
