import { cn } from '@libs/cn';

type ProfileHeaderProps = {
  name: string;
  avatarSrc: string;
  className?: string;
};

export default function ProfileHeader({ name, avatarSrc, className }: ProfileHeaderProps) {
  return (
    <header className={cn('flex items-center gap-[2.4rem]', className)}>
      <div className="relative shrink-0">
        <img
          src={avatarSrc}
          alt={`${name} 프로필 이미지`}
          className="h-[10.8rem] w-[10.8rem] rounded-full object-cover"
          draggable={false}
        />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-[0.4rem]">
          <h1 className="heading2-800 truncate text-primary-600">{name}</h1>

          <span
            className={cn(
              'detail rounded-[0.6rem] bg-kakao-bgd text-kakao-text',
              'select-none px-[0.8rem] py-[0.4rem]',
            )}
          >
            카카오 로그인
          </span>
        </div>
      </div>
    </header>
  );
}
