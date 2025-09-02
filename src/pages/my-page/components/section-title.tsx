import { cn } from '@libs/cn';
import type { ReactNode } from 'react';

export default function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={cn('sub-body-600 text-primary-500', className)}>{children}</h2>;
}
