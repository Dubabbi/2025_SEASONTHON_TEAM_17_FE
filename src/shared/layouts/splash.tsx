import Intro from '@components/intro';
import { cn } from '@libs/cn';

export default function Splash() {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[var(--z-splash)]',
        'mx-auto grid h-full w-full max-w-[43rem] place-items-center',
        'bg-gray-50',
        'px-[2.4rem]',
      )}
    >
      <Intro />
    </div>
  );
}
