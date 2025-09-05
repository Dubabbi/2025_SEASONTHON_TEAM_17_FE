import Heart from '@assets/icons/3d-heart.svg?react';
import { cn } from '@libs/cn';

type Props = {
  username: string;
  showSubtitle?: boolean;
  className?: string;
  gradientClass?: string;
};

export default function HeroSection({
  username,
  showSubtitle = true,
  className = '',
  gradientClass = '',
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
          <span>반가워요! </span>
          <span className="text-primary-600">{username}</span>
          <span>님</span>
        </h1>

        <Heart className="h-[20rem] w-[20rem]" />

        {showSubtitle && (
          <p className="heading2-600 text-center text-gray-900">
            오늘도 <span className="text-primary-600">마음:ON</span>과 함께해요
          </p>
        )}
      </div>
    </section>
  );
}
