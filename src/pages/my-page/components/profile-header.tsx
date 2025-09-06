import { cn } from '@libs/cn';

type ProfileHeaderProps = {
  name: string;
  avatarSrc: string;
  className?: string;
};

export default function ProfileHeader({ name, avatarSrc, className }: ProfileHeaderProps) {
  return (
    <header className={cn('flex items-start gap-[2.4rem]', className)}>
      <div className="relative shrink-0">
        <img
          src={avatarSrc}
          alt={`${name} 프로필 이미지`}
          className="h-[10.8rem] w-[10.8rem] rounded-full object-cover outline outline-gray-200"
          draggable={false}
        />
      </div>

      <div className="flex-col gap-[0.4rem] text-left">
        <h1 className="sub-heading2 text-primary-600">{name}</h1>

        <span
          className={cn(
            'detail rounded-[4px] bg-kakao-bgd text-kakao-text',
            'select-none px-[0.8rem] py-[0.4rem] text-center',
          )}
        >
          카카오 로그인
        </span>
      </div>
    </header>
  );
}
