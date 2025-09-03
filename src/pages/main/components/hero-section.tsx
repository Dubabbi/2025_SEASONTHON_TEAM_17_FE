import Heart from '@assets/icons/3d-heart.svg?react';

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
  gradientClass = 'bg-gradient-bgd2',
}: Props) {
  return (
    <section
      className={[
        'relative overflow-hidden rounded-b-[30px]',
        'px-[2.5rem] py-[2rem]',
        'flex-col-center gap-[1.2rem] bg-cover bg-no-repeat',
        gradientClass,
        className,
      ].join(' ')}
    >
      <h1 className="sub-title heading2 text-center text-gray-900">
        <span>반가워요! </span>
        <span className="text-primary-600">{username}</span>
        <span>님</span>
      </h1>

      <Heart className="h-[20rem] w-[20rem]" />

      {showSubtitle && (
        <p className="sub-heading2 text-center text-gray-900">
          오늘도 <span className="text-primary-600">마음:ON</span>과 함께해요
        </p>
      )}
    </section>
  );
}
