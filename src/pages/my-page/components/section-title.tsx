import { cn } from '@libs/cn';
import type { ReactNode } from 'react';

export default function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn('cap_14_m px-[2.4rem] pt-[2.4rem] pb-[1.2rem] text-primary-500', className)}>
      {children}
    </h2>
  );
}
