import { membersQueries } from '@apis/members/members-queries';
import Heart from '@assets/icons/3d-heart.svg?react';
import { cn } from '@libs/cn';
import { useQuery } from '@tanstack/react-query';

type Props = {
  showSubtitle?: boolean;
  className?: string;
  gradientClass?: string;
};

export default function HeroSection({
  showSubtitle = true,
  className = '',
  gradientClass = '',
}: Props) {
  const { data: mypage } = useQuery(membersQueries.mypage());

  const username = mypage?.nickname ?? mypage?.nickname ?? '마몬';

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
