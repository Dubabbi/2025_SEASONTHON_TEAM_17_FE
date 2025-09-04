import FriendsIcon from '@assets/icons/3d-friends.svg?react';
import { cn } from '@libs/cn';

type Props = {
  className?: string;
  gradientClass?: string;
};

export default function FriendsHeader({
  className = '',
  gradientClass = 'bg-gradient-bgd2',
}: Props) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-b-[30px]',
        'px-[2.5rem] py-[2rem]',
        'bg-cover bg-no-repeat',
        gradientClass,
        className,
      )}
    >
      <div aria-hidden className="linear-layer">
        <div className="linear" />
      </div>
      <div className="relative z-10 flex-col-center gap-[1.2rem]">
        <h1 className="sub-heading1 text-center text-gray-900">
          <span>현재 </span>
          <span className="text-primary-600">친구</span>
          <span>를 찾고 계신가요?</span>
        </h1>

        <FriendsIcon className="h-[20rem] w-[20rem]" />

        <p className="heading2-600 text-center text-gray-900">
          친구와 함께 감정 일기를 공유해봐요!
        </p>
      </div>
    </section>
  );
}
